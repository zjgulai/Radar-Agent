#!/usr/bin/env node
/**
 * Receive-only PoC entrypoint.
 *
 * Reads one bounded JSON credential object from stdin, validates it with the
 * fixed target config, then runs the local runtime until the duration expires
 * or SIGINT/SIGTERM arrives. It never consults environment variables, never
 * prints raw errors, and never uses the REST Client or token endpoints.
 */

let runtime = null;
let signalSeen = false;
let fatalSeen = false;
let writtenTerminal = false;
let exitCode = null;

function writeLine(line) {
  try {
    process.stdout.write(line);
  } catch {
    // A closed stdout must not turn into a raw stack trace.
  }
}

function writeTerminal(record) {
  if (writtenTerminal) {
    return;
  }
  writtenTerminal = true;
  writeLine(`${JSON.stringify(record)}\n`);
}

function setExitCode(code) {
  if (exitCode === null) {
    exitCode = code;
  }
  process.exitCode = exitCode;
}

function stopForSignal() {
  signalSeen = true;
  if (runtime !== null) {
    runtime.stop('signal');
    return;
  }
  writeTerminal({ status: 'stopped', reason: 'signal' });
  setExitCode(0);
  try {
    process.stdin.destroy();
  } catch {
    // Nothing else to release while waiting for credentials.
  }
}

function fatal() {
  if (fatalSeen) {
    return;
  }
  fatalSeen = true;
  if (runtime !== null) {
    try {
      if (runtime.fail('internal_error')) {
        setExitCode(1);
        return;
      }
    } catch {
      // Fall through to the constant safe line.
    }
  }
  writeTerminal({ status: 'failed', error: 'internal_error' });
  setExitCode(1);
  try {
    process.stdin.destroy();
  } catch {
    // Ignore stdin teardown failures.
  }
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
  }
}

main().catch(fatal);