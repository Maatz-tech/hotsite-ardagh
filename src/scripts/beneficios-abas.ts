/**
 * Abas por unidade (desktop) / carrossel (mobile) da seção `#beneficios`.
 *
 * UM estado só — o índice ativo — refletido em três lugares, sempre por
 * ATRIBUTO, nunca por classe de cor:
 *   · aba    → `aria-selected` (padrão ARIA de tablist)
 *   · painel → `data-ativo`
 *   · ponto  → `aria-current`
 * Ver playbook/09-qa-erros-comuns.md#qa-024: duas utilitárias disputando a
 * mesma propriedade fazem o ativo ficar preso na primeira aba, porque quem
 * vence é a ordem no CSS e não a ordem de aplicação no DOM.
 *
 * No mobile os painéis convivem num trilho com `scroll-snap`, então o
 * estado tem duas origens: o clique/tecla e o dedo. As duas convergem para
 * `ir()`; o `scroll` do dedo entra por `sincronizarComRolagem()`, que nunca
 * re-rola o trilho (senão o dedo brigaria com o script).
 *
 * Não há autoplay: o Figma não documenta nenhum, e conteúdo que anda sozinho
 * seria um problema de WCAG 2.2.2 a mais sem nenhum ganho.
 *
 * No desktop, onde o trilho não rola, um arrasto lateral curto também troca
 * de painel — o gesto que já funciona no toque passa a valer no mouse.
 */
import { trocaDirecional } from '../lib/motion';

/** Arrasto mínimo, em px, para contar como troca. */
const LIMIAR_ARRASTO = 48;

/** A partir daqui o gesto é arrasto, não clique: a seleção de texto sai. */
const LIMIAR_SELECAO = 5;

const MEDIA_MOVIMENTO = '(prefers-reduced-motion: reduce)';

function comportamento(): ScrollBehavior {
  return window.matchMedia(MEDIA_MOVIMENTO).matches ? 'auto' : 'smooth';
}

