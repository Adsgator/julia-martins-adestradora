# Plano de Ação — Landing Page Julia Martins Adestradora

**Cliente:** Júlia Martins · **Domínio:** juliamartinsadestradora.com.br
**Stack:** Astro 5 + TypeScript strict + Tailwind v4 (CSS-first) + GSAP/Lenis + astro-icon
**Substitui:** site WordPress atual
**Posicionamento:** portfólio profissional / autoridade — irmã visual da Natu Espaço Canino

---

> ## Este é o plano original, não o estado atual
>
> Documento de planejamento escrito no início do projeto. Serve como registro
> das decisões daquele momento. **A fonte da verdade do que está construído
> hoje é o `CLAUDE.md`** — quando os dois divergirem, o CLAUDE.md vence.
>
> O que mudou desde então:
>
> | Neste plano | Hoje |
> |---|---|
> | Tema claro **com dark mode e toggle no Footer** (seções 1, 4, 6) | **Sem tema escuro.** A cliente não quis. O toggle e o script anti-flash saíram juntos — tirar só o botão deixaria preso no escuro quem já o tivesse clicado |
> | Sans `Poppins`/`Montserrat` (seção 3) | **Só Poppins**, local via `@fontsource`. Montserrat estava declarada e nunca era baixada |
> | Menu de 7 itens (seção 6) | 8 itens |
> | Ebook / captura de e-mail (seção 7, item 4) | Fora do escopo, junto com o blog |
> | Instagram Feed (seção 7, item 7) | Não implementado |
> | Prints de conversa como depoimento (seção 7, item 3) | Substituídos pelas **6 avaliações reais do Google**. A pasta de prints segue sem uso: precisa de autorização dos retratados |
>
> Dos pontos da seção 7, seguem em aberto: **e-mail** (item 1), **número do
> registro CNA** (item 6) e **canal do YouTube** (item 5).

---

## 1. Decisões fechadas

| Decisão | Escolha |
|---|---|
| Base de código | Clonar `NATU-ESPACO-CANINO` (sem `dist`, `node_modules`, `.git`, `src/assets/images`) |
| Paleta | Variação da paleta Natu: mantém verde-escuro e creme, troca o acento laranja por tom próprio |
| Imagens | Cliente/Lucas envia fotos novas. Slots ficam prontos e documentados |
| Tema padrão | Claro, com dark mode funcional (toggle no Footer) |
| Conversão | WhatsApp `5512982668716`, msg `Olá! Vi o site e quero saber mais.` |
| GTM | `GTM-TVBKMTWJ` |
| Schema | `LocalBusiness` |

---

## 2. Diferença de propósito entre os dois sites

| | Natu Espaço Canino | Julia Martins |
|---|---|---|
| Objetivo | Vender creche/hospedagem (espaço físico) | Autoridade + portfólio da profissional |
| Protagonista | O espaço | A pessoa |
| Conversão | Agendar avaliação | Falar no WhatsApp sobre o cão |
| Público | Donos da região de Piranguçu | Donos (presencial + online) **e** profissionais/creches (mentoria) |
| Tom visual | Imersivo, fotos amplas do espaço | Editorial, mais respiro, foco em retrato e método |

**Ponte entre os sites:** seção dedicada à Natu na página da Julia (com link) + mesma família tipográfica/tokens. A Natu deixa de ser só um item de rodapé e vira parte da narrativa de autoridade.

---

## 3. Identidade visual — como manter conexão sem clonar

**Herda da Natu (cria o parentesco):**
- Fonte serifada `Gliker` (títulos) — copiar `public/Gliker-font/`
- Sans `Poppins`/`Montserrat` (corpo)
- Sistema de tokens `--t-*` e todas as classes utilitárias de `global.css` (`.btn-primary`, `.card-hover`, `.label-tag`, `.section-py`, `.container-wide`)
- Verde-escuro institucional e fundo creme

