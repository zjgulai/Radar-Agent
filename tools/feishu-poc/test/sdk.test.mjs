import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DISCOVERY_URL,
  HANDSHAKE_TIMEOUT_MS,
  MAX_DISCOVERY_ATTEMPTS,
  MAX_DISCOVERY_RESPONSE_BYTES,
  MAX_DISCOVERY_TIMEOUT_MS,
  MIN_DISCOVERY_INTERVAL_MS,
  SNAPSHOT_INTERVAL_MS,
  STARTUP_DEADLINE_MS,
  createGuardedHttpInstance,
  createSdkLogger,
} from '../runtime.mjs';

const APP_ID = 'cli_aa69bd34937adbf7';
const APP_SECRET = 'synthetic-guard-secret';
const WSS_URL = 'wss://open.feishu.cn/ws?device_id=synthetic-device&service_id=synthetic-service';
const CLIENT_CONFIG = {
  PingInterval: 120,
  ReconnectCount: -1,
  ReconnectInterval: 120,
  ReconnectNonce: 30,
};

function validResponse() {
  return {
    code: 0,
    data: { URL: WSS_URL, ClientConfig: CLIENT_CONFIG },
    msg: 'ok',
  };
}

function discoveryOptions(overrides = {}) {
  return {
    method: 'post',
    url: DISCOVERY_URL,
    data: { AppID: APP_ID, AppSecret: APP_SECRET },
    headers: { locale: 'zh', 'User-Agent': 'synthetic-ua' },
    timeout: 15000,
    ...overrides,
  };
}

function createGuard({ response = validResponse, now } = {}) {
  const calls = [];
  const records = [];
  const controller = new AbortController();
  const guard = createGuardedHttpInstance({
    appId: APP_ID,
    appSecret: APP_SECRET,
    request: async (options) => {
      calls.push(options);
      return typeof response === 'function' ? response(options) : response;
    },
    record: (record) => records.push(record),
    signal: controller.signal,
    ...(now === undefined ? {} : { now }),
  });
  return { guard, calls, records, controller };
}

function fixedRejection(error) {
  assert.equal(error.message, 'discovery_rejected');
  assert.equal(error.message.includes('MARKER'), false);
  return true;
}

test('pinned runtime timing constants are the verified values with startup margin', () => {
  assert.equal(STARTUP_DEADLINE_MS, 25000);
  assert.equal(HANDSHAKE_TIMEOUT_MS, 10000);
  assert.equal(MAX_DISCOVERY_TIMEOUT_MS, 10000);
  assert.equal(SNAPSHOT_INTERVAL_MS, 15000);
  assert.equal(MAX_DISCOVERY_RESPONSE_BYTES, 65536);
  // Discovery and handshake run back to back inside the startup deadline.
  assert.equal(
    STARTUP_DEADLINE_MS - MAX_DISCOVERY_TIMEOUT_MS - HANDSHAKE_TIMEOUT_MS,
    5000,
  );
});

test('SDK logger implements exactly the five methods and discards all arguments', () => {
  const logger = createSdkLogger();
  assert.deepEqual(Object.keys(logger).sort(), ['debug', 'error', 'info', 'trace', 'warn']);
  assert.equal('fatal' in logger, false);

  const hostile = {
    get secret() {
      throw new Error('MARKER_LOGGER_GETTER');
    },
  };
  for (const method of ['error', 'warn', 'info', 'debug', 'trace']) {
    assert.equal(typeof logger[method], 'function');
    assert.equal(logger[method].length, 0);
    assert.equal(logger[method](hostile, 'MARKER_LOG_TEXT', 42, { nested: true }), undefined);
  }
});

test('guard forwards one bounded POST discovery request and preserves ClientConfig', async () => {
  const { guard, calls, records } = createGuard();

  const result = await guard.request(discoveryOptions({
    timeout: 15000,
    maxRedirects: 5,
    baseURL: '',
  }));

  assert.equal(calls.length, 1);
  const sent = calls[0];
  assert.equal(sent.method, 'post');
  assert.equal(sent.url, DISCOVERY_URL);
  assert.equal(sent.maxRedirects, 0);
  assert.equal(sent.proxy, false);
  assert.equal(sent.timeout, 10000);
  assert.equal(sent.maxContentLength, 65536);
  assert.equal(sent.signal instanceof AbortSignal, true);
  assert.deepEqual(sent.data, { AppID: APP_ID, AppSecret: APP_SECRET });
  assert.deepEqual(sent.headers, { locale: 'zh', 'User-Agent': 'synthetic-ua' });

  assert.deepEqual(result, {
    code: 0,
    data: {
      URL: WSS_URL,
      ClientConfig: {
        PingInterval: 120,
        ReconnectCount: -1,
        ReconnectInterval: 120,
        ReconnectNonce: 30,
      },
    },
  });
  assert.deepEqual(records, []);
});

