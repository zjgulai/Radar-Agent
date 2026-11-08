import test from 'node:test';
import assert from 'node:assert/strict';

import { TARGET_APP_ID, parseConfig, createAudit, createHandlers } from '../core.mjs';

const APP_ID = 'cli_aa69bd34937adbf7';
const SECRET = 'synthetic-test-secret';

function captureAudit() {
  const lines = [];
  const audit = createAudit((line) => lines.push(line));
  return { audit, lines, records: () => lines.map((line) => JSON.parse(line)) };
}

function createHandlerHarness({ now } = {}) {
  const lines = [];
  const audit = createAudit((line) => lines.push(line));
  const { handlers, snapshot } = createHandlers({ audit, now });
  return { handlers, snapshot, lines, records: () => lines.map((line) => JSON.parse(line)) };
}

test('TARGET_APP_ID is the fixed receive-only app binding', () => {
  assert.equal(TARGET_APP_ID, 'cli_aa69bd34937adbf7');
});

test('parseConfig returns explicit target credentials and the 300 second default', () => {
  const config = parseConfig({ appId: APP_ID, appSecret: SECRET });
  assert.deepEqual(config, {
    appId: 'cli_aa69bd34937adbf7',
    appSecret: 'synthetic-test-secret',
    durationSeconds: 300,
  });
});

test('parseConfig accepts inclusive duration boundaries 10 and 600', () => {
  for (const durationSeconds of [10, 600]) {
    const config = parseConfig({ appId: APP_ID, appSecret: SECRET, durationSeconds });
    assert.equal(config.durationSeconds, durationSeconds);
  }
});

test('parseConfig ignores unrelated input fields and never returns them', () => {
  const config = parseConfig({
    appId: APP_ID,
    appSecret: SECRET,
    durationSeconds: 45,
    appToken: 'MARKER_APP_TOKEN',
    baseUrl: 'https://MARKER.example/hook',
    nested: { MARKER: true },
  });
  assert.deepEqual(Object.keys(config).sort(), ['appId', 'appSecret', 'durationSeconds']);
  assert.equal(JSON.stringify(config).includes('MARKER'), false);
});

test('parseConfig rejects any app id other than the fixed target without echoing it', () => {
  const supplied = 'cli_MARKER_not_the_target';
  assert.throws(
    () => parseConfig({ appId: supplied, appSecret: SECRET }),
    (error) => {
      assert.equal(error.code, 'config_app_id_invalid');
      assert.equal(error.message.includes(supplied), false);
      return true;
    },
  );
});

test('parseConfig rejects missing, blank, or nonstring secrets without echoing values', () => {
  const cases = [
    { appId: APP_ID },
    { appId: APP_ID, appSecret: '' },
    { appId: APP_ID, appSecret: '   \t\n' },
    { appId: APP_ID, appSecret: 42 },
    { appId: APP_ID, appSecret: null },
    { appId: APP_ID, appSecret: { marker: 'MARKER_OBJECT_SECRET' } },
  ];

  for (const input of cases) {
    assert.throws(
      () => parseConfig(input),
      (error) => {
        assert.equal(error.code, 'config_app_secret_invalid');
        assert.equal(error.message.includes('MARKER'), false);
        assert.equal(error.message.includes('42'), false);
        return true;
      },
    );
  }
});

test('parseConfig accepts unusual secrets by UTF-8 length and does not guess token shape', () => {
  const unusual = 'not-a-feishu-token::{"utf8":"✓"}::line\nbreak';
  assert.equal(parseConfig({ appId: APP_ID, appSecret: unusual }).appSecret, unusual);

  const exactly4096Ascii = 'A'.repeat(4096);
  assert.equal(parseConfig({ appId: APP_ID, appSecret: exactly4096Ascii }).appSecret, exactly4096Ascii);

  const exactly4096Utf8 = 'é'.repeat(2048);
  assert.equal(Buffer.byteLength(exactly4096Utf8, 'utf8'), 4096);
  assert.equal(parseConfig({ appId: APP_ID, appSecret: exactly4096Utf8 }).appSecret, exactly4096Utf8);
});

