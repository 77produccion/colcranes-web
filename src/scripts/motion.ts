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
  const figures = Array.from(explorer.querySelectorAll<HTMLElement>(".stage__fig"));
  const families = Array.from(explorer.querySelectorAll<HTMLElement>(".family"));
  const marker = explorer.querySelector<HTMLElement>("[data-marker]");

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
    inputs[index].checked = true;
    families.forEach((fam, i) => {
      const isActive = i === index;
      fam.classList.toggle("is-active", isActive);
      const fig = fam.querySelector<HTMLElement>(".stage__fig");
      if (fig) fig.classList.toggle("is-active", isActive);
    });
    moveMarker(index, animate);

    if (!animate) return;

    const activeFam = families[index];
    const active = activeFam ? activeFam.querySelector<HTMLElement>(".stage__fig") : null;
    if (!active) return;
    gsap.fromTo(
      active,
      { y: 26, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", clearProps: "transform,opacity" }
    );
    gsap.fromTo(
      active.querySelectorAll(".note"),
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.45, delay: 0.18, stagger: 0.06, ease: "power2.out" }
    );
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
