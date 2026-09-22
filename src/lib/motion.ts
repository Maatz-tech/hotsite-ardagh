/**
 * Tokens e primitivas de movimento — fonte única de verdade das animações.
 * Ver playbook/05-animacao.md.
 *
 * Nunca espalhar `duration: 0.63` mágico pelas seções: importe daqui.
 * O estado inicial (opacity: 0) mora no CSS, condicionado à classe `.js`.
 */

/** ease-out expo — curva padrão do projeto */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** ease-in-out suave, para loops (marquee, autoplay) */
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const;

export const DUR = {
  fast: 0.25, // micro-interação
  base: 0.45, // entrada de elemento
  slow: 0.7, // reveal de bloco / slide
} as const;

/** Quanto do elemento precisa estar visível para disparar o reveal */
export const IN_VIEW_AMOUNT = 0.25;

/** Delay entre itens de uma lista */
export const STAGGER = 0.1;

/** Presets declarativos — para uso com motion/react */
export const fadeUp = {
  initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: DUR.slow, ease: EASE },
} as const;

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: DUR.base, ease: EASE },
} as const;

/** True quando o usuário pediu menos movimento. Sempre checar antes de animar. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Fallback que REVELA. Conteúdo preso em opacity:0 porque o módulo não
 * carregou é conteúdo perdido.
 */
function mostrar(els: ArrayLike<Element>) {
  for (const el of Array.from(els) as HTMLElement[]) {
    el.style.opacity = '1';
    el.style.filter = 'none';
    el.style.transform = 'none';
  }
}

/**
 * Devolve o controle ao CSS quando a animação termina — senão o transform
 * inline deixado pelo Motion mata qualquer :hover com transform.
 * Ver playbook/09-qa-erros-comuns.md#qa-002
 */
function liberar(el: HTMLElement) {
  el.style.opacity = '1'; // continua inline: precisa vencer `.js [data-reveal]`
  el.style.transform = '';
  el.style.filter = '';
  el.style.willChange = '';
}

/**
 * Import tardio do `motion` (~26 KB gzip): ele competia banda com a imagem
 * do LCP. Como todo reveal está abaixo da dobra, adiar não é percebido.
 */
let ocioso: Promise<void> | null = null;
function aposCarregar(): Promise<void> {
  if (!ocioso) {
    ocioso = new Promise<void>((resolve) => {
      const seguir = () =>
        'requestIdleCallback' in window
          ? window.requestIdleCallback(() => resolve(), { timeout: 600 })
          : setTimeout(resolve, 120);
      if (document.readyState === 'complete') seguir();
      else window.addEventListener('load', seguir, { once: true });
    });
  }
  return ocioso;
}

type Opts = { atraso?: number };

/** Reveal padrão: fade + subida curta + blur saindo. Bloco, imagem, card solto. */
export async function revealOnScroll(selector: string, opts: Opts = {}) {
  const alvos = document.querySelectorAll<HTMLElement>(selector);
  if (!alvos.length) return;
  if (prefersReducedMotion()) return mostrar(alvos);

  await aposCarregar();
  const { animate, inView } = await import('motion');

  inView(
    selector,
    (el) => {
      animate(
        el,
        { opacity: [0, 1], y: [24, 0], filter: ['blur(10px)', 'blur(0px)'] },
        { duration: DUR.slow, delay: opts.atraso ?? 0, ease: EASE }
      ).finished.then(() => liberar(el as HTMLElement));
    },
    { amount: IN_VIEW_AMOUNT }
  );
}

