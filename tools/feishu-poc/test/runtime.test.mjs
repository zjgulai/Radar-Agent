import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import * as sdk from '@larksuiteoapi/node-sdk';
import { TARGET_APP_ID, parseConfig } from '../core.mjs';
import {
  HANDSHAKE_TIMEOUT_MS,
  STARTUP_DEADLINE_MS,
  createRuntime,
} from '../runtime.mjs';

const APP_SECRET = '{{SECRET_od3qvz6r}}';
const CONFIG = parseConfig({ appId: TARGET_APP_ID, appSecret: APP_SECRET, durationSeconds: 300 });
const RUN_PATH = fileURLToPath(new URL('../run.mjs', import.meta.url));
const ENDPOINT = 'https://open.feishu.cn/callback/ws/endpoint';
const WSS_URL = 'wss://open.feishu.cn/ws?device_id=synthetic-device&service_id=synthetic-service';
const CLIENT_CONFIG = {
  PingInterval: 120,
  ReconnectCount: -1,
  ReconnectInterval: 120,
  ReconnectNonce: 30,
};
const VALID_DISCOVERY_RESPONSE = {
  code: 0,
  data: { URL: WSS_URL, ClientConfig: CLIENT_CONFIG },
  msg: 'ok',
};

const RUNTIME_STATUSES = new Set([
  'connected',
  'reconnecting',
  'reconnected',
  'stopped',
  'failed',
  'discovery_failed',
  'snapshot',
  'received',
  'invalid',
]);
const RUNTIME_KEYS = new Set([
  'status',
  'error',
  'reason',
  'code',
  'total',
  'invalid',
  'received',
  'p2p',
  'group',
  'unknown',
  'cards',
  'botAdded',
  'event',
  'chatType',
  'durationMs',
  'requestId',
]);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitFor(predicate, label, timeoutMs = 2000) {
  const startedAt = Date.now();
  while (!predicate()) {
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error(`timed out waiting for ${label}`);
    }
    await delay(2);
  }
}

function discoveryOptions(options) {
  return {
    method: 'post',
    url: ENDPOINT,
    data: { AppID: options.appId, AppSecret: options.appSecret },
    headers: { locale: 'zh', 'User-Agent': 'synthetic-ua' },
    timeout: 15000,
  };
}

function createHarness({ mode = 'manual', discovery } = {}) {
  const lines = [];
  const calls = {
    requests: [],
    clients: [],
    starts: [],
    closes: [],
    clientInstances: [],
    discoveryAccepted: false,
    discoveryRejected: false,
  };

  const defaultDiscovery = async (options) => {
    calls.requests.push(options);
    return VALID_DISCOVERY_RESPONSE;
  };
  const request = discovery
    ? async (options) => {
      calls.requests.push(options);
      return discovery(options);
    }
    : defaultDiscovery;

  class FakeWSClient {
    constructor(options) {
      this.options = options;
      calls.clients.push(options);
      calls.clientInstances.push(this);
    }

    start(params) {
      calls.starts.push(params);
      const options = this.options;

      if (mode === 'manual') {
        return Promise.resolve();
      }

      if (mode === 'ready' || mode === 'ready-then-error' || mode === 'reconnect') {
        return (async () => {
          try {
            await options.httpInstance.request(discoveryOptions(options));
            calls.discoveryAccepted = true;
          } catch {
            calls.discoveryRejected = true;
            return;
          }
          options.onReady();
          if (mode === 'ready-then-error') {
            options.onError(new Error('MARKER_RAW_STACK'));
          }
          if (mode === 'reconnect') {
            setTimeout(() => {
              options.onReconnecting();
              options.onReconnected();
            }, 5);
          }
        })();
      }

      if (mode === 'delayed-ready') {
        return (async () => {
          try {
            await options.httpInstance.request(discoveryOptions(options));
            calls.discoveryAccepted = true;
          } catch {
            calls.discoveryRejected = true;
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, 30));
          options.onReady();
        })();
      }

      if (mode === 'no-ready') {
        return (async () => {
          try {
            await options.httpInstance.request(discoveryOptions(options));
            calls.discoveryAccepted = true;
          } catch {
            calls.discoveryRejected = true;
          }
        })();
      }

      if (mode === 'error') {
        return (async () => {
          try {
            await options.httpInstance.request(discoveryOptions(options));
          } catch {
            calls.discoveryRejected = true;
            return;
          }
          options.onError(new Error('MARKER_RAW_STACK'));
        })();
      }

      if (mode === 'auth-error') {
        return (async () => {
          try {
            const response = await options.httpInstance.request(discoveryOptions(options));
            calls.discoveryAccepted = true;
            if (response.code !== 0) {
              options.onError(new Error('auth rejected'));
              return;
            }
            options.onReady();
          } catch {
            calls.discoveryRejected = true;
          }
        })();
      }

      if (mode === 'deferred') {
        return (async () => {
          try {
            await options.httpInstance.request(discoveryOptions(options));
            calls.discoveryAccepted = true;
            options.onReady();
          } catch {
            calls.discoveryRejected = true;
          }
        })();
      }

      throw new Error(`unknown mode ${mode}`);
    }

    close(params = {}) {
      calls.closes.push({
        force: params.force,
        sameInstance: calls.clientInstances[0] === this,
        abortedBeforeClose: calls.requests.length > 0
          && calls.requests.every((request) => request.signal?.aborted === true),
      });
    }
  }

  const fakeSdk = {
    ...sdk,
    WSClient: FakeWSClient,
    defaultHttpInstance: { request },
    Client: class ForbiddenClient {
      constructor() {
        throw new Error('MARKER_CLIENT_USED');
      }
    },
  };

  return {
    sdk: fakeSdk,
    lines,
    calls,
    writeLine: (line) => lines.push(line),
    records: () => lines.map((line) => JSON.parse(line)),
  };
}

