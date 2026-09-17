> **Como usar:** Abra o Claude Code na raiz do projeto clonado e cole o prompt abaixo seguido do conteúdo deste arquivo.

**Prompt para o Claude Code:**
```
Você está implementando o site do cliente Júlia (segmento: Adestramento e Comportamento Canino).
Leia este documento do início ao fim antes de começar. Depois siga passo a passo:

1. Preencha `src/styles/tokens.css` com as cores da seção "Direção de Arte" (apenas os valores — os nomes são fixos)
2. Atualize o `<link>` de fonte serifada no `BaseLayout.astro` conforme a tipografia indicada
3. Preencha `src/pages/index.astro` com imports dos componentes e ordem das seções
4. Para cada seção, substitua os textos placeholder pela copy indicada neste documento
5. Preencha `.env` com WhatsApp, GTM e domínio — o template já lê essas variáveis
6. Preencha o `defaultSchema` no `BaseLayout.astro` com os dados do Schema.org
7. Preencha os TODOs em `politica-de-privacidade.astro` e `termos-de-uso.astro` com dados reais
8. Garanta: Hero com `id="hero-section"`, Footer com `id="footer"`, main com `id="main-content"`
9. Rode `npm run build` para validar — corrija qualquer erro antes de considerar pronto

Regras absolutas:
- NUNCA hardcode cor, fonte ou tamanho — sempre `var(--t-*)` ou classes utilitárias Tailwind
- `<Image />` do Astro, nunca `<img>` nativo
- Sem `any` no TypeScript, sem `!important` no CSS
- Tema padrão: claro (padrão)
```

---

# Documento do Projeto — Júlia
**Studio:** Astroteca Studio
**Gerado em:** 15/09/2026
**Segmento:** Adestramento e Comportamento Canino
**Tipo:** servico

---

## Briefing do Cliente

| Campo | Valor |
|-------|-------|
| Nome do cliente | Júlia |
| Nome da marca | Julia Martins Adestradora |
| Segmento | Adestramento e Comportamento Canino |
| Tipo de negócio | servico |
| Proposta de valor | Educação, comportamento e treinamento para uma convivência mais equilibrada entre cães e pessoas. |
| Domínio | juliamartinsadestradora.com.br |
| WhatsApp | 5512982668716 |
| Horários | horario de atendimento comercial. das 8 as 18. ( agendamento conforme a disponibilidade de agenda ) |
| Instagram | https://www.instagram.com/juliamartinsadestradora/ |
| Objetivo de conversão | whatsapp |
| GTM ID | GTM-TVBKMTWJ |
| Schema tipo | LocalBusiness |
| Serviço principal | Educação e treinamento |
| Público primário | Donos de cães que buscam melhorar a comunicação e convivência; profissionais da área canina, creches e daycares que desejam estruturar processos. |
| Dor do público | Dificuldades na comunicação com o cão, problemas de comportamento como medo, reatividade, ansiedade, destruição, dificuldade de ficar sozinho, possessividade, excesso de excitação, e problemas de convivência. |
| Resultado esperado | Convivência mais equilibrada e prazerosa, melhor compreensão do comportamento canino, cão com mais habilidades para lidar com a rotina, aumento da segurança, autonomia e confiança na relação. |
| Frase de impacto | Mais do que ensinar seu cão a obedecer, ensinamos vocês a se entenderem |
| Diferencial | Meu trabalho une experiência prática em adestramento e comportamento com uma visão mais ampla sobre educação e convivência canina. Não trabalho apenas comandos ou correção de comportamentos: considero o vínculo, a comunicação, os limites, o manejo, a rotina, a individualidade e as necessidades de cada cão. O atendimento é personalizado e busca preparar o cão para situações reais do dia a dia. Além dos atendimentos individuais, ofereço treinamentos em grupo, canicross para iniciantes, acompanhamento online e mentoria para profissionais e creches, |
| SEO título | Julia Martins Adestradora | Educação e Comportamento Canino |
| SEO descrição | Mais do que ensinar obediência, Julia Martins Adestradora promove a convivência equilibrada entre cães e pessoas. Treinamento personalizado, filhotes, comportamento, grupos e mentoria profissional. |
| SEO keywords | adestramento, adestrador, adestramento de cães, treinamento de cães, comportamento canino, educação canina, filhotes, canicross, mentoria adestramento, adestrador Itajubá, adestrador Piranguçu |
| Google nota | 5 |
| Google avaliações | 31 |

