/**
 * Gera variantes menores das fotos grandes, para o `srcset`.
 *
 * O arquivo em 2× do desktop é ~4× maior do que o mobile precisa: lá a
 * mesma foto é desenhada com metade da largura CSS. Sem variante, o celular
 * baixa o arquivo do desktop inteiro — foi o "Properly size images" de 186 KB
 * que o Lighthouse apontou.
 *
 * Nomenclatura: foto.webp → foto-420.webp. O `srcsetVariantes` de
 * src/lib/imagens.ts monta o srcset a partir disso.
 *
 *   node scripts/gerar-variantes.mjs
 */
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';

/** [arquivo, larguras das variantes] — só o que pesa e encolhe no mobile. */
const ALVOS = [
  // Largura escolhida para cobrir o pior caso do mobile: a largura CSS real
  // da peça num viewport de ~412 com DPR 2. Abaixo disso o navegador pula
  // para o arquivo do desktop e a variante não serve para nada.
  ['public/images/hero/foto-1.webp', [460]],
  ['public/images/hero/foto-2.webp', [440]],
  ['public/images/hero/foto-3.webp', [210]],
  ['public/images/hero/selo.webp', [160]],
  ['public/images/hero/latinha.webp', [110]],
  ['public/images/jeito-ardagh/foto-equipe.webp', [730]],
  ['public/images/materia-prima/recorte.webp', [480]],
  ['public/images/materia-prima/foto-vitro.webp', [350]],
  ['public/images/o-programa/cresca-alem-do-estagio.webp', [540]],
  ['public/images/o-programa/areas-de-atuacao.webp', [540]],
  ['public/images/a-ardagh/latinha.webp', [440]],
];

let antes = 0;
let gerado = 0;

for (const [arquivo, larguras] of ALVOS) {
  if (!existsSync(arquivo)) {
    console.error(`  ausente: ${arquivo}`);
    continue;
  }
  antes += statSync(arquivo).size;
  for (const w of larguras) {
    const saida = arquivo.replace(/\.webp$/, `-${w}.webp`);
    execFileSync('cwebp', ['-quiet', '-q', '80', '-resize', String(w), '0', arquivo, '-o', saida]);
    const kb = statSync(saida).size / 1024;
    gerado += statSync(saida).size;
    console.log(`  ${path.basename(saida).padEnd(34)} ${kb.toFixed(0).padStart(4)} KB`);
  }
}

console.log(`\n  originais ${(antes / 1024).toFixed(0)} KB → variantes ${(gerado / 1024).toFixed(0)} KB`);
