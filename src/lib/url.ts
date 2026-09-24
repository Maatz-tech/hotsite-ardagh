/**
 * Junta um caminho de /public com o `base` do deploy.
 *
 * Existe porque o site vai para dois lugares: a Hostinger, na raiz de
 * ardagh.maatz.com.br, e o GitHub Pages, sob /hotsite-ardagh. Escrito
 * `src="/images/x.webp"`, o arquivo some no segundo — o navegador pede
 * /images/x.webp em vez de /hotsite-ardagh/images/x.webp.
 *
 * O CSS não precisa disto: o Vite já reescreve os `url()` no build.
 * Vale para o que é atributo no HTML — src, href, srcset, og:image.
 *
 *   url('/images/hero/latinha.webp')
 *   → '/images/hero/latinha.webp'              (raiz)
 *   → '/hotsite-ardagh/images/hero/latinha.webp' (Pages)
 */
export function url(caminho: string): string {
  // BASE_URL vem com barra no fim ('/' ou '/hotsite-ardagh/'); o caminho
  // vem com barra no início. Sem tirar uma das duas, sai '//images'.
  return import.meta.env.BASE_URL.replace(/\/$/, '') + caminho;
}