test('guard accepts an explicit POST spelling and a shorter timeout without exceeding the cap', async () => {
  const { guard, calls } = createGuard();

  const result = await guard.request(discoveryOptions({ method: 'POST', timeout: 2500 }));

  assert.equal(result.code, 0);
  assert.equal(calls[0].timeout, 2500);
});

test('guard requires a ClientConfig record with every timer bounded to integer seconds', async () => {
  const invalidConfigs = [
    ['missing ClientConfig', undefined],
    ['null ClientConfig', null],
    ['array ClientConfig', []],
    ['string ClientConfig', 'config'],
    ['numeric ClientConfig', 42],
    ['empty ClientConfig', {}],
    ['zero PingInterval', { ...CLIENT_CONFIG, PingInterval: 0 }],
    ['oversized PingInterval', { ...CLIENT_CONFIG, PingInterval: 3601 }],
    ['fractional PingInterval', { ...CLIENT_CONFIG, PingInterval: 1.5 }],
    ['negative PingInterval', { ...CLIENT_CONFIG, PingInterval: -1 }],
    ['string PingInterval', { ...CLIENT_CONFIG, PingInterval: '120' }],
    ['NaN PingInterval', { ...CLIENT_CONFIG, PingInterval: NaN }],
    ['zero ReconnectInterval', { ...CLIENT_CONFIG, ReconnectInterval: 0 }],
    ['oversized ReconnectInterval', { ...CLIENT_CONFIG, ReconnectInterval: 3601 }],
    ['fractional ReconnectInterval', { ...CLIENT_CONFIG, ReconnectInterval: 1.5 }],
    ['negative ReconnectInterval', { ...CLIENT_CONFIG, ReconnectInterval: -1 }],
    ['string ReconnectInterval', { ...CLIENT_CONFIG, ReconnectInterval: '120' }],
    ['negative ReconnectNonce', { ...CLIENT_CONFIG, ReconnectNonce: -1 }],
    ['oversized ReconnectNonce', { ...CLIENT_CONFIG, ReconnectNonce: 3601 }],
    ['fractional ReconnectNonce', { ...CLIENT_CONFIG, ReconnectNonce: 1.5 }],
    ['string ReconnectNonce', { ...CLIENT_CONFIG, ReconnectNonce: '30' }],
    ['too-small ReconnectCount', { ...CLIENT_CONFIG, ReconnectCount: -2 }],
    ['oversized ReconnectCount', { ...CLIENT_CONFIG, ReconnectCount: 101 }],
    ['fractional ReconnectCount', { ...CLIENT_CONFIG, ReconnectCount: 1.5 }],
    ['string ReconnectCount', { ...CLIENT_CONFIG, ReconnectCount: '1' }],
  ];

  for (const [name, clientConfig] of invalidConfigs) {
    const { guard, calls, records } = createGuard({
      response: {
        code: 0,
        data: { URL: WSS_URL, ClientConfig: clientConfig },
        msg: 'ok',
      },
    });

    await assert.rejects(
      guard.request(discoveryOptions()),
      (error) => {
        assert.equal(error.message, 'discovery_rejected', name);
        assert.equal(error.message.includes('MARKER'), false, name);
        return true;
      },
      name,
    );
    assert.equal(calls.length, 1, name);
    assert.deepEqual(records, [], name);
  }
});

