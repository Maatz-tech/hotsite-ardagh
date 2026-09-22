# ardagh-hotsite

Hotsite de página única do **Programa Crescer — Programa de Estágio Ardagh
Metal Packaging 2027**. Realização Eureca.

| | |
|---|---|
| Slug | `ardagh-hotsite` |
| Marca | Ardagh Metal Packaging (AMP) — Programa Crescer |
| Domínio | ⚠️ pendente |
| Figma | `RXNF0LxVHITuN11JZwDpj2` — ver [docs/figma/MAPA.md](docs/figma/MAPA.md) |
| Rotas | página única (`/`) |
| Indexação | **noindex** até aprovação do cliente |
| Prazo de inscrição | 05/11 |

## Stack

Astro 5 (static) + Tailwind v4 (`@theme` em `src/styles/global.css`) + Motion
para animação. Ver [playbook/README.md](playbook/README.md).

## Tipografia

**Gotham Rounded**, servida do próprio domínio. Os OTFs entregues pelo cliente
foram subsetados para Latin-1 mais a pontuação tipográfica do layout: 110 KB
cada vira ~18 KB, 73 KB nos quatro pesos (Light 300, Book 400, Medium 500,
Bold 700 — o limite do playbook). Sem itálico: o desenho não usa.

Book e Medium são pré-carregados por aparecerem acima da dobra; Light e Bold
chegam pelo CSS. Numa visita à home o navegador baixa **55,8 KB** de fonte.

A VAG Rounded Std que aparece na faixa legal do Figma é resíduo do template da
Eureca — o site é todo Gotham Rounded.

### Política de quebra de linha — resolvida

A regra de "deixar fluir" valeu enquanto a substituta estava no ar. Com a
fonte real, as quebras voltaram sozinhas para onde o Figma as colocou, como
previsto: as diferenças de altura caíram de até −78px para no máximo −9px.

## Fases

- [x] **0. Intake** — scaffold, 23 prints de referência, tokens, `site.ts`, `MAPA.md`, noindex
- [x] **1. Header + Hero + Footer** — feito, aguardando sua revisão
- [x] **2. Miolo** — as 9 seções feitas, aguardando revisão
- [x] **3. Pré-entrega** — sitemap, JSON-LD, OG, favicon e performance feitos.
      Falta só virar `INDEXAVEL` no lançamento

## Performance — medido no build

| | mobile | desktop | alvo do playbook |
|---|---|---|---|
| Performance | **98** | **100** | 95 |
| Acessibilidade | **97** | **97** | 95 |
| Best Practices | **100** | **100** | 100 |
| SEO | 69 | 69 | bloqueado de propósito |

LCP 2,3 s no mobile e 0,5 s no desktop · CLS 0 · TBT 0 ms.

O SEO fica em 69 só por causa do `noindex`. Virando `INDEXAVEL` em
`src/data/site.ts`, o meta sai, o robots libera e passa a anunciar o
sitemap — é a única coisa que falta para a nota subir.

A acessibilidade fica em 97 pelo contraste da paleta, decisão registrada
mais abaixo.

### Crédito da Maatz

Vem do web component `<maatz-footer theme="brand">`, que monta a própria UTM
a partir de `customer-name` — não há link a manter aqui.

Ele é carregado **em ociosidade**, não por `<script src>` no HTML: como tag
normal o pre-scanner o descobre cedo e ele disputa banda com o LCP. Numa
medição em 4G lento isso custou 8 pontos de performance e 0,8s de LCP. Como
está abaixo da dobra, esperar a ociosidade não tem custo visível.

Dentro da tag há um link de resguardo com o mesmo texto: o componente
substitui o `innerHTML` ao registrar, então ele só aparece se o script de
terceiro não carregar. Sem isso, o crédito sumiria nesse caso.

### Imagens

`scripts/gerar-variantes.mjs` gera uma versão menor de cada foto pesada e
`src/lib/imagens.ts` monta o `srcset`. Sem isso o celular baixava o arquivo
dimensionado para o desktop em 2× — eram 186 KB de desperdício, hoje 12 KB.

O `sizes` de cada imagem é a largura CSS **real** da peça, não uma
aproximação: as peças do hero são uma porcentagem de `100vw - 48px` até
saturarem no teto da composição. Um `sizes` inflado em 20px faz o navegador
pular para o arquivo grande e a variante não serve para nada.

O preload do LCP carrega o MESMO par `srcset`/`sizes` da imagem
(`imagesrcset`/`imagesizes`). Sem isso ele pré-carrega um arquivo, o
`srcset` escolhe outro, e o navegador baixa os dois.

Inventário e status por seção: [docs/figma/MAPA.md](docs/figma/MAPA.md).

## Ritmo combinado

Cada seção é feita **uma vez**, entregue para o cliente revisar e testar, e só
depois do OK seguimos para a próxima. Se durante um ajuste aparecer que a seção
inteira está fora do design, **avisar e perguntar** antes de reabrir o loop
completo — não escalar por conta própria.

## Pendências

Todas estão marcadas como `PENDÊNCIA` no código, no ponto exato onde entram.

