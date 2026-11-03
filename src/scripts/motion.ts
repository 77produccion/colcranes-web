/**
 * COLCRANES — Gramática de movimiento.
 *
 * Principios:
 *  - Elevación: titulares emergen desde una máscara, como una carga izada.
 *  - Translación: un carro amarillo se desplaza a lo largo de un riel.
 *  - Recorrido: trazado progresivo de líneas de sistema.
 *  - Revelado técnico: anotaciones que aparecen tras su línea guía.
 *
 * Reglas:
 *  - Nada depende de CSS `opacity: 0`: si JS falla el contenido permanece visible.
 *  - Las preferencias de movimiento reducido no desactivan animaciones.
 *  - Todo vive dentro de gsap.matchMedia() y se limpia con revert().
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;

function setupBrandMotion() {
  const links = Array.from(document.querySelectorAll<HTMLElement>(".brands__link"));
  links.forEach((link) => {
    const enter = () => gsap.to(link, { scale: 1.08, duration: 0.48, ease: "power3.out", overwrite: "auto" });
    const leave = () => gsap.to(link, { scale: 1, duration: 0.62, ease: "power3.out", overwrite: "auto" });
    link.addEventListener("mouseenter", enter);
    link.addEventListener("mouseleave", leave);
    link.addEventListener("focus", enter);
    link.addEventListener("blur", leave);
  });
}

function setupHeroSlides() {
  const images = Array.from(document.querySelectorAll<HTMLImageElement>("[data-hero-slide]"));
  if (images.length < 2) return;
  let active = 0;
  images.forEach((image, index) => gsap.set(image, { autoAlpha: index === 0 ? 1 : 0, scale: index === 0 ? 1 : 1.06 }));
  const timer = window.setInterval(() => {
    const next = (active + 1) % images.length;
    gsap.to(images[active], { autoAlpha: 0, duration: 1.1, ease: "power2.inOut" });
    gsap.fromTo(images[next], { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 1.45, ease: "power2.inOut", overwrite: "auto" });
    active = next;
  }, 3000);
  return () => window.clearInterval(timer);
}

function setupQuoteDrawer() {
  const drawer = document.querySelector<HTMLElement>("[data-quote-drawer]");
  const panel = drawer?.querySelector<HTMLElement>(".quote-drawer__panel");
  const scrim = drawer?.querySelector<HTMLElement>(".quote-drawer__scrim");
  const openButtons = document.querySelectorAll<HTMLElement>("[data-quote-open], .header-cta, .mobile-drawer a[href='#cotizar']");
  if (!drawer || !panel) return;
  let previousFocus: HTMLElement | null = null;
  const close = () => {
    if (drawer.getAttribute("aria-hidden") === "true") return;
    gsap.to(panel, { x: "100%", duration: 0.5, ease: "power3.in", onComplete: () => {
      drawer.setAttribute("aria-hidden", "true");
      drawer.inert = true;
      drawer.style.display = "none";
      document.body.classList.remove("quote-open");
      previousFocus?.focus();
    } });
    if (scrim) gsap.to(scrim, { autoAlpha: 0, duration: 0.35 });
  };
  const open = () => {
    previousFocus = document.activeElement as HTMLElement;
    drawer.inert = false;
    drawer.style.display = "block";
    drawer.style.visibility = "visible";
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("quote-open");
    gsap.fromTo(panel, { x: "100%" }, { x: "0%", duration: 0.68, ease: "power3.out", overwrite: true, onComplete: () => panel.focus() });
    if (scrim) gsap.fromTo(scrim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, overwrite: true });
  };
  openButtons.forEach((button) => button.addEventListener("click", (event) => { event.preventDefault(); open(); }));
  document.querySelectorAll<HTMLAnchorElement>("a[href='#cotizar']").forEach((link) => {
    link.addEventListener("click", (event) => { event.preventDefault(); open(); });
  });
  if (window.location.hash === "#cotizar") open();
  drawer.querySelectorAll("[data-quote-close]").forEach((button) => button.addEventListener("click", close));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
}

function setupQuoteContacts() {
  const accordion = document.querySelector<HTMLDetailsElement>(".quote-contacts__accordion");
  const summary = accordion?.querySelector<HTMLElement>("summary");
  const content = accordion?.querySelector<HTMLElement>(".quote-contacts__details");
  if (!accordion || !summary || !content) return;
  gsap.set(content, { height: 0, autoAlpha: 0, overflow: "hidden" });
  summary.addEventListener("click", (event) => {
    event.preventDefault();
    const opening = !accordion.open;
    accordion.open = opening;
    summary.setAttribute("aria-expanded", String(opening));
    gsap.killTweensOf(content);
    if (opening) {
      gsap.to(content, { height: "auto", autoAlpha: 1, duration: 0.48, ease: "power3.out", onComplete: () => gsap.set(content, { clearProps: "height,overflow" }) });
    } else {
      gsap.set(content, { height: content.scrollHeight, overflow: "hidden" });
      gsap.to(content, { height: 0, autoAlpha: 0, duration: 0.38, ease: "power2.inOut" });
    }
  });
}

function setupExplorer() {
  const explorer = document.querySelector<HTMLElement>("[data-explorer]");
  if (!explorer) return;

  const inputs = Array.from(explorer.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
  const rows = Array.from(explorer.querySelectorAll<HTMLElement>(".index-row"));
  const families = Array.from(explorer.querySelectorAll<HTMLElement>(".family"));
  const marker = explorer.querySelector<HTMLElement>("[data-marker]");
  let activeIndex = -1;
  let transition: gsap.core.Timeline | undefined;
  let outgoingImage: HTMLElement | undefined;

  const moveMarker = (index: number, animate = true) => {
    const row = rows[index];
    if (!marker || !row) return;
    const y = row.offsetTop + (row.offsetHeight - marker.offsetHeight) / 2;
    if (animate) {
      gsap.to(marker, { y, duration: 0.55, ease: "power3.out" });
    } else {
      gsap.set(marker, { y });
    }
  };

  const activate = (index: number, animate = true) => {
    if (index === activeIndex) return;
    const previousIndex = activeIndex;
    const previous = families[previousIndex];
    const next = families[index];
    const direction = index > previousIndex ? 1 : -1;
    transition?.kill();
    outgoingImage?.remove();
    outgoingImage = undefined;
    activeIndex = index;
    inputs[index].checked = true;
    families.forEach((fam, i) => {
      const isActive = i === index;
      fam.classList.toggle("is-active", isActive);
      fam.inert = !isActive;
      fam.setAttribute("aria-hidden", String(!isActive));
      gsap.set(fam.querySelectorAll(".stage__fig, .stage__foot, .note"), {
        clearProps: "transform,opacity,visibility",
      });
    });
    moveMarker(index, animate);

    if (!animate || !previous) return;

    const incomingMedia = next.querySelector<HTMLElement>(".stage__media");
    const previousFigure = previous.querySelector<HTMLElement>(".stage__fig");
    const incomingFigure = next.querySelector<HTMLElement>(".stage__fig");
    const incomingText = next.querySelector<HTMLElement>(".stage__foot");
    if (!incomingMedia || !previousFigure || !incomingFigure || !incomingText) return;
    const incomingNotes = Array.from(incomingFigure.querySelectorAll<HTMLElement>(".note"));
    const incomingCopy = [incomingText, ...incomingNotes];
    // Hide copy immediately, including when a previous transition was interrupted.
    gsap.set(incomingCopy, { autoAlpha: 0 });

    // Keep the viewport and its background stationary. Only the two figures
    // move, so an opaque outgoing panel cannot hide the incoming product.
    const figureBounds = previousFigure.getBoundingClientRect();
    const mediaBounds = incomingMedia.getBoundingClientRect();
    const outgoing = previousFigure.cloneNode(true) as HTMLElement;
    gsap.set(outgoing.querySelectorAll(".note"), { autoAlpha: 0 });
    outgoing.setAttribute("aria-hidden", "true");
    Object.assign(outgoing.style, {
      position: "absolute",
      left: `${figureBounds.left - mediaBounds.left}px`,
      top: `${figureBounds.top - mediaBounds.top}px`,
      width: `${figureBounds.width}px`,
      height: `${figureBounds.height}px`,
      margin: "0",
      zIndex: "2",
      visibility: "visible",
      pointerEvents: "none",
    });
    incomingMedia.append(outgoing);
    outgoingImage = outgoing;
    const travel = incomingMedia.clientHeight;

    transition = gsap.timeline({
      defaults: { duration: 0.95, ease: "power2.inOut" },
      onComplete: () => {
        outgoing.remove();
        outgoingImage = undefined;
        gsap.set([incomingFigure, ...incomingCopy], {
          clearProps: "transform,opacity,visibility",
        });
      },
    });
    transition
      .to(outgoing, { y: -travel * direction }, 0)
      .fromTo(incomingFigure, { y: travel * direction }, { y: 0 }, 0)
      .to(incomingCopy, { autoAlpha: 1, duration: 0.45, ease: "power2.out" });
  };

  inputs.forEach((input, index) => {
    input.addEventListener("change", () => {
      if (input.checked) activate(index);
    });
  });

  rows.forEach((row, index) => {
    row.addEventListener("mouseenter", () => {
      if (!inputs[index].checked) moveMarker(index);
    });
    row.addEventListener("mouseleave", () => {
      const checked = inputs.findIndex((i) => i.checked);
      moveMarker(checked < 0 ? 0 : checked);
    });
  });

  const checked = inputs.findIndex((i) => i.checked);
  activate(checked < 0 ? 0 : checked, false);
}

/* La interacción del ciclo de vida no es movimiento: seleccionar una etapa
   debe funcionar aunque el sistema pida movimiento reducido. Antes vivía
   dentro del bloque de animación y, con esa preferencia activa, las siete
   etapas quedaban marcadas como activas y ningún botón respondía. */