function createTestRuntime({ mode = 'manual', discovery, timing, writeLine } = {}) {
  const harness = createHarness({ mode, discovery });
  const runtime = createRuntime({
    config: CONFIG,
    sdk: harness.sdk,
    writeLine: writeLine ?? harness.writeLine,
    timing: {
      startupDeadlineMs: 1000,
      durationMs: 1000,
      snapshotIntervalMs: 15000,
      ...timing,
    },
  });
  return { ...harness, runtime };
}

function invoke(dispatcher, eventType, event) {
  return dispatcher.invoke(
    {
      schema: '2.0',
      header: {
        event_type: eventType,
        app_id: TARGET_APP_ID,
        token: 'MARKER_HEADER_TOKEN',
      },
      event,
    },
    { needCheck: false },
  );
}

test('runtime pins the verified handshake and startup defaults', () => {
  assert.equal(HANDSHAKE_TIMEOUT_MS, 10000);
  assert.equal(STARTUP_DEADLINE_MS, 20000);
});

test('runtime constructs WSClient with the exact receive-only option set', () => {
  const { runtime, calls } = createTestRuntime();
  runtime.start();

  assert.equal(calls.clients.length, 1);
  const options = calls.clients[0];
  assert.deepEqual(Object.keys(options).sort(), [
    'appId',
    'appSecret',
    'autoReconnect',
    'domain',
    'handshakeTimeoutMs',
    'httpInstance',
    'logger',
    'loggerLevel',
    'onError',
    'onReady',
    'onReconnected',
    'onReconnecting',
  ]);
  assert.equal(options.appId, TARGET_APP_ID);
  assert.equal(options.appSecret, APP_SECRET);
  assert.equal(options.domain, sdk.Domain.Feishu);
  assert.equal(options.loggerLevel, sdk.LoggerLevel.error);
  assert.equal(options.handshakeTimeoutMs, 10000);
  assert.equal(options.autoReconnect, true);
  assert.equal(typeof options.httpInstance.request, 'function');
  for (const callback of ['onReady', 'onError', 'onReconnecting', 'onReconnected']) {
    assert.equal(typeof options[callback], 'function');
  }
});

test('runtime registers only the three receive-only fixed handler keys plus SDK app_ticket', async () => {
  const { runtime, calls } = createTestRuntime();
  const done = runtime.start();

  const dispatcher = calls.starts[0].eventDispatcher;
  assert.deepEqual([...dispatcher.handles.keys()].sort(), [
    'app_ticket',
    'card.action.trigger',
    'im.chat.member.bot.added_v1',
    'im.message.receive_v1',
  ]);

  runtime.stop('signal');
  await done;
});