| # | O que falta | Onde entra | Bloqueia |
|---|---|---|---|
| 1 | URL da página de inscrição (ATS) | `CTA_URL` em `src/data/site.ts` | nada — o botão existe, o destino é `#` |
| — | ~~Arquivos da Gotham Rounded~~ | ✅ 4 pesos servidos do próprio domínio |
| — | ~~URLs das 3 redes~~ | ✅ Instagram, LinkedIn e site institucional |
| 4 | URL da política de privacidade | `LEGAL_LINKS` | nada |
| — | ~~Domínio~~ | ✅ `https://ardagh.maatz.com.br` (provisório) |
| — | ~~Crédito da Maatz~~ | ✅ web component oficial (`rodape.maatz.com.br`) |
| — | ~~Imagem OG 1200×630~~ | ✅ gerada com os assets reais do site |
| — | ~~Favicon~~ | ✅ marca AMP, em .ico + 32/192/512 + apple-touch |
| — | ~~Remote do GitHub~~ | ✅ `Maatz-tech/hotsite-ardagh`, privado |
| 9 | **Contraste da paleta reprova na WCAG AA** | decisão de design | nota de Acessibilidade abaixo da meta |
| — | ~~Confirmar as 2 unidades~~ | ✅ confirmado pelo cliente: São Paulo/SP e Jacareí/SP |

## Contraste — decisão registrada

A paleta do Figma reprova na WCAG AA em três frentes. Medido:

| combinação | onde | contraste | exigido |
|---|---|---|---|
| verde `#4bcb60` sobre fundo claro | eyebrow, palavras de destaque | 1,80–2,10:1 | 4,5:1 |
| branco sobre verde | tarja corrida | 2,10:1 | 4,5:1 |
| branco sobre azul `#0099d8` | todos os botões, aba ativa | 3,21:1 | 4,5:1 |

O botão é o mais grave: 18px peso 500 não conta como "texto grande", então o
alvo é 4,5:1. **Decisão do cliente: manter fiel ao Figma.** A nota de
Acessibilidade do Lighthouse vai ficar abaixo dos 95 do playbook por causa
disto, e não por defeito de implementação.

Se um dia for corrigido, a mudança é de token e não de seção: bastaria um
`--color-accent-text` (~`#267a31`, 4,6:1 sobre a pílula) para o verde quando
é texto, e escurecer `--color-brand` nos botões.

## Dívida de sistema de design

Levantada pelos agentes seção a seção. A regra do playbook é: apareceu 2×
com o mesmo estilo, vira utilitária. Estes já passaram disso.

| # | O que falta | Ocorrências | Situação |
|---|---|---|---|
| 1 | `.barra-destaque` (barra vertical + frase) | 3 | ✅ **promovida** — estrutural, com `currentColor` |
| 2 | `.h2` com leading 1.2 no mobile | 2 | ✅ **corrigida no token** |
| 3 | `.body-lg` — 18px / 1.3 | 4 | ✅ **promovida** — `beneficios` abre para 1.5 e sobrescreve |
| 4 | `.h4` — 20px / 500 / 1.3, título de card | 3 | ✅ **promovida** |
| 5 | `--radius-box: 24px` | 3 | ✅ **promovido a token** |
| 6 | `Button` com prop `bloco` | 4 | ✅ **promovida** — 327px com as pontas separadas no mobile, 257px centrado no desktop |
| 7 | `ativoPorLeitura()` no `lib/motion.ts` | 3 scrollspies | ⬜ header, abas e etapas repetem a ideia |
| 8 | `chacoalhar()` no `lib/motion.ts` | 1 | ⬜ os 6 valores do balanço estão à mão |
| 9 | `.eyebrow-on-dark` (branco 15% sobre azul) | 1 | ⬜ local, ainda é exceção |

Os 7 e 8 são generalização de comportamento e só compensam se um próximo
projeto pedir o mesmo — generalizar com uma ocorrência é chute.

O que sobra de repetição é exceção legítima, não dívida: o título do item de
etapas (18px/500, outro papel), o valor da bolsa (20px/700) e a pílula de aba
(20px/400).

## Política de quebra de linha

Onde a Nunito faz um título caber em menos linhas que o Figma, **deixamos
fluir**. Conferido nó a nó: os títulos do Figma são um único nó de texto, sem
quebra autoral — as duas linhas do desenho são quebra natural da Gotham
Rounded. Forçar `<br>` seria compensar a fonte, e a quebra forçada viraria
defeito no dia em que os `.woff2` chegarem.

## Inconsistências do Figma a confirmar com o cliente

1. **São Paulo aparece em duas versões.** O mock mobile diz "Transporte
   fretado*" com a nota "Conforme as linhas contratadas pela Ardagh"; o painel
   canônico (`6100:10`, e o que o desktop exibe) diz "Transporte Flex*" com
   "Conforme regras e elegibilidade do benefício". Adotamos a segunda.
2. ~~**São duas unidades, não quatro.**~~ **Confirmado pelo cliente:** o
   programa tem só São Paulo/SP e Jacareí/SP. Alagoinhas (`6033:4749`) e
   Manaus (`6033:4977`) estão `hidden` no Figma por serem versões anteriores.

`SITE_URL` está propositalmente em `https://exemplo.com.br`: o grep de
pré-entrega quebra enquanto estiver assim, então não tem como ir para produção
sem o domínio real.

## Assets

Prints de referência do Figma (23 arquivos, desktop e mobile de cada seção):
`docs/reference/`. Prints do projeto para comparação: `docs/local/`.

Fotos e vetores são extraídos por seção, no momento em que a seção é
construída, e vão para `public/images/<id-da-secao>/` em WebP.