function setupLifecycle() {
  const rail = document.querySelector<HTMLElement>("[data-rail]");
  if (!rail) return;

  const stops = Array.from(rail.querySelectorAll<HTMLElement>(".stop"));

  const setActive = (el: HTMLElement) => {
    stops.forEach((s) => {
      const on = s === el;
      s.classList.toggle("is-active", on);
      s.querySelector(".stop__toggle")?.setAttribute("aria-pressed", String(on));
    });
  };

  stops.forEach((stop) => {
    const toggle = stop.querySelector<HTMLButtonElement>(".stop__toggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => setActive(stop));
    toggle.addEventListener("focus", () => setActive(stop));
    stop.addEventListener("mouseenter", () => setActive(stop));
  });

  const current = stops.findIndex((s) => s.classList.contains("is-active"));
  if (stops.length) setActive(stops[current < 0 ? 0 : current]);
}

/* Sólo el trazado de la línea y el revelado de las etapas. */
function animateLifecycle() {
  const rail = document.querySelector<HTMLElement>("[data-rail]");
  if (!rail) return;

  const nodeLine = rail.querySelector<HTMLElement>("[data-rail-line]");
  const stops = Array.from(rail.querySelectorAll<HTMLElement>(".stop"));
  if (!nodeLine) return;

  gsap.to(nodeLine, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: rail,
      start: "top 78%",
      end: "top 32%",
      scrub: 0.6,
    },
  });

  /* immediateRender:false — el contenido nunca queda oculto si el trigger no dispara. */
  gsap.fromTo(
    stops,
    { y: 22, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.06,
      ease: "power2.out",
      immediateRender: false,
      clearProps: "transform,opacity",
      scrollTrigger: { trigger: rail, start: "top 82%", once: true },
    }
  );
}

