import { isIP } from 'node:net';

import * as defaultSdk from '@larksuiteoapi/node-sdk';

import { createAudit, createHandlers } from './core.mjs';

export const DISCOVERY_URL = 'https://open.feishu.cn/callback/ws/endpoint';
// Discovery (10s) and handshake (10s) can run back to back before onReady, so
// the startup deadline keeps a 5s scheduling margin above that sum.
export const STARTUP_DEADLINE_MS = 25000;
export const HANDSHAKE_TIMEOUT_MS = 10000;
export const SNAPSHOT_INTERVAL_MS = 15000;
export const MAX_DISCOVERY_TIMEOUT_MS = 10000;
export const MAX_DISCOVERY_RESPONSE_BYTES = 64 * 1024;
// Fail-closed discovery budget: reconnects repeat discovery per attempt, so
// cap the run and refuse attempts that arrive inside the one-second floor.
export const MAX_DISCOVERY_ATTEMPTS = 32;
export const MIN_DISCOVERY_INTERVAL_MS = 1000;
const MAX_DISCOVERY_CODE = Number.MAX_SAFE_INTEGER;
const MAX_DURATION_MS = 600 * 1000;
const MAX_SECRET_BYTES = 4096;

const RUNTIME_STATUSES = new Set([
  'connected',
  'reconnecting',
  'reconnected',
  'stopped',
  'failed',
  'discovery_failed',
  'snapshot',
]);
const RUNTIME_ERRORS = new Set([
  'startup_timeout',
  'sdk_error',
  'internal_error',
  'config_invalid',
]);
const STOP_REASONS = new Set(['timeout', 'signal']);
const COUNT_FIELDS = [
  'total',
  'invalid',
  'received',
  'p2p',
  'group',
  'unknown',
  'cards',
  'botAdded',
];

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function fixedError(message, name) {
  const error = new Error(message);
  if (name !== undefined) {
    error.name = name;
  }
  return error;
}

function abortError() {
  return fixedError('discovery_aborted', 'AbortError');
}

function rejectionError() {
  return fixedError('discovery_rejected');
}

function isAllowedWssUrl(value) {
  if (typeof value !== 'string' || value.length === 0 || value.length > 4096) {
    return false;
  }
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'wss:'
    || parsed.username !== ''
    || parsed.password !== ''
    || parsed.hostname.length === 0) {
    return false;
  }
  // Local engineering policy: stay inside the Feishu domain family on the
  // default/443 port, with no userinfo and no IP literals. This is not a
  // claim that every official endpoint host lives here.
  if (parsed.port !== '' && parsed.port !== '443') {
    return false;
  }
  const hostname = parsed.hostname.toLowerCase();
  if (isIP(hostname) !== 0) {
    return false;
  }
  return hostname === 'feishu.cn' || hostname.endsWith('.feishu.cn');
}

function boundedClientInteger(value, minimum, maximum) {
  return Number.isInteger(value) && value >= minimum && value <= maximum;
}

function normalizeClientConfig(value) {
  // The SDK multiplies each field by 1000 and feeds setTimeout. Missing,
  // zero, fractional, or non-finite values become NaN/0ms timers and can spin
  // the reconnect/ping loops, so every timer must be a bounded integer second.
  try {
    if (!isRecord(value)) {
      throw rejectionError();
    }

    const pingInterval = value.PingInterval;
    const reconnectInterval = value.ReconnectInterval;
    const reconnectNonce = value.ReconnectNonce;
    const reconnectCount = value.ReconnectCount;

    if (!boundedClientInteger(pingInterval, 1, 3600)
      || !boundedClientInteger(reconnectInterval, 1, 3600)
      || !boundedClientInteger(reconnectNonce, 0, 3600)
      || !(reconnectCount === -1 || boundedClientInteger(reconnectCount, 0, 100))) {
      throw rejectionError();
    }

    return {
      PingInterval: pingInterval,
      ReconnectInterval: reconnectInterval,
      ReconnectNonce: reconnectNonce,
      ReconnectCount: reconnectCount,
    };
  } catch {
    throw rejectionError();
  }
}

function boundedTime(value, fallback, maximum) {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(Math.max(Math.trunc(value), 0), maximum);
}

/**
 * SDK logger used by EventDispatcher and WSClient. Every method intentionally
 * has zero declared parameters and discards whatever it receives: raw SDK
 * arguments can contain event payloads, tokens, URLs, or AxiosError objects.
 */
export function createSdkLogger() {
  return Object.freeze({
    error: () => {},
    warn: () => {},
    info: () => {},
    debug: () => {},
    trace: () => {},
  });
}

