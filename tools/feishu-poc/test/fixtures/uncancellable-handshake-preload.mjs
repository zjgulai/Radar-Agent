// TEST-ONLY preload: route the SDK import to the synthetic fixture that
// leaves an uncancellable pre-open handshake timer behind.
import * as nodeModule from 'node:module';

const SYNTHETIC_SDK_URL = new URL('./synthetic-sdk.mjs', import.meta.url).href;

function resolveSynthetic(specifier, context, nextResolve) {
  if (specifier === '@larksuiteoapi/node-sdk') {
    return { url: SYNTHETIC_SDK_URL, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

if (typeof nodeModule.registerHooks === 'function') {
  nodeModule.registerHooks({ resolve: resolveSynthetic });
} else {
  nodeModule.register(new URL('./synthetic-sdk-loader.mjs', import.meta.url));
}
