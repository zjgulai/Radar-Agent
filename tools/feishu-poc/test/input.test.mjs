import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { readCredentialInput } from '../input.mjs';

const APP_ID = 'fixture-app';
const MAX_INPUT_BYTES = 32768;

function jsonInputOfSize(size) {
  const prefix = `{"appId":"${APP_ID}","appSecret":"`;
  const suffix = '","durationSeconds":10}';
  const secretLength = size - Buffer.byteLength(prefix) - Buffer.byteLength(suffix);
  assert.ok(secretLength > 0, 'fixture size must exceed JSON overhead');
  return { payload: prefix + 'a'.repeat(secretLength) + suffix, secretLength };
}

// Break caught: silently accepting truncated or excessive credential input.
test('reads one complete JSON object from stdin without storing it', async () => {
  const input = Readable.from(['{"appId":"fixture-app",', '"appSecret":"synthetic-only"}\n']);
  assert.deepEqual(await readCredentialInput(input), {
    appId: 'fixture-app', appSecret: 'synthetic-only',
  });
});

test('rejects malformed JSON with a constant safe error', async () => {
  await assert.rejects(readCredentialInput(Readable.from(['secret-looking-invalid-json'])),
    { message: 'invalid_credential_input' });
});

test('rejects empty input instead of falling back to environment credentials', async () => {
  await assert.rejects(readCredentialInput(Readable.from([])),
    { message: 'invalid_credential_input' });
});

test('rejects oversized UTF8 input above the 32768-byte cap', async () => {
  await assert.rejects(readCredentialInput(Readable.from(['中'.repeat(11000)])),
    { message: 'credential_input_too_large' });
});

test('accepts a JSON payload exactly at the 32768-byte boundary across chunks', async () => {
  const { payload, secretLength } = jsonInputOfSize(MAX_INPUT_BYTES);
  assert.equal(Buffer.byteLength(payload), MAX_INPUT_BYTES);
  const value = await readCredentialInput(
    Readable.from([payload.slice(0, 16000), payload.slice(16000)]));
  assert.equal(value.appId, APP_ID);
  assert.equal(value.appSecret.length, secretLength);
});

test('rejects a JSON payload one byte above the 32768-byte boundary', async () => {
  const { payload } = jsonInputOfSize(MAX_INPUT_BYTES + 1);
  await assert.rejects(readCredentialInput(Readable.from([payload])),
    { message: 'credential_input_too_large' });
});

// Break caught: a valid 4096-byte secret whose JSON escaping exceeds the old
// 8192-byte cap is rejected even though it is deliverable at the new cap.
test('accepts a 4096-byte control-character secret escaped to nearly 25 KiB', async () => {
  const secret = '\u0000'.repeat(4096);
  assert.equal(Buffer.byteLength(secret, 'utf8'), 4096);
  const payload = JSON.stringify({ appId: APP_ID, appSecret: secret, durationSeconds: 10 });
  assert.ok(Buffer.byteLength(payload) > 8192);
  assert.ok(Buffer.byteLength(payload) <= MAX_INPUT_BYTES);
  assert.deepEqual(await readCredentialInput(Readable.from([payload])), {
    appId: APP_ID, appSecret: secret, durationSeconds: 10,
  });
});

test('preserves a 4096-byte multibyte secret without escaping expansion', async () => {
  const secret = 'é'.repeat(2048);
  assert.equal(Buffer.byteLength(secret, 'utf8'), 4096);
  const payload = JSON.stringify({ appId: APP_ID, appSecret: secret, durationSeconds: 10 });
  assert.ok(Buffer.byteLength(payload) < 8192);
  const value = await readCredentialInput(Readable.from([payload]));
  assert.equal(value.appSecret, secret);
});

test('rejects arrays and scalar JSON rather than treating them as configuration', async () => {
  for (const input of ['[]', 'null', '42', '"private-value"']) {
    await assert.rejects(readCredentialInput(Readable.from([input])),
      { message: 'invalid_credential_input' });
  }
});

test('suppresses raw stream errors that can contain credentials', async () => {
  const stream = new Readable({ read() {
    this.destroy(new Error('synthetic-private-stream-error'));
  }});
  await assert.rejects(readCredentialInput(stream), { message: 'credential_input_failed' });
});