test('real EventDispatcher flattens v2 envelopes and core sees re-wrapped event data', async () => {
  const { runtime, calls, records, lines } = createTestRuntime();
  const done = runtime.start();
  const dispatcher = calls.starts[0].eventDispatcher;

  const p2p = await invoke(dispatcher, 'im.message.receive_v1', {
    sender: { sender_id: { open_id: 'ou_MARKER' } },
    message: {
      message_id: 'om_MARKER',
      chat_type: 'p2p',
      content: 'MARKER_BODY',
    },
  });
  const group = await invoke(dispatcher, 'im.message.receive_v1', {
    message: { message_id: 'om_MARKER_2', chat_type: 'group', content: 'MARKER_BODY_2' },
  });
  const unknownChat = await invoke(dispatcher, 'im.message.receive_v1', {
    message: { chat_type: 'channel', content: 'MARKER_BODY_3' },
  });
  const card = await invoke(dispatcher, 'card.action.trigger', {
    token: 'MARKER_UPDATE_TOKEN',
    action: { value: { MARKER_ACTION: true }, tag: 'button' },
    context: { open_message_id: 'om_MARKER_CARD', open_chat_id: 'oc_MARKER' },
  });
  const botAdded = await invoke(dispatcher, 'im.chat.member.bot.added_v1', {
    chat_id: 'oc_MARKER_BOT',
    operator_id: { open_id: 'ou_MARKER_BOT' },
  });
  const noHandler = await invoke(dispatcher, 'unknown.event', { secret: 'MARKER_UNKNOWN' });

  assert.equal(p2p, undefined);
  assert.equal(group, undefined);
  assert.equal(unknownChat, undefined);
  assert.deepEqual(card, {});
  assert.equal(botAdded, undefined);
  assert.equal(noHandler, 'no unknown.event event handle');

  runtime.stop('signal');
  const result = await done;
  assert.equal(result.outcome, 'stopped');

  const audits = records().filter((record) => record.requestId !== undefined);
  assert.deepEqual(audits.map((record) => record.event), [
    'im.message.receive_v1',
    'im.message.receive_v1',
    'im.message.receive_v1',
    'card.action.trigger',
    'im.chat.member.bot.added_v1',
  ]);
  assert.deepEqual(audits.slice(0, 3).map((record) => record.chatType), ['p2p', 'group', 'unknown']);
  assert.equal(audits[3].chatType, undefined);
  assert.equal(audits[4].chatType, undefined);
  for (const record of audits) {
    assert.equal(record.status, 'received');
    assert.match(record.requestId, /^req-[1-9][0-9]*$/);
    assert.equal(Number.isSafeInteger(record.durationMs) && record.durationMs >= 0, true);
  }

  const output = lines.join('');
  for (const marker of [
    'MARKER_HEADER_TOKEN',
    'MARKER_UPDATE_TOKEN',
    'MARKER_ACTION',
    'ou_MARKER',
    'om_MARKER',
    'oc_MARKER',
    'MARKER_BODY',
    'MARKER_UNKNOWN',
  ]) {
    assert.equal(output.includes(marker), false, marker);
  }
});

test('SDK logger and EventDispatcher raw arguments are never written', async () => {
  const { runtime, calls, lines } = createTestRuntime();
  const done = runtime.start();
  const dispatcher = calls.starts[0].eventDispatcher;
  const before = lines.length;

  const options = calls.clients[0];
  const circular = {};
  circular.self = circular;
  for (const method of ['error', 'warn', 'info', 'debug', 'trace']) {
    assert.equal(
      options.logger[method]('MARKER_SDK_LOG', { config: { data: 'MARKER_SECRET' } }, circular),
      undefined,
    );
  }

  await invoke(dispatcher, 'unknown.event', { message: 'MARKER_UNKNOWN_RAW' });

  assert.equal(lines.length, before);
  assert.equal(lines.join('').includes('MARKER'), false);

  runtime.stop('signal');
  await done;
});

