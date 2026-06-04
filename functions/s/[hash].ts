interface Env {
  QR_KV: KVNamespace;
  ASSETS: Fetcher;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { hash } = context.params as { hash: string };

  const compressed = await context.env.QR_KV.get(hash);
  if (!compressed) {
    return new Response('Not found', { status: 404 });
  }

  const assetRes = await context.env.ASSETS.fetch(
    new Request(new URL('/index.html', context.request.url))
  );
  const html = await assetRes.text();

  // Inject compressed data as a global before </head>
  const injected = html.replace(
    '</head>',
    `<script>window.__QR_DATA__ = ${JSON.stringify(compressed)};</script></head>`
  );

  return new Response(injected, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