function setupGenericReveals() {
  const groups = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal-group]"));
  groups.forEach((group) => {
    const items = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!items.length) return;
    gsap.fromTo(
      items,
      { y: 26, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.07,
        ease: "power2.out",
        immediateRender: false,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: group, start: "top 84%", once: true },
      }
    );
  });

  const singles = Array.from(
    document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-group] [data-reveal])")
  );
  singles.forEach((el) => {
    gsap.fromTo(
      el,
      { y: 26, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: "power2.out",
        immediateRender: false,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }
    );
  });
}

/* Conteo animado de las cifras: conserva prefijo/sufijo (+ y %) y la
   tipografía original; sólo cambia el número mientras entra en pantalla. */
function setupHeroPlaylist() {
  const container = document.querySelector<HTMLElement>("[data-hero-videos]");
  const playlist = document.querySelector<HTMLElement>("[data-hero-playlist]");
  if (!container || !playlist) return;

  const videos = Array.from(container.querySelectorAll<HTMLVideoElement>("video"));
  const items = Array.from(playlist.querySelectorAll<HTMLLIElement>("li"))
    .map((li) => ({
      src: li.dataset.src ?? "",
      position: li.dataset.position ?? "50% 50%",
    }))
    .filter((item) => item.src);

  if (videos.length < 2 || !items.length) return;

  let activeSlot = 0;
  let currentIndex = 0;

  const load = (video: HTMLVideoElement, index: number) => {
    const item = items[index];
    video.preload = "auto";
    video.style.objectPosition = item.position;
    video.src = item.src;
    video.load();
  };

  const start = (video: HTMLVideoElement) => {
    video.play()?.catch(() => {});
  };

  load(videos[0], 0);
  videos[0].addEventListener("canplay", () => start(videos[0]), { once: true });
  load(videos[1], 1);

  const advance = () => {
    const from = videos[activeSlot];
    const to = videos[1 - activeSlot];
    const nextIndex = (currentIndex + 1) % items.length;

    const swap = () => {
      start(to);
      to.classList.add("is-active");
      from.classList.remove("is-active");

      activeSlot = 1 - activeSlot;
      currentIndex = nextIndex;

      /* Espera al fundido antes de liberar el slot anterior y usarlo para
         dejar cargando el clip que seguirá al que acaba de entrar. */
      window.setTimeout(() => {
        from.pause();
        from.removeAttribute("src");
        from.load();
        load(videos[1 - activeSlot], (currentIndex + 1) % items.length);
      }, 1100);
    };

    if (to.readyState >= 3) swap();
    else to.addEventListener("canplay", swap, { once: true });
  };

  videos.forEach((video) => {
    video.addEventListener("ended", () => {
      if (video === videos[activeSlot]) advance();
    });
  });
}