test('parseConfig rejects secrets over 4096 UTF-8 bytes without echoing them', () => {
  const tooLongAscii = 'MARKER_' + 'A'.repeat(4090);
  const tooLongUtf8 = 'MARKER_' + 'é'.repeat(2050);

  for (const appSecret of [tooLongAscii, tooLongUtf8]) {
    assert.throws(
      () => parseConfig({ appId: APP_ID, appSecret }),
      (error) => {
        assert.equal(error.code, 'config_app_secret_invalid');
        assert.equal(error.message.includes('MARKER_'), false);
        return true;
      },
    );
  }
});

test('parseConfig rejects malformed duration values', () => {
  const cases = ['300', 9, 601, 10.5, NaN, Infinity, -Infinity, null, true, {}, [300]];

  for (const durationSeconds of cases) {
    assert.throws(
      () => parseConfig({ appId: APP_ID, appSecret: SECRET, durationSeconds }),
      { code: 'config_duration_invalid' },
    );
  }
});

test('parseConfig rejects non-object config sources without echoing them', () => {
  const cases = [null, undefined, '{"appId":"cli_aa69bd34937adbf7"}', 42, true, [APP_ID]];

  for (const input of cases) {
    assert.throws(() => parseConfig(input), { code: 'config_invalid' });
  }
});

test('parseConfig never falls back to ambient credential environment variables', () => {
  const names = [
    'FEISHU_APP_ID',
    'FEISHU_APP_SECRET',
    'LARK_APP_ID',
    'LARK_APP_SECRET',
    'APP_ID',
    'APP_SECRET',
  ];
  const saved = new Map(names.map((name) => [name, process.env[name]]));

  try {
    for (const name of names) {
      process.env[name] = name.endsWith('ID') ? APP_ID : 'MARKER_ENV_SECRET';
    }

    assert.throws(() => parseConfig({}), { code: 'config_app_id_invalid' });
    assert.throws(() => parseConfig({ appId: APP_ID }), { code: 'config_app_secret_invalid' });
  } finally {
    for (const [name, value] of saved) {
      if (value === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = value;
      }
    }
  }
});

test('createAudit writes one allowlisted JSON object plus newline per record', () => {
  const { audit, lines, records } = captureAudit();

  audit({ event: 'im.message.receive_v1', status: 'received', chatType: 'p2p', count: 2, durationMs: 7 });
  audit({ event: 'card.action.trigger', status: 'received' });

  assert.equal(typeof audit, 'function');
  assert.equal(lines.length, 2);
  for (const line of lines) {
    assert.equal(line.endsWith('\n'), true);
    assert.equal(line.slice(0, -1).includes('\n'), false);
  }

  const [first, second] = records();
  const { requestId: firstId, ...firstFields } = first;
  const { requestId: secondId, ...secondFields } = second;

  assert.deepEqual(firstFields, {
    event: 'im.message.receive_v1',
    status: 'received',
    chatType: 'p2p',
    count: 2,
    durationMs: 7,
  });
  assert.deepEqual(secondFields, {
    event: 'card.action.trigger',
    status: 'received',
  });
  assert.match(firstId, /^req-[1-9][0-9]*$/);
  assert.match(secondId, /^req-[1-9][0-9]*$/);
  assert.notEqual(firstId, secondId);
});

test('createAudit drops unknown fields, nested objects, raw errors, tokens, ids, and urls', () => {
  const { audit, lines, records } = captureAudit();

  audit({
    event: 'im.message.receive_v1',
    status: 'received',
    chatType: 'p2p',
    requestId: 'src-MARKER_REQUEST_ID',
    appSecret: 'MARKER_SECRET',
    accessToken: 'MARKER_TOKEN',
    openId: 'ou_MARKER',
    messageId: 'om_MARKER',
    url: 'https://MARKER.example/x',
    content: 'MARKER_BODY',
    summary: 'MARKER_SUMMARY',
    error: new Error('MARKER_RAW_ERROR'),
    nested: { MARKER: true },
  });

  assert.equal(lines.length, 1);
  const { requestId, ...rest } = records()[0];
  assert.deepEqual(rest, {
    event: 'im.message.receive_v1',
    status: 'received',
    chatType: 'p2p',
  });
  assert.match(requestId, /^req-[1-9][0-9]*$/);

  const output = lines.join('');
  for (const marker of [
    'MARKER_SECRET',
    'MARKER_TOKEN',
    'ou_MARKER',
    'om_MARKER',
    'MARKER.example',
    'MARKER_BODY',
    'MARKER_SUMMARY',
    'MARKER_RAW_ERROR',
    'src-MARKER_REQUEST_ID',
  ]) {
    assert.equal(output.includes(marker), false);
  }
});