test('start resolving without onReady is a bounded startup failure', async () => {
  const { runtime, calls, records, lines } = createTestRuntime({
    mode: 'no-ready',
    timing: { startupDeadlineMs: 20, durationMs: 5000 },
  });

  const startedAt = Date.now();
  const result = await runtime.start();

  assert.deepEqual(result, { outcome: 'failed', exitCode: 1, connected: false });
  assert.ok(Date.now() - startedAt < 1000);
  assert.equal(calls.discoveryAccepted, true);
  assert.equal(calls.closes.length, 1);
  assert.equal(calls.closes[0].force, true);
  assert.equal(calls.closes[0].sameInstance, true);
  assert.equal(calls.closes[0].abortedBeforeClose, true);

  const runtimeRecords = records();
  assert.deepEqual(runtimeRecords, [{ status: 'failed', error: 'startup_timeout' }]);
  assert.equal(lines.join('').includes('MARKER'), false);
});

test('onReady starts the bounded duration and a normal timeout stops gracefully', async () => {
  const { runtime, calls, records } = createTestRuntime({
    mode: 'ready',
    timing: { startupDeadlineMs: 500, durationMs: 20 },
  });

  const startedAt = Date.now();
  const result = await runtime.start();
  const elapsed = Date.now() - startedAt;

  assert.deepEqual(result, { outcome: 'stopped', exitCode: 0, connected: true });
  assert.ok(elapsed >= 10 && elapsed < 1000);
  assert.deepEqual(records().map((record) => record.status), ['connected', 'stopped']);
  assert.deepEqual(records()[1], { status: 'stopped', reason: 'timeout' });
  assert.equal(calls.closes.length, 1);
  assert.equal(calls.closes[0].force, true);
  assert.equal(calls.closes[0].sameInstance, true);
  assert.equal(calls.closes[0].abortedBeforeClose, true);
  assert.equal(calls.requests.length, 1);
  assert.equal(calls.requests[0].url, ENDPOINT);
  assert.equal(calls.requests[0].method, 'post');
});

test('the duration clock starts after onReady, not after start resolves', async () => {
  const { runtime, records } = createTestRuntime({
    mode: 'delayed-ready',
    timing: { startupDeadlineMs: 500, durationMs: 20 },
  });

  const startedAt = Date.now();
  const done = runtime.start();
  await delay(10);
  assert.equal(records().some((record) => record.status === 'connected'), false);

  const result = await done;
  const elapsed = Date.now() - startedAt;

  assert.deepEqual(result, { outcome: 'stopped', exitCode: 0, connected: true });
  assert.ok(elapsed >= 35 && elapsed < 1000, `elapsed ${elapsed}`);
  assert.deepEqual(records().map((record) => record.status), ['connected', 'stopped']);
});

test('stop is idempotent and clears the startup and snapshot timers', async () => {
  const { runtime, calls, records } = createTestRuntime({
    mode: 'ready',
    timing: { startupDeadlineMs: 10, durationMs: 40, snapshotIntervalMs: 5 },
  });

  const done = runtime.start();
  await waitFor(() => records().some((record) => record.status === 'connected'), 'connected');
  runtime.stop('signal');
  const first = await done;
  assert.deepEqual(first, { outcome: 'stopped', exitCode: 0, connected: true });

  const stableCount = records().length;
  runtime.stop('signal');
  runtime.stop('timeout');
  await delay(50);

  assert.equal(records().length, stableCount);
  assert.equal(calls.closes.length, 1);
  assert.equal(records().filter((record) => record.status === 'stopped').length, 1);
  assert.equal(records().some((record) => record.status === 'failed'), false);
});

test('onError fails the runtime with a constant error code', async () => {
  const { runtime, calls, records, lines } = createTestRuntime({
    mode: 'error',
    timing: { startupDeadlineMs: 500 },
  });

  const result = await runtime.start();

  assert.deepEqual(result, { outcome: 'failed', exitCode: 1, connected: false });
  assert.deepEqual(records(), [{ status: 'failed', error: 'sdk_error' }]);
  assert.equal(calls.closes.length, 1);
  assert.equal(calls.closes[0].force, true);
  assert.equal(lines.join('').includes('MARKER_RAW_STACK'), false);
});

test('onError after onReady records connected then failed', async () => {
  const { runtime, records } = createTestRuntime({
    mode: 'ready-then-error',
    timing: { startupDeadlineMs: 500 },
  });

  const result = await runtime.start();

  assert.deepEqual(result, { outcome: 'failed', exitCode: 1, connected: true });
  assert.deepEqual(records().map((record) => record.status), ['connected', 'failed']);
});

