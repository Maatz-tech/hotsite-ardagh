/**
 * Etapas do processo seletivo — Figma 6032:2525 (desktop) e 6033:4358 (mobile).
 *
 * `quando` tem duas formas porque o Figma tem duas: no mobile a linha cai para
 * 14px numa caixa de 249px e "06 de outubro a 05 de novembro" quebraria em duas
 * linhas, estourando a altura do item. A forma curta vale para as quatro, não só
 * para a primeira — data misturada na mesma lista fica pior que data abreviada.
 * Renderizadas as duas, com `display: none` na que não vale: quem está escondido
 * assim sai também da árvore de acessibilidade, então o leitor de tela lê uma só.
 */
export type Etapa = {
  /** 1 a 4 — é o número vazado na latinha, não um índice qualquer. */
  numero: 1 | 2 | 3 | 4;
  /** Período, como aparece no desktop. */
  quando: string;
  /** Mesmo período na forma curta do mobile. */
  quandoCurto: string;
  titulo: string;
};

export const ETAPAS: Etapa[] = [
  {
    numero: 1,
    quando: '06 de outubro a 05 de novembro',
    quandoCurto: '06/outubro a 05/novembro',
    titulo: 'Inscrições e trilha online',
  },
  {
    numero: 2,
    quando: 'novembro de 2026',
    quandoCurto: 'novembro/2026',
    titulo: 'Triagem e ranking',
  },
  {
    numero: 3,
    quando: 'dezembro de 2026',
    quandoCurto: 'dezembro/2026',
    titulo: 'Dinâmicas e entrevistas',
  },
  {
    numero: 4,
    quando: 'fevereiro de 2027',
    quandoCurto: 'fevereiro/2027',
    titulo: 'Início do programa',
  },
];
