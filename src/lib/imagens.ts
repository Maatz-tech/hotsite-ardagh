/**
 * Monta o `srcset` a partir das variantes geradas por
 * `scripts/gerar-variantes.mjs`, que salva `foto.webp` como `foto-420.webp`.
 *
 * Existe porque o arquivo dimensionado para o desktop em 2× é grande demais
 * para o celular, onde a mesma foto é desenhada com metade da largura CSS.
 * Sem isto o mobile baixa o arquivo do desktop inteiro.
 *
 *   srcsetVariantes('/images/hero/foto-1.webp', [420], 785)
 *   → '/images/hero/foto-1-420.webp 420w, /images/hero/foto-1.webp 785w'
 */
export function srcsetVariantes(src: string, larguras: number[], intrinseca: number): string {
  const variantes = larguras.map((w) => `${src.replace(/\.webp$/, `-${w}.webp`)} ${w}w`);
  return [...variantes, `${src} ${intrinseca}w`].join(', ');
}