/**
 * Wrap the SDK's endpoint-discovery HTTP instance. The SDK calls
 * httpInstance.request({ method:'post', url, data:{AppID,AppSecret}, ... })
 * once for the initial connect and again for every reconnect attempt. Each
 * call is independent and bounded: the wrapper binds the body to the explicit
 * config, bounds timeout/response size/redirects, validates the WSS URL and
 * ClientConfig, and denies any response that lands after the AbortController
 * fires. It also fails closed beyond 32 attempts per run and refuses attempts
 * inside the one-second floor; it never sleeps or silently retries.
 */
export function createGuardedHttpInstance({
  appId,
  appSecret,
  request,
  record = () => {},
  signal,
  now = Date.now,
}) {
  const clock = typeof now === 'function' ? now : Date.now;
  let discoveryAttempts = 0;
  let lastDiscoveryAttemptAt;

  async function guardedRequest(options) {
    if (signal !== undefined && signal.aborted) {
      throw abortError();
    }
    if (!isRecord(options)) {
      throw rejectionError();
    }
    if (typeof options.method !== 'string' || options.method.toLowerCase() !== 'post') {
      throw rejectionError();
    }
    if (options.url !== DISCOVERY_URL) {
      throw rejectionError();
    }
    if (options.baseURL !== undefined && options.baseURL !== '') {
      throw rejectionError();
    }

    const body = options.data;
    if (!isRecord(body)
      || body.AppID !== appId
      || body.AppSecret !== appSecret) {
      throw rejectionError();
    }

    const requestedTimeout = Number.isFinite(options.timeout) ? options.timeout : MAX_DISCOVERY_TIMEOUT_MS;
    const forwarded = {
      ...options,
      method: 'post',
      url: DISCOVERY_URL,
      data: { AppID: appId, AppSecret: appSecret },
      maxRedirects: 0,
      maxContentLength: MAX_DISCOVERY_RESPONSE_BYTES,
      proxy: false,
      timeout: Math.min(Math.max(requestedTimeout, 1), MAX_DISCOVERY_TIMEOUT_MS),
    };
    if (signal !== undefined) {
      forwarded.signal = signal;
    }
    delete forwarded.baseURL;

    if (typeof request !== 'function') {
      throw rejectionError();
    }

    if (discoveryAttempts >= MAX_DISCOVERY_ATTEMPTS) {
      throw rejectionError();
    }
    let attemptedAt;
    try {
      attemptedAt = clock();
    } catch {
      throw rejectionError();
    }
    if (!Number.isFinite(attemptedAt)) {
      throw rejectionError();
    }
    if (lastDiscoveryAttemptAt !== undefined
      && attemptedAt - lastDiscoveryAttemptAt < MIN_DISCOVERY_INTERVAL_MS) {
      throw rejectionError();
    }
    discoveryAttempts += 1;
    lastDiscoveryAttemptAt = attemptedAt;

    let response;
    try {
      response = await request(forwarded);
    } catch {
      if (signal !== undefined && signal.aborted) {
        throw abortError();
      }
      throw rejectionError();
    }

    if (signal !== undefined && signal.aborted) {
      throw abortError();
    }

    if (isRecord(response)) {
      const status = response.status;
      if (Number.isInteger(status) && status >= 300 && status < 400) {
        throw rejectionError();
      }
      if (isRecord(response.headers) && response.headers.location !== undefined) {
        throw rejectionError();
      }
    }

    let serialized;
    try {
      serialized = JSON.stringify(response);
    } catch {
      throw rejectionError();
    }
    if (typeof serialized !== 'string'
      || Buffer.byteLength(serialized, 'utf8') > MAX_DISCOVERY_RESPONSE_BYTES) {
      throw rejectionError();
    }

    if (!isRecord(response)
      || !Number.isSafeInteger(response.code)
      || response.code < 0
      || response.code > MAX_DISCOVERY_CODE) {
      throw rejectionError();
    }

    if (response.code !== 0) {
      // data:{} lets pullConnectConfig destructure { URL, ClientConfig }
      // before it checks the nonzero code. Only the numeric code is exposed.
      try {
        record({ status: 'discovery_failed', code: response.code });
      } catch {
        // Auditing must never break discovery.
      }
      return { code: response.code, data: {} };
    }

    const data = response.data;
    if (!isRecord(data)) {
      throw rejectionError();
    }
    let url;
    try {
      url = data.URL;
    } catch {
      throw rejectionError();
    }
    if (!isAllowedWssUrl(url)) {
      throw rejectionError();
    }
    const clientConfig = normalizeClientConfig(data.ClientConfig);

    return { code: 0, data: { URL: url, ClientConfig: clientConfig } };
  }

  return { request: guardedRequest };
}