**Diferencia (evita parecer a mesma página):**
- Acento próprio no lugar do laranja `#f47a20` da Natu — proposta: caramelo/terroso
- Hero de retrato (foto da Júlia), não de paisagem — a Natu usa banner amplo do espaço
- Mais espaço em branco, ritmo editorial, grid assimétrico nas seções de método
- Blocos de texto em coluna estreita (`max-w-prose`), típico de página de autor

### tokens.css proposto

```css
:root {
  --t-primary: #1e432c;          /* herdado da Natu — parentesco */
  --t-primary-dark: #122819;
  --t-secondary: #b5793f;        /* NOVO — caramelo, substitui o laranja Natu */
  --t-secondary-hover: #c98d51;
  --t-complement: #d6dfc4;       /* herdado */
  --t-background: #faf8f3;       /* creme levemente mais claro que a Natu */
  --t-surface: #ffffff;
  --t-surface-alt: #f2efe7;
  --t-dark: #10180f;
  --t-border: #e2dbcd;
  --t-text-main: #1d231d;
  --t-text-soft: #5a6458;
  --t-text-muted: #81897c;
}
```

Valores a confirmar visualmente na Tarefa 3. `--t-accent-gold-*` acompanham o novo `--t-secondary`.

---

## 4. Estrutura da página

Ordem definida para narrativa de autoridade (dor → pessoa → solução → prova → conversão):

| # | Seção | id | Origem | Observação |
|---|---|---|---|---|
| 1 | Header | — | adaptar Natu | Menu: Sobre, Serviços, Método, Natu, FAQ + CTA WhatsApp |
| 2 | Hero | `hero-section` | **refazer** | Título ataca a dor #1. Foto/retrato da Júlia. CTA primário WhatsApp + secundário `#servicos` |
| 3 | Sobre a Júlia | `sobre` | adaptar `About.astro` | Narrativa "Antes de ensinar cães, eu quis aprender a entendê-los" |
| 4 | Diferenciais | `diferenciais` | adaptar `Exclusivity.astro` | 4 pilares do manifesto |
| 5 | Serviços | `servicos` | **refazer** | 7 cards com CTA individual por serviço |
| 6 | Como funciona | `metodo` | nova | 3 passos: avaliação → plano → acompanhamento |
| 7 | Natu Espaço Canino | `natu` | nova | Ponte para o site irmão, com link externo |
| 8 | Prova social | `avaliacoes` | adaptar `Testimonials.astro` | Google 5,0 ★ (31 avaliações) — dado real do briefing |
| 9 | Atendimento / onde | `atendimento` | adaptar `Location.astro` | Itajubá, Piranguçu, SJC, Poços de Caldas + online |
| 10 | FAQ | `faq` | adaptar `FAQ.astro` | 9 perguntas do briefing |
| 11 | CTA final | — | adaptar | "Hora de começar uma convivência mais equilibrada" |
| 12 | Footer | `footer` | adaptar | Toggle de tema, redes, link Natu, legais |

**Ficam de fora:** Instagram Feed (só se o embed for confirmado), Preços (cliente não autorizou), depoimentos escritos (não há material real — só a nota do Google).

### Os 7 serviços (cards)

Educação e treinamento · Filhotes · Comportamento · Treinamento em grupo · Canicross · Online · Mentoria profissional

Cada card: ícone `lucide:*`, título, descrição curta e CTA próprio com `data-tracking` distinto — permite medir qual serviço converte.

---

## 5. SEO

- **title:** `Adestradora em Itajubá e Piranguçu | Julia Martins` (≤60)
- **description:** dor + benefício + CTA implícito, ≤160
- **keywords:** adestramento de cães, adestrador Itajubá, adestrador Piranguçu, comportamento canino, treinamento de filhotes, canicross, mentoria adestramento
- Schema `LocalBusiness` com `areaServed`, `aggregateRating` (5,0 / 31), `sameAs` (Instagram, TikTok, Natu)
- Canonical, OG image próprio, sitemap

---

## 6. Tarefas de execução

| # | Tarefa | Status | Entrega |
|---|---|---|---|
| 1 | Clonar base do Natu, limpar assets/dist/git, `npm install` | ✅ | Projeto roda |
| 2 | `.env`, `astro.config.mjs`, `package.json` | ✅ | Config aplicada |
| 3 | `tokens.css` — paleta Julia (claro + dark) | ✅ | Caramelo `#b5793f` no lugar do laranja Natu |
| 4 | `BaseLayout.astro` — SEO, OG, canonical, Schema, GTM | ✅ | `ProfessionalService` + favicon + preload Gliker corrigido |
| 5 | Header + Footer | ✅ | Menu 7 itens, toggle de tema, fecha com Escape/clique fora |
| 6 | Hero | ✅ | Layout editorial 2 colunas, CTA duplo |
| 7 | Sobre + Diferenciais | ✅ | Narrativa em 1ª pessoa + 4 pilares |
| 8 | Serviços (7 cards) + Como funciona | ✅ | Tracking individual por serviço |
| 9 | Natu + Prova social + Atendimento | ✅ | Bloco escuro de ponte + Google 5,0 |
| 10 | FAQ (9 perguntas) | ✅ | Acordeão animado preservado da biblioteca |
| 11 | CTA final + WhatsApp flutuante | ✅ | Componente próprio, separado do FAQ |
| 12 | Páginas legais + 404 | ⚠️ | Domínio e nome corrigidos; e-mail é placeholder |
| 13 | Substituir slots pelas fotos | ⛔ | Aguardando fotos da cliente |
| 14 | `npm run check` + `npm run build` | ✅ | 0 erros, 0 warnings, 0 hints |
| 15 | Revisão mobile + Lighthouse | ⏳ | Pendente de conferência visual |

**Validado no HTML renderizado:** 11 IDs de seção corretos, 0 links `href="#"`,
17 pontos de tracking distintos, 0 resíduos da Natu, alternância de fundos
correta nas 10 seções, 0 cores hardcoded (exceto `theme-color`, que exige literal).

**Bloqueio:** Tarefa 13 depende das fotos. Tudo o mais está entregue.

---

## 7. Pontos que precisam de confirmação da cliente

1. **E-mail** — o briefing traz `juliamartinsadestradora` sem domínio. Necessário para as páginas legais e o Schema.
2. **Fotos** — retrato para o Hero, foto para o Sobre, e imagens de apoio para os serviços.
3. **Depoimentos** — o WP atual tem 15 prints de conversa. Vale reaproveitar? (Se sim, precisam de autorização dos clientes.)
4. **Ebook / captura de e-mail** — existe hoje no WP ("Guia de enriquecimento ambiental"). Manter na nova página?
5. **YouTube** — está no rodapé do WP atual mas não no briefing. Incluir?
6. **CNA/CBKC** — o WP atual cita registro no Conselho Nacional de Adestramento. Confirmar se segue válido; é um ativo forte de autoridade.
7. **Instagram Feed** — manter a seção exige um serviço de embed. Confirmar antes.

---

## 8. Regras herdadas (inegociáveis)

- Zero cor/fonte/tamanho hardcoded — sempre token ou utilitário Tailwind
- `<Image />` de `astro:assets` com `width`/`height`, nunca `<img>`
- Sem `any` no TypeScript, sem `!important` no CSS
- Botões: `.btn-primary`, `.btn-ghost`, `.btn-secondary-gold` — nunca classes soltas
- Ícones: `astro-icon` + `lucide`, nunca emoji
- Alternância `bg-surface` ↔ `bg-background` entre seções vizinhas
- `id="hero-section"`, `id="footer"`, `id="main-content"` obrigatórios
- Tracking `contato_wpp` via dataLayer em todo CTA de WhatsApp