### História / Sobre

Antes de ensinar cães, eu quis aprender a entendê-los. Minha trajetória com cães começou pelo adestramento. Com o tempo, quanto mais cães eu treinava, mais percebia que ensinar comandos era apenas uma parte do trabalho. Um cão não existe dentro de uma aula. Ele existe dentro de uma casa, de uma família, de uma rotina, de uma relação. Foi essa percepção que fez meu trabalho evoluir. Passei a olhar cada vez mais para comportamento, linguagem corporal, manejo, socialização, descanso, enriquecimento, rotina e para a participação dos donos no processo. Hoje, meu trabalho é ensinar cães e, principalmente, ensinar pessoas a se comunicarem melhor com eles. Essa experiência também deu origem à Natu Espaço Canino, onde essa filosofia ganhou um espaço físico e uma rotina própria. A Natu nasceu da necessidade de oferecer aos cães algo que muitas vezes falta: estrutura para viver bem. Hoje, meus trabalhos se complementam. No atendimento individual, trabalhamos a relação entre cão e dono. Na Natu, aplicamos essa visão na rotina, na socialização, no manejo e na convivência. E na mentoria, compartilho essa experiência com outros profissionais.

### FAQ

Você atende quais cidades? Atualmente realizo atendimentos presenciais em Itajubá e Piranguçu, além de treinamentos em grupo em São José dos Campos e Poços de Caldas. Também ofereço acompanhamento online. | O treinamento é feito na minha casa? A modalidade de atendimento depende da necessidade do cão e do objetivo do treinamento. Durante a avaliação definimos o formato mais adequado. | Você atende filhotes? Sim. O trabalho com filhotes busca construir uma boa base de educação, manejo, rotina, socialização e comunicação desde os primeiros meses. | Você trabalha com problemas comportamentais? Sim. Casos comportamentais são avaliados individualmente para entender as causas e definir uma estratégia adequada. | Preciso ter experiência com cães? Não. O treinamento também ensina o dono a conduzir e se comunicar melhor com o cão. | Você atende online? Sim. O acompanhamento online é indicado para famílias que conseguem aplicar o treinamento na rotina e desejam orientação profissional à distância. | Como funciona o Canicross? O trabalho começa com uma introdução ao esporte, comunicação, condução, equipamentos e evolução gradual. | Você oferece treinamento em grupo? Sim. Atualmente existem grupos em conforme formação das turmas. | Você oferece mentoria profissional? Sim. A mentoria é voltada para profissionais, pessoas que estão começando na área e espaços como creches e daycares.

### Objeções a Quebrar

Dúvidas sobre cidades de atendimento (presencial e online), local do treinamento, atendimento a filhotes e problemas comportamentais, necessidade de experiência prévia do dono, funcionamento do Canicross, disponibilidade de treinamento em grupo e mentoria profissional.

---

## Estrutura da Página

### 1. Header