/** Grid de cards / lista de itens: os FILHOS do container entram em cascata. */
export async function revealStagger(selector: string, opts: Opts = {}) {
  const containers = document.querySelectorAll<HTMLElement>(selector);
  if (!containers.length) return;
  if (prefersReducedMotion()) {
    for (const c of containers) mostrar(c.children);
    return;
  }

  await aposCarregar();
  const { animate, inView, stagger } = await import('motion');

  inView(
    selector,
    (el) => {
      const filhos = Array.from(el.children) as HTMLElement[];
      animate(
        filhos,
        { opacity: [0, 1], y: [28, 0], filter: ['blur(10px)', 'blur(0px)'] },
        {
          duration: DUR.slow - 0.1,
          delay: stagger(STAGGER, { startDelay: opts.atraso ?? 0 }),
          ease: EASE,
        }
      ).finished.then(() => filhos.forEach(liberar));
    },
    { amount: IN_VIEW_AMOUNT }
  );
}

/** Entrada lateral: item de acordeão, card que entra pela borda. */
export async function revealFromX(
  selector: string,
  opts: Opts & { de?: 'esquerda' | 'direita' } = {}
) {
  const alvos = document.querySelectorAll<HTMLElement>(selector);
  if (!alvos.length) return;
  if (prefersReducedMotion()) return mostrar(alvos);

  const x = opts.de === 'direita' ? 32 : -32;

  await aposCarregar();
  const { animate, inView } = await import('motion');

  inView(
    selector,
    (el) => {
      animate(
        el,
        { opacity: [0, 1], x: [x, 0], filter: ['blur(8px)', 'blur(0px)'] },
        { duration: 0.55, delay: opts.atraso ?? 0, ease: EASE }
      ).finished.then(() => liberar(el as HTMLElement));
    },
    { amount: IN_VIEW_AMOUNT }
  );
}

/**
 * Heading palavra a palavra. UM por seção, sempre no heading — em body copy
 * vira ruído. As palavras já vêm quebradas em <span data-palavra> do build
 * (ver RevealText.astro): quebrar no cliente causa reflow e piscada.
 */
export async function revealWords(selector: string, opts: Opts = {}) {
  const headings = document.querySelectorAll<HTMLElement>(selector);
  if (!headings.length) return;
  if (prefersReducedMotion()) {
    for (const h of headings) mostrar(h.querySelectorAll('[data-palavra]'));
    return;
  }

  await aposCarregar();
  const { animate, inView, stagger } = await import('motion');

  inView(
    selector,
    (el) => {
      const palavras = Array.from(
        el.querySelectorAll<HTMLElement>('[data-palavra]')
      );
      if (!palavras.length) return;
      animate(
        palavras,
        { opacity: [0, 1], y: [14, 0], filter: ['blur(8px)', 'blur(0px)'] },
        {
          duration: 0.55,
          delay: stagger(0.045, { startDelay: opts.atraso ?? 0 }),
          ease: EASE,
        }
      ).finished.then(() => palavras.forEach(liberar));
    },
    { amount: IN_VIEW_AMOUNT }
  );
}

/**
 * Divisor / sublinhado que se desenha.
 * ATENÇÃO: observa-se o PAI, não a linha. Um elemento em scaleX(0) tem caixa
 * de área zero e o IntersectionObserver nunca reporta interseção para ela.
 * Ver playbook/09-qa-erros-comuns.md#qa-003
 */
export async function drawLine(selector: string, opts: Opts = {}) {
  const linhas = document.querySelectorAll<HTMLElement>(selector);
  if (!linhas.length) return;
  if (prefersReducedMotion()) {
    for (const l of linhas) l.style.transform = 'none';
    return;
  }

  await aposCarregar();
  const { animate, inView } = await import('motion');

  for (const linha of linhas) {
    const pai = linha.parentElement;
    if (!pai) continue;
    inView(
      pai,
      () => {
        animate(
          linha,
          { transform: ['scaleX(0)', 'scaleX(1)'] },
          { duration: DUR.slow - 0.1, delay: opts.atraso ?? 0, ease: EASE }
        );
      },
      { amount: IN_VIEW_AMOUNT }
    );
  }
}

