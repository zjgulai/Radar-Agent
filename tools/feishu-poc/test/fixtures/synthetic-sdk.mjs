// TEST-ONLY synthetic SDK used by run.mjs subprocess tests.
//
// It models the defect the real SDK exposes: WSClient.close() cannot reach a
// socket or timer created before the handshake completes. The timer below is
// deliberately never cleared, so only process.exit() from run.mjs can bound
// the child lifetime.

export const Domain = { Feishu: 'https://open.feishu.cn' };
export const LoggerLevel = { error: 'error' };

const DISCOVERY_RESPONSE = {
  code: 0,
  data: {
    URL: 'wss://open.feishu.cn/ws?device_id=synthetic-device&service_id=synthetic-service',
    ClientConfig: {
      PingInterval: 120,
      ReconnectCount: -1,
      ReconnectInterval: 120,
      ReconnectNonce: 30,
    },
  },
  msg: 'ok',
};

export const defaultHttpInstance = {
  async request() {
    return DISCOVERY_RESPONSE;
  },
};

export class EventDispatcher {
  constructor() {
    this.handles = new Map();
  }

  register(handles) {
    for (const [key, value] of Object.entries(handles)) {
      this.handles.set(key, value);
    }
    return this;
  }
}

export class WSClient {
  constructor(options) {
    this.options = options;
  }

  start() {
    // A ref'd interval and timeout standing in for a pre-open handshake
    // socket/timer that close() below cannot reach.
    setInterval(() => {}, 60000);
    setTimeout(() => {}, 60000);
    this.options.onError(new Error('MARKER_SYNTHETIC_HANDSHAKE_FAILURE'));
    return Promise.resolve();
  }

  close() {
    // Intentionally unable to clear the pre-open handshake timer.
  }
}
