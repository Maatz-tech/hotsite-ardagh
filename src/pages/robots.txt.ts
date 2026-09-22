import type { APIRoute } from 'astro';
import { SITE_URL, INDEXAVEL } from '../data/site';

/**
 * Espelha a chave `INDEXAVEL` de src/data/site.ts. Bloqueado enquanto o
 * cliente não aprova; no lançamento a mesma chave libera aqui, tira o
 * meta noindex do Base.astro e passa a anunciar o sitemap.
 */
const corpo = INDEXAVEL
  ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap-index.xml\n`
  : 'User-agent: *\nDisallow: /\n';

export const GET: APIRoute = () =>
  new Response(corpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
