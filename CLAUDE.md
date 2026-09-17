# CLAUDE.md — Julia Martins Adestradora

Landing page de autoridade/portfólio da adestradora Júlia Martins.
Projeto irmão da Natu Espaço Canino (`../NATU-ESPACO-CANINO`), da mesma cliente.

---

## Antes de dizer que consertei — a regra que vale mais que todas as outras

Os bugs que mais custaram tempo aqui (carrossel travando, arraste morto no
desktop, marquee parado) **não foram difíceis de consertar. Foram difíceis de
enxergar**, porque eu testava de um jeito que não conseguia reproduzi-los.

Sempre uma destas duas:

| O que eu testei | O que a cliente vive |
|---|---|
| `astro preview` numa porta minha | o `npm run dev` dela |
| Playwright em `no-preference` | Windows com "Mostrar animações" **desligado** |
| `elemento.click()` via JS | mouse de verdade em coordenadas |
| A seta **uma vez**: "o índice mudou, ok" | clicar até dar a volta — o bug só aparece **depois** |

Um teste escolhido por ser barato tende a ser um teste que **não pode falhar**.
Foi o que aconteceu: cada atalho meu aumentava a chance de "passar" sem provar
nada.

**O protocolo, nesta ordem:**

1. **Reproduzir antes de mexer.** Nenhuma linha muda antes de eu ver o bug
   acontecer e ter a medição na mão. Se não reproduzir, o certo é dizer
   "não reproduzi" — não é chutar um conserto.
2. **No ambiente dela.** Porta do dev server que ela está usando (não a minha),
   Chrome de verdade (`channel: "chrome"`) e
   `page.emulateMedia({ reducedMotion: "reduce" })`, que é a máquina dela.
3. **O teste é a frase dela, ao pé da letra.** "Não consigo passar pelas setas"
   vira *clicar a seta até a volta completa*, não "o Swiper reagiu". Proxy não
   é teste.
4. **Na segunda vez que ela reclama da mesma coisa, parar de mexer no código.**
   Repetição significa que meu modelo do problema está errado, não que o
   conserto está quase certo. Foi assim que `observer`, `threshold`,
   `followFinger` e outros seis se acumularam no `Carousel.astro` — cada um
   consertando um sintoma, e a **soma** é que quebrava. Na segunda vez:
   instrumentar e medir, não ajustar.
5. **Separar "mudei" de "verifiquei".** Só escrever "está funcionando" com o
   resultado da medição na frente. Sem isso, o certo é "mudei X, não consegui
   confirmar".

> A regra 4 é a que economiza mais tempo. As regras 1 e 3 são as que evitam
> o retrabalho. Nenhuma delas é sobre carrossel — valem para qualquer sintoma
> que a cliente relate.

---

## Stack

- **Astro 5** + TypeScript strict
- **Tailwind CSS v4** — CSS-first, **sem `tailwind.config.js`**. Tokens em `src/styles/tokens.css`, mapeados por `@theme` em `global.css`.
- **GSAP + ScrollTrigger + Lenis** — via `src/components/islands/ScrollAnimations.tsx`
- **framer-motion** — menu mobile e banner de cookies (React islands)
- **astro-icon** + `@iconify-json/lucide`

---

## Identidade visual — a regra que define este projeto

A cliente quer que esta página seja **uma extensão da Natu**, mantendo conexão
visual sem ser a mesma página.

**Herdado da Natu (não mexer):** fonte serifada Gliker, sistema de tokens `--t-*`,
classes utilitárias de `global.css`, verde-escuro `#1e432c`, fundo creme.

**Próprio da Julia (a diferenciação):**
- `--t-secondary` é caramelo `#b5793f`, não o laranja `#f47a20` da Natu
- Fundo creme mais claro (`#faf8f3`) e mais respiro entre blocos
- Hero de retrato em duas colunas, não banner de paisagem
- Ritmo editorial: `max-w-prose` nos textos, grid assimétrico

> O `manifesto-julia.md` sugere verde-oliva `#6B8E23` e fontes Montserrat/Lato.
> **Essa parte foi descartada por decisão do cliente**: conflita com o parentesco
> visual com a Natu. Não reintroduzir.

---

## Tokens — nunca hardcode

Todo valor visual vem de `tokens.css`. Use o utilitário Tailwind (`bg-primary`,
`text-text-main`, `font-serif`) ou `var(--t-...)` em CSS escopado.

### Dois caramelos, e o motivo

| Token | Valor | Onde |
|---|---|---|
| `--t-secondary` | `#b5793f` | A cor da marca. Botão, borda, ícone, título grande, destaque dentro de H2 |
| `--t-secondary-text` | `#9a6533` | **Só texto pequeno em caramelo** |

Sobre o creme, `#b5793f` mede **3,43:1**. Isso passa nos 3:1 que a WCAG pede
para texto grande, e reprova nos 4,5:1 de texto normal. Os quatro lugares em
que o caramelo carregava texto miúdo — `.label-tag`, os numerais "01" de Como
eu trabalho, as estrelas dos depoimentos e a citação de Sobre a Júlia —
passaram para `--t-secondary-text`, que mede **4,57:1**.

> **Não trocar `--t-secondary` por `--t-secondary-text` no resto.** A cor da
> marca é decisão da cliente e continua valendo em tudo que é grande ou não é
> texto. O token novo existe para não ter que escolher entre identidade e
> legibilidade.

### Contraste: como medir sem se enganar

O Tailwind v4 emite as cores em **`oklab()`**, não em `rgb()`. Um script que
parseia `getComputedStyle().backgroundColor` com regex de `rgb` **pula toda
camada com modificador de opacidade** (`bg-primary/76`, `bg-white/8`) e mede
o texto contra o fundo errado. Foi o que aconteceu aqui: a varredura acusou
26 reprovações, entre elas "branco sobre branco" em botões que estavam
corretos.

A forma que funciona é resolver a cor pelo canvas, pintando sobre base branca
e sobre base preta e tirando o alfa da diferença:

```
sobreBranco = a*C + (1-a)*255
sobrePreto  = a*C
a = 1 - (sobreBranco - sobrePreto)/255      C = sobrePreto / a
```

Com isso as reprovações caíram de 26 para 5 — e as 5 eram reais. Lembre
também de pular `aria-hidden="true"`: a marca d'água "404" mede 1,1:1 de
propósito.
Duas exceções, e só essas:
1. A `<meta name="theme-color">` do `BaseLayout`, porque HTML não aceita
   `var()` nesse atributo.
