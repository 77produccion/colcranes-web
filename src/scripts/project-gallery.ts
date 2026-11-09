import { gsap } from "gsap";

/** Inercia táctil nativa y desplazamiento animado al elegir una fotografía. */
export function setupProjectGalleries() {
  document.querySelectorAll<HTMLElement>("[data-project-record]").forEach((root) => {
    const gallery = root.querySelector<HTMLElement>("[data-project-gallery]")!;
    if (gallery.dataset.ready) return;
    gallery.dataset.ready = "true";
    const dots = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-project-dot]"));
    if (!dots.length) return;
    const dotStrip = root.querySelector<HTMLElement>(".project-record__dots")!;
    const descriptions = Array.from(root.querySelectorAll<HTMLElement>("[data-project-description]"));
    const figures = Array.from(gallery.querySelectorAll<HTMLElement>("figure"));
    const status = root.querySelector<HTMLElement>("[data-project-status]")!;
    let current = 0;
    let frame = 0;
    let drag: { id: number; x: number; left: number } | null = null;
    let motion: gsap.core.Tween | undefined;
    const update = () => {
      frame = 0;
      const index = Math.max(0, Math.min(dots.length - 1, Math.round(gallery.scrollLeft / gallery.clientWidth)));
      if (index === current) return;
      current = index;
      dots.forEach((dot, candidate) => dot.setAttribute("aria-current", String(candidate === index)));
      descriptions.forEach((description, candidate) => {
        description.classList.toggle("is-active", candidate === index);
        description.setAttribute("aria-hidden", String(candidate !== index));
      });
      const activeDot = dots[index];
      dotStrip.scrollTo({ left: activeDot.offsetLeft - (dotStrip.clientWidth - activeDot.offsetWidth) / 2, behavior: "smooth" });
      status.textContent = `Fotografía ${index + 1} de ${dots.length}. ${dots[index].getAttribute("aria-label")?.replace(/^Ver fotografía \d+: /, "")}`;
    };
    const go = (index: number) => {
      const target = Math.max(0, Math.min(dots.length - 1, index));
      motion?.kill();
      // El snap nativo puede convertir cada fotograma en un salto de imagen.
      gallery.classList.add("is-animating");
      gallery.classList.remove("is-dragging");
      motion = gsap.to(gallery, {
        scrollLeft: target * gallery.clientWidth,
        duration: 0.7,
        ease: "power2.inOut",
        overwrite: true,
        onComplete: () => {
          motion = undefined;
          gallery.classList.remove("is-animating");
          update();
        },
      });
    };
    dots.forEach((dot, index) => dot.addEventListener("click", () => go(index)));
    gallery.addEventListener("scroll", () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
    gallery.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      go(event.key === "Home" ? 0 : event.key === "End" ? dots.length - 1 : current + (event.key === "ArrowRight" ? 1 : -1));
    });
    gallery.addEventListener("pointerdown", (event) => {
      // El touch conserva desplazamiento e inercia nativos y no bloquea el scroll vertical.
      motion?.kill();
      motion = undefined;
      if (event.pointerType !== "mouse" || event.button !== 0) {
        gallery.classList.remove("is-animating");
        return;
      }
      gallery.classList.add("is-dragging");
      gallery.classList.remove("is-animating");
      gallery.scrollTo({ left: gallery.scrollLeft, behavior: "instant" });
      drag = { id: event.pointerId, x: event.clientX, left: gallery.scrollLeft };
      gallery.setPointerCapture(event.pointerId);
    });
    gallery.addEventListener("pointermove", (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const delta = event.clientX - drag.x;
      gallery.scrollLeft = drag.left - delta;
    });
    const release = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const previousDrag = drag;
      drag = null;
      const width = gallery.clientWidth;
      const delta = gallery.scrollLeft - previousDrag.left;
      const index = Math.abs(delta) > Math.min(70, width * 0.15)
        ? Math.round(previousDrag.left / width) + Math.sign(delta)
        : Math.round(previousDrag.left / width);
      // Mantener el snap desactivado hasta iniciar el ajuste suave evita un salto previo.
      go(index);
      if (gallery.hasPointerCapture(event.pointerId)) gallery.releasePointerCapture(event.pointerId);
    };
    gallery.addEventListener("pointerup", release);
    gallery.addEventListener("pointercancel", release);
    gallery.addEventListener("lostpointercapture", release);
    let width = gallery.clientWidth;
    new ResizeObserver(() => {
      if (gallery.clientWidth === width) return;
      motion?.kill();
      motion = undefined;
      width = gallery.clientWidth;
      gallery.scrollTo({ left: current * width, behavior: "instant" });
      gallery.classList.remove("is-animating", "is-dragging");
    }).observe(gallery);
    // Las figuras fuera del encuadre no se anuncian como imágenes visibles.
    const visibility = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.setAttribute("aria-hidden", String(entry.intersectionRatio < 0.5)));
    }, { root: gallery, threshold: 0.5 });
    figures.forEach((figure) => visibility.observe(figure));
  });
}
