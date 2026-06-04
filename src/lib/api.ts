export async function createShortUrl(compressed: string): Promise<string> {
  const res = await fetch('/api/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ compressed }),
  });
  if (!res.ok) throw new Error('Failed to create short URL');
  const { hash } = await res.json<{ hash: string }>();
  return hash;
}