2. O azul `#0084af` da **Fórmula Natural**, declarado no `<style>` escopado
   de `FormulaNatural.astro`. É cor de marca de terceiro e fica fora de
   `tokens.css` de propósito — não é opção da paleta da Júlia, é a cor de
   uma parceira, usada só naquele bloco.

---

## Fonte da verdade do conteúdo

**`roteiro-cliente.md` guia a copy**, mas não é literal. Foi escrito com ajuda
de IA a partir do site antigo (desatualizado, de ~4 anos atrás) e a cliente não
revisou a fundo: tem repetição, listas longas demais e blocos que dizem a mesma
coisa. Use as ideias e o tom dele; **condense livremente.**

`depoimentos-google.md` traz as 6 avaliações reais do Google, já implementadas.
**Não editar esses textos** — são avaliações públicas de terceiros.

Os cards usam `line-clamp-6`: corte **visual**, com reticências. O texto
completo continua no HTML — o que não se pode é editar a avaliação. Sem o
clamp, o depoimento de 124 caracteres deixava um vão branco ao lado do de
380, porque os cards têm altura uniforme.

Os outros `.md` da raiz (`briefing-julia.md`, `manifesto-julia.md`,
`estrutura-copy-julia.md`) são material anterior da Astroteca. Servem só para
consultar dados operacionais (WhatsApp, GTM, cidades).

Detalhes que a cliente pediu explicitamente:
- Não usar "Clientes felizes, cães felizes" (genérico, do site antigo)
- Não terminar com "Transforme o comportamento do seu cão hoje"
- Depoimentos com nome + cão. O tratamento (`Tutora`/`Tutor`) é um campo por
  depoimento, não um `Tutor(a)` genérico. Só preencher com evidência: Mariana
  e Rozana se identificam no próprio texto ("melhor tutora", "obrigada").
  **Duda Soares ficou sem a linha** — a avaliação cita a raça e não o nome do
  cão, e não há marca de gênero ("Duda" serve para Eduarda e Eduardo).
  Não inventar nenhum dos dois: são pessoas reais

---

## Estrutura da página

`index.astro` compõe nesta ordem. Ela segue o roteiro da cliente — que numerou
os blocos fora de ordem, com o "0. Para quem é meu trabalho" no fim do
documento mas pedido na Home:

| # | Seção | id | Bloco do roteiro |
|---|---|---|---|
| 1 | Hero | `hero-section` | 1 |
| 2 | Manifesto + Para quem é | `manifesto` | 2 + 0 |
| 3 | Como eu trabalho | `como-trabalho` | 2 (pilares) |
| 4 | Serviços (7) | `servicos` | 3 |
| 5 | Método (6 passos) | `metodo` | 5 |
| 6 | Sobre a Júlia | `sobre` | 4 |
| 7 | Certificação CNA/CBKC | `certificacao` | site antigo |
| 8 | Canicross | `canicross` | 6 |
| 9 | Treinamento em grupo | `grupo` | 7 |
| 10 | Depoimentos | `depoimentos` | 11 |
| 11 | Parceria Fórmula Natural | `formula-natural` | site antigo |
| 12 | Mentoria | `mentoria` | 8 |
| 13 | FAQ | `faq` | 13 |
| 14 | Contato | `contato` | 14 |

Certificação e Fórmula Natural não vêm do roteiro: são blocos do site antigo
que a cliente pediu de volta. **O texto dos dois é o do site antigo, literal.**
Credencial e parceria com marca de terceiro não se parafraseiam — reescrever
"órgão vinculado à CBKC filiada à FCI" muda o que se afirma sobre um registro
profissional real. Nenhuma das duas entra no menu: são blocos de apoio à
credibilidade, não destinos, e o header já tem 8 itens.

Alternância `bg-background` ↔ `bg-surface` entre vizinhas. **`canicross` é a
única `bg-dark`** — é a quebra de ritmo do meio da página. Não adicione outra
seção escura sem reavaliar o ritmo todo.

**`formula-natural` é a única seção fora da paleta** (azul da marca parceira,
a pedido da cliente). Como o fundo não é creme, nada ali pode usar
`text-text-*` nem `bg-surface`: os textos são brancos com opacidade e a
`.label-tag` tem uma variante própria (`.formula-tag`). Se for mexer nessa
seção, lembre que ela não herda as suposições de contraste do resto da página.

> O bloco "Para quem é" do roteiro foi **fundido ao Manifesto**: os dois
> tratavam da mesma ideia e empilhados deixavam a página arrastada. Nenhum
> texto se perdeu — o que era parágrafo virou lista escaneável.

**Fora do escopo:** blog/Conteúdos (bloco 12 do roteiro) fica para uma fase
posterior, a combinar com a cliente. Páginas internas para Canicross, Grupo e
Mentoria também — hoje são seções da one-page.

### `/links` — a página de bio-link

Irmã da `links.astro` da Natu: mesma estrutura (banner, avatar sobreposto,
perfil, redes, lista de botões), vestida com a identidade da Júlia — verde
`#1e432c`, caramelo no CTA de WhatsApp, creme e botões em pílula, no lugar
dos 8px da Natu.

**Standalone de propósito.** Não usa o `BaseLayout` nem o `global.css`: é
aberta do Instagram, no 4G, para quatro botões. Carregar Tailwind, GSAP,
Lenis e Swiper ali seria desperdício — hoje são 16 KB de HTML e 7,5 KB de
CSS. O preço é declarar localmente o `@font-face` da Gliker e o punhado de
valores que no site vêm do `@theme` (que é `inline` e não existe em runtime).
As **cores continuam vindo de `tokens.css`**, que é `:root` puro e vive sem o
`global.css` — a página não hardcoda paleta.

Quatro links, nesta ordem: site da Júlia (verde), site da Natu,
"Deixe sua avaliação" (o mesmo perfil do Google que o `Testimonials` usa) e
WhatsApp (caramelo). O tracking segue o padrão do site: `link_click` em tudo
que tem `data-tracking`, e `contato_wpp` só no WhatsApp.

> **`noindex` e sitemap não convivem.** A página declara `noindex`, então o
> `astro.config.mjs` a filtra do sitemap — senão o Search Console acusa
> "enviada, mas marcada como noindex": o sitemap pede indexação e a meta nega.

