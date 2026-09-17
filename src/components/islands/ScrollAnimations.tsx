// ScrollAnimations — Lenis (smooth scroll) + GSAP ScrollTrigger.
//
// Gatilhos disponíveis:
//   [data-animate]            entrada de baixo
//   [data-animate-left/right] entrada lateral
//   [data-animate-scale]      entrada em escala
//   [data-animate-group]      stagger nos filhos [data-animate-item]
//   [data-counter="150"]      contador numérico
//   [data-parallax="0.3"]     parallax vertical
//   [data-reveal-lines]       revelação linha a linha (scrollytelling)
//   [data-rail-drag]          arrastar horizontal com o mouse no .scroll-rail
//   [data-rail-pin]           trilho que avança conforme o scroll da página
//                             (trava a seção; vale em todas as larguras)
//   [data-cursor-area]        cursor customizado dentro da área
//
// Segurança: o CSS só esconde elementos quando <html> tem .anim-ready, que
// é adicionada aqui. Se este módulo falhar, a página aparece inteira.

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    (async () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const { default: Lenis } = await import("lenis");
      const gsap = (await import("gsap")).default;
      const { default: ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: !prefersReduced,
      });

      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      // Âncoras internas passam pelo Lenis para o scroll suave funcionar.
      const anchorHandlers: Array<[Element, EventListener]> = [];
      for (const anchor of document.querySelectorAll('a[href^="#"]')) {
        const handler = (event: Event) => {
          const href = (anchor as HTMLAnchorElement).getAttribute("href");
          if (!href || href === "#") return;
          const target = document.querySelector(href);
          if (!target) return;
          event.preventDefault();
          lenis.scrollTo(target as HTMLElement, { offset: -80 });
        };
        anchor.addEventListener("click", handler);
        anchorHandlers.push([anchor, handler]);
      }

      // ── Trilhos conduzidos pelo scroll da página (pin horizontal) ──
      //
      // A seção trava na tela e o trilho avança na horizontal enquanto a
      // página rola, até o último card entrar no container.
      //
      // Só a SEÇÃO SERVIÇOS usa isto, e a restrição é estrutural: o pin
      // congela a `<section>` inteira, então ela precisa conter só o bloco
      // do trilho. Serviços é assim. Método (tem o bloco de fechamento
      // depois) e Mentoria (tem carrossel de fotos e o bloco da Natu) já
      // usaram e voltaram para `data-rail-drag`: ali o pin congelava esses
      // outros blocos junto, e parecia que o efeito "vazava" para os
      // sliders. Antes de aplicar num trilho novo, confira que a seção não
      // tem mais nada além dele.
      //
      // Roda MESMO com `prefers-reduced-motion`, e é proposital: isto não é
      // decoração, é como o conteúdo é navegado. Desligado, os cards 4 a 7
      // ficavam inalcançáveis para quem tem animações reduzidas — e no
      // Windows basta "Mostrar animações" desligado para cair nesse caso.
      // `matchMedia` do GSAP: cria o pin só no desktop e desfaz sozinho se a
      // janela cruzar o breakpoint.
      const mm = gsap.matchMedia();

      const setupPinnedRails = () => {
        // ── Só a partir de 1024px ──
        //
        // No celular o pin prendia a seção por 2497px — 3,1 telas de rolagem
        // com a página congelada, o que é muito dedo para atravessar um
        // bloco de apoio. Pior: o `touch-action: pan-y` que o pin exige
        // BLOQUEIA o deslize horizontal, então o gesto natural de arrastar
        // os cards não funcionava. No toque, o trilho nativo é melhor nas
        // duas pontas: menos rolagem e o gesto que o usuário já espera.
        mm.add("(min-width: 1024px)", () => {
          const limpezas: Array<() => void> = [];

          for (const rail of document.querySelectorAll<HTMLElement>("[data-rail-pin]")) {
            const section = rail.closest("section");
            const track = rail.querySelector<HTMLElement>(".scroll-rail-track");
            if (!section || !track) continue;

            // O trilho deixa de rolar por conta própria: quem se move é o
            // track, por transform. `scrollWidth` do rail mediria o conteúdo
            // rolável, que aqui é sempre igual ao visível.
            rail.style.overflowX = "hidden";
            track.style.willChange = "transform";

            const distance = () => Math.max(0, track.scrollWidth - rail.clientWidth);

            // O curso vertical tem três trechos: folga inicial, percurso dos
            // cards (1:1 com o scroll) e folga final. As duas folgas são curso
            // EXTRA — o meio nunca é comprimido.
            //
            // Folga inicial: sem ela, o mesmo gesto que fixa a seção já empurra
            // os cards, e o usuário trava e vê o trilho correr sem ter pedido.
            const DEAD_ZONE = 0.18;
            const folgaInicio = () => distance() * (DEAD_ZONE / (1 - DEAD_ZONE));

            // Folga final: sem ela o pin acabava no MESMO pixel em que o último
            // card encostava no container, com o scroll ainda em velocidade
            // cheia — a seção era arrancada da tela no instante em que o card
            // chegava. Estes 320px seguram o último card enquadrado antes de
            // devolver a página ao fluxo normal.
            const FOLGA_FIM = 320;

            const cursoTotal = () => folgaInicio() + distance() + FOLGA_FIM;

            // progress (0..1 do curso total) → quantos px o track andou.
            const deslocamento = (raw: number) => {
              const d = distance();
              if (d <= 0) return 0;
              return Math.min(Math.max(raw * cursoTotal() - folgaInicio(), 0), d);
            };

            const barKey = rail.dataset.railProgress;
            const bar = barKey
              ? document.querySelector<HTMLElement>(`[data-rail-progress-for="${barKey}"]`)
              : null;

            const trigger = ScrollTrigger.create({
              trigger: section,
              start: "center center",
              end: () => `+=${cursoTotal()}`,
              pin: true,
              pinSpacing: true,
              // Sem `anticipatePin`: ele antecipa a troca para `position: fixed`
              // com base na velocidade do scroll, e com a inércia do Lenis isso
              // faz a seção travar/soltar antes da hora e corrigir no quadro
              // seguinte — uma piscada nas bordas do pin. Existia para evitar o
              // flash na ENTRADA em scroll rápido, o que a folga inicial já
              // resolve: nos primeiros 400px os cards nem se movem, então um
              // erro de alguns quadros na hora de travar não aparece.
              // `scrub: true` (sem número) segue o scroll quadro a quadro. Com
              // um valor de inércia (0.6) o trilho tinha um atraso próprio que,
              // somado à suavização do Lenis, virava duas animações disputando
              // a mesma posição — era a travada no momento em que a seção fixa.
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const x = deslocamento(self.progress);

                // `translate3d` em vez de `scrollLeft`: escrever `scrollLeft`
                // força o navegador a recalcular layout a cada frame; o
                // transform roda na composição, sem reflow.
                track.style.transform = `translate3d(${-x}px,0,0)`;

                // O trilho não rola mais, então o evento `scroll` que a barra
                // de progresso escuta nunca dispara: ela é atualizada aqui.
                if (bar) {
                  const d = distance();
                  const andado = d > 0 ? x / d : 0;
                  const span = bar.firstElementChild as HTMLElement | null;
                  const widthPct = Math.max((rail.clientWidth / track.scrollWidth) * 100, 8);
                  bar.style.setProperty("--rail-progress", `${widthPct}%`);
                  if (span) span.style.left = `${andado * (100 - widthPct)}%`;
                }
              },
            });

            // Sem handler de roda: com `overflow-x: hidden` o trilho não tem
            // mais scroll próprio para engolir o gesto, e a roda vira scroll
            // da página naturalmente. Interceptar aqui só adicionaria mais uma
            // escrita concorrendo com o Lenis.

            limpezas.push(() => {
              rail.style.overflowX = "";
              track.style.transform = "";
              track.style.willChange = "";
              trigger.kill();
            });
          }

          // O matchMedia chama isto ao sair do breakpoint: o trilho volta
          // a ser um scroll horizontal comum.
          return () => {
            for (const fn of limpezas) fn();
          };
        });
      };

      // ── Trilhos: arraste, barra de progresso e cursor ──
      //
      // Tudo aqui é NAVEGAÇÃO, não enfeite, e por isso roda nos DOIS
      // caminhos — antes e depois do `return` de `prefersReduced`.
      //
      // Ficava só depois do `return`, e o efeito era invisível no teste:
      // no mobile o dedo rola o `overflow-x` nativo, que não precisa de JS,
      // então só o desktop quebrava, e só em quem tem movimento reduzido.
      // É a terceira vez que esta armadilha morde (marquee, pin, arraste).
      const dragCleanups: Array<() => void> = [];
      const progressCleanups: Array<() => void> = [];
      const cursorCleanups: Array<() => void> = [];

      const setupRails = () => {
        // ── Arrastar com o mouse nos trilhos horizontais ──
        for (const rail of document.querySelectorAll<HTMLElement>("[data-rail-drag]")) {
          // Trilho conduzido pelo scroll não recebe arraste: durante o pin a
          // seção vira `position: fixed` com transform, e o `setPointerCapture`
          // perde a referência de coordenadas — o arraste não chegava a
          // escrever no `scrollLeft`. Quem conduz ali é o scroll da página.
          if (rail.hasAttribute("data-rail-pin")) continue;

          let down = false;
          let startX = 0;
          let startScroll = 0;
          let moved = false;

          // Pointer capture mantém os eventos no próprio trilho: sem
          // listeners globais de pointermove disputando a cada movimento.
          const onDown = (event: PointerEvent) => {
            if (event.pointerType !== "mouse" || event.button !== 0) return;
            // Sem isto o navegador inicia a seleção de texto (ou o drag nativo
            // da imagem) e fica com o gesto: o ponteiro se move, mas o
            // `scrollLeft` não. Era o motivo de o arraste não funcionar no
            // desktop — e o Playwright não reproduz, porque o mouse sintético
            // não dispara nem seleção nem drag nativo.
            event.preventDefault();
            down = true;
            moved = false;
            startX = event.clientX;
            startScroll = rail.scrollLeft;
            rail.style.cursor = "grabbing";
            rail.setPointerCapture(event.pointerId);
          };
          // Cinto e suspensório: mesmo com o preventDefault acima, uma imagem
          // dentro do card pode iniciar o drag nativo.
          const onDragStart = (event: Event) => {
            if (down) event.preventDefault();
          };
          const onMove = (event: PointerEvent) => {
            if (!down) return;
            const delta = event.clientX - startX;
            if (Math.abs(delta) > 3) moved = true;
            rail.scrollLeft = startScroll - delta;
          };
          const onUp = (event: PointerEvent) => {
            if (!down) return;
            down = false;
            rail.style.cursor = "";
            if (rail.hasPointerCapture(event.pointerId)) {
              rail.releasePointerCapture(event.pointerId);
            }
          };
          // Impede que o arraste dispare o link ao soltar.
          const onClick = (event: MouseEvent) => {
            if (moved) {
              event.preventDefault();
              event.stopPropagation();
            }
          };

          rail.addEventListener("pointerdown", onDown);
          rail.addEventListener("pointermove", onMove);
          rail.addEventListener("pointerup", onUp);
          rail.addEventListener("pointercancel", onUp);
          rail.addEventListener("click", onClick, true);
          rail.addEventListener("dragstart", onDragStart);

          dragCleanups.push(() => {
            rail.removeEventListener("pointerdown", onDown);
            rail.removeEventListener("pointermove", onMove);
            rail.removeEventListener("pointerup", onUp);
            rail.removeEventListener("pointercancel", onUp);
            rail.removeEventListener("click", onClick, true);
            rail.removeEventListener("dragstart", onDragStart);
          });
        }

        // ── Barra de progresso dos trilhos ──
        for (const rail of document.querySelectorAll<HTMLElement>("[data-rail-progress]")) {
          // O trilho com pin também entra aqui, e de propósito: abaixo de
          // 1024px o pin não existe e ele rola nativamente, então precisa
          // desta barra. No desktop ele fica com `overflow: hidden` e nunca
          // emite `scroll`, então este listener não dispara e quem escreve a
          // barra é o `onUpdate` do ScrollTrigger. Os dois não se atropelam.

          const key = rail.dataset.railProgress;
          const bar = document.querySelector<HTMLElement>(`[data-rail-progress-for="${key}"]`);
          if (!bar) continue;

          const span = bar.firstElementChild as HTMLElement | null;
          let frame = 0;

          // Ler scrollWidth/clientWidth força reflow. Agrupar tudo em um
          // rAF por frame evita o loop leitura-escrita que trava o scroll.
          const update = () => {
            frame = 0;
            const total = rail.scrollWidth;
            const view = rail.clientWidth;
            const max = total - view;
            if (max <= 1) {
              bar.style.setProperty("--rail-progress", "100%");
              if (span) span.style.left = "0%";
              return;
            }
            const widthPct = Math.max((view / total) * 100, 8);
            bar.style.setProperty("--rail-progress", `${widthPct}%`);
            if (span) span.style.left = `${(rail.scrollLeft / max) * (100 - widthPct)}%`;
          };

          const schedule = () => {
            if (frame) return;
            frame = requestAnimationFrame(update);
          };

          rail.addEventListener("scroll", schedule, { passive: true });
          window.addEventListener("resize", schedule);
          update();

          progressCleanups.push(() => {
            if (frame) cancelAnimationFrame(frame);
            rail.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
          });
        }

        // ── Cursor customizado dentro de áreas marcadas (desktop apenas) ──
        const fine = window.matchMedia("(pointer: fine)").matches;
        if (fine) {
          for (const area of document.querySelectorAll<HTMLElement>("[data-cursor-area]")) {
            const dot = document.createElement("span");
            dot.className = "cursor-dot";
            dot.setAttribute("aria-hidden", "true");
            dot.textContent = area.dataset.cursorArea || "arraste";
            // Anexado ao body, não à área: um elemento posicionado dentro de
            // um container com overflow aumenta a área rolável dele.
            document.body.append(dot);

            gsap.set(dot, { xPercent: -50, yPercent: -50, scale: 0.6 });
            const setX = gsap.quickTo(dot, "x", { duration: 0.3, ease: "power3" });
            const setY = gsap.quickTo(dot, "y", { duration: 0.3, ease: "power3" });

            const onEnter = (event: PointerEvent) => {
              // Posiciona antes de aparecer, senão surge vindo do canto.
              gsap.set(dot, { x: event.clientX, y: event.clientY });
              gsap.to(dot, { opacity: 1, scale: 1, duration: 0.22 });
            };
            const onLeave = () => gsap.to(dot, { opacity: 0, scale: 0.6, duration: 0.22 });
            // position: fixed usa coordenadas da viewport diretamente.
            const onMove = (event: PointerEvent) => {
              setX(event.clientX);
              setY(event.clientY);
            };

            area.addEventListener("pointerenter", onEnter);
            area.addEventListener("pointerleave", onLeave);
            area.addEventListener("pointermove", onMove);

            cursorCleanups.push(() => {
              area.removeEventListener("pointerenter", onEnter);
              area.removeEventListener("pointerleave", onLeave);
              area.removeEventListener("pointermove", onMove);
              dot.remove();
            });
          }
        }
      };

      if (prefersReduced) {
        // Sem animações de ENTRADA (o conteúdo já está visível porque
        // .anim-ready nunca é aplicada), mas tudo que é NAVEGAÇÃO roda:
        // pin, arraste, barra de progresso e cursor.
        setupPinnedRails();
        setupRails();

        cleanup = () => {
          for (const [el, handler] of anchorHandlers) el.removeEventListener("click", handler);
          mm.revert();
          for (const fn of dragCleanups) fn();
          for (const fn of progressCleanups) fn();
          for (const fn of cursorCleanups) fn();
          for (const trigger of ScrollTrigger.getAll()) trigger.kill();
          gsap.ticker.remove(ticker);
          lenis.destroy();
        };
        return;
      }

      setupPinnedRails();
      setupRails();

      // A partir daqui o JS controla a visibilidade.
      document.documentElement.classList.add("anim-ready");

      const enter = { start: "top 88%", toggleActions: "play none none none" } as const;

      for (const el of gsap.utils.toArray<Element>("[data-animate]")) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, ...enter },
          },
        );
      }

      for (const el of gsap.utils.toArray<Element>("[data-animate-left]")) {
        gsap.fromTo(
          el,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, ...enter },
          },
        );
      }

      for (const el of gsap.utils.toArray<Element>("[data-animate-right]")) {
        gsap.fromTo(
          el,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, ...enter },
          },
        );
      }

      for (const el of gsap.utils.toArray<Element>("[data-animate-scale]")) {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, ...enter },
          },
        );
      }

      for (const group of gsap.utils.toArray<Element>("[data-animate-group]")) {
        const children = group.querySelectorAll("[data-animate-item]");
        if (!children.length) continue;
        gsap.fromTo(
          children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: { trigger: group, ...enter },
          },
        );
      }

      // ── Scrollytelling: revela o texto linha a linha conforme o scroll ──
      for (const el of gsap.utils.toArray<HTMLElement>("[data-reveal-lines]")) {
        const words = (el.textContent ?? "").trim().split(/\s+/);
        if (words.length < 2) continue;

        // Sem will-change aqui: uma camada de composição por palavra
        // sobrecarrega a GPU e trava o scroll.
        el.textContent = "";
        const spans = words.map((word) => {
          const span = document.createElement("span");
          span.textContent = word;
          span.style.display = "inline-block";
          el.append(span, document.createTextNode(" "));
          return span;
        });

        gsap.fromTo(
          spans,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.4,
            scrollTrigger: {
              trigger: el,
              start: "top 78%",
              end: "bottom 55%",
              scrub: 0.6,
            },
          },
        );
      }

      for (const el of gsap.utils.toArray<HTMLElement>("[data-counter]")) {
        const target = Number.parseFloat(el.dataset.counter ?? "0");
        const isInteger = Number.isInteger(target);
        const obj = { value: 0 };

        gsap.to(obj, {
          value: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, ...enter },
          onUpdate() {
            const current = isInteger
              ? Math.round(obj.value)
              : Number.parseFloat(obj.value.toFixed(1));
            el.textContent = current > 999 ? current.toLocaleString("pt-BR") : String(current);
          },
        });
      }

      for (const el of gsap.utils.toArray<HTMLElement>("[data-parallax]")) {
        const factor = Number.parseFloat(el.dataset.parallax ?? "0.2");
        const distance = window.innerHeight * factor;
        gsap.fromTo(
          el,
          { y: -distance / 2 },
          {
            y: distance / 2,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }

      // Recalcula posições quando imagens e fontes terminam de carregar,
      // senão os triggers do fim da página ficam deslocados.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);
      ScrollTrigger.refresh();

      cleanup = () => {
        for (const [el, handler] of anchorHandlers) el.removeEventListener("click", handler);
        // Desfaz o pin e devolve o trilho ao estado original.
        mm.revert();
        for (const fn of dragCleanups) fn();
        for (const fn of progressCleanups) fn();
        for (const fn of cursorCleanups) fn();
        window.removeEventListener("load", refresh);
        for (const trigger of ScrollTrigger.getAll()) trigger.kill();
        gsap.ticker.remove(ticker);
        lenis.destroy();
        document.documentElement.classList.remove("anim-ready");
      };
    })();

    return () => cleanup?.();
  }, []);

  return null;
}
