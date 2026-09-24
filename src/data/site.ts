/**
 * Dados compartilhados do site — definidos UMA vez, importados onde precisa.
 * Regra do playbook (DRY): listas de nav/social/legal moram aqui.
 *
 * As PENDÊNCIAS abaixo estão espelhadas em PROJECT.md. Nada de
 * placeholder na entrega.
 */

/** Nome da marca — usado em alt, aria-label e JSON-LD. */
export const SITE_NAME = 'Programa Crescer — Ardagh Metal Packaging';

/**
 * URL final, sem barra no fim. Usada em canonical, OG e sitemap.
 * Vem do `site` do astro.config.mjs, que muda conforme o destino do
 * build — a Hostinger na raiz, o GitHub Pages sob /hotsite-ardagh.
 * O caminho do base entra por src/lib/url.ts, não aqui.
 */
export const SITE_URL = import.meta.env.SITE.replace(/\/$/, '');

/**
 * Chave única da indexação. Enquanto for `false`:
 *   · o Base.astro emite <meta name="robots" content="noindex, nofollow">
 *   · o robots.txt bloqueia tudo e não anuncia o sitemap
 * No lançamento, virar `true` e publicar — não há mais nada a mexer.
 * A nota de SEO do Lighthouse fica baixa de propósito até lá.
 */
export const INDEXAVEL = false;

/**
 * Destino do CTA principal — o botão "Inscreva-se agora" aparece no
 * header e em seis seções, todos apontam para cá.
 * PENDÊNCIA: URL da página de inscrição (ATS).
 */
export const CTA_URL = '#';
export const CTA_LABEL = 'Inscreva-se agora';

/** Âncoras do menu — o href casa com o id da <section>. */
export const NAV_LINKS = [
  { label: 'O Programa', href: '#o-programa' },
  { label: 'Benefícios', href: '#beneficios' },
  { label: 'Pré-requisitos', href: '#pre-requisitos' },
  { label: 'A Ardagh', href: '#a-ardagh' },
  { label: 'Etapas', href: '#etapas' },
] as const;

/** Ordem do Figma: Instagram, LinkedIn, site institucional. */
export const SOCIAL_LINKS = [
  {
    label: 'Instagram da Ardagh Brasil',
    href: 'https://www.instagram.com/ardaghbrasil/',
    icon: 'Instagram',
  },
  {
    label: 'LinkedIn do Ardagh Group',
    href: 'https://www.linkedin.com/company/ardagh-group/posts/?feedView=all',
    icon: 'LinkedIn',
  },
  {
    label: 'Site da Ardagh Metal Packaging',
    href: 'https://www.ardaghmetalpackaging.com/',
    icon: 'Site',
  },
] as const;

/** A política é a da Eureca, realizadora do programa — mesmo destino usado
 *  no hotsite-solar-cocacola. */
export const LEGAL_LINKS = [
  { label: 'Política de Privacidade', href: 'https://eureca.me/politica-de-privacidade/' },
] as const;

/** Prazo de inscrição — aparece na tarja e no selo do "jeito Ardagh". */
export const PRAZO_CURTO = '05/11';
export const PRAZO_LONGO = '05/NOV';

/**
 * Janela de inscrição em ISO, para o JSON-LD de vaga. Vem da etapa 1 de
 * `src/data/etapas.ts` ("06 de outubro a 05 de novembro") cruzada com a
 * etapa 2 ("novembro de 2026"), que fixa o ano.
 */
export const INSCRICOES_ABREM = '2026-10-06';
export const INSCRICOES_FECHAM = '2026-11-05T23:59:59-03:00';