test('onReconnecting and onReconnected stay observable without restarting the duration', async () => {
  const { runtime, records } = createTestRuntime({
    mode: 'reconnect',
    timing: { startupDeadlineMs: 500, durationMs: 40 },
  });

  const result = await runtime.start();

  assert.deepEqual(result, { outcome: 'stopped', exitCode: 0, connected: true });
  assert.deepEqual(records().map((record) => record.status), [
    'connected',
    'reconnecting',
    'reconnected',
    'stopped',
  ]);
});

test('stop before discovery resolves aborts the request, denies the response, and prevents a socket', async () => {
  const controllerRequest = {};
  const discovery = (options) => {
    controllerRequest.options = options;
    return new Promise((resolve) => {
      controllerRequest.resolve = resolve;
    });
  };

  const { runtime, calls, records } = createTestRuntime({
    mode: 'deferred',
    discovery,
    timing: { startupDeadlineMs: 5000, durationMs: 5000 },
  });

  const done = runtime.start();
  await waitFor(() => typeof controllerRequest.resolve === 'function', 'discovery request');
  assert.equal(controllerRequest.options.url, ENDPOINT);
  assert.equal(controllerRequest.options.signal.aborted, false);

  runtime.stop('signal');
  assert.equal(controllerRequest.options.signal.aborted, true);
  assert.equal(calls.closes.length, 1);
  assert.equal(calls.closes[0].abortedBeforeClose, true);

  controllerRequest.resolve(VALID_DISCOVERY_RESPONSE);
  const result = await done;
  await waitFor(() => calls.discoveryRejected === true, 'post-stop discovery denial');

  assert.deepEqual(result, { outcome: 'stopped', exitCode: 0, connected: false });
  assert.equal(calls.discoveryAccepted, false);
  assert.equal(calls.discoveryRejected, true);
  assert.equal(calls.closes.length, 1);
  assert.equal(calls.closes[0].sameInstance, true);
  assert.equal(records().some((record) => record.status === 'connected'), false);
});

test('nonzero discovery auth codes emit a numeric code and never a message', async () => {
  const discovery = async (options) => {
    return { code: 514, data: null, msg: 'MARKER_AUTH_MESSAGE' };
  };

  const { runtime, calls, records, lines } = createTestRuntime({
    mode: 'auth-error',
    discovery,
    timing: { startupDeadlineMs: 500 },
  });

  const result = await runtime.start();

  assert.deepEqual(result, { outcome: 'failed', exitCode: 1, connected: false });
  const runtimeRecords = records();
  assert.deepEqual(runtimeRecords.map((record) => record.status), ['discovery_failed', 'failed']);
  assert.deepEqual(Object.keys(runtimeRecords[0]).sort(), ['code', 'status']);
  assert.equal(runtimeRecords[0].code, 514);
  assert.equal(typeof runtimeRecords[0].code, 'number');
  assert.deepEqual(runtimeRecords[1], { status: 'failed', error: 'sdk_error' });
  assert.equal(lines.join('').includes('MARKER'), false);
  assert.equal(lines.join('').includes('msg'), false);
  assert.equal(calls.closes.length, 1);
});

test('periodic snapshots contain only fixed counts and bounded numbers', async () => {
  const { runtime, calls, records } = createTestRuntime({
    mode: 'ready',
    timing: { startupDeadlineMs: 500, durationMs: 80, snapshotIntervalMs: 5 },
  });

  const done = runtime.start();
  const dispatcher = calls.starts[0].eventDispatcher;
  await invoke(dispatcher, 'im.message.receive_v1', {
    message: { chat_type: 'p2p', content: 'MARKER_SNAPSHOT_BODY' },
  });

  await waitFor(
    () => records().some((record) => record.status === 'snapshot' && record.total >= 1),
    'snapshot',
  );
  await done;

  const snapshots = records().filter((record) => record.status === 'snapshot');
  assert.ok(snapshots.length >= 1);
  for (const snapshot of snapshots) {
    assert.deepEqual(Object.keys(snapshot).sort(), [
      'botAdded',
      'cards',
      'group',
      'invalid',
      'p2p',
      'received',
      'status',
      'total',
      'unknown',
    ]);
    for (const key of ['botAdded', 'cards', 'group', 'invalid', 'p2p', 'received', 'total', 'unknown']) {
      assert.equal(Number.isSafeInteger(snapshot[key]) && snapshot[key] >= 0, true, key);
    }
    assert.equal(snapshot.received, snapshot.total - snapshot.invalid);
  }
  assert.equal(snapshots.some((snapshot) => snapshot.p2p >= 1), true);
});

