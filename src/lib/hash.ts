const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function toBase62(bytes: Uint8Array): string {
  let n = BigInt('0x' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join(''));
  let result = '';
  const base = BigInt(62);
  while (n > 0n) {
    result = BASE62[Number(n % base)] + result;
    n = n / base;
  }
  return result || '0';
}

export async function hashCompressed(compressed: string): Promise<string> {
  const bytes = new TextEncoder().encode(compressed);
  const buf = await crypto.subtle.digest('SHA-256', bytes);
  return toBase62(new Uint8Array(buf)).slice(0, 7);
}