test('createAudit drops allowlisted fields whose values are outside the fixed whitelist', () => {
  const { audit, lines, records } = captureAudit();

  audit({ event: 'evil.event', status: 'pwned', error: 'MARKER_RAW_ERROR', chatType: 'dm', count: -1, durationMs: 1.5 });
  assert.equal(lines.length, 0);

  audit({ event: 'im.message.receive_v1', status: 'received', chatType: 'dm', count: 3.5, durationMs: -2 });
  const { requestId, ...rest } = records()[0];
  assert.deepEqual(rest, {
    event: 'im.message.receive_v1',
    status: 'received',
  });
  assert.match(requestId, /^req-[1-9][0-9]*$/);

  audit({ status: 'invalid', error: 'invalid_payload' });
  const invalid = records()[1];
  assert.equal(invalid.status, 'invalid');
  assert.equal(invalid.error, 'invalid_payload');

  for (const rejected of [{ status: 'error' }, { event: 'im.message.receive_v1.extra' }, { error: 'raw_error' }]) {
    const before = lines.length;
    audit(rejected);
    assert.equal(lines.length, before);
  }
});

test('createAudit accepts only nonnegative safe integer counters and durations', () => {
  const { audit, records } = captureAudit();

  audit({ status: 'received', count: 0, durationMs: 0 });
  audit({ status: 'received', count: Number.MAX_SAFE_INTEGER, durationMs: Number.MAX_SAFE_INTEGER });
  audit({ status: 'received', count: Number.MAX_SAFE_INTEGER + 1, durationMs: -1 });
  audit({ status: 'received', count: NaN, durationMs: '5' });

  const [zero, max, overflow, malformed] = records();
  assert.equal(zero.count, 0);
  assert.equal(zero.durationMs, 0);
  assert.equal(max.count, Number.MAX_SAFE_INTEGER);
  assert.equal(max.durationMs, Number.MAX_SAFE_INTEGER);
  assert.deepEqual(Object.keys(overflow).sort(), ['requestId', 'status']);
  assert.deepEqual(Object.keys(malformed).sort(), ['requestId', 'status']);
});

test('createAudit ignores non-records and noise records entirely', () => {
  const { audit, lines } = captureAudit();
  const noise = [
    null,
    undefined,
    'MARKER_NOISE',
    42,
    [],
    {},
    { arbitrary: 'MARKER_NOISE' },
    { event: 'evil.event', status: 'pwn', error: new Error('MARKER_RAW_ERROR'), chatType: 'dm', count: -1, durationMs: 1.5 },
  ];

  for (const record of noise) {
    assert.doesNotThrow(() => audit(record));
  }
  assert.equal(lines.length, 0);
});

test('createAudit reads each field once so hostile getters cannot swap in raw values', () => {
  const { audit, lines, records } = captureAudit();
  let eventReads = 0;
  let countReads = 0;
  const record = {
    get event() {
      eventReads += 1;
      return eventReads === 1 ? 'im.message.receive_v1' : 'MARKER_SWAPPED_EVENT';
    },
    get count() {
      countReads += 1;
      return countReads === 1 ? 4 : 'MARKER_SWAPPED_COUNT';
    },
    status: 'received',
  };

  audit(record);

  const emitted = records()[0];
  assert.equal(emitted.event, 'im.message.receive_v1');
  assert.equal(emitted.count, 4);
  assert.equal(emitted.status, 'received');
  assert.equal(lines.join('').includes('MARKER_SWAPPED'), false);
});

test('createHandlers exposes exactly the three receive-only event handlers', () => {  const { handlers } = createHandlerHarness();
  assert.deepEqual(Object.keys(handlers).sort(), [
    'card.action.trigger',
    'im.chat.member.bot.added_v1',
    'im.message.receive_v1',
  ].sort());
});

