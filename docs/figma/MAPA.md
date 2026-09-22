# Mapa do Figma — ardagh-hotsite

Fonte de verdade da correspondência **Figma ↔ código**. Atualizar o status a
cada seção fechada. Se o Figma mudar, muda aqui primeiro.

- **fileKey:** `RXNF0LxVHITuN11JZwDpj2`
- **Home desktop (1440):** `6009:353` — [link](https://www.figma.com/design/RXNF0LxVHITuN11JZwDpj2/LP----Ardagh--Eureca-?node-id=6009-353)
- **Home mobile (375):** `6032:3706` — [link](https://www.figma.com/design/RXNF0LxVHITuN11JZwDpj2/LP----Ardagh--Eureca-?node-id=6032-3706)
- **Locais (conteúdo das abas):** `6100:10` — [link](https://www.figma.com/design/RXNF0LxVHITuN11JZwDpj2/LP----Ardagh--Eureca-?node-id=6100-10)

Página única. "Locais" **não** é rota — é o conteúdo das abas de `#beneficios`.

## Seções

Ordem real da página. Os prints de referência estão em `docs/reference/<id>-{desktop,mobile}.png`.

| # | Seção | `id` | Node desktop | Node mobile | Componente | Status |
|---|---|---|---|---|---|---|
| — | Header | `header` | `6009:354` | `6032:3359` (dentro do hero) | `src/components/Header.astro` | 🟨 em revisão |
| 1 | Hero | `hero` | `6009:409` | `6032:3416` | `sections/HeroSection.astro` | 🟨 em revisão |
| 2 | Tarja corrida | `tarja` | `6021:363` | `6032:3707` | `sections/TarjaSection.astro` | 🟨 em revisão |
| 3 | Antes de virar lata | `materia-prima` | `6024:374` | `6032:3718` | `sections/MateriaPrimaSection.astro` | 🟨 em revisão |
| 4 | Aprender fazendo muda tudo | `o-programa` | `6027:700` | `6032:3754` | `sections/OProgramaSection.astro` | 🟨 em revisão |
| 5 | Locais + benefícios | `beneficios` | `6030:1821` | `6032:3835` | `sections/BeneficiosSection.astro` | 🟨 em revisão |
| 6 | O que você traz para a mesa | `pre-requisitos` | `6031:2162` | `6032:4244` | `sections/PreRequisitosSection.astro` | 🟨 em revisão |
| 7 | Sua jornada começa aqui | `etapas` | `6032:2525` | `6033:4358` | `sections/EtapasSection.astro` | 🟨 em revisão |
| 8 | O jeito Ardagh de trabalhar | `jeito-ardagh` | `6031:2317` | `6033:4432` | `sections/JeitoArdaghSection.astro` | 🟨 em revisão |
| 9 | A Ardagh Metal Packaging | `a-ardagh` | `6031:2339` | `6033:4549` | `sections/AArdaghSection.astro` | 🟨 em revisão |
| — | Footer | `footer` | `6028:1447` | `6033:4598` | `src/components/Footer.astro` | 🟨 em revisão |
| — | Faixa legal | — | `6028:1535` | `6033:4683` | dentro de `Footer.astro` | 🟨 em revisão |

Legenda: ⬜ a fazer · 🟨 em revisão com o cliente · ✅ aprovado

## Menu → âncora

| Link | Âncora | Seção |
|---|---|---|
| O Programa | `#o-programa` | 4 |
| Benefícios | `#beneficios` | 5 |
| Pré-requisitos | `#pre-requisitos` | 6 |
| A Ardagh | `#a-ardagh` | 9 |
| Etapas | `#etapas` | 7 |

## Nós a ignorar

Estão `hidden` no Figma — são versões anteriores. **Não implementar.**

| Node | O que é |
|---|---|
| `6028:1326` | versão antiga da grade de benefícios (sem abas por unidade) |
| `6033:4749` · `6033:4977` | painéis de Alagoinhas/BA e Manaus/AM em `6100:10` — **só São Paulo/SP e Jacareí/SP estão visíveis** |
| `6028:1371` | frame vazio |
| `6032:3664` | header mobile — o desenho final está achatado dentro do raster do hero |
| `6029:1634`, `6029:1636`, `6029:1682` | botões de aba da versão antiga |
| `6030:1828`, `6030:1830`, `6030:1832`, `6030:1836`, `6030:1940` | botões de aba antigos (inclusive "Alagoinhas — BA" e "Manaus/AM") |
| `6031:2165` | latinha dentro do eyebrow de pré-requisitos **no desktop** — por isso o ícone só existe no mobile |
| `6031:2190`, `6031:2202`, `6032:4335`, `6032:4347` | botões dentro dos cards 2 e 3 de pré-requisitos: **os cards não têm botão** |
| `6031:2360`, `6033:4436` | ícone no eyebrow de jeito-ardagh (desktop e mobile) |
| `6032:3035`, `6033:4399` | ícone no eyebrow de etapas (desktop e mobile) |

Os quatro últimos são o mesmo vetor "Exclude" 24×14 que acompanharia o texto
do eyebrow numa versão anterior. Está oculto em **todos** os eyebrows do
arquivo — o `gap: 10px` que sobra nas pílulas é resíduo disso.

## Armadilhas deste arquivo

1. **`get_metadata` mente sobre alguns frames.** `6009:409` (hero desktop),
   `6032:3416` (hero mobile), `6031:2162` (pré-requisitos) e `6032:4244` voltam
   como frames sem filhos, como se fossem imagem achatada. **Não são** —
   `get_design_context` devolve a árvore inteira. Nunca concluir que um nó é
   raster só porque o metadata veio vazio: confirmar com `get_design_context`
   antes de reconstruir no olho.

   **Como listar os nós ocultos de um desses frames:** chamar `get_metadata`
   num nó FILHO (ex.: `6031:2163` em vez de `6031:2162`) devolve a árvore
   completa **com as marcas `hidden`**. O `get_design_context` não serve para
   isso: ele simplesmente omite nó oculto, então o que está fora do desenho
   fica invisível para quem só olha o código gerado. Foi assim que os quatro
   botões-fantasma dos cards de pré-requisitos apareceram.
2. **O header mobile é `6032:3359`, filho do hero** — pílula branca de 343×64,
   raio 16 (o desktop usa 20). O frame `6032:3664` solto está oculto e é versão
   antiga.
2b. **Duas fotos empilhadas no hero.** `manaus-118 2` é a foto retangular com o
   fundo da fábrica; `manaus-118 1` é o recorte da pessoa em PNG com alfa, por
   cima, extravasando a moldura. Faltando a primeira, a pessoa flutua no azul.
3. **Os azuis não estão em variável no Figma.** `get_variable_defs` só devolve
   6 cores. O fundo do hero é um gradiente de malha exportado como imagem
   (`/images/hero/bg.webp`, 6 KB); os azuis chapados do rodapé estão em
   `global.css` como `--color-brand-band` e `--color-brand-deep`.
4. **A faixa legal aparece em VAG Rounded Std no Figma** — resíduo do template
   da Eureca. O site inteiro é Gotham Rounded; unificado em Gotham Rounded.
5. **Duas grades diferentes.** A página usa 1216 (margem de 112 no 1440); o
   rodapé usa 1200 (margem de 120). Por isso a `.footer-lp` própria.
6. **O header do Figma tem 1220 e não 1216** — começa em 112 e termina em 1332,
   4px fora da grade que todas as outras seções usam. O mesmo acontece com a
   composição do hero (592 + 628 = 1220 dentro de um bloco de 1216). Foi
   implementado **na grade de 1216**: o desvio é de 4px na borda direita e
   deixa header, hero e seções alinhados entre si.

## Tokens medidos

Do `get_variable_defs` e de `get_design_context` nos nós reais. Tudo já está em
`src/styles/global.css`.

| Figma | Valor | Token |
|---|---|---|
| `blue` | `#0099d8` | `--color-brand` |
| `green` | `#4bcb60` | `--color-accent` |
| `text` | `#333333` | `--color-ink` |
| `text 2` | `#535353` | `--color-ink-body` |
| `cinza-solar/20` | `#d4d4d4` | `--color-line` |
| — (fundo das seções) | `#fafafa` | `--color-surface-alt` |
| — (faixa legal) | `#0063a7` | `--color-brand-deep` |
| — (hero, medido) | `#002570` → `#0678be` | `--color-hero-*` |

Tipografia: **Gotham Rounded** — Book (400) no corpo, Medium (500) em títulos,
nav, botões e eyebrows. Licenciada; Nunito é a substituta até os `.woff2`
chegarem.

Medidas recorrentes: container 1216px (112px de margem no 1440, 24px no 375),
seção `py` 100px desktop / 64px mobile, card `radius` 20px, botão pílula
`radius` 100px altura 52px (44px no header), eyebrow `radius` 24px.
