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
 * PENDÊNCIA: domínio não definido. O valor abaixo é proposital —
 * o grep de pré-entrega (playbook/08-entrega.md) quebra enquanto
 * ele estiver aqui, então não tem como escapar para produção.
 */
export const SITE_URL = 'https://exemplo.com.br';

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

/** Crédito do rodapé — link com UTM para atribuição da Maatz. */
export const MAATZ_URL =
  'https://maatz.com.br?utm_source=ardagh&utm_medium=footer&utm_campaign=portfolio';

/** Prazo de inscrição — aparece na tarja e no selo do "jeito Ardagh". */
export const PRAZO_CURTO = '05/11';
export const PRAZO_LONGO = '05/NOV';