function createRecorder(writeLine) {
  return function record(input) {
    try {
      if (!isRecord(input)) {
        return;
      }

      const status = input.status;
      if (!RUNTIME_STATUSES.has(status)) {
        return;
      }

      const safe = { status };

      const error = input.error;
      if (RUNTIME_ERRORS.has(error)) {
        safe.error = error;
      }

      const reason = input.reason;
      if (STOP_REASONS.has(reason)) {
        safe.reason = reason;
      }

      const code = input.code;
      if (Number.isSafeInteger(code) && code >= 0 && code <= MAX_DISCOVERY_CODE) {
        safe.code = code;
      }

      for (const field of COUNT_FIELDS) {
        const value = input[field];
        if (Number.isSafeInteger(value) && value >= 0) {
          safe[field] = value;
        }
      }

      writeLine(`${JSON.stringify(safe)}\n`);
    } catch {
      // Output failure must never escape an SDK callback.
    }
  };
}

/**
 * Minimal receive-only runtime: EventDispatcher + low-level WSClient only.
 * It never constructs the REST Client, never sends messages, and never
 * requests a tenant/app token. All emitted lines are fixed-enum NDJSON.
 */
export function createRuntime({ config, sdk = defaultSdk, writeLine, timing = {} }) {
  if (typeof writeLine !== 'function') {
    throw new TypeError('createRuntime requires a writeLine function');
  }
  if (!isRecord(config)
    || typeof config.appId !== 'string'
    || typeof config.appSecret !== 'string'
    || config.appSecret.trim().length === 0
    || Buffer.byteLength(config.appSecret, 'utf8') > MAX_SECRET_BYTES) {
    throw new TypeError('invalid runtime config');
  }

  const settings = isRecord(timing) ? timing : {};
  const record = createRecorder(writeLine);
  const safeWriteLine = (line) => {
    try {
      writeLine(line);
    } catch {
      // Core auditing must never throw inside a handler.
    }
  };

  const audit = createAudit(safeWriteLine);
  const { handlers, snapshot } = createHandlers({ audit });
  const recordHandlerFailure = (eventType) => {
    try {
      audit({ event: eventType, status: 'invalid', error: 'handler_error' });
    } catch {
      // Fixed failure diagnostics must never escape an SDK callback either.
    }
  };
  const logger = createSdkLogger();
  const controller = new AbortController();

  const baseInstance = sdk.defaultHttpInstance;
  const baseRequest = baseInstance && typeof baseInstance.request === 'function'
    ? baseInstance.request.bind(baseInstance)
    : undefined;

  const httpInstance = createGuardedHttpInstance({
    appId: config.appId,
    appSecret: config.appSecret,
    request: baseRequest,
    record,
    signal: controller.signal,
  });

  const dispatcher = new sdk.EventDispatcher({
    logger,
    loggerLevel: sdk.LoggerLevel.error,
  });

  const plainHandler = (eventType) => (data) => {
    try {
      handlers[eventType]({ event: data });
    } catch {
      // Explicit invalid diagnostic; raw thrown values never reach output.
      recordHandlerFailure(eventType);
    }
    return undefined;
  };

  dispatcher.register({
    'im.message.receive_v1': plainHandler('im.message.receive_v1'),
    'im.chat.member.bot.added_v1': plainHandler('im.chat.member.bot.added_v1'),
    'card.action.trigger': (data) => {
      try {
        handlers['card.action.trigger']({ event: data });
      } catch {
        // Keep the acknowledgement contract even when the handler fails.
        recordHandlerFailure('card.action.trigger');
      }
      return {};
    },
  });

  const configuredDurationMs = Number.isInteger(config.durationSeconds)
    ? config.durationSeconds * 1000
    : 0;
  const durationMs = boundedTime(
    settings.durationMs === undefined ? configuredDurationMs : settings.durationMs,
    0,
    MAX_DURATION_MS,
  );
  const startupDeadlineMs = boundedTime(
    settings.startupDeadlineMs === undefined ? STARTUP_DEADLINE_MS : settings.startupDeadlineMs,
    STARTUP_DEADLINE_MS,
    STARTUP_DEADLINE_MS,
  );
  const snapshotIntervalMs = boundedTime(
    settings.snapshotIntervalMs === undefined ? SNAPSHOT_INTERVAL_MS : settings.snapshotIntervalMs,
    SNAPSHOT_INTERVAL_MS,
    SNAPSHOT_INTERVAL_MS,
  );

  let started = false;
  let finished = false;
  let connected = false;
  let startupTimer;
  let durationTimer;
  let snapshotTimer;
  let resolveDone;
  const done = new Promise((resolve) => {
    resolveDone = resolve;
  });

  function clearTimers() {
    if (startupTimer !== undefined) {
      clearTimeout(startupTimer);
      startupTimer = undefined;
    }
    if (durationTimer !== undefined) {
      clearTimeout(durationTimer);
      durationTimer = undefined;
    }
    if (snapshotTimer !== undefined) {
      clearInterval(snapshotTimer);
      snapshotTimer = undefined;
    }
  }

  function finalize(outcome, finalRecord) {
    if (finished) {
      return;
    }
    finished = true;
    clearTimers();
    try {
      controller.abort();
    } catch {
      // Abort must never throw.
    }
    try {
      client.close({ force: true });
    } catch {
      // The SDK close path is synchronous; keep shutdown safe regardless.
    }
    if (finalRecord !== undefined) {
      record(finalRecord);
    }
    const result = {
      outcome,
      exitCode: outcome === 'failed' ? 1 : 0,
      connected,
    };
    // Let an in-flight aborted discovery rejection propagate to its caller
    // before callers observe the terminal result.
    setImmediate(() => {
      resolveDone(result);
    });
  }

  function finishFailure(errorCode) {
    const safeError = RUNTIME_ERRORS.has(errorCode) ? errorCode : 'internal_error';
    finalize('failed', { status: 'failed', error: safeError });
  }

  function emitSnapshot() {
    const counts = snapshot();
    record({
      status: 'snapshot',
      total: counts.total,
      invalid: counts.invalid,
      received: Math.max(counts.total - counts.invalid, 0),
      p2p: counts.byChatType.p2p,
      group: counts.byChatType.group,
      unknown: counts.byChatType.unknown,
      cards: counts.byEvent['card.action.trigger'],
      botAdded: counts.byEvent['im.chat.member.bot.added_v1'],
    });
  }

  // SDK onReady means the WebSocket opened (WS open), not that application
  // protocol readiness, event subscription, or delivery was verified.
  function onReady() {
    try {
      if (finished || connected) {
        return;
      }
      connected = true;
      if (startupTimer !== undefined) {
        clearTimeout(startupTimer);
        startupTimer = undefined;
      }
      record({ status: 'connected' });
      durationTimer = setTimeout(() => {
        durationTimer = undefined;
        stop('timeout');
      }, durationMs);
      if (snapshotIntervalMs > 0) {
        snapshotTimer = setInterval(() => {
          try {
            emitSnapshot();
          } catch {
            // Snapshotting must never break the connection.
          }
        }, snapshotIntervalMs);
      }
    } catch {
      // Callback exceptions must never escape into the SDK state machine.
    }
  }

  function onError() {
    try {
      finishFailure('sdk_error');
    } catch {
      // Never throw out of an SDK callback.
    }
  }

  function onReconnecting() {
    try {
      if (!finished) {
        record({ status: 'reconnecting' });
      }
    } catch {
      // Never throw out of an SDK callback.
    }
  }

  function onReconnected() {
    try {
      if (!finished) {
        record({ status: 'reconnected' });
      }
    } catch {
      // Never throw out of an SDK callback.
    }
  }

  const client = new sdk.WSClient({
    appId: config.appId,
    appSecret: config.appSecret,
    domain: sdk.Domain.Feishu,
    logger,
    loggerLevel: sdk.LoggerLevel.error,
    onReady,
    onError,
    onReconnecting,
    onReconnected,
    handshakeTimeoutMs: HANDSHAKE_TIMEOUT_MS,
    autoReconnect: true,
    httpInstance,
  });

  function stop(reason = 'signal') {
    const safeReason = reason === 'timeout' ? 'timeout' : 'signal';
    try {
      if (finished) {
        return false;
      }
      finalize('stopped', { status: 'stopped', reason: safeReason });
      return true;
    } catch {
      return false;
    }
  }

  function fail(errorCode = 'internal_error') {
    const safeError = RUNTIME_ERRORS.has(errorCode) ? errorCode : 'internal_error';
    try {
      if (finished) {
        return false;
      }
      finishFailure(safeError);
      return true;
    } catch {
      return false;
    }
  }

  function start() {
    if (started) {
      return done;
    }
    started = true;
    if (finished) {
      return done;
    }

    startupTimer = setTimeout(() => {
      startupTimer = undefined;
      if (!finished && !connected) {
        finishFailure('startup_timeout');
      }
    }, startupDeadlineMs);

    try {
      const starting = client.start({ eventDispatcher: dispatcher });
      if (starting && typeof starting.then === 'function') {
        starting.then(undefined, () => {
          try {
            finishFailure('sdk_error');
          } catch {
            // Never surface an async rejection.
          }
        });
      }
    } catch {
      finishFailure('sdk_error');
    }

    return done;
  }

  return { start, stop, fail };
}