test('every emitted record uses fixed fields, statuses, and bounded numbers', async () => {
  const { runtime, calls, records } = createTestRuntime({
    mode: 'ready',
    timing: { startupDeadlineMs: 500, durationMs: 40, snapshotIntervalMs: 5 },
  });

  const done = runtime.start();
  const dispatcher = calls.starts[0].eventDispatcher;
  await invoke(dispatcher, 'im.message.receive_v1', { message: { chat_type: 'group' } });
  await invoke(dispatcher, 'im.message.receive_v1', { event: 'MARKER_INVALID' });
  await done;

  const emitted = records();
  assert.ok(emitted.length > 0);
  assert.equal(
    emitted.some((record) => record.status === 'invalid' && record.error === 'invalid_payload'),
    true,
  );
  for (const record of emitted) {
    assert.equal(RUNTIME_STATUSES.has(record.status), true);
    for (const key of Object.keys(record)) {
      assert.equal(RUNTIME_KEYS.has(key), true, key);
    }
    for (const key of ['code', 'total', 'invalid', 'received', 'p2p', 'group', 'unknown', 'cards', 'botAdded', 'durationMs']) {
      if (key in record) {
        assert.equal(Number.isSafeInteger(record[key]) && record[key] >= 0, true, key);
      }
    }
    if ('error' in record) {
      assert.equal(
        ['startup_timeout', 'sdk_error', 'internal_error', 'config_invalid', 'invalid_payload'].includes(record.error),
        true,
      );
    }
    if ('reason' in record) {
      assert.equal(['timeout', 'signal'].includes(record.reason), true);
    }
  }
});

test('a throwing writeLine never escapes runtime callbacks', async () => {
  const { runtime } = createTestRuntime({
    mode: 'ready',
    timing: { startupDeadlineMs: 500, durationMs: 15 },
    writeLine: () => {
      throw new Error('MARKER_WRITE_FAILURE');
    },
  });

  let result;
  await assert.doesNotReject(async () => {
    result = await runtime.start();
  });
  assert.deepEqual(result, { outcome: 'stopped', exitCode: 0, connected: true });
});

test('run.mjs fails closed on empty stdin with a constant safe line', () => {
  const result = spawnSync(process.execPath, [RUN_PATH], {
    input: '',
    encoding: 'utf8',
    timeout: 10000,
  });

  assert.equal(result.status, 1);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout, '{"status":"failed","error":"config_invalid"}\n');
});

test('run.mjs does not echo malformed stdin credentials', () => {
  const marker = 'MARKER_STDIN_JSON';
  const result = spawnSync(process.execPath, [RUN_PATH], {
    input: `{"appId":${marker}`,
    encoding: 'utf8',
    timeout: 10000,
  });

  assert.equal(result.status, 1);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout.includes(marker), false);
  assert.equal(result.stdout, '{"status":"failed","error":"config_invalid"}\n');
});

test('run.mjs rejects a wrong app id without echoing configuration values', () => {
  const result = spawnSync(process.execPath, [RUN_PATH], {
    input: JSON.stringify({
      appId: 'cli_MARKER_WRONG_APP',
      appSecret: 'MARKER_STDIN_SECRET',
      durationSeconds: 30,
    }),
    encoding: 'utf8',
    timeout: 10000,
  });

  assert.equal(result.status, 1);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout, '{"status":"failed","error":"config_invalid"}\n');
  assert.equal(result.stdout.includes('MARKER'), false);
});

function waitForExit(child, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error('child did not exit'));
    }, timeoutMs);
    timer.unref();
    child.once('exit', (code, signal) => {
      clearTimeout(timer);
      resolve({ code, signal });
    });
  });
}

for (const signalName of ['SIGINT', 'SIGTERM']) {
  test(`run.mjs stops gracefully on ${signalName} while waiting for stdin`, async () => {
    const child = spawn(process.execPath, [RUN_PATH], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    await delay(300);
    child.kill(signalName);
    const exit = await waitForExit(child);

    assert.equal(exit.code, 0);
    assert.equal(stderr, '');
    assert.equal(stdout, '{"status":"stopped","reason":"signal"}\n');
  });
}