---

## Densidade: a regra que mais importa aqui

O roteiro da cliente é longo e repetitivo (foi escrito com ajuda de IA e ela
mesma não revisou a fundo). **Reproduzir cada frase como parágrafo produz uma
página gigante e sem estética** — foi o erro da primeira versão.

A regra: **muitos itens curtos vão para slider horizontal, não para
empilhamento vertical.** Listas longas do roteiro viram badges. Blocos que
repetem a mesma ideia são fundidos.

| Seção | Tratamento |
|---|---|
| Como eu trabalho (6 pilares) | `.scroll-rail` |
| Serviços (7) | `.scroll-rail` com foto em cada card |
| Método (6 passos) | `.scroll-rail` |
| Mentoria / creches (8 tópicos) | `.scroll-rail` |
| Mentoria / profissionais (9 itens) | badges |
| Canicross (9 itens) | badges |
| Método / "também ensinamos" (7) | badges |

**Imagens sempre em carrossel** (`Carousel.astro`, Swiper já no projeto), para
caber todas as fotos que a cliente enviou: Sobre, Canicross, Grupo e Mentoria.
22 das 26 imagens estão em uso.

---

## Design expressivo — o que sustenta o layout

Referência aprovada: página editorial estilo Framer. Nada de grid de cards
uniformes, nada de seções empilhadas iguais.

**Hero:** foto da Júlia correndo com os cães (canicross na neblina) em tela
cheia, com gradiente escuro na base e texto sobreposto à esquerda. Duas versões
da imagem — wide no desktop, recorte vertical no mobile.

### Container: 1300px é a régua

**Todo conteúdo vive dentro de `.container-wide` (1300px).** Sair dele é
decisão consciente, não descuido. Hoje só três coisas saem, e todas por um
motivo:

| O que sai | Por quê |
|---|---|
| `.marquee` | Faixa corrida precisa da largura da tela para o loop fazer sentido |
| Hero | Imagem de fundo em tela cheia |
| `.divisoria` | Uma serra que parasse no meio da tela não seria divisória |

> O `.scroll-rail` **não** sai mais: ele já sangrou até a borda da tela e a
> cliente pediu tudo dentro da régua de 1300px. O excedente é recortado no
> próprio trilho.

### Divisória de montanhas (`Divisoria.astro`)

Herdada do site antigo a pedido da cliente. SVG inline com três camadas,
usado na transição de/para o Canicross.

A camada da **frente** usa `currentColor` = cor da seção seguinte (`para`),
e é ela que costura a emenda. As camadas de **trás** usam verdes fixos da
marca, não opacidade sobre o fundo — com opacidade as cristas sumiam quando
o destino era claro (creme sobre creme não tem contraste).

```astro
<Divisoria para="dark" />   <!-- entrando no bloco escuro -->
<Canicross />
```

Hoje há **uma divisória só na página**, na entrada do Canicross. A de saída
(`invertido`) existiu e foi removida a pedido da cliente — ficou pesada. O
prop `invertido` continua no componente, disponível.

Fica **entre** as seções em `index.astro`, nunca dentro de uma delas.

O `invertido` usa `scaleY(-1)`, **não `rotate(180deg)`**: o rotate espelha
também na horizontal e as duas serras ficariam com o mesmo perfil invertido,
denunciando que é a mesma imagem. Só na vertical, o desenho da crista
continua diferente entre o topo e a base.

> A serra marca a entrada no Canicross, o único bloco escuro da página. A
> saída não leva: emoldurar as duas pontas ficou pesado e a cliente pediu
> para tirar. O Canicross encosta direto no Grupo, em corte reto.

### Técnicas de UI aplicadas

| Técnica | Onde | Como |
|---|---|---|
| **Horizontal scroll** | Método, Mentoria/creches, Depoimentos | `.scroll-rail` + `data-rail-drag` (arrastar com mouse) + `data-rail-progress` (barra) |
| **Horizontal scroll com pin** | Serviços (e só ela), **só ≥1024px** | `data-rail-pin`: a seção trava e o trilho anda com o scroll da página. No mobile vira trilho de toque comum |

### Serviços: o trilho conduzido pelo scroll

A seção trava na tela (`pin`) e o trilho avança na horizontal conforme a
página rola, até o último card entrar no container. O curso vertical é igual
à distância horizontal que falta, então a rolagem fica 1:1.

Os cards são `lg:w-[calc((100cqi-2.5rem)/3)]` — três por container. A
largura vem de **`cqi`**, não de `%`: o `%` resolveria contra o track, que é
bem mais largo que o container.

### Por que só Serviços tem este efeito

**O pin congela a `<section>` inteira.** Logo, a seção precisa conter só o
bloco do trilho — e Serviços é a única assim.

O efeito já esteve no Método e na Mentoria e **foi removido**, depois de
várias tentativas de conserto. O histórico, para não se repetir:

| Alvo do pin | O que quebrou |
|---|---|
| `<section>` | Congelava os outros blocos da seção. Na Mentoria (carrossel de fotos → trilho → bloco da Natu) o carrossel ficava **parado por 1500px de rolagem**, e parecia que o efeito "vazava" para os sliders. No Método, o bloco de fechamento congelava |
| `<div>` em volta do trilho | Pior: um `div` solto no fluxo vira `position: fixed` sem reservar espaço, e os cards **flutuavam por cima de Serviços e dos Depoimentos**, deixando um vazio na seção de origem |

Não há terceiro alvo. Fazer funcionar ali exigiria dar a cada trilho uma
`<section>` só dele — reestruturar duas seções por causa de um efeito
decorativo, em conteúdo de apoio ("6 etapas", "8 frentes"). **Decisão da
cliente: não vale.** Método, Mentoria e Depoimentos usam `data-rail-drag`.

> Antes de aplicar `data-rail-pin` num trilho novo: **a `<section>` tem
> mais alguma coisa além deste trilho?** Se tem, não use.

### O pin é só do desktop (≥ 1024px)

Criado dentro de `gsap.matchMedia().add("(min-width: 1024px)", …)`, que o
desfaz sozinho se a janela cruzar o breakpoint.

No celular o pin prendia a seção por **2497px — 3,1 telas** de rolagem com a
página congelada, muito dedo para atravessar um bloco de apoio. E o
`touch-action: pan-y` que o pin exige **bloqueia o deslize horizontal**, ou
seja, o gesto natural de passar os cards não funcionava. Abaixo de 1024px o
trilho é um scroll de toque comum: menos rolagem e o gesto esperado.