test('message handler counts deliveries, whitelists chat_type, and returns undefined', () => {
  const { handlers, snapshot, lines, records } = createHandlerHarness();
  const message = handlers['im.message.receive_v1'];
  const p2pPayload = {
    header: { event_id: 'evt_MARKER' },
    event: {
      sender: { sender_id: { open_id: 'ou_MARKER' } },
      message: { message_id: 'om_MARKER', chat_type: 'p2p', content: 'MARKER_BODY' },
    },
  };

  assert.equal(message(p2pPayload), undefined);
  assert.equal(message({ event: { message: { chat_type: 'group' } } }), undefined);
  for (const chat_type of ['dm', 'P2P', 42, null, undefined]) {
    assert.equal(message({ event: { message: { chat_type } } }), undefined);
  }

  assert.deepEqual(snapshot(), {
    total: 7,
    invalid: 0,
    byEvent: {
      'im.message.receive_v1': 7,
      'im.chat.member.bot.added_v1': 0,
      'card.action.trigger': 0,
    },
    byChatType: { p2p: 1, group: 1, unknown: 5 },
  });

  const audits = records();
  assert.equal(audits.length, 7);
  assert.equal(audits[0].event, 'im.message.receive_v1');
  assert.equal(audits[0].status, 'received');
  assert.equal(audits[0].chatType, 'p2p');
  assert.equal(audits[1].chatType, 'group');
  for (const record of audits) {
    assert.equal(record.event, 'im.message.receive_v1');
    assert.equal(record.status, 'received');
    assert.equal(Number.isSafeInteger(record.durationMs) && record.durationMs >= 0, true);
    assert.match(record.requestId, /^req-[1-9][0-9]*$/);
  }
  for (const record of audits.slice(2)) {
    assert.equal(record.chatType, 'unknown');
  }

  const output = lines.join('');
  for (const marker of ['MARKER_BODY', 'ou_MARKER', 'om_MARKER', 'evt_MARKER']) {
    assert.equal(output.includes(marker), false);
  }
});

test('message handler never reads body content, sender details, or message ids', () => {
  const { handlers, snapshot } = createHandlerHarness();
  const payload = {
    event: {
      get sender() {
        throw new Error('MARKER_SENDER_READ');
      },
      message: {
        chat_type: 'p2p',
        get content() {
          throw new Error('MARKER_CONTENT_READ');
        },
        get message_id() {
          throw new Error('MARKER_ID_READ');
        },
      },
    },
  };

  let result;
  assert.doesNotThrow(() => {
    result = handlers['im.message.receive_v1'](payload);
  });
  assert.equal(result, undefined);
  assert.deepEqual(snapshot().byChatType, { p2p: 1, group: 0, unknown: 0 });
});

test('bot added handler counts its delivery and returns undefined', () => {
  const { handlers, snapshot, lines, records } = createHandlerHarness();
  const payload = {
    header: { event_id: 'evt_MARKER' },
    event: { chat_id: 'oc_MARKER', operator_id: { open_id: 'ou_MARKER' } },
  };

  assert.equal(handlers['im.chat.member.bot.added_v1'](payload), undefined);
  assert.deepEqual(snapshot(), {
    total: 1,
    invalid: 0,
    byEvent: {
      'im.message.receive_v1': 0,
      'im.chat.member.bot.added_v1': 1,
      'card.action.trigger': 0,
    },
    byChatType: { p2p: 0, group: 0, unknown: 0 },
  });

  const [record] = records();
  assert.equal(record.event, 'im.chat.member.bot.added_v1');
  assert.equal(record.status, 'received');
  assert.equal('chatType' in record, false);
  assert.equal(Number.isSafeInteger(record.durationMs), true);
  assert.equal(lines.join('').includes('MARKER'), false);
});

test('card action handler returns an empty PoC acknowledgement without reading action content', () => {
  const { handlers, snapshot, lines, records } = createHandlerHarness();
  const payload = {};
  for (const name of ['action', 'value']) {
    Object.defineProperty(payload, name, {
      enumerable: true,
      get() {
        throw new Error('MARKER_ACTION_READ');
      },
    });
  }

  const acknowledgement = handlers['card.action.trigger'](payload);
  assert.deepEqual(acknowledgement, {});
  assert.deepEqual(Object.keys(acknowledgement), []);
  assert.deepEqual(snapshot(), {
    total: 1,
    invalid: 0,
    byEvent: {
      'im.message.receive_v1': 0,
      'im.chat.member.bot.added_v1': 0,
      'card.action.trigger': 1,
    },
    byChatType: { p2p: 0, group: 0, unknown: 0 },
  });

  const [record] = records();
  assert.equal(record.event, 'card.action.trigger');
  assert.equal(record.status, 'received');
  assert.equal('chatType' in record, false);
  assert.equal('toast' in record, false);
  assert.equal('card' in record, false);
  assert.equal('action' in record, false);
  assert.equal(lines.join('').includes('MARKER'), false);
});