test('guard accepts the inclusive ClientConfig timer boundaries', async () => {
  const validConfigs = [
    { PingInterval: 1, ReconnectInterval: 1, ReconnectNonce: 0, ReconnectCount: 0 },
    { PingInterval: 3600, ReconnectInterval: 3600, ReconnectNonce: 3600, ReconnectCount: 100 },
    { PingInterval: 120, ReconnectInterval: 120, ReconnectNonce: 30, ReconnectCount: -1 },
  ];

  for (const clientConfig of validConfigs) {
    const { guard } = createGuard({
      response: {
        code: 0,
        data: { URL: WSS_URL, ClientConfig: clientConfig },
        msg: 'ok',
      },
    });

    assert.deepEqual(await guard.request(discoveryOptions()), {
      code: 0,
      data: { URL: WSS_URL, ClientConfig: clientConfig },
    });
  }
});

test('guard rejects hostile ClientConfig getters with a fixed error', async () => {
  let reads = 0;
  const hostileConfig = { ...CLIENT_CONFIG };
  Object.defineProperty(hostileConfig, 'PingInterval', {
    enumerable: true,
    get() {
      reads += 1;
      if (reads > 1) {
        throw new Error('MARKER_CLIENT_CONFIG_GETTER');
      }
      return 120;
    },
  });

  const { guard } = createGuard({
    response: {
      code: 0,
      data: { URL: WSS_URL, ClientConfig: hostileConfig },
      msg: 'ok',
    },
  });

  await assert.rejects(
    guard.request(discoveryOptions()),
    (error) => {
      assert.equal(error.message, 'discovery_rejected');
      assert.equal(error.message.includes('MARKER'), false);
      return true;
    },
  );
});

test('guard strips unrelated ClientConfig and discovery data fields', async () => {
  const { guard } = createGuard({
    response: {
      code: 0,
      data: {
        URL: WSS_URL,
        ClientConfig: { ...CLIENT_CONFIG, PrivateTimer: 'MARKER_CLIENT_CONFIG' },
        PrivateField: 'MARKER_DISCOVERY_DATA',
      },
      msg: 'MARKER_DISCOVERY_MESSAGE',
    },
  });

  const result = await guard.request(discoveryOptions());

  assert.deepEqual(result, {
    code: 0,
    data: { URL: WSS_URL, ClientConfig: CLIENT_CONFIG },
  });
  assert.equal(JSON.stringify(result).includes('MARKER'), false);
  assert.deepEqual(Object.keys(result.data.ClientConfig).sort(), [
    'PingInterval',
    'ReconnectCount',
    'ReconnectInterval',
    'ReconnectNonce',
  ]);
});

test('guard enforces the one-second discovery floor without sleeping', async () => {
  let clock = 5000;
  const { guard, calls } = createGuard({ now: () => clock });

  await guard.request(discoveryOptions());
  clock += MIN_DISCOVERY_INTERVAL_MS - 1;
  await assert.rejects(guard.request(discoveryOptions()), fixedRejection);
  assert.equal(calls.length, 1);

  clock += 1;
  await guard.request(discoveryOptions());
  assert.equal(calls.length, 2);
});

test('guard caps discovery attempts per run at 32', async () => {
  let clock = 0;
  const { guard, calls, records } = createGuard({ now: () => clock });

  for (let attempt = 0; attempt < MAX_DISCOVERY_ATTEMPTS; attempt += 1) {
    assert.equal((await guard.request(discoveryOptions())).code, 0);
    clock += MIN_DISCOVERY_INTERVAL_MS;
  }
  await assert.rejects(guard.request(discoveryOptions()), fixedRejection);

  assert.equal(calls.length, MAX_DISCOVERY_ATTEMPTS);
  assert.deepEqual(records, []);
});

test('guard confines discovery WSS URLs to the feishu.cn family on port 443', async () => {
  const accepted = [
    'wss://feishu.cn/ws',
    'wss://open.feishu.cn/ws',
    'wss://open.feishu.cn:443/ws',
    'wss://a.b.feishu.cn/ws?device_id=synthetic-device',
    'WSS://OPEN.FEISHU.CN/ws',
  ];

  for (const url of accepted) {
    const { guard } = createGuard({
      response: { code: 0, data: { URL: url, ClientConfig: CLIENT_CONFIG } },
    });
    const result = await guard.request(discoveryOptions());
    assert.equal(result.data.URL, url, url);
  }

  const rejected = [
    'wss://open.feishu.cn:8443/ws',
    'wss://open.feishu.cn:80/ws',
    'wss://feishu.cn.evil.example/ws',
    'wss://evilfeishu.cn/ws',
    'wss://open.feishu.cn.evil/ws',
    'wss://open.larkoffice.com/ws',
    'wss://127.0.0.1/ws',
    'wss://10.0.0.1/ws',
    'wss://[::1]/ws',
  ];

  for (const url of rejected) {
    const { guard , records } = createGuard({
      response: { code: 0, data: { URL: url, ClientConfig: CLIENT_CONFIG } },
    });
    await assert.rejects(
      guard.request(discoveryOptions()),
      (error) => {
        assert.equal(error.message, 'discovery_rejected', url);
        assert.equal(error.message.includes(url), false, url);
        return true;
      },
      url,
    );
    assert.deepEqual(records, [], url);
  }
});