Por isso o `touch-action: pan-y` em `global.css` também vive dentro de
`@media (min-width: 1024px)` — fora dali ele só atrapalharia.

### Armadilha: a seção trava e a seguinte aparece por baixo

Com o pin em três seções, o sintoma era rolar dois cards, eles sumirem,
outra seção aparecer e a anterior voltar. A causa está na tabela acima.

Houve também uma tentativa de trocar o `start` por um cálculo baseado no
trilho, que **não era o problema** e foi revertida. O `start` é
`center center`.

> **Medir com `scrollTo` não encontra este bug.** Pulos instantâneos passam
> por cima dos quadros onde a sobreposição acontece: a varredura acusou 2px
> de diferença e disse que estava tudo certo. Com `mouse.wheel`, o mesmo
> trecho mostrou a seção seguinte subindo 2000px por baixo da travada.
> **Para bug de pin, role com a roda.**

**O arraste manual fica desativado neste trilho**, em qualquer largura.
Durante o pin a seção vira `position: fixed` com `transform`, e o
`setPointerCapture` do arraste perde a referência de coordenadas — os eventos
chegam mas o `scrollLeft` não muda. Quem conduz é o scroll.

O trilho tem `overflow-x: hidden` e quem se move é o **track, por
`transform`** — não o `scrollLeft` do trilho. Escrever `scrollLeft` a cada
frame força recálculo de layout; o transform roda na composição. Como o
trilho não tem mais scroll próprio, a roda do mouse vira scroll da página
sozinha (o antigo `onWheel` foi removido) e a barra de progresso é
atualizada dentro do `onUpdate`, já que o evento `scroll` nunca dispara.

No mobile, o `touch-action: pan-y` em `.scroll-rail[data-rail-pin]` deixa o
gesto vertical passar para a página — sem isso o dedo rolava o trilho por
fora do pin e os dois brigavam pela mesma posição. O `scroll-snap` sai pelo
mesmo motivo.

O `scrub` é `true`, **sem valor de inércia**. Com `scrub: 0.6` o trilho
tinha um atraso próprio que, somado à suavização do Lenis, virava duas
animações disputando a mesma posição — era a travada no instante em que a
seção fixava.

**O curso tem três trechos, e as duas folgas são curso EXTRA** — o meio
nunca é comprimido. Em 1440px, medido:

| Trecho | Tamanho | O que acontece |
|---|---|---|
| Folga inicial | ~390px | Seção travada, cards parados |
| Percurso | 1760px | Cards andam 1:1 com o scroll |
| Folga final | 320px | Último card no container, seção ainda travada |

A **folga inicial** (`DEAD_ZONE = 0.18`, fração do percurso) existe porque sem
ela o mesmo gesto que fixa a seção já empurrava os cards: o usuário travava e
via o trilho correr sem ter pedido.

A **folga final** (`FOLGA_FIM = 320`, em px) existe porque sem ela o pin
acabava no *mesmo pixel* em que o último card encostava no container — com o
scroll ainda em velocidade cheia, a seção era arrancada da tela no instante
em que o card chegava. Era a reclamação de "solta rápido demais".

> Uma tentativa de trocar a fração inicial por pixels fixos (`DEAD_PX`) foi
> revertida junto com o `start` calculado. A fração funciona bem em Serviços.

**Sem `anticipatePin`.** Ele antecipa a troca para `position: fixed` com base
na velocidade do scroll; com a inércia do Lenis isso faz a seção travar/soltar
antes da hora e corrigir no quadro seguinte — uma piscada nas bordas do pin.
Servia para evitar o flash na *entrada* em scroll rápido, o que a folga
inicial já cobre: nos primeiros ~390px os cards não se movem, então errar a
hora de travar por alguns quadros não aparece.

> **Piscada no pin é artefato de pintura, não de geometria.** Medir
> `getBoundingClientRect` não acha: na troca `fixed`→`relative` a posição é
> contínua (medido: -47 → -50 → -54, sem salto). Se reaparecer, investigue
> camadas de composição (`will-change`) e o `anticipatePin`, não coordenadas.
> Aqui o fundo da seção é igual ao do `body`, então um quadro sem pintura
> não mostra cor errada — isso já foi descartado.

**Sem máscara de degradê na borda direita.** Chegou a existir uma, via
`mask-image` e uma `--rail-fade` escrita pelo JS, para sugerir que o trilho
continua além do container. **A cliente não gostou do resultado e ela foi
removida** — não reintroduzir. O corte na régua do container é o
comportamento desejado.

### Armadilha: o efeito não roda na máquina do cliente

**O pin e o sticky stacking rodam mesmo com `prefers-reduced-motion`.** É
proposital: eles não são decoração, são como o conteúdo é navegado — com o
pin desligado, os cards 4 a 7 de Serviços ficam inalcançáveis.