test('invalid payloads never throw and emit only fixed audit codes', () => {
  const { handlers, snapshot, lines, records } = createHandlerHarness();
  const messageBodies = [
    null,
    undefined,
    'MARKER_RAW',
    17,
    [],
    {},
    { event: null },
    { event: {} },
    { event: { message: null } },
    { event: [] },
  ];
  const botBodies = [null, 'MARKER_RAW', 7, [], {}, { event: null }, { event: 'not-an-object' }];
  const cardBodies = [null, 'MARKER_RAW', 7, []];

  for (const body of messageBodies) {
    let result;
    assert.doesNotThrow(() => {
      result = handlers['im.message.receive_v1'](body);
    });
    assert.equal(result, undefined);
  }
  for (const body of botBodies) {
    let result;
    assert.doesNotThrow(() => {
      result = handlers['im.chat.member.bot.added_v1'](body);
    });
    assert.equal(result, undefined);
  }
  for (const body of cardBodies) {
    let result;
    assert.doesNotThrow(() => {
      result = handlers['card.action.trigger'](body);
    });
    assert.deepEqual(result, {});
  }

  assert.deepEqual(snapshot(), {
    total: 21,
    invalid: 21,
    byEvent: {
      'im.message.receive_v1': 10,
      'im.chat.member.bot.added_v1': 7,
      'card.action.trigger': 4,
    },
    byChatType: { p2p: 0, group: 0, unknown: 10 },
  });

  const audits = records();
  assert.equal(audits.length, 21);
  for (const record of audits) {
    assert.deepEqual(Object.keys(record).sort(), ['error', 'event', 'requestId', 'status']);
    assert.equal(record.status, 'invalid');
    assert.equal(record.error, 'invalid_payload');
    assert.match(record.requestId, /^req-[1-9][0-9]*$/);
  }
  assert.equal(lines.join('').includes('MARKER_RAW'), false);
});

test('handler timing uses the injected clock and omits nonsensical elapsed values', () => {
  let ticks = 0;
  const clock = () => [100, 107, 200, 250][ticks++] ?? 300;
  const { handlers, records } = createHandlerHarness({ now: clock });

  handlers['im.message.receive_v1']({ event: { message: { chat_type: 'p2p' } } });
  handlers['card.action.trigger']({});

  const [messageRecord, cardRecord] = records();
  assert.equal(messageRecord.durationMs, 7);
  assert.equal(cardRecord.durationMs, 50);

  let backwardsTicks = 0;
  const backwardsClock = () => (backwardsTicks++ === 0 ? 500 : 400);
  const backwards = createHandlerHarness({ now: backwardsClock });
  backwards.handlers['im.message.receive_v1']({ event: { message: { chat_type: 'p2p' } } });
  const [backwardsRecord] = backwards.records();
  assert.equal('durationMs' in backwardsRecord, false);
  assert.equal(backwardsRecord.status, 'received');
});

test('snapshot returns a fresh counts-only copy and counts repeated deliveries', () => {
  const { handlers, snapshot } = createHandlerHarness();
  const payload = { event: { message: { chat_type: 'group', content: 'MARKER_BODY' } } };
  handlers['im.message.receive_v1'](payload);
  handlers['im.message.receive_v1'](payload);

  const expected = {
    total: 2,
    invalid: 0,
    byEvent: {
      'im.message.receive_v1': 2,
      'im.chat.member.bot.added_v1': 0,
      'card.action.trigger': 0,
    },
    byChatType: { p2p: 0, group: 2, unknown: 0 },
  };
  assert.deepEqual(snapshot(), expected);
  assert.deepEqual(Object.keys(snapshot()).sort(), ['byChatType', 'byEvent', 'invalid', 'total']);

  const view = snapshot();
  view.total = 999;
  view.byEvent['im.message.receive_v1'] = 999;
  view.byChatType.group = 999;
  assert.deepEqual(snapshot(), expected);
});
