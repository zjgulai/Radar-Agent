// TEST-ONLY preload: route the SDK import to the synthetic fixture and make
// stdout never report completion, so only run.mjs's hard flush fallback can
// end the child process.
import './uncancellable-handshake-preload.mjs';

process.stdout.write = function blockedWrite() {
  // No callback is ever invoked, modelling a blocked stdout pipe.
  return false;
};
