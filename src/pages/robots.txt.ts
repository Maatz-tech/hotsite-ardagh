import type { APIRoute } from 'astro';

/**
 * Bloqueio total enquanto o site não é aprovado pelo cliente.
 * No lançamento: trocar por Allow e apontar o sitemap.
 * Espelha a prop `naoIndexar` do Base.astro — mexer nos dois juntos.
 */
export const GET: APIRoute = () =>
  new Response('User-agent: *\nDisallow: /\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