test('guard rejects wrong methods, non-discovery URLs, and alternate auth bodies before the request', async () => {
  const rejected = [
    { name: 'GET', options: discoveryOptions({ method: 'get' }) },
    { name: 'PUT', options: discoveryOptions({ method: 'put' }) },
    { name: 'DELETE', options: discoveryOptions({ method: 'delete' }) },
    { name: 'missing method', options: discoveryOptions({ method: undefined }) },
    { name: 'plain http', options: discoveryOptions({ url: 'http://open.feishu.cn/callback/ws/endpoint' }) },
    { name: 'other host', options: discoveryOptions({ url: 'https://MARKER.example/callback/ws/endpoint' }) },
    { name: 'other path', options: discoveryOptions({ url: 'https://open.feishu.cn/callback/ws/other' }) },
    { name: 'query suffix', options: discoveryOptions({ url: `${DISCOVERY_URL}?rewrite=1` }) },
    { name: 'baseURL override', options: discoveryOptions({ baseURL: 'https://MARKER.example' }) },
    {
      name: 'wrong app id',
      options: discoveryOptions({ data: { AppID: 'cli_0000000000000000', AppSecret: APP_SECRET } }),
    },
    {
      name: 'wrong secret',
      options: discoveryOptions({ data: { AppID: APP_ID, AppSecret: 'MARKER_WRONG_SECRET' } }),
    },
    {
      name: 'client assertion bypass',
      options: discoveryOptions({
        data: { AppID: APP_ID, AppSecret: '', ClientAssertion: 'MARKER_ASSERTION' },
      }),
    },
    { name: 'missing body', options: discoveryOptions({ data: undefined }) },
  ];

  for (const { name, options } of rejected) {
    const { guard, calls, records } = createGuard();
    await assert.rejects(
      guard.request(options),
      (error) => {
        assert.equal(error.message, 'discovery_rejected', name);
        assert.equal(error.message.includes('MARKER'), false, name);
        assert.equal(error.message.includes('http'), false, name);
        return true;
      },
      name,
    );
    assert.equal(calls.length, 0, name);
    assert.deepEqual(records, [], name);
  }
});

test('guard rejects redirect responses and still forces maxRedirects to zero', async () => {
  const { guard, calls } = createGuard({
    response: {
      status: 302,
      headers: { location: 'https://MARKER.example/redirect' },
      data: validResponse(),
    },
  });

  await assert.rejects(
    guard.request(discoveryOptions()),
    (error) => {
      assert.equal(error.message, 'discovery_rejected');
      assert.equal(error.message.includes('MARKER'), false);
      return true;
    },
  );
  assert.equal(calls[0].maxRedirects, 0);
});

test('guard rejects a response that exceeds the fixed byte bound', async () => {
  const oversized = validResponse();
  oversized.msg = 'MARKER_OVERSIZED_' + 'x'.repeat(MAX_DISCOVERY_RESPONSE_BYTES);

  const { guard } = createGuard({ response: oversized });

  await assert.rejects(
    guard.request(discoveryOptions()),
    (error) => {
      assert.equal(error.message, 'discovery_rejected');
      assert.equal(error.message.includes('MARKER'), false);
      return true;
    },
  );
});

test('guard turns a nonzero discovery code into numeric code plus empty data only', async () => {
  const { guard, records } = createGuard({
    response: { code: 514, data: null, msg: 'MARKER_AUTH_MESSAGE' },
  });

  const result = await guard.request(discoveryOptions());

  assert.deepEqual(result, { code: 514, data: {} });
  assert.equal(typeof result.code, 'number');
  assert.equal('msg' in result, false);
  assert.deepEqual(records, [{ status: 'discovery_failed', code: 514 }]);
  assert.equal(JSON.stringify(records).includes('MARKER'), false);
  assert.equal(JSON.stringify(records).includes('AUTH_MESSAGE'), false);
});