/* Fondo rotativo de la sección "Ingeniería y fabricación": crossfade con
   zoom lento cada 3 s, siempre activo (sin condicionarlo a reduced motion). */
function setupCapacitySlides() {
  const root = document.querySelector<HTMLElement>("[data-capacity-slides]");
  if (!root) return;

  const layers = Array.from(root.querySelectorAll<HTMLImageElement>("img"));
  let sources: string[] = [];
  try {
    sources = JSON.parse(root.dataset.sources ?? "[]");
  } catch {
    return;
  }
  if (layers.length < 2 || sources.length < 2) return;

  let index = 0;
  let active = 0;

  const preload = (src: string) => {
    const image = new Image();
    image.src = src;
  };

  preload(sources[1]);

  const advance = () => {
    const nextIndex = (index + 1) % sources.length;
    const prev = layers[active];
    const next = layers[1 - active];

    const swap = () => {
      next.classList.add("is-active");
      gsap.set(next, { zIndex: 2, opacity: 0, scale: 1.06 });
      gsap.set(prev, { zIndex: 1 });
      gsap.to(next, {
        opacity: 1,
        scale: 1,
        duration: 3.2,
        ease: "power1.out",
        overwrite: true,
      });
      gsap.to(prev, {
        opacity: 0,
        duration: 1.15,
        ease: "power2.inOut",
        overwrite: true,
      });
      window.setTimeout(() => prev.classList.remove("is-active"), 1200);

      active = 1 - active;
      index = nextIndex;
      preload(sources[(index + 1) % sources.length]);
    };

    if (next.complete && next.src === new URL(sources[nextIndex], window.location.href).href) {
      swap();
    } else {
      next.onload = () => {
        next.onload = null;
        swap();
      };
      next.src = sources[nextIndex];
    }
  };

  window.setInterval(advance, 3000);
}

