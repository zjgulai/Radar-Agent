const MAX_INPUT_BYTES = 32768;

export async function readCredentialInput(stream) {
  const chunks = [];
  let total = 0;
  let exceeded = false;
  try {
    for await (const chunk of stream) {
      const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      total += bytes.length;
      if (total > MAX_INPUT_BYTES) {
        exceeded = true;
        break;
      }
      chunks.push(bytes);
    }
  } catch {
    throw new Error('credential_input_failed');
  }
  if (exceeded) {
    throw new Error('credential_input_too_large');
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error();
    }
    return value;
  } catch {
    throw new Error('invalid_credential_input');
  }
}