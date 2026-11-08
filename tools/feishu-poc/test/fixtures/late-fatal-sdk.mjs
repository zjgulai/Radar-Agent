// TEST-ONLY synthetic SDK used by the late-fatal subprocess regression.
//
// Unlike synthetic-sdk.mjs, this variant opens successfully (onReady) and then
// leaves a ref'd pre-open handshake timer behind, so run.mjs must exit its own
// process. The late-fatal preload throws an uncaught exception after the
// terminal stopped line, while stdout completion is still delayed.

export const Domain = { Feishu: 'https://open.feishu.cn' };
export const LoggerLevel = { error: 'error' };

export const defaultHttpInstance = {
  async request() {
    return {
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
    setInterval(() => {}, 60000);
    setTimeout(() => {}, 60000);
    this.options.onReady();
    return Promise.resolve();
  }

  close() {
    // Intentionally unable to clear the pre-open handshake timer.
  }
}