test('guard passes the official large connection-limit code through as a number', async () => {
  const { guard, records } = createGuard({
    response: { code: 1000040350, data: null, msg: 'MARKER_EXCEED_CONN' },
  });

  const result = await guard.request(discoveryOptions());

  assert.deepEqual(result, { code: 1000040350, data: {} });
  assert.deepEqual(records, [{ status: 'discovery_failed', code: 1000040350 }]);
  assert.equal(JSON.stringify(records).includes('MARKER'), false);
});

test('guard rejects malformed or unbounded numeric codes without echoing values', async () => {
  const codes = ['514', 1.5, NaN, Infinity, -1, Number.MAX_SAFE_INTEGER + 1, undefined, null];

  for (const code of codes) {
    const { guard, calls, records } = createGuard({
      response: { code, data: validResponse().data, msg: 'MARKER_BAD_CODE' },
    });

    await assert.rejects(
      guard.request(discoveryOptions()),
      (error) => {
        assert.equal(error.message, 'discovery_rejected');
        assert.equal(error.message.includes('MARKER'), false);
        return true;
      },
    );
    assert.equal(calls.length, 1);
    assert.deepEqual(records, []);
  }
});

test('guard accepts only credential-free wss discovery URLs', async () => {
  const rejectedUrls = [
    'ws://open.feishu.cn/ws',
    'http://open.feishu.cn/ws',
    'https://open.feishu.cn/ws',
    'wss://user:pass@open.feishu.cn/ws',
    'wss://:pass@open.feishu.cn/ws',
    'not a url',
    '',
  ];

  for (const url of rejectedUrls) {
    const { guard, records } = createGuard({
      response: { code: 0, data: { URL: url, ClientConfig: CLIENT_CONFIG } },
    });

    await assert.rejects(
      guard.request(discoveryOptions()),
      (error) => {
        assert.equal(error.message, 'discovery_rejected');
        assert.equal(error.message.includes('open.feishu.cn'), false);
        assert.equal(error.message.includes('user'), false);
        return true;
      },
      url,
    );
    assert.deepEqual(records, []);
  }
});

test('guard rejects circular or non-serializable responses with a fixed error', async () => {
  const circular = validResponse();
  circular.self = circular;

  const cases = [circular, { code: 0, data: { URL: WSS_URL, ClientConfig: CLIENT_CONFIG }, extra: 1n }];

  for (const response of cases) {
    const { guard } = createGuard({ response });
    await assert.rejects(
      guard.request(discoveryOptions()),
      (error) => {
        assert.equal(error.message, 'discovery_rejected');
        return true;
      },
    );
  }
});

test('guard aborts before the request when its signal is already aborted', async () => {
  const controller = new AbortController();
  controller.abort();
  const calls = [];
  const guard = createGuardedHttpInstance({
    appId: APP_ID,
    appSecret: APP_SECRET,
    request: async (options) => {
      calls.push(options);
      return validResponse();
    },
    signal: controller.signal,
  });

  await assert.rejects(
    guard.request(discoveryOptions()),
    (error) => {
      assert.equal(error.name, 'AbortError');
      assert.equal(error.message, 'discovery_aborted');
      return true;
    },
  );
  assert.equal(calls.length, 0);
});

test('guard denies a discovery response that resolves after abort', async () => {
  const controller = new AbortController();
  let resolveResponse;
  let sent;
  const guard = createGuardedHttpInstance({
    appId: APP_ID,
    appSecret: APP_SECRET,
    request: (options) => {
      sent = options;
      return new Promise((resolve) => {
        resolveResponse = resolve;
      });
    },
    signal: controller.signal,
  });

  const pending = guard.request(discoveryOptions());
  assert.equal(sent.signal, controller.signal);

  controller.abort();
  resolveResponse(validResponse());

  await assert.rejects(
    pending,
    (error) => {
      assert.equal(error.name, 'AbortError');
      assert.equal(error.message, 'discovery_aborted');
      return true;
    },
  );
  assert.equal(sent.signal.aborted, true);
});