Isso já causou bug reportado **quatro vezes**. Nas três primeiras, sempre igual: o
`ScrollAnimations` dá `return` cedo quando `prefersReduced`, e o bloco
ficava depois desse `return`. Na máquina do cliente (Windows com "Mostrar
animações" desligado) o recurso simplesmente não existia.

Pegou o marquee, depois o pin, depois o **arraste dos trilhos**. O terceiro
foi o mais difícil de enxergar: no mobile o dedo rola o `overflow-x` nativo,
que não precisa de JS, então só o desktop quebrava — e só em quem tem
movimento reduzido. Parecia "arraste não funciona no desktop".

Hoje **`setupPinnedRails()` e `setupRails()` (arraste + barra + cursor) são
chamados nos dois caminhos**, e as duas definições ficam antes do `return`.

**A quarta foi o header que não escondia — e por outro vetor.** Não era o
`return` do `ScrollAnimations`: era o CSS. O `<header>` tinha
`data-animate="header"`, e a regra de `global.css`

```css
@media (prefers-reduced-motion: reduce) {
  [data-animate] { transform: none !important; }
}
```

vence a declaração **inline** que o script do header escreve. Medido na
máquina da cliente: `style.transform = "translateY(-100%)"` e
`getComputedStyle().transform === "none"`. O JS fazia tudo certo e o CSS
descartava, em silêncio.

Hoje o `data-animate` fica no `<nav>` de dentro, nunca no `<header>`: o
wrapper posicionado é do JS, a caixa que anima na entrada é do GSAP.

> **A regra geral:** elemento cuja POSIÇÃO é controlada por JS não pode usar
> `data-animate*`. Os dois disputam o mesmo `transform`, e sob `reduce` o
> `!important` sempre ganha. Anime um filho.

> A máquina do cliente tem "Mostrar animações" desligado, e **é bom que
> tenha**: é o melhor detector desta classe de bug. Não peça para ligar.
> Teste com `page.emulateMedia({ reducedMotion: "reduce" })`.

Ao criar efeito novo, decida: é enfeite (respeita `reduce`) ou é navegação
(roda sempre, talvez sem inércia)? E **teste nos dois modos** com
`page.emulateMedia({ reducedMotion: "reduce" })`.
| **Sticky stacking** | Como eu trabalho | `.stack-card` com `--stack-i` inline, dentro de `.stack-list`. Todas as larguras |
| **Scrollytelling** | Manifesto | `data-reveal-lines` — o JS fatia em `<span>` e revela palavra a palavra com `scrub` |
| **Infinite marquee** | Logo depois do Hero (`Marquee.astro`) | `.marquee` com dois `.marquee-track` idênticos; pausa no hover |
| **Cursor tracking** | nenhum (mecanismo disponível) | `data-cursor-area="arraste"` cria a etiqueta que segue o ponteiro. **Removido a pedido da cliente**: o `cursor: grab` já diz que arrasta, e a etiqueta cobria o conteúdo do card |
| **Parallax** | disponível | `data-parallax="0.08"`. Não usar dentro de Swiper (conflito de transform) |

Outras classes: `.frame-editorial` (moldura de imagem), `.bleed-*`,
`.lede`, `.numeral-ghost`, `.rule-soft`.

### Escala tipográfica: quem usa o quê

A escala é **monotônica** — cada degrau é menor que o anterior em todos os
breakpoints. Não inverter (já aconteceu: `xl` tinha mínimo 2.6rem contra
2.2rem do `2xl`, e no mobile o H2 de seção ficava maior que o manifesto).

| Token | Onde | ~1440px |
|---|---|---|
| `display-hero` | só a H1 do Hero | 74px |
| `display-2xl` | só a frase do Manifesto (scrollytelling) | 58px |
| `display-xl` | **toda H2 de abertura de seção** | 46px |
| `display-lg` | disponível | 38px |
| `display-md` | sub-título dentro de seção (H3) | 30px |
| `display-sm` | título de card | 23px |

**A unidade fluida é `cqi`, não `vw`.** `.container-wide` abre o container
de consulta (`container-type: inline-size`), então os títulos escalam com os
1300px do container e param de crescer em monitores largos. Cada token
declara primeiro a versão `vw` como fallback e sobrescreve com `cqi`.

**`xl`, `lg`, `md` e `sm` usam `base + k*cqi`, não `k*cqi` puro.** Com o
coeficiente sozinho, a curva só vencia o mínimo perto de 1000px de container,
e a faixa inteira de tablet saía com tipografia de celular. Medido antes:

| Container | `xl` | `lg` | `md` | `sm` |
|---|---|---|---|---|
| 336 (celular 360) | 28,8 | 25,6 | 22,4 | 18,4 |
| **728 (iPad 768)** | **29,1** | **25,6** | **22,4** | **18,4** |
| 984 (iPad-L 1024) | 39,4 | 31,5 | 24,6 | 18,7 |

Três degraus idênticos entre 336px e 728px — o iPad recebia o mesmo corpo de
um celular pequeno. Hoje, com o termo fixo: 33,9 / 29,0 / 25,0 / 19,8 em 728.
**Mínimo e máximo não mudaram**, então celular e desktop seguem como estavam
aprovados; o ganho é todo no meio.

O container mede `vw - 24px` abaixo de 640px e `vw - 40px` acima, batendo em
1300px. É essa a régua do `cqi` — não a largura da tela.

> Ao medir a escala, **meça os elementos reais da página**. Injetar um
> `<span class="text-display-lg">` devolve 16px, porque o Tailwind v4 só gera
> o utilitário que aparece no código-fonte e `display-lg` não é usado por
> ninguém. Ler `var(--text-display-xl)` também não funciona: o `@theme` é
> `inline`, então a variável não existe em runtime. Já "descobri" as duas
> coisas como se fossem bug.

> **Nunca colocar `w-full` num `.container-wide`.** Ele sobrescreve o
> `width: min(…, 1300px)` e o conteúdo passa a escalar com a tela inteira —
> era o que fazia a H1 do Hero vazar do container.

### Armadilha: página com 33.554.432px de altura

`33554432` é `2^25`, o limite de layout do Chrome. Se a auditoria mostrar
esse número, há um **ciclo de realimentação de largura**: uma imagem dentro
de um box com `aspect-ratio`, dentro de um slide, dentro de um flex/grid —
o conteúdo define a largura do pai, que redefine a do filho, até estourar.
A página inteira perde a altura e vira um retângulo.

**A cura é `min-width: 0`** nos itens de grid/flex que contêm carrosséis.
Itens de grid e flex têm `min-width: auto` por padrão, o que os deixa
crescer com o conteúdo. Os wrappers dos 4 carrosséis têm `class="min-w-0"`
por isso — não remover.

### Armadilha: 12px de scroll horizontal no mobile

A sangria do `.scroll-rail` precisa bater **exatamente** com o gutter do
`.container-wide`, que muda por breakpoint (0.75rem, depois 1.25rem a
partir de 640px). Um valor fixo de `1.5rem` sobra e vira scroll horizontal.

### Como auditar de verdade

Deduzir pelo CSS não resolveu esses bugs — medir o DOM resolveu. Para
investigar layout quebrado, instale `playwright-core` como dev-dependency
(o Chromium já existe na máquina, e o `channel: "chrome"` usa o Chrome
instalado), meça `document.documentElement.scrollHeight/scrollWidth`, e
bisseccione escondendo elementos com `display:none` até achar qual reduz a
medida. Remova a dependência depois.

### Armadilha: o marquee parado — `prefers-reduced-motion`

**Esta foi a causa real, e custou três rodadas para ser achada.**

O reset de movimento em `@layer base` zera *toda* animação da página com
`!important`. No Windows, **"Mostrar animações" desligado já faz o Chrome
reportar `prefers-reduced-motion: reduce`** — não é preciso configurar nada
de acessibilidade. Nessa máquina o marquee recebia `animation-duration:
0.01ms` e `iteration-count: 1`: rodava uma vez, instantaneamente, e parava.
Parado para sempre, independente da duração configurada.

O seletor virou `*:not(.marquee-track)` e a faixa tem regra própria: sob
`reduce` ela **desacelera** (×2.6) em vez de parar. Congelada, ela deixava
uma frase cortada no meio da tela — que é justamente o que parecia bug.

> **Ao testar animação, emule os dois modos.** O Playwright sobe em
> `no-preference` por padrão; se a máquina do usuário está em `reduce`,
> você está testando um navegador diferente do dele e vai jurar que está
> tudo certo. `page.emulateMedia({ reducedMotion: "reduce" })`.

Velocidade: em 46s para ~1830px a faixa andava 40px/s, lento demais para
ler como movimento. Hoje são **18s** (~100px/s, ritmo de barra de notícias).
`animationPlayState: running` não prova que algo se move a olho nu — meça o
`transform` em dois instantes e divida pela diferença de tempo.

### Armadilha: o último card do baralho desalinha

Dois sintomas, mesma raiz: **um sticky nunca sai da caixa do pai.**

1. O card 6 não subia por cima do 5 — faltava curso de rolagem.
2. Pior, no meio da rolagem ele *descia* e colidia com o 5.

O (2) acontecia porque, numa `<ol>` em block, o último `<li>` se alonga até
o fim da lista. O card ficava preso ao **rodapé** da própria caixa e era
arrastado para cima junto com ela — não estava "solto", estava grudado no
lugar errado.

A cura são as duas coisas juntas, em `global.css`:

```css
.stack-list { display: flex; flex-direction: column; gap: 4rem; }
.stack-card { flex: 0 0 auto; }   /* cada <li> tem só a altura do card */
.stack-list::after { height: 60vh; }  /* curso final do último card */
```

O `flex: 0 0 auto` é o que impede o <li> de esticar. O `::after` dá o curso.
Faltando qualquer um, o card 6 desalinha.

> **Ao auditar, não conte a soltura no fim da seção como erro.** Quando a
> seção termina, os seis cards se soltam juntos e sobem — isso é o correto.
> Meça o desalinhamento só enquanto a pilha está montada, senão você "acha"
> 9 bugs que são o comportamento esperado (aconteceu).

### Armadilha: o marquee dá um salto a cada volta

A animação desloca `-100%`, que é a largura de **uma** cópia. Os dois tracks
são idênticos e encostados, então ao fim do ciclo a segunda cópia está
exatamente onde a primeira começou.

Havia um `calc(-100% - 2rem)` somando um gap que não existe — o `.marquee`
não tem `gap` entre os tracks, o `gap-8` é entre os itens *dentro* de cada
track. A faixa andava 32px a mais por volta e saltava. O espaçamento na
emenda vem do `padding-right: 2rem` no track, não do keyframe.

### Armadilha: o arraste que só falha no navegador de verdade

Sintoma: no desktop o ponteiro se move sobre o trilho e nada rola. Em teste
automatizado passa — e foi por isso que demorou a ser achado.

A causa é o navegador ficar com o gesto antes do JS: arrastar sobre texto
inicia a **seleção**, e arrastar sobre uma imagem inicia o **drag nativo**.
Os dois engolem o `pointermove`. O mouse sintético do Playwright não dispara
nem um nem outro, então o teste mede um navegador que não é o do usuário.

A cura são três coisas juntas:

```
event.preventDefault()  no pointerdown      (ScrollAnimations)
user-select: none       no trilho e no .natu-carousel
-webkit-user-drag: none nas imagens
```

> **Para testar arraste, verifique `window.getSelection().toString()` depois
> do gesto.** Se voltar texto, o navegador ficou com o gesto — é este bug,
> mesmo que o `scrollLeft` tenha mudado no teste.

### Armadilha: carrossel que arrasta e volta

Sintoma: as setas funcionam, mas arrastar move os slides e eles voltam ao
ponto de partida. Parece travado.

Não é bug de CSS nem de evento — é o `longSwipesRatio`, que por padrão é
**0.5**: o Swiper só troca de slide se o arrasto passar de metade da largura.
Num slide de ~630px são 315px, muito mais que um gesto natural de mouse.
Abaixo disso ele volta, corretamente, para o slide atual.

Está em `0.22` no `Carousel.astro`. Se um carrossel voltar a "travar" no
arrasto, é esse número — não mexa em `touch-action` nem em `pointer-events`.

### Armadilha: `loop: true` TRAVA o carrossel (Swiper 12.2.0)

**Esta foi a causa real de "não consigo passar pelas setas", reportado muitas
vezes.** O carrossel andava até o último slide, voltava ao primeiro e
**parava de responder para sempre** — `isEnd` ficava preso em `true` e nem
seta nem arraste avançavam.

Medido nos dois projetos, com `slideNext()` chamado 6 vezes:

```
loop: true      r1 r1 r1 r1 r1 r1       (preso no primeiro)
rewind: true    r1 r2 r3 r0 r1 r2       (dá a volta, infinito)
sem nenhum      r1 r2 r3 r3 r3 r3       (para no último)
```

`rewind: true` entrega o que a cliente quer — passar infinitamente, chegando
ao fim volta ao começo — sem o reordenamento de slides que o `loop` faz por
baixo dos panos e que está quebrado nesta versão.

> **A Natu tem o mesmo bug.** `../NATU-ESPACO-CANINO` usa `loop: true` e os
> carrosséis dela travam igual (medido: `infraestrutura` para em r6,
> `depoimentos` nunca sai de r2). Se for mexer lá, aplique `rewind` também.
> **Não use a Natu como referência de carrossel funcionando** — foi o que eu
> fiz, e ela estava quebrada do mesmo jeito.

### Todos os 5 carrosséis têm `navigation`

`sobre-fotos` ficou um tempo sem a prop e era o único sem setas — dava
"timeout" no teste de clique porque o botão simplesmente não existia no DOM.
A cliente pediu explicitamente que **todos** passassem por seta e por
arraste. Ao criar um `<Carousel>` novo, passe `navigation`.

### Como testar carrossel de verdade

O que me fez errar várias vezes seguidas, e o que corrigiu:

| Erro | Correção |
|---|---|
| Testar `astro preview` (build) enquanto o usuário vê `npm run dev` | **Teste na porta do dev server dele** |
| `elemento.click()` via JS | `page.mouse.click(x, y)` nas coordenadas reais |
| Clicar a seta **uma vez** e ver o índice mudar | Clicar **N+2 vezes** e conferir se dá a volta |
| Filtrar só `console.error` | Capturar `warning` também |
| Deixar o ponteiro sobre o carrossel ao medir autoplay | `pauseOnMouseEnter` pausa — mova o mouse para longe |

Um clique só provava que o Swiper reagia, não que a navegação funcionava.
O bug só aparecia **depois da volta completa**.

### Carrossel: config enxuta, igual à da Natu

**A Natu (`../NATU-ESPACO-CANINO`) serve de referência para a config
enxuta, mas NÃO para o `loop`** — ver a armadilha acima. Quando os 5
carrosséis daqui pararam de funcionar,
a causa foi **acúmulo**: eu tinha somado `observer`, `observeParents`,
`observeSlideChildren`, `threshold`, `resistanceRatio`,
`touchReleaseOnEdges`, `longSwipesMs`, `shortSwipes`, `followFinger` e um
`swiper.update()` a cada imagem carregada — cada um para consertar um
sintoma, e a **soma** é que quebrava.

Com `loop: true`, toda mutação de DOM faz o Swiper recriar os slides
clonados e perder a posição. O trio `observer*` mais o `update()` por imagem
garantiam isso o tempo todo.

Hoje a config é a da Natu mais quatro coisas justificadas: `speed`,
`longSwipesRatio`, `keyboard`/`a11y` e `img.draggable = false`.
**Não reintroduza opção de Swiper sem necessidade comprovada** — o caminho
de volta é sempre comparar com a Natu.

> **Como testar arrasto de carrossel:** Playwright com `mouse.move` **não**
> dispara o gesto do Swiper de forma confiável — um Swiper limpo da CDN
> também "falha" no mesmo teste. Não confie nesse resultado isolado. Meça
> o `swiper.translate` **durante** o arrasto (sem soltar): se acompanha o
> ponteiro, os eventos estão chegando e o problema é de threshold.

### Armadilha: retângulo gigante no lugar de um carrossel

O CSS escopado de um componente Astro **não alcança conteúdo que chega por
`<slot>`**. O `Carousel.astro` recebe os slides por slot, então as regras de
`.swiper-slide` que viviam no `<style>` dele eram descartadas no build. Sem
regra de largura, os 4 slides empilhavam na vertical e a seção virava um
bloco de milhares de pixels.

**Todo CSS do carrossel vive em `global.css`**, não no componente. Se for
mexer nele, mexa lá. Vale para qualquer componente que estilize conteúdo de
slot.

### Armadilha: a página sumindo do Método para baixo

Aconteceu e pode voltar. Duas causas, ambas corrigidas:

1. **`overflow-x: hidden` no `<html>`** quebra o cálculo de altura do
   ScrollTrigger quando o Lenis controla o scroll. Os triggers abaixo da
   dobra nunca disparam e os elementos ficam presos em `opacity: 0`.
   **O `overflow-x` fica só no `body`.**
2. **O estado inicial das animações agora exige `.anim-ready`** no `<html>`,
   classe que o `ScrollAnimations` adiciona ao assumir o controle. Se o JS
   falhar, a página aparece inteira. **Nunca escrever `[data-animate] {
   opacity: 0 }` sem essa guarda.**

O script também chama `ScrollTrigger.refresh()` no `load` e no
`document.fonts.ready`, senão os triggers do fim da página ficam deslocados
depois que imagens e fontes carregam.

**Animação é "expressivo moderado":** só entrada, via `ScrollAnimations.tsx`,
que já existe e não precisou de JS novo. Use `data-animate`,
`data-animate-left/right`, `data-animate-scale`, `data-animate-group` +
`data-animate-item`, e `data-parallax="0.08"` com parcimônia.
Tudo respeita `prefers-reduced-motion`.

> **Seção com `.bleed-*` precisa de `overflow-hidden` própria**, senão a
> animação de entrada em X vaza e cria scroll horizontal antes do clamp.

---

## Acessibilidade — o que já está medido

Varredura em 12 larguras (320 a 2560) e nas duas páginas legais, nos dois
modos de movimento:

| Item | Estado |
|---|---|
| Scroll horizontal | zero em todas as 12 larguras |
| Contraste AA sobre fundo sólido | sem reprovação nas 4 páginas |
| Alvo de toque (WCAG 2.5.8, 24px) | sem reprovação |
| Hierarquia de headings | sem pulo de nível |
| `alt`, `width`/`height` nas imagens | completos |
| Âncoras internas | todas resolvem |
| Console | limpo em `no-preference`; em `reduce` só o aviso informativo do GSAP |

**Alvo de toque:** links de texto ganham área sem mudar o desenho com
`py-1 -my-1` — o padding cresce a caixa e a margem negativa devolve o espaço
ao layout. O `.link-underline` usa `padding-block` com o `::after` em
`bottom: 0.25rem`, senão o sublinhado desce junto e descola do texto.

**Footer:** quatro colunas só a partir de `xl` (1280px). Em `lg` as colunas
ficavam com 222px e `@juliamartinsadestradora` (256px) vazava.

**Banner de cookies:** `client:only="react"`, nunca `client:idle`. Ele decide
a visibilidade pelo `localStorage`, que o servidor não tem — com SSR saía
renderizado como "pendente" e sumia na hidratação (flash para quem já
aceitou), e o `useReducedMotion()` divergia entre servidor e cliente, gerando
erro de hidratação no console em toda visita.

---

## Regras absolutas

1. `<Image />` de `astro:assets` com `width`/`height`, nunca `<img>` nativo
2. Sem `any` no TypeScript
3. Sem `!important` no CSS
4. Botões: `.btn-primary`, `.btn-ghost`, `.btn-secondary-gold` — nunca classes soltas
5. Ícones `lucide:*`, nunca emoji
6. `npm run check` limpo antes de considerar pronto
7. **Nunca inventar depoimento, avaliação ou credencial.** O briefing só autoriza
   a nota do Google (5,0 / 31 avaliações).

---

## Comportamentos de UX que devem funcionar

- **Header:** esconde ao rolar para baixo, link ativo por IntersectionObserver, menu mobile fecha ao clicar em link, fora ou com Escape
- **WhatsApp flutuante:** some sobre `#hero-section` e `#footer`
- **Sem tema escuro.** A cliente não quis. O toggle do Footer **e** o script
  anti-flash do `BaseLayout` foram removidos juntos: tirar só o botão deixaria
  preso no escuro quem já o tivesse clicado, porque o `localStorage` continuaria
  mandando. O `@custom-variant dark` e as regras `dark:` seguem em `global.css`,
  inertes — nada adiciona a classe `.dark` ao `<html>`
- **Tracking:** todo CTA de WhatsApp tem `data-tracking` e `data-section` próprios; o listener em `index.astro` dispara `contato_wpp` no dataLayer. Cada serviço tem tracking individual (`whatsapp-servico-<slug>`) para medir qual converte.

---

## Fontes — todas locais

Gliker vem de `public/Gliker-font` com `@font-face` próprio. **Poppins vem do
`@fontsource`, importado no `BaseLayout`** (pesos 300 a 700; cada `@font-face`
só baixa quando algum elemento pede aquele peso).

O `@import url("https://fonts.googleapis.com/...")` que existia no
`global.css` foi removido. Era a pior forma possível de carregar fonte — o
navegador baixa o CSS, parseia, só então descobre o CSS do Google, baixa, e
só então busca o `.woff2`: três idas encadeadas — e mandava o IP de cada
visitante para o Google, o que destoa da política de privacidade que o
próprio site declara. Os `preconnect` para `fonts.googleapis` e
`fonts.gstatic` saíram junto, porque não há mais requisição externa.

**Montserrat foi removida inteira** (pacote, token `--font-montserrat` e
fallback em `--t-font-sans`). Estava declarada e não era usada em lugar
nenhum: medido no navegador, o arquivo nunca chegava a ser baixado.

> O subset `latin` cobre todo o português (ã, ç, õ, é, â, ê, à, º, ª e o
> travessão). Conferido com `document.fonts.load()` seguido de
> `document.fonts.check()` — **nessa ordem**. Checar sem carregar antes
> devolve `false` para peso ainda não baixado e parece falta de glifo.

---

## Imagens

24 fotos da cliente convertidas para webp em `src/assets/images/`, vindas de
`G:\Meu Drive\CLIENTES\ASSETS CLIENTES\JULIA MARTINS`. São fotos profissionais
(crédito nas marcas d'água: Gabriela Schumann e @bizu_photo).

Em uso: `julia-retrato` (Hero), `julia-conducao` (Manifesto), `julia-foco`
(Como eu trabalho), `aula-01`/`aula-03`/`julia-orientando` (Serviços),
`julia-trabalho` (Sobre), `canicross-capa` (Canicross),
`grupo-01`/`02`/`04` (Grupo), `mentoria-01` (Mentoria).

As demais (`canicross-01..04`, `aula-02`, `aula-04`, `grupo-03`,
`mentoria-02..04`, `julia-extra-01/02`) estão disponíveis como alternativa.

`formula-01..04` (4 fotos da pasta `Formula Natural`) estão na seção de parceria.

`avatar-julia.webp` é o único arquivo **derivado**, não uma foto nova: um
recorte quadrado de `julia-retrato.webp` no rosto (440×440 a partir de
235,80, reduzido a 400×400), para o avatar da `/links`. Existe porque num
círculo de 96px o retrato de corpo inteiro deixa o rosto com ~16px —
`object-position` desloca o recorte, não o enquadra. Para refazer:

```js
sharp("src/assets/images/julia-retrato.webp")
  .extract({ left: 235, top: 80, width: 440, height: 440 })
  .resize(400, 400).webp({ quality: 90 })
```

> A pasta `Prints de casos reais` (8 prints de conversa) continua fora de uso:
> prints precisam de autorização dos clientes retratados.

**Logos de terceiros** (`selo-cbkc`, `selo-cna`, `selo-fci`,
`logo-formula-natural`) vieram do site antigo da própria cliente
(`wp-content/uploads`), não de uma busca. São marcas de terceiros: usar só
nesses dois blocos e nunca recolorir nem distorcer.

---

## Pendências

1. **E-mail** — o briefing traz `juliamartinsadestradora` sem domínio. Hoje as
   páginas legais usam `contato@juliamartinsadestradora.com.br` como placeholder,
   centralizado numa constante `EMAIL_CONTATO` por arquivo.
2. **Logo** — aplicado no Header, Footer e páginas legais
   (`logo-julia.webp`, versão branca/laranja). Os três têm fundo escuro, por
   isso usam o mesmo arquivo. Para fundo claro existe
   `Logo verde com laranja sem fundo.png` na pasta da cliente.
3. **Número do registro CNA** — a seção de certificação afirma registro ativo,
   mas sem número. Se a cliente tiver o número, ele fortalece a credencial.
4. **Canal do YouTube** — `TODO(cliente)` no Footer.
5. **Duda Soares** — sem tratamento nem nome do cão na avaliação. Só preencher
   com confirmação da cliente; não inventar.

> **og-image resolvida.** `public/og-image.jpg` (1200×630, 116 KB) foi gerada
> a partir de `julia-retrato.webp` com o logo, a chamada do Hero e as cidades,
> renderizada em navegador. As metas `og:image`/`twitter:image` apontam para
> ela e declaram `width`, `height` e `alt`. A marca d'água da fotógrafa
> (©Gabriela Schumann) fica visível de propósito — é crédito, não sujeira.
> Se a cliente mandar uma arte própria, é só substituir o arquivo.

---

## Comandos

```bash
npm run dev      # dev server (use --port se houver outro projeto rodando)
npm run build    # build de produção
npm run check    # astro check + biome
npm run format   # biome format --write
```

> Há outros projetos de cliente que ocupam as portas 4321-4325.
> Use `npx astro dev --port 4399` para não colidir.

> **Antes de investigar "não funciona", confira se há mais de um dev server
> deste projeto rodando.** Já aconteceu duas vezes: o Astro sobe na próxima
> porta livre quando a 4321 está ocupada, e a aba antiga continua servindo
> código velho — o bug "não reproduz" porque não existe mais.
>
> ```powershell
> foreach ($p in 4321..4325) {
>   $c = Get-NetTCPConnection -LocalPort $p -State Listen -EA SilentlyContinue
>   if ($c) { "$p -> PID $($c.OwningProcess)" }
> }
> ```
