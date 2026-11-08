export const TARGET_APP_ID = 'cli_aa69bd34937adbf7';

const MAX_SECRET_BYTES = 4096;

const AUDIT_EVENT_TYPES = new Set([
  'im.message.receive_v1',
  'im.chat.member.bot.added_v1',
  'card.action.trigger',
]);
const AUDIT_STATUS_CODES = new Set(['received', 'invalid']);
const AUDIT_ERROR_CODES = new Set(['invalid_payload']);
const AUDIT_CHAT_TYPES = new Set(['p2p', 'group', 'unknown']);

function isNonNegativeSafeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function configError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function readAppSecret(input) {
  const appSecret = input.appSecret;

  if (typeof appSecret !== 'string' || appSecret.trim().length === 0) {
    throw configError('config_app_secret_invalid', 'Invalid app secret');
  }

  if (Buffer.byteLength(appSecret, 'utf8') > MAX_SECRET_BYTES) {
    throw configError('config_app_secret_invalid', 'Invalid app secret');
  }

  return appSecret;
}

export function parseConfig(input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw configError('config_invalid', 'Configuration must be an object');
  }

  if (input.appId !== TARGET_APP_ID) {
    throw configError('config_app_id_invalid', 'Invalid app id');
  }

  const appSecret = readAppSecret(input);

  const durationSeconds = input.durationSeconds === undefined ? 300 : input.durationSeconds;
  if (!Number.isInteger(durationSeconds) || durationSeconds < 10 || durationSeconds > 600) {
    throw configError('config_duration_invalid', 'Invalid duration');
  }

  return {
    appId: TARGET_APP_ID,
    appSecret,
    durationSeconds,
  };
}

export function createAudit(writeLine) {
  let requestCount = 0;

  return function audit(record) {
    if (record === null || typeof record !== 'object' || Array.isArray(record)) {
      return;
    }

    const event = record.event;
    const status = record.status;
    const error = record.error;
    const chatType = record.chatType;
    const count = record.count;
    const durationMs = record.durationMs;

    const safe = {};
    if (AUDIT_EVENT_TYPES.has(event)) {
      safe.event = event;
    }
    if (AUDIT_STATUS_CODES.has(status)) {
      safe.status = status;
    }
    if (AUDIT_ERROR_CODES.has(error)) {
      safe.error = error;
    }
    if (AUDIT_CHAT_TYPES.has(chatType)) {
      safe.chatType = chatType;
    }
    if (isNonNegativeSafeInteger(count)) {
      safe.count = count;
    }
    if (isNonNegativeSafeInteger(durationMs)) {
      safe.durationMs = durationMs;
    }

    if (Object.keys(safe).length === 0) {
      return;
    }

    requestCount += 1;
    safe.requestId = `req-${requestCount}`;
    writeLine(`${JSON.stringify(safe)}\n`);
  };
}

const EVENT_MESSAGE_RECEIVED = 'im.message.receive_v1';
const EVENT_BOT_ADDED = 'im.chat.member.bot.added_v1';
const EVENT_CARD_ACTION = 'card.action.trigger';

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readProperty(value, key) {
  if (!isRecord(value)) {
    return undefined;
  }
  try {
    return value[key];
  } catch {
    return undefined;
  }
}

function readChatType(payload) {
  const event = readProperty(payload, 'event');
  const message = readProperty(event, 'message');
  const chatType = readProperty(message, 'chat_type');
  return chatType === 'p2p' || chatType === 'group' ? chatType : 'unknown';
}

function isMessageDelivery(payload) {
  const event = readProperty(payload, 'event');
  return isRecord(event) && isRecord(readProperty(event, 'message'));
}

function isBotAddedDelivery(payload) {
  return isRecord(readProperty(payload, 'event'));
}

export function createHandlers({ audit, now = Date.now } = {}) {
  if (typeof audit !== 'function') {
    throw new TypeError('createHandlers requires an audit function');
  }

  const clock = typeof now === 'function' ? now : Date.now;
  const byEvent = {
    [EVENT_MESSAGE_RECEIVED]: 0,
    [EVENT_BOT_ADDED]: 0,
    [EVENT_CARD_ACTION]: 0,
  };
  const byChatType = { p2p: 0, group: 0, unknown: 0 };
  let total = 0;
  let invalid = 0;

  function begin(eventType) {
    total += 1;
    byEvent[eventType] += 1;
    return clock();
  }

  function elapsedSince(startedAt) {
    const elapsed = clock() - startedAt;
    return isNonNegativeSafeInteger(elapsed) ? elapsed : undefined;
  }

  function recordReceived(eventType, chatType, durationMs) {
    const record = { event: eventType, status: 'received' };
    if (chatType !== undefined) {
      record.chatType = chatType;
    }
    if (durationMs !== undefined) {
      record.durationMs = durationMs;
    }
    audit(record);
  }

  function recordInvalid(eventType) {
    invalid += 1;
    audit({ event: eventType, status: 'invalid', error: 'invalid_payload' });
  }

  function handleMessage(payload) {
    const startedAt = begin(EVENT_MESSAGE_RECEIVED);
    const chatType = readChatType(payload);
    byChatType[chatType] += 1;

    if (!isMessageDelivery(payload)) {
      recordInvalid(EVENT_MESSAGE_RECEIVED);
      return undefined;
    }

    recordReceived(EVENT_MESSAGE_RECEIVED, chatType, elapsedSince(startedAt));
    return undefined;
  }

  function handleBotAdded(payload) {
    const startedAt = begin(EVENT_BOT_ADDED);

    if (!isBotAddedDelivery(payload)) {
      recordInvalid(EVENT_BOT_ADDED);
      return undefined;
    }

    recordReceived(EVENT_BOT_ADDED, undefined, elapsedSince(startedAt));
    return undefined;
  }

  function handleCardAction(payload) {
    const startedAt = begin(EVENT_CARD_ACTION);

    if (!isRecord(payload)) {
      recordInvalid(EVENT_CARD_ACTION);
      return {};
    }

    recordReceived(EVENT_CARD_ACTION, undefined, elapsedSince(startedAt));
    return {};
  }

  return {
    handlers: {
      [EVENT_MESSAGE_RECEIVED]: handleMessage,
      [EVENT_BOT_ADDED]: handleBotAdded,
      [EVENT_CARD_ACTION]: handleCardAction,
    },
    snapshot() {
      return {
        total,
        invalid,
        byEvent: { ...byEvent },
        byChatType: { ...byChatType },
      };
    },
  };
}