| Campo | Texto |
|-------|-------|
| logoAlt | Julia Martins Adestradora |
| ctaTexto | Falar no WhatsApp |
| ctaUrl | https://wa.me/5512982668716?text=Ol%C3%A1!%20Vi%20o%20site%20e%20quero%20saber%20mais. |
| servico1Titulo | Sobre (#sobre) |
| servico2Titulo | Serviços (#servicos) |
| servico3Titulo | Diferenciais (#diferenciais) |
| item_4 | FAQ (#faq) |

### 2. Hero

| Campo | Texto |
|-------|-------|
| titulo | Seu cão tem medo, ansiedade, destrói a casa ou não obedece? |
| subtitulo | Mais do que ensinar seu cão a obedecer, ensinamos vocês a se entenderem. Convivência mais equilibrada, confiança e autonomia para vocês dois, com atendimento presencial em Itajubá e Piranguçu ou online. |
| ctaTexto | Quero resolver isso agora |
| ctaUrl | https://wa.me/5512982668716?text=Ol%C3%A1!%20Vi%20o%20site%20e%20quero%20saber%20mais. |
| ctaSecundarioTexto | Conhecer os treinamentos (#servicos) |

### 3. Sobre

| Campo | Texto |
|-------|-------|
| titulo | Sobre a Júlia |
| texto | Antes de ensinar cães, eu quis aprender a entendê-los. Minha trajetória com cães começou pelo adestramento. Com o tempo, quanto mais cães eu treinava, mais percebia que ensinar comandos era apenas uma parte do trabalho. Um cão não existe dentro de uma aula. Ele existe dentro de uma casa, de uma família, de uma rotina, de uma relação. Foi essa percepção que fez meu trabalho evoluir. Passei a olhar cada vez mais para comportamento, linguagem corporal, manejo, socialização, descanso, enriquecimento, rotina e para a participação dos donos no processo. Hoje, meu trabalho é ensinar cães e, principalmente, ensinar pessoas a se comunicarem melhor com eles. Essa experiência também deu origem à Natu Espaço Canino, onde essa filosofia ganhou um espaço físico e uma rotina própria. A Natu nasceu da necessidade de oferecer aos cães algo que muitas vezes falta: estrutura para viver bem. Hoje, meus trabalhos se complementam. No atendimento individual, trabalhamos a relação entre cão e dono. Na Natu, aplicamos essa visão na rotina, na socialização, no manejo e na convivência. E na mentoria, compartilho essa experiência com outros profissionais. |
| subtitulo | Antes de ensinar cães, eu quis aprender a entendê-los. |
| servico1Titulo | Minha trajetória com cães começou no adestramento. Com o tempo, percebi que ensinar comandos era só uma parte do trabalho. |
| servico2Titulo | Um cão não vive dentro de uma aula. Ele vive dentro de uma casa, de uma rotina, de uma relação. Foi essa percepção que fez meu trabalho evoluir. |
| servico3Titulo | Hoje eu ensino cães e, principalmente, ensino pessoas a se comunicarem melhor com eles. |
| item_4 | Essa abordagem também deu origem à Natu Espaço Canino, onde ganhou um espaço físico e uma rotina própria. No atendimento individual trabalho a relação entre você e seu cão. Na mentoria, compartilho essa experiência com outros profissionais. |
| ctaTexto | Quero treinar com a Júlia |
| ctaUrl | https://wa.me/5512982668716?text=Ol%C3%A1!%20Vi%20o%20site%20e%20quero%20saber%20mais. |

### 4. Diferenciais

| Campo | Texto |
|-------|-------|
| titulo | O que torna esse trabalho diferente |
| subtitulo | Uma abordagem mais ampla sobre educação e convivência canina, não só comandos. |
| diferencial1 | Visão Abrangente e Personalizada |
| diferencial2 | Preparação para a Vida Real |
| diferencial3 | Oferta Diversificada de Serviços |
| servico1Titulo | Atendimento personalizado, pensado para a individualidade e as necessidades de cada cão. |
| servico2Titulo | O trabalho olha para o vínculo, a comunicação, os limites, o manejo e a rotina, não só para o comportamento isolado. |
| servico3Titulo | Preparo o cão para situações reais do dia a dia, não só para o ambiente da aula. |
| item_4 | Além do atendimento individual, você encontra treinamento em grupo, canicross para iniciantes, acompanhamento online e mentoria para profissionais e creches. |

### 5. Serviços

| Campo | Texto |
|-------|-------|
| titulo | Serviços |
| subtitulo | Encontre o treinamento que faz sentido para vocês |
| servico1Titulo | Educação e treinamento. Para quem quer melhorar a comunicação com o cão e torná-lo mais fácil de conduzir no dia a dia: obediência, autocontrole, foco, passeio, permanência e manejo. |
| servico1Texto | Para donos que querem melhorar a comunicação, ensinar habilidades e tornar o cão mais fácil de conduzir no dia a dia. Trabalhamos obediência, autocontrole, foco, passeio, permanência, manejo e outras habilidades importantes para a convivência. |
| servico2Titulo | Filhotes. Os primeiros meses são a melhor oportunidade para ensinar o cão a viver bem no mundo: rotina, educação sanitária, mordidas, descanso, enriquecimento, socialização, manejo, autonomia e prevenção de problemas de comportamento. |
| servico2Texto | Os primeiros meses são uma oportunidade enorme de ensinar o cão a viver bem no mundo. O trabalho envolve muito mais do que comandos: rotina, educação sanitária, mordidas, descanso, enriquecimento, socialização, manejo, autonomia, prevenção de problemas comportamentais. |
| servico3Titulo | Comportamento. Medo, reatividade, ansiedade, destruição, dificuldade de ficar sozinho, possessividade, excesso de excitação e problemas de convivência exigem avaliação e planejamento, não só um comando de senta. |
| servico3Texto | Alguns comportamentos não são resolvidos simplesmente ensinando um “senta”. Medos, reatividade, ansiedade, destruição, dificuldade de ficar sozinho, possessividade, excesso de excitação e problemas de convivência exigem avaliação e planejamento. O primeiro passo é entender por que aquele comportamento está acontecendo. |
| item_4 | Treinamento em grupo. Uma oportunidade para o cão aprender a responder a você mesmo diante de distrações, outros cães e diferentes estímulos. |
| item_5 | Canicross. Para quem quer descobrir esse esporte ao lado do cão: treinamento para iniciantes, conexão entre cão e condutor, condução, comandos, equipamentos e evolução gradual. |
| item_6 | Online. Orientação para famílias que estão longe ou precisam de acompanhamento na rotina de casa, com você como parte ativa do processo. |
| item_7 | Mentoria profissional. Para profissionais, creches, daycares e espaços caninos que querem estruturar melhor seus processos e sua rotina. |
| ctaTexto | Quero saber qual treinamento é ideal |
| ctaUrl | https://wa.me/5512982668716?text=Ol%C3%A1!%20Vi%20o%20site%20e%20quero%20saber%20mais. |

### 6. Como Funciona

| Campo | Texto |
|-------|-------|
| titulo | Como funciona o processo |
| subtitulo | Cada cão e cada família têm uma história diferente, por isso o formato é definido caso a caso. |
| passo1 | Avaliação da necessidade |
| passo2 | Planejamento personalizado |
| passo3 | Acompanhamento na rotina |
| servico1Titulo | Avaliação inicial. Entendemos a necessidade do seu cão, o objetivo do treinamento e o contexto da rotina de vocês. |
| servico2Titulo | Casos comportamentais recebem atenção individual, para entender as causas do comportamento antes de definir qualquer estratégia. |
| servico3Titulo | Durante a avaliação, definimos juntos o formato mais adequado: presencial, em grupo, online ou mentoria. |
| ctaTexto | Agendar minha avaliação |
| ctaUrl | https://wa.me/5512982668716?text=Ol%C3%A1!%20Vi%20o%20site%20e%20quero%20saber%20mais. |

### 7. FAQ

| Campo | Texto |
|-------|-------|
| titulo | Perguntas frequentes |
| subtitulo | Você atende quais cidades? Atualmente realizo atendimentos presenciais em Itajubá e Piranguçu, além de treinamentos em grupo em São José dos Campos e Poços de Caldas. Também ofereço acompanhamento online. | O treinamento é feito na minha casa? A modalidade de atendimento depende da necessidade do cão e do objetivo do treinamento. Durante a avaliação definimos o formato mais adequado. | Você atende filhotes? Sim. O trabalho com filhotes busca construir uma boa base de educação, manejo, rotina, socialização e comunicação desde os primeiros meses. | Você trabalha com problemas comportamentais? Sim. Casos comportamentais são avaliados individualmente para entender as causas e definir uma estratégia adequada. | Preciso ter experiência com cães? Não. O treinamento também ensina o dono a conduzir e se comunicar melhor com o cão. | Você atende online? Sim. O acompanhamento online é indicado para famílias que conseguem aplicar o treinamento na rotina e desejam orientação profissional à distância. | Como funciona o Canicross? O trabalho começa com uma introdução ao esporte, comunicação, condução, equipamentos e evolução gradual. | Você oferece treinamento em grupo? Sim. Atualmente existem grupos em conforme formação das turmas. | Você oferece mentoria profissional? Sim. A mentoria é voltada para profissionais, pessoas que estão começando na área e espaços como creches e daycares. |
| servico1Titulo | Você atende quais cidades? Atualmente realizo atendimentos presenciais em Itajubá e Piranguçu, além de treinamentos em grupo em São José dos Campos e Poços de Caldas. Também ofereço acompanhamento online. |
| servico2Titulo | O treinamento é feito na minha casa? A modalidade de atendimento depende da necessidade do cão e do objetivo do treinamento. Durante a avaliação definimos o formato mais adequado. |
| servico3Titulo | Você atende filhotes? Sim. O trabalho com filhotes busca construir uma boa base de educação, manejo, rotina, socialização e comunicação desde os primeiros meses. |
| item_4 | Você trabalha com problemas comportamentais? Sim. Casos comportamentais são avaliados individualmente para entender as causas e definir uma estratégia adequada. |
| item_5 | Preciso ter experiência com cães? Não. O treinamento também ensina você a conduzir e se comunicar melhor com o seu cão. |
| item_6 | Você atende online? Sim. O acompanhamento online é indicado para famílias que conseguem aplicar o treinamento na rotina e desejam orientação profissional à distância. |
| item_7 | Como funciona o Canicross? O trabalho começa com uma introdução ao esporte, comunicação, condução, equipamentos e evolução gradual. |
| item_8 | Você oferece treinamento em grupo? Sim. Os grupos são formados conforme a montagem das turmas. |
| item_9 | Você oferece mentoria profissional? Sim. A mentoria é voltada para profissionais, pessoas que estão começando na área e espaços como creches e daycares. |
| ctaTexto | Tirar minha dúvida com a Júlia |
| ctaUrl | https://wa.me/5512982668716?text=Ol%C3%A1!%20Vi%20o%20site%20e%20quero%20saber%20mais. |

### 8. Instagram Feed

| Campo | Texto |
|-------|-------|
| titulo | Acompanhe no Instagram |
| ctaTexto | Seguir no Instagram |
| subtitulo | Bastidores dos treinamentos, dicas e a rotina real dos cães que acompanhamos. |
| ctaUrl | https://www.instagram.com/juliamartinsadestradora/ |

### 9. CTA Final

| Campo | Texto |
|-------|-------|
| titulo | Hora de começar uma convivência mais equilibrada com o seu cão |
| subtitulo | Fale com a Júlia agora e entenda qual caminho faz mais sentido para vocês dois. |
| ctaTexto | Falar com a Júlia no WhatsApp |
| ctaUrl | https://wa.me/5512982668716?text=Ol%C3%A1!%20Vi%20o%20site%20e%20quero%20saber%20mais. |

### 10. Footer

| Campo | Texto |
|-------|-------|
| copyright | © 2026 Julia Martins Adestradora. Todos os direitos reservados. |
| politicaUrl | /politica-de-privacidade |
| titulo | Júlia Martins |
| subtitulo | Educação, comportamento e convivência canina. |
| servico1Titulo | Adestramento • Filhotes • Comportamento • Grupos • Canicross • Online • Mentoria |
| servico2Titulo | WhatsApp: (12) 9 8266-8716 |
| servico3Titulo | Atendimento: Piranguçu e Itajubá (datas em outras cidades a combinar). Horário comercial, das 8h às 18h, conforme disponibilidade de agenda. |
| item_4 | Instagram: @juliamartinsadestradora | TikTok: @juliamartinsadestradora | Natu Espaço Canino: natuespacocanino.com.br |



---

## Direção de Arte

### Tema Padrão
**Claro**

### Cores — `src/styles/tokens.css`

Preencha **apenas os valores** (os nomes são fixos entre projetos):

```css
:root {
  --t-primary:      #6B8E23;
  --t-primary-dark: #556B2F;
  --t-secondary:    #D2B48C;
  --t-background:   #FDFDFD;
  --t-surface:      #FFFFFF;
  --t-surface-alt:  #F5F5F5;
  --t-dark:         #36454F;
  --t-text-main:    #333333;
  --t-text-soft:    #555555;
  --t-text-muted:   #888888;
  --t-border:       #DDDDDD;
}

.dark {
  --t-background:  #1A1A1A;
  --t-surface:     #2C2C2C;
  --t-surface-alt: #3A3A3A;
  --t-text-main:   #E0E0E0;
  --t-text-soft:   #B0B0B0;
  --t-text-muted:  #757575;
  --t-border:      #454545;
}
```

### Tipografia

| Papel | Fonte |
|-------|-------|
| Heading (`font-serif`) | Montserrat |
| Body (`font-sans`) | Lato |

### Mood & Referências

Natural, confiante, profissional e acolhedor, transmitindo a harmonia entre cães e donos em um ambiente de aprendizado e respeito.



---

## Regras de Copy — DNA do Negócio

## DNA: Prestador de Serviço

**Tom:** Confiante, direto, focado em resultado tangível.
**Perspectiva:** "Eu resolvo seu problema" — não "eu ofereço um serviço".
**Foco:** Transformação antes/depois. O visitante deve sentir que o problema dele tem solução aqui.

**Copy que funciona:**
- Hero: atacar a dor principal no título. Subheadline com o resultado esperado.
- CTA: verbos de ação imediata — "Agende agora", "Fale comigo hoje", "Quero resolver isso".
- Sobre: credenciais rapidamente, depois voltar ao cliente — não fazer monólogo sobre si.
- Depoimentos: resultado específico + prazo + nome real. Ex: "Resolvi em 3 dias o que levava semanas".

**Evitar:** Jargão técnico, parágrafos longos, muito sobre o processo e pouco sobre o resultado.

---

## Checklist Final

- [ ] `npm run build` sem erros de TypeScript/Astro
- [ ] `src/styles/tokens.css` preenchido com cores reais do cliente
- [ ] Fontes carregadas: `<link>` no `BaseLayout.astro` + import `@fontsource` no `global.css`
- [ ] `.env` preenchido: `PUBLIC_WA_NUMBER`, `PUBLIC_WA_MESSAGE`, `PUBLIC_GTM_ID`, `PUBLIC_SITE_URL`
- [ ] `BaseLayout.astro`: title, description, OG, canonical, Schema.org JSON-LD
- [ ] Hero com `id="hero-section"`; Footer com `id="footer"`; main com `id="main-content"`
- [ ] Header: esconde ao rolar para baixo; link ativo por IntersectionObserver
- [ ] WhatsApp flutuante: some quando Hero ou Footer estão visíveis; número real no `.env`
- [ ] Dark mode: toggle no Footer; persiste localStorage; sem flash na primeira carga
- [ ] Todas as seções com copy real (sem placeholder genérico)
- [ ] Responsivo em mobile (375px): texto ≥ 20px, botões ≥ 44px, padding lateral ≥ 20px
- [ ] `politica-de-privacidade.astro` e `termos-de-uso.astro`: TODOs preenchidos
- [ ] Schema tipo: `LocalBusiness`
- [ ] GTM configurado (ID: GTM-TVBKMTWJ)
- [ ] WhatsApp (número: 5512982668716)