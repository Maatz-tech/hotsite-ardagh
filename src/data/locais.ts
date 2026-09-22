/**
 * Unidades do Programa Crescer — conteúdo das abas de `#beneficios`.
 *
 * Fonte de verdade: Figma `6100:10` ("Locais").
 *
 * São DUAS unidades. O frame tem quatro painéis, mas `6033:4749`
 * (Alagoinhas) e `6033:4977` (Manaus) estão `hidden` — são versões
 * anteriores, como os botões de aba antigos em `6030:1828`/`6030:1940`.
 * A fita de abas do desenho confirma: só "São Paulo/SP" (`6030:1826`) e
 * "Jacareí/SP" (`6030:1834`) estão visíveis.
 *
 * Ordem de exibição: São Paulo, Jacareí — a mesma da fita de abas. (No canvas
 * do Figma os frames estão em outra ordem; aquilo é arrumação, não produto.)
 *
 * Diferenças reais entre as duas, levantadas nó a nó — NÃO uniformizar sem
 * confirmar com o cliente:
 *   · São Paulo tem "Transporte Flex", Jacareí "Transporte fretado";
 *   · a nota do `*` muda junto com o benefício de transporte;
 *   · São Paulo tem "Quick Massage" e "Assessoria de corrida" no "E MAIS:".
 *
 * Se as unidades de Alagoinhas e Manaus voltarem, o conteúdo delas está no
 * histórico do git (commit bdca971) e nos nós ocultos acima.
 */

/** Ícone de cada benefício — um componente `Ben*.astro` por chave. */
export type IconeBeneficio =
  | 'saude'
  | 'vida'
  | 'refeicao'
  | 'transporte'
  | 'estacionamento'
  | 'wellhub'
  | 'pac'
  | 'idiomas';

export interface Beneficio {
  icone: IconeBeneficio;
  rotulo: string;
  /** Chamada para a nota de rodapé do painel. Sai em peso mais leve, como no Figma. */
  nota?: '*' | '**';
}

/** Contornos disponíveis. As duas unidades ficam em São Paulo. */
export type MapaEstado = 'sp';

export interface Mapa {
  estado: MapaEstado;
  /**
   * Posição do pino no sistema de coordenadas do próprio contorno (px do
   * Figma, canto superior esquerdo do pino). Medido como
   * `posição do pino − posição do mapa` dentro do frame de 232×190, o que
   * torna o par independente do tamanho da caixa: no mobile a caixa é 277
   * de largura e o contorno continua centralizado, então o pino acompanha.
   */
  pino: { x: number; y: number };
}

export interface Unidade {
  /** Slug estável — vira o `id` dos nós de `aria-controls` / `aria-labelledby`. */
  id: string;
  /** Rótulo da aba e título do painel. */
  nome: string;
  /** Valor mensal da bolsa-auxílio, já formatado. */
  bolsa: string;
  mapa: Mapa;
  beneficios: Beneficio[];
  /** Linha corrida do bloco "E MAIS:", com os separadores "•" do layout. */
  eMais: string;
  /** Notas de rodapé, na ordem `*` e `**`. */
  notas: string[];
}

/** Os oito benefícios em chip, na ordem do Figma. Só o transporte varia. */
function beneficios(transporte: string): Beneficio[] {
  return [
    { icone: 'saude', rotulo: 'Plano de saúde' },
    { icone: 'vida', rotulo: 'Seguro de vida' },
    { icone: 'refeicao', rotulo: 'Auxílio-refeição' },
    { icone: 'transporte', rotulo: transporte, nota: '*' },
    { icone: 'estacionamento', rotulo: 'Estacionamento interno', nota: '**' },
    { icone: 'wellhub', rotulo: 'Wellhub' },
    { icone: 'pac', rotulo: 'Programa de Apoio ao Colaborador (PAC)' },
    { icone: 'idiomas', rotulo: 'Programa de Idiomas Ardagh' },
  ];
}

const NOTA_VAGAS = '**Sujeito à disponibilidade de vagas';
const E_MAIS_BASE =
  'Programa de Educação Corporativa • Acesso gratuito ao LinkedIn Learning • Grupos de Afinidade • Programa de voluntariado';

export const UNIDADES: Unidade[] = [
  {
    id: 'sao-paulo-sp',
    nome: 'São Paulo/SP',
    bolsa: 'R$ 1.900,00',
    mapa: { estado: 'sp', pino: { x: 114, y: 62 } },
    beneficios: beneficios('Transporte Flex'),
    eMais: `${E_MAIS_BASE} • Quick Massage • Assessoria de corrida`,
    notas: ['*Conforme regras e elegibilidade do benefício', NOTA_VAGAS],
  },
  {
    id: 'jacarei-sp',
    nome: 'Jacareí/SP',
    bolsa: 'R$ 1.900,00',
    mapa: { estado: 'sp', pino: { x: 122, y: 59 } },
    beneficios: beneficios('Transporte fretado'),
    eMais: E_MAIS_BASE,
    notas: ['*Conforme as linhas contratadas pela Ardagh', NOTA_VAGAS],
  },
];

/** Rótulo do período da bolsa — igual nas duas unidades. */
export const PERIODO_BOLSA = '/mês';
