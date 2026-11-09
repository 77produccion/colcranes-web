/** Reproductor independiente de GSAP: el primer clip ya tiene fuentes en el HTML. */
export function setupHeroVideo() {
  const root = document.querySelector<HTMLElement>("[data-hero]");
  const container = root?.querySelector<HTMLElement>("[data-hero-videos]");
  if (!root || !container || container.dataset.ready) return;
  container.dataset.ready = "true";
  const videos = Array.from(container.querySelectorAll<HTMLVideoElement>("video"));
  const mobile = matchMedia("(max-width: 767px)").matches;
  const items = Array.from(root.querySelectorAll<HTMLElement>("[data-hero-playlist] li")).map((item) => ({
    desktop: item.dataset.src!,
    mobile: item.dataset.mobileSrc || item.dataset.src!,
    position: item.dataset.position || "50% 50%",
  }));
  if (videos.length < 2 || !items.length) return;

  let activeSlot = 0;
  let pendingSlot: number | null = null;
  let blocked = false;
  const rect = root.getBoundingClientRect();
  let inView = rect.bottom > 0 && rect.top < innerHeight;
  const failed = new Set<string>();
  const url = (src: string) => new URL(src, location.href).href;
  const indexOf = (video: HTMLVideoElement) => Number(video.dataset.playlistIndex || 0);
  const candidates = (index: number) => mobile
    ? [items[index].mobile, items[index].desktop]
    : [items[index].desktop, items[index].mobile];
  const play = (video: HTMLVideoElement) => {
    if (!inView || document.hidden) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    void video.play().catch((error: DOMException) => {
      if (error.name === "AbortError" || document.hidden || !inView) return;
      if (error.name === "NotSupportedError") {
        if (video.currentSrc || video.src) failed.add(video.currentSrc || video.src);
        else candidates(indexOf(video)).forEach((src) => failed.add(url(src)));
        recover(video);
        return;
      }
      blocked = true;
    });
  };
  const load = (video: HTMLVideoElement, index: number): boolean => {
    const source = candidates(index).find((src) => !failed.has(url(src)));
    if (!source) return false;
    video.replaceChildren();
    video.muted = video.defaultMuted = true;
    video.playsInline = true;
    video.loop = false;
    video.preload = "auto";
    video.dataset.playlistIndex = String(index);
    video.style.objectPosition = items[index].position;
    video.src = source;
    video.load();
    return true;
  };
  const prepareNext = () => {
    const standby = videos[1 - activeSlot];
    const index = (indexOf(videos[activeSlot]) + 1) % items.length;
    if (standby.dataset.playlistIndex !== String(index)) load(standby, index);
  };
  const recover = (video: HTMLVideoElement) => {
    if (video.currentSrc || video.src) failed.add(video.currentSrc || video.src);
    const original = indexOf(video);
    for (let offset = 0; offset < items.length; offset++) {
      if (load(video, (original + offset) % items.length)) return;
    }
    blocked = true;
  };
  const advance = () => {
    if (pendingSlot !== null || !inView || document.hidden) return;
    pendingSlot = 1 - activeSlot;
    const next = videos[pendingSlot];
    if (!next.currentSrc && !next.src) prepareNext();
    play(next);
  };
  const sync = () => {
    if (!inView || document.hidden) videos.forEach((video) => video.pause());
    else if (pendingSlot !== null) play(videos[pendingSlot]);
    else if (videos[activeSlot].ended) advance();
    else play(videos[pendingSlot ?? activeSlot]);
  };

  videos.forEach((video, slot) => {
    video.loop = false;
    video.muted = video.defaultMuted = true;
    video.addEventListener("canplay", () => {
      if (slot === activeSlot || slot === pendingSlot) play(video);
    });
    video.addEventListener("playing", () => {
      if (!inView || document.hidden) { video.pause(); return; }
      if (slot === pendingSlot) {
        const previous = videos[activeSlot];
        video.classList.add("is-active");
        previous.classList.remove("is-active");
        previous.pause();
        activeSlot = slot;
        pendingSlot = null;
      }
      blocked = false;
    });
    video.addEventListener("timeupdate", () => {
      if (slot === activeSlot && inView && !document.hidden && video.duration - video.currentTime < 2) prepareNext();
    });
    video.addEventListener("ended", () => { if (slot === activeSlot) advance(); });
    video.addEventListener("error", () => recover(video));
  });
  videos[0].dataset.playlistIndex = "0";
  videos[0].querySelectorAll("source").forEach((source) => {
    source.addEventListener("error", () => {
      if (!videos[0].contains(source)) return;
      failed.add(url(source.src));
      // Algunos navegadores sólo emiten error en <source>, no en <video>.
      // No depender de haber alcanzado a escuchar los errores anteriores.
      if (!load(videos[0], 0)) recover(videos[0]);
    });
  });
  // El navegador puede haber cargado/reproducido antes de ejecutar este módulo.
  if (videos[0].error || videos[0].networkState === HTMLMediaElement.NETWORK_NO_SOURCE) recover(videos[0]);
  sync();

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }).observe(root);
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("pageshow", sync);
  // Reintento desde un gesto real, sin añadir controles visibles.
  const resumeFromGesture = () => {
    if (!blocked) return;
    const target = videos[pendingSlot ?? activeSlot];
    if (target.error) { failed.clear(); load(target, indexOf(target)); }
    play(target);
  };
  document.addEventListener("pointerup", resumeFromGesture);
  document.addEventListener("keydown", resumeFromGesture);
  window.setTimeout(() => {
    if (inView && !document.hidden && videos[activeSlot].paused) {
      blocked = true;
    }
  }, 12000);
}
