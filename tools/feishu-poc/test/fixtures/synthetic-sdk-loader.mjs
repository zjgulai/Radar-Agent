// TEST-ONLY module hook: redirect the SDK specifier to the synthetic fixture.
// Used through `node --import ./uncancellable-handshake-preload.mjs` from the
// test process only; production code has no environment flag or injection seam.
const SYNTHETIC_SDK_URL = new URL('./synthetic-sdk.mjs', import.meta.url).href;

export async function resolve(specifier, context, nextResolve) {
  if (specifier === '@larksuiteoapi/node-sdk') {
    return { url: SYNTHETIC_SDK_URL, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