/** Parallax leve ligado ao scroll — foto grande de fundo. */
/** As nove combinações de borda que o `scroll` do Motion aceita. */
/**
 * Troca direcional entre painéis de abas / carrossel.
 *
 * O painel que entra vem do lado de onde a navegação veio: avançando, ele
 * chega pela direita; voltando, pela esquerda. É a assinatura da casa com o
 * eixo trocado — desfoque + deslocamento, sem mexer em layout.
 *
 * Anima só quem ENTRA. Quem sai costuma perder o `display` no mesmo quadro
 * em que perde o atributo de ativo, e segurá-lo em cena exigiria tirar o
 * painel do fluxo — caro e frágil para um ganho que quase não se vê.
 */
export async function trocaDirecional(
  entrando: HTMLElement,
  direcao: 'proximo' | 'anterior',
  opcoes: { distancia?: number } = {},
) {
  if (prefersReducedMotion()) return;

  const { distancia = 40 } = opcoes;
  const de = direcao === 'proximo' ? distancia : -distancia;

  const { animate } = await import('motion');
  const animacao = animate(
    entrando,
    { opacity: [0, 1], x: [de, 0], filter: ['blur(8px)', 'blur(0px)'] },
    { duration: DUR.base, ease: EASE },
  );

  await animacao.finished;
  // Devolve o controle ao CSS — senão o transform inline congela hover e
  // qualquer transição posterior (QA-002).
  liberar(entrando);
}

export type BordaScroll = `${'start' | 'center' | 'end'} ${'start' | 'center' | 'end'}`;

export type OpcoesParallax = {
  /** Deslocamento total, em px. */
  distancia?: number;
  /**
   * Elemento que dita o progresso. Por padrão é o próprio alvo — mas quando
   * várias peças precisam andar em sincronia, todas têm que ler o MESMO
   * progresso, senão cada uma calcula o seu (alturas diferentes) e elas
   * desencontram. Aí passa-se o contêiner comum.
   */
  alvo?: string;
  /**
   * Trecho de scroll observado. O padrão serve para seção no meio da página.
   * Para um bloco que já nasce visível — um hero — use
   * `['start start', 'end start']`: assim o progresso começa em 0 e a peça
   * fica exatamente onde o Figma a colocou até o primeiro scroll.
   */
  offset?: [BordaScroll, BordaScroll];
  /**
   * 'centro' (padrão) atravessa de -distancia a +distancia, com o repouso no
   * meio do trecho. 'parado' sai de 0 e vai até -distancia: nada se desloca
   * antes do usuário rolar.
   */
  ancora?: 'centro' | 'parado';
};

export async function parallax(selector: string, opcoes: number | OpcoesParallax = 40) {
  const alvos = document.querySelectorAll<HTMLElement>(selector);
  if (!alvos.length || prefersReducedMotion()) return;

  const {
    distancia = 40,
    alvo,
    offset = ['start end', 'end start'] as [BordaScroll, BordaScroll],
    ancora = 'centro',
  } = typeof opcoes === 'number' ? { distancia: opcoes } : opcoes;

  const referencia = alvo ? document.querySelector<HTMLElement>(alvo) : null;
  if (alvo && !referencia) return;

  const y: [number, number] =
    ancora === 'parado' ? [0, -distancia] : [-distancia, distancia];

  await aposCarregar();
  const { animate, scroll } = await import('motion');

  for (const el of alvos) {
    /* Conduzir pelo callback, e não com `scroll(animate(...))`.
       A forma açucarada delega para a ViewTimeline nativa do browser, que
       só conhece o intervalo `cover` (equivalente a
       ['start end', 'end start']) e IGNORA o `offset` em silêncio — a peça
       nasce deslocada e não tem como ancorar no repouso. O caminho de
       callback usa a medição do próprio Motion e respeita o offset.
       Ver playbook/09-qa-erros-comuns.md#qa-032 */
    const animacao = animate(el, { y }, { ease: 'linear', duration: 1, autoplay: false });
    scroll((progresso: number) => { animacao.time = progresso; }, {
      target: referencia ?? el,
      offset,
    });
  }
}