export function iniciarAbasBeneficios(raiz: HTMLElement): void {
  const abas = Array.from(raiz.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const paineis = Array.from(raiz.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
  const pontos = Array.from(raiz.querySelectorAll<HTMLButtonElement>('[data-ponto]'));
  const trilho = raiz.querySelector<HTMLElement>('[data-trilho]');
  const fita = raiz.querySelector<HTMLElement>('[data-fita-abas]');
  const anterior = raiz.querySelector<HTMLButtonElement>('[data-seta="anterior"]');
  const proximo = raiz.querySelector<HTMLButtonElement>('[data-seta="proximo"]');

  if (!trilho || abas.length === 0 || abas.length !== paineis.length) return;

  const ultimo = abas.length - 1;
  let indice = Math.max(
    0,
    abas.findIndex((a) => a.getAttribute('aria-selected') === 'true')
  );

  /** Enquanto rolamos por script, o listener de `scroll` fica calado. */
  let rolandoPorScript = 0;

  function pintar() {
    abas.forEach((aba, i) => {
      const ativo = i === indice;
      aba.setAttribute('aria-selected', String(ativo));
      // Roving tabindex: o tablist inteiro é UMA parada de tabulação.
      aba.tabIndex = ativo ? 0 : -1;
    });

    paineis.forEach((painel, i) => {
      if (i === indice) painel.setAttribute('data-ativo', '');
      else painel.removeAttribute('data-ativo');
    });

    pontos.forEach((ponto, i) => {
      ponto.setAttribute('aria-current', String(i === indice));
    });

    if (anterior) anterior.disabled = indice === 0;
    if (proximo) proximo.disabled = indice === ultimo;
  }

  /** O trilho só rola quando os painéis estão lado a lado (mobile). */
  function trilhoRola(): boolean {
    return trilho!.scrollWidth - trilho!.clientWidth > 4;
  }

  function trazerParaVista() {
    const painel = paineis[indice];

    if (trilhoRola()) {
      rolandoPorScript += 1;
      trilho!.scrollTo({ left: painel.offsetLeft - trilho!.offsetLeft, behavior: comportamento() });
      // O `scroll` suave dura alguns quadros; o contador cai quando ele parar.
      window.setTimeout(() => {
        rolandoPorScript = Math.max(0, rolandoPorScript - 1);
      }, 600);
    }

    // A fita de abas rola no mobile se as pílulas não couberem em 327.
    if (fita && fita.scrollWidth - fita.clientWidth > 4) {
      const aba = abas[indice];
      const alvo = aba.offsetLeft - (fita.clientWidth - aba.offsetWidth) / 2;
      fita.scrollTo({ left: Math.max(0, alvo), behavior: comportamento() });
    }
  }

  function ir(novo: number, opcoes: { foco?: boolean } = {}) {
    const destino = Math.min(ultimo, Math.max(0, novo));
    if (destino !== indice) {
      const direcao = destino > indice ? 'proximo' : 'anterior';
      indice = destino;
      pintar();
      // Só no desktop: no mobile a própria rolagem já é a transição, e
      // animar por cima dela brigaria com o dedo.
      if (!trilhoRola()) void trocaDirecional(paineis[indice], direcao);
    }
    trazerParaVista();
    if (opcoes.foco) abas[indice].focus();
  }

  abas.forEach((aba, i) => {
    aba.addEventListener('click', () => ir(i));
  });

  // Navegação por seta dentro do tablist, com ativação automática — é o que
  // o padrão ARIA pede quando trocar de painel não custa nada.
  raiz.querySelector('[role="tablist"]')?.addEventListener('keydown', (evento) => {
    const e = evento as KeyboardEvent;
    const passo =
      e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;

    if (passo !== 0) {
      e.preventDefault();
      // Circular: da última volta para a primeira, como no padrão.
      ir((indice + passo + abas.length) % abas.length, { foco: true });
      return;
    }
    if (e.key === 'Home') {
      e.preventDefault();
      ir(0, { foco: true });
    }
    if (e.key === 'End') {
      e.preventDefault();
      ir(ultimo, { foco: true });
    }
  });

  pontos.forEach((ponto, i) => {
    ponto.addEventListener('click', () => ir(i));
  });

  anterior?.addEventListener('click', () => ir(indice - 1));
  proximo?.addEventListener('click', () => ir(indice + 1));

  /* Arrasto lateral no desktop → troca de painel.
     No mobile o trilho rola de verdade e o navegador cuida do gesto; aqui o
     arrasto só entra quando não há rolagem para disputar. */
  let arrasteX: number | null = null;
  let jaTrocou = false;

  trilho.addEventListener('pointerdown', (e) => {
    if (trilhoRola() || e.button !== 0) return;
    // Não sequestrar o gesto de quem está selecionando texto ou clicando
    // num controle de verdade.
    if ((e.target as HTMLElement).closest('a, button, input, select, textarea')) return;
    arrasteX = e.clientX;
    jaTrocou = false;
  });

  trilho.addEventListener('pointermove', (e) => {
    if (arrasteX === null || jaTrocou) return;
    const dx = e.clientX - arrasteX;

    /* Só corta a seleção quando o gesto JÁ virou arrasto. Fazer isso no
       pointerdown — ou com preventDefault ali — mataria o duplo clique para
       selecionar palavra, que é comportamento esperado num bloco de texto. */
    if (Math.abs(dx) > LIMIAR_SELECAO && !trilho!.classList.contains('arrastando')) {
      trilho!.classList.add('arrastando');
      window.getSelection()?.removeAllRanges();
    }

    if (Math.abs(dx) < LIMIAR_ARRASTO) return;
    jaTrocou = true;
    // Arrastar para a ESQUERDA puxa o próximo, como no toque.
    ir(dx < 0 ? indice + 1 : indice - 1);
  });

  const soltarArraste = () => {
    if (arrasteX === null) return;
    arrasteX = null;
    jaTrocou = false;
    trilho!.classList.remove('arrastando');
  };

  trilho.addEventListener('pointerup', soltarArraste);
  trilho.addEventListener('pointercancel', soltarArraste);
  trilho.addEventListener('pointerleave', soltarArraste);

  /* Dedo → estado. Nunca o contrário aqui dentro. */
  let agendado = false;
  trilho.addEventListener(
    'scroll',
    () => {
      if (rolandoPorScript > 0 || !trilhoRola() || agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        agendado = false;
        const centro = trilho.scrollLeft + trilho.clientWidth / 2;
        let maisPerto = 0;
        let menorDistancia = Infinity;
        paineis.forEach((painel, i) => {
          const meio = painel.offsetLeft - trilho.offsetLeft + painel.offsetWidth / 2;
          const distancia = Math.abs(meio - centro);
          if (distancia < menorDistancia) {
            menorDistancia = distancia;
            maisPerto = i;
          }
        });
        if (maisPerto !== indice) {
          indice = maisPerto;
          pintar();
        }
      });
    },
    { passive: true }
  );

  // Ao trocar de viewport o trilho passa a rolar (ou deixa de rolar); o
  // painel ativo precisa reaparecer no lugar certo.
  window.addEventListener('resize', () => {
    rolandoPorScript += 1;
    if (trilhoRola()) {
      trilho.scrollLeft = paineis[indice].offsetLeft - trilho.offsetLeft;
    }
    rolandoPorScript = Math.max(0, rolandoPorScript - 1);
  });

  pintar();
}
