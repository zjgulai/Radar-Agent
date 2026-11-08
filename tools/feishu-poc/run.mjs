#!/usr/bin/env node
/**
 * Receive-only PoC entrypoint.
 *
 * Reads one bounded JSON credential object from stdin, validates it with the
 * fixed target config, then runs the local runtime until the duration expires
 * or SIGINT/SIGTERM arrives. It never consults environment variables, never
 * prints raw errors, and never uses the REST Client or token endpoints.
 */

const TERMINAL_STATUSES = new Set(['stopped', 'failed']);

// The SDK's public close() cannot reach a socket or timer created before the
// handshake completes, so this process must end itself after the terminal
// result. Empty-write completion means prior stdout was flushed; the hard
// fallback bounds exit even when stdout never reports completion.
const EXIT_FLUSH_FALLBACK_MS = 2000;

let runtime = null;
let signalSeen = false;
let fatalSeen = false;
let terminalRecorded = false;
let terminalExitCode = null;
let exitCode = null;
let finishStarted = false;

function writeRawLine(line) {
  try {
    process.stdout.write(line);
  } catch {
    // A closed stdout must not turn into a raw stack trace.
  }
}

function readTerminalExitCode(line) {
  try {
    const record = JSON.parse(line);
    if (record !== null
      && typeof record === 'object'
      && !Array.isArray(record)
      && TERMINAL_STATUSES.has(record.status)) {
      return record.status === 'failed' ? 1 : 0;
    }
  } catch {
    // Non-JSON output is never a terminal record.
  }
  return null;
}

function commitTerminal(code) {
  terminalRecorded = true;
  terminalExitCode = code;
  exitCode = code;
  process.exitCode = code;
}

function writeLine(line) {
  if (terminalRecorded) {
    // Exactly one terminal record may win; nothing may follow it.
    return;
  }
  const code = readTerminalExitCode(line);
  if (code !== null) {
    commitTerminal(code);
  }
  writeRawLine(line);
}

function writeTerminal(record) {
  if (terminalRecorded) {
    return terminalExitCode;
  }
  const code = record.status === 'failed' ? 1 : 0;
  commitTerminal(code);
  writeRawLine(`${JSON.stringify(record)}\n`);
  return code;
}

function setExitCode(code) {
  if (terminalRecorded) {
    // The committed terminal record owns the exit code. A late failure must
    // never print failed while leaving a stopped terminal's exit code 0.
    process.exitCode = terminalExitCode;
    return;
  }
  if (exitCode === null) {
    exitCode = code;
  }
  process.exitCode = exitCode;
}

function flushStdoutThenExit() {
  if (finishStarted) {
    return;
  }
  finishStarted = true;
  const code = exitCode === null ? 0 : exitCode;
  const fallback = setTimeout(() => {
    process.exit(code);
  }, EXIT_FLUSH_FALLBACK_MS);
  try {
    process.stdout.write('', () => {
      clearTimeout(fallback);
      process.exit(code);
    });
  } catch {
    clearTimeout(fallback);
    process.exit(code);
  }
}

function stopForSignal() {
  signalSeen = true;
  if (terminalRecorded || finishStarted) {
    return;
  }
  if (runtime !== null) {
    let stopped = false;
    try {
      stopped = runtime.stop('signal');
    } catch {
      stopped = false;
    }
    if (!terminalRecorded && !stopped) {
      writeTerminal({ status: 'stopped', reason: 'signal' });
    }
    if (terminalRecorded) {
      flushStdoutThenExit();
    }
    return;
  }
  writeTerminal({ status: 'stopped', reason: 'signal' });
  try {
    process.stdin.destroy();
  } catch {
    // Nothing else to release while waiting for credentials.
  }
  flushStdoutThenExit();
}

function fatal() {
  if (fatalSeen) {
    return;
  }
  fatalSeen = true;

  if (terminalRecorded) {
    // Late failure after the single terminal outcome: keep that outcome and
    // its exit code, and never append a contradictory failed record.
    setExitCode(terminalExitCode);
    flushStdoutThenExit();
    return;
  }

  if (runtime !== null) {
    try {
      if (runtime.fail('internal_error')) {
        setExitCode(1);
        flushStdoutThenExit();
        return;
      }
    } catch {
      // Fall through to the constant safe line.
    }
    if (terminalRecorded) {
      setExitCode(terminalExitCode);
      flushStdoutThenExit();
      return;
    }
  }

  writeTerminal({ status: 'failed', error: 'internal_error' });
  setExitCode(1);
  try {
    process.stdin.destroy();
  } catch {
    // Ignore stdin teardown failures.
  }
  flushStdoutThenExit();
}

process.on('SIGINT', stopForSignal);
process.on('SIGTERM', stopForSignal);
process.on('uncaughtException', fatal);
process.on('unhandledRejection', fatal);

async function main() {
  const { readCredentialInput } = await import('./input.mjs');
  const { parseConfig } = await import('./core.mjs');

  let config;
  try {
    const input = await readCredentialInput(process.stdin);
    if (signalSeen) {
      return;
    }
    config = parseConfig(input);
  } catch {
    if (signalSeen) {
      return;
    }
    try {
      process.stdin.destroy();
    } catch {
      // Ignore stdin teardown failures after bounded input rejection.
    }
    writeTerminal({ status: 'failed', error: 'config_invalid' });
    setExitCode(1);
    flushStdoutThenExit();
    return;
  }

  if (signalSeen) {
    return;
  }

  const { createRuntime } = await import('./runtime.mjs');
  if (signalSeen) {
    return;
  }

  runtime = createRuntime({ config, writeLine });

  try {
    const result = await runtime.start();
    setExitCode(result.exitCode);
  } catch {
    fatal();
    return;
  }
  flushStdoutThenExit();
}

main().catch(fatal);
