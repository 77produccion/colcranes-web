import assert from "node:assert/strict";
import { chromium, webkit } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.AUDIT_URL || "http://127.0.0.1:4322";
const results = [];
const playing = async (page) => page.waitForFunction(() => {
  const video = document.querySelector(".hero__video.is-active");
  return video && video.readyState >= 2 && video.currentTime > 0.15 && !video.paused;
}, undefined, { timeout: 20000, polling: 100 });
for (const [engine, launcher] of [["chrome", chromium], ["webkit", webkit]]) {
  const browser = await launcher.launch(engine === "chrome" ? { channel: "chrome" } : {});
  try {
    for (const scenario of ["desktop", "mobile", "reduce", "saveData", "no-motion-module", "no-js", "blocked-autoplay", "missing-clip"]) {
      const mobile = scenario !== "desktop";
      const context = await browser.newContext({ viewport: { width: mobile ? 390 : 1440, height: 844 }, hasTouch: mobile, isMobile: mobile, reducedMotion: scenario === "reduce" ? "reduce" : "no-preference", javaScriptEnabled: scenario !== "no-js" });
      if (scenario === "saveData") await context.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true, effectiveType: "2g" } }));
      if (scenario === "blocked-autoplay") await context.addInitScript(() => {
        window.__rejectHeroAutoplay = true;
        const original = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function () {
          if (window.__rejectHeroAutoplay) { this.pause(); return Promise.reject(new DOMException("Autoplay requires a gesture", "NotAllowedError")); }
          return original.call(this);
        };
        document.addEventListener("pointerdown", () => { window.__rejectHeroAutoplay = false; }, { capture: true });
      });
      const page = await context.newPage();
      if (scenario === "no-motion-module") await page.route(/\/motion\.[^/]+\.js$/, (route) => route.abort());
      if (scenario === "missing-clip") await page.route(`${base}/`, async (route) => {
        // WebKit en Windows obtiene medios fuera de la intercepción de requests;
        // una URL realmente inexistente comprueba el 404 también en ese motor.
        const response = await route.fetch();
        await route.fulfill({ response, body: (await response.text()).replaceAll("11-equipos-en-nave", "missing-hero-clip") });
      });
      await page.goto(base, { waitUntil: "domcontentloaded" });
      assert.equal(await page.locator("[data-hero-playback], .hero__playback").count(), 0, "No debe mostrarse ningún control de reproducción.");
      if (scenario === "blocked-autoplay") {
        await page.waitForFunction(() => document.querySelector("[data-hero-videos]")?.dataset.ready === "true");
        await page.locator("[data-hero]").click({ position: { x: 100, y: 150 } });
      }
      if (scenario === "no-js") {
        // Los pollers inyectados de Playwright tampoco avanzan con JavaScript desactivado.
        await page.waitForTimeout(1800);
        assert.ok(await page.locator(".hero__video.is-active").evaluate((video) => video.currentTime > 0 && !video.paused));
      } else await playing(page);
      const state = await page.locator(".hero__video.is-active").evaluate((video) => ({ src: video.currentSrc, muted: video.muted, ready: video.readyState }));
      assert.equal(state.muted, true);
      assert.equal(state.src.endsWith("-mobile.mp4"), mobile || scenario === "missing-clip");
      if (scenario === "missing-clip") assert.ok(!state.src.includes("missing-hero-clip"), "Un fragmento inexistente no debe bloquear la portada.");
      if (scenario === "mobile") {
        await page.locator(".hero__video.is-active").evaluate((video) => { video.currentTime = video.duration - 0.2; });
        await page.waitForFunction((first) => document.querySelector(".hero__video.is-active").currentSrc !== first, state.src);
        await playing(page);
        await page.evaluate(() => scrollTo(0, innerHeight * 2));
        await page.waitForFunction(() => [...document.querySelectorAll(".hero__video")].every((video) => video.paused));
        await page.evaluate(() => scrollTo(0, 0));
        await playing(page);
      }
      results.push({ engine, scenario, ...state });
      console.log(`OK: ${engine}, ${scenario}: reproducción real comprobada.`);
      await context.close();
    }
  } finally { await browser.close(); }
}
await mkdir(".astro/review", { recursive: true });
await writeFile(".astro/review/hero-playback.json", JSON.stringify(results, null, 2));