/* Aliado operativo: la imagen de fondo y la fila activa cambian juntas. */
function setupAlliance() {
  const section = document.querySelector<HTMLElement>("[data-alliance]");
  if (!section) return;

  const items = Array.from(section.querySelectorAll<HTMLButtonElement>("[data-alliance-item]"));
  const images = Array.from(section.querySelectorAll<HTMLImageElement>(".alliance__img"));
  const railFill = section.querySelector<HTMLElement>("[data-alliance-rail]");
  if (!items.length || !images.length) return;

  let active = 0;
  let timer: number | undefined;

  const moveRail = (index: number) => {
    const item = items[index];
    const title = item?.querySelector<HTMLElement>(".alliance__title");
    const railParent = railFill?.parentElement;
    if (!railFill || !title || !railParent) return;
    const base = railParent.getBoundingClientRect();
    const target = title.getBoundingClientRect();
    gsap.to(railFill, {
      y: target.top - base.top,
      height: target.height,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
    });
  };

  const activate = (index: number) => {
    active = index;
    items.forEach((item, i) => {
      const on = i === index;
      item.classList.toggle("is-active", on);
      item.setAttribute("aria-pressed", String(on));
    });
    images.forEach((image, i) => image.classList.toggle("is-active", i === index));
    moveRail(index);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = undefined;
  };

  const start = () => {
    stop();
    timer = window.setInterval(() => activate((active + 1) % items.length), 5200);
  };

  items.forEach((item, index) => {
    item.addEventListener("mouseenter", () => activate(index));
    item.addEventListener("focus", () => activate(index));
    item.addEventListener("click", () => activate(index));
  });

  section.addEventListener("mouseenter", stop);
  section.addEventListener("mouseleave", start);
  section.addEventListener("focusin", stop);
  section.addEventListener("focusout", (event) => {
    if (!section.contains(event.relatedTarget as Node)) start();
  });

  window.addEventListener("resize", () => moveRail(active));
  activate(0);
  start();
}

/* Botón flotante de WhatsApp: abre un selector de línea de atención y deja
   eventos de seguimiento en dataLayer / gtag. */
