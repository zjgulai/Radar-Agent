// TEST-ONLY preload for the late-terminal-failure subprocess regression.
//
// It routes the SDK import to a synthetic client that opens successfully and
// keeps an uncancellable handshake timer, delays the stdout completion
// callback run.mjs awaits, and throws an uncaught exception shortly after the
// terminal stopped line is written. No production flag or injection seam.

import { registerHooks } from 'node:module';

const SYNTHETIC_SDK_URL = new URL('./late-fatal-sdk.mjs', import.meta.url).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '@larksuiteoapi/node-sdk') {
      return { url: SYNTHETIC_SDK_URL, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});

const originalWrite = process.stdout.write.bind(process.stdout);
let lateFatalScheduled = false;

process.stdout.write = function (chunk, encoding, callback) {
  const cb = typeof encoding === 'function' ? encoding : callback;
  const enc = typeof encoding === 'function' ? undefined : encoding;
  const text = typeof chunk === 'string' ? chunk : '';

  if (!lateFatalScheduled
      && (text.includes('"status":"stopped"') || text.includes('"status":"failed"'))) {
    lateFatalScheduled = true;
    setTimeout(() => {
      throw new Error('MARKER_SYNTHETIC_LATE_FATAL');
    }, 40);
  }

  // run.mjs flushes with an empty write plus a completion callback. Delay only
  // that completion so the late exception lands after the terminal record but
  // before the process would otherwise exit.
  if (text === '' && typeof cb === 'function') {
    const accepted = originalWrite(chunk, enc);
    setTimeout(cb, 400);
    return accepted;
  }
  return originalWrite(chunk, enc, cb);
};
