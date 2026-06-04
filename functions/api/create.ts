interface Env {
  QR_KV: KVNamespace;
}

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

async function makeHash(compressed: string): Promise<string> {
  const bytes = new TextEncoder().encode(compressed);
  const buf = await crypto.subtle.digest('SHA-256', bytes);
  return toBase62(new Uint8Array(buf)).slice(0, 7);
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let compressed: string;
  try {
    const body = await context.request.json<{ compressed: string }>();
    compressed = body.compressed;
    if (typeof compressed !== 'string' || compressed.length === 0) throw new Error();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const hash = await makeHash(compressed);

  const existing = await context.env.QR_KV.get(hash);
  if (!existing) {
    // 1-year TTL
    await context.env.QR_KV.put(hash, compressed, { expirationTtl: 60 * 60 * 24 * 365 });
  }

  return Response.json({ hash });
};