function setupWhatsAppWidget() {
  const widget = document.querySelector<HTMLElement>("[data-wa]");
  const modal = widget?.querySelector<HTMLElement>("[data-wa-modal]");
  const openButton = widget?.querySelector<HTMLButtonElement>("[data-wa-open]");
  const panel = modal?.querySelector<HTMLElement>(".wa-modal__panel");
  const scrim = modal?.querySelector<HTMLElement>(".wa-modal__scrim");
  const closeButton = modal?.querySelector<HTMLButtonElement>(".wa-modal__close");
  if (!widget || !modal || !openButton || !panel) return;

  let lastFocus: HTMLElement | null = null;
  let closing = false;

  const track = (event: string, detail: Record<string, string> = {}) => {
    const w = window as unknown as {
      dataLayer?: Array<Record<string, unknown>>;
      gtag?: (...args: unknown[]) => void;
    };
    w.dataLayer?.push({ event, ...detail });
    w.gtag?.("event", event, detail);
  };

  const open = () => {
    if (!modal.hidden) return;
    lastFocus = document.activeElement as HTMLElement;
    modal.hidden = false;
    document.body.classList.add("wa-open");
    openButton.setAttribute("aria-expanded", "true");
    gsap.fromTo(panel, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" });
    if (scrim) gsap.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
    window.setTimeout(() => (closeButton ?? panel.querySelector<HTMLElement>("a, button"))?.focus(), 60);
    track("whatsapp_open");
  };

  const close = () => {
    if (modal.hidden || closing) return;
    closing = true;
    openButton.setAttribute("aria-expanded", "false");
    gsap.to(panel, { y: 14, opacity: 0, duration: 0.22, ease: "power2.in" });
    if (scrim) gsap.to(scrim, { opacity: 0, duration: 0.2 });
    window.setTimeout(() => {
      modal.hidden = true;
      document.body.classList.remove("wa-open");
      closing = false;
      lastFocus?.focus();
    }, 230);
  };

  openButton.addEventListener("click", open);
  modal.querySelectorAll<HTMLElement>("[data-wa-close]").forEach((el) => el.addEventListener("click", close));

  modal.querySelectorAll<HTMLAnchorElement>("[data-wa-line]").forEach((link) => {
    link.addEventListener("click", () => {
      track("whatsapp_lead", { line: link.dataset.waLine ?? "" });
      window.setTimeout(close, 180);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = Array.from(
      modal.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

/* Ajusta el zoom del visor PDF al ancho disponible para que la página llene
   el marco y el contenido se pueda recorrer con scroll vertical. */
function setupCatalogViewer() {
  const iframe = document.querySelector<HTMLIFrameElement>("[data-catalog-viewer]");
  const base = iframe?.dataset.src;
  if (!iframe || !base) return;

  let current = 0;
  let resizeTimer: number | undefined;

  const fit = () => {
    const width = iframe.clientWidth;
    if (!width) return;
    const zoom = Math.max(30, Math.min(120, Math.round(width / 9.5)));
    if (Math.abs(zoom - current) < 3) return;
    current = zoom;
    iframe.src = `${base}#page=1&zoom=${zoom},0,0&toolbar=0&navpanes=0`;
  };

  const start = () => {
    fit();
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(fit, 260);
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          start();
        }
      },
      { rootMargin: "500px" }
    );
    observer.observe(iframe);
  } else {
    start();
  }
}

function setupStatCounters() {
  const values = Array.from(document.querySelectorAll<HTMLElement>(".stat-card__value"));
  values.forEach((el) => {
    const original = el.textContent?.trim() ?? "";
    const match = original.match(/^([^\d]*)(\d+)([^\d]*)$/);
    if (!match) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits);
    if (!Number.isFinite(target)) return;
    const counter = { value: 0 };
    const render = () => {
      el.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
    };
    render();
    gsap.to(counter, {
      value: target,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: render,
      onComplete: () => {
        el.textContent = original;
      },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
}

function setupHeader() {
  const header = document.querySelector<HTMLElement>("[data-header]");
  const sentinel = document.querySelector<HTMLElement>("[data-header-sentinel]");
  const drawer = document.querySelector<HTMLElement>("[data-drawer]");
  const toggle = document.querySelector<HTMLButtonElement>("[data-drawer-toggle]");

  if (header && sentinel && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => header.classList.toggle("is-solid", !entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
  }

  if (drawer && toggle) {
    const setOpen = (open: boolean) => {
      drawer.dataset.open = String(open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector("[data-drawer-label]")!.textContent = open ? "Cerrar" : "Menú";
    };
    toggle.addEventListener("click", () => setOpen(drawer.dataset.open !== "true"));
    drawer.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => setOpen(false))
    );
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }
}

function run() {
  root.classList.add("js");
  setupHeader();
  setupExplorer();
  setupLifecycle();
  setupBrandMotion();
  setupQuoteDrawer();
  setupQuoteContacts();
  setupHeroSlides();
  setupHeroPlaylist();
  setupCapacitySlides();
  setupAlliance();
  setupWhatsAppWidget();
  setupCatalogViewer();
  setupStatCounters();

  const mm = gsap.matchMedia();

  mm.add("all", () => {
    /* --- Portada: revelado por elevación --- */
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (hero) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-hero-media] img",
        { scale: 1.07 },
        { scale: 1, duration: 1.6, ease: "power2.out" },
        0
      )
        .fromTo(
          "[data-hero-line] > span",
          { yPercent: 108 },
          { yPercent: 0, duration: 1, stagger: 0.1 },
          0.15
        )
        .fromTo(
          "[data-hero-fade]",
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.09,
            clearProps: "transform,opacity",
          },
          0.7
        );
    }

    animateLifecycle();
    setupGenericReveals();

    /* --- Paralaje contenido de la portada --- */
    const heroMedia = document.querySelector<HTMLElement>("[data-hero-media]");
    if (heroMedia) {
      gsap.to(heroMedia, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    ScrollTrigger.refresh();
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", run, { once: true });
} else {
  run();
}
