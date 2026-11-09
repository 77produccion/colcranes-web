import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { existsSync } from "node:fs";
import photos from "../src/data/project-photos.json" with { type: "json" };

const base = process.env.AUDIT_URL || "http://127.0.0.1:4322";
await mkdir(".astro/review", { recursive: true });
const browser = await chromium.launch({ channel: process.env.AUDIT_BROWSER || "chrome" });
const results = [];
try {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1440, 1920]) {
    const page = await context.newPage();
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`);
    });
    for (const route of ["/", "/proyectos"]) {
      await page.goto(`${base}${route}`, { waitUntil: "load" });
      await page.waitForTimeout(700);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow ${route} at ${width}px`);
      assert.equal(await page.locator(".stats-grid").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length), width <= 1100 ? 2 : 4);
      assert.equal(await page.locator(".stats-band__crane").isVisible(), width >= 768);
      if (width < 768) {
        const stats = await page.locator(".stats-band").evaluate((element) => ({
          background: getComputedStyle(element).backgroundColor,
          image: getComputedStyle(element).backgroundImage,
          colors: [...element.querySelectorAll(".stat-card__value, .stat-card__label, .stat-card__detail")].map((item) => getComputedStyle(item).color),
        }));
        assert.equal(stats.background, "rgb(45, 46, 131)");
        assert.equal(stats.image, "none");
        assert.ok(stats.colors.every((color) => color === "rgb(255, 255, 255)"));
      }
      assert.equal(await page.locator(".hero__logo, .service-line__logo").count(), 0);
      if (route === "/") {
        await page.waitForTimeout(1000);
        const overlap = await page.evaluate(() => {
          const floating = document.querySelector("[data-wa-open]").getBoundingClientRect();
          return [...document.querySelectorAll(".hero__ctas > *")].some((element) => {
            const rect = element.getBoundingClientRect();
            return rect.left < floating.right && rect.right > floating.left && rect.top < floating.bottom && rect.bottom > floating.top;
          });
        });
        assert.equal(overlap, false, `WhatsApp overlaps hero actions at ${width}px`);
      }
      assert.equal(await page.evaluate(() => performance.getEntriesByType("resource").some((entry) => /\.pdf(?:$|[?#])|pdf\.worker/.test(entry.name))), false, "PDF loaded before approaching catalog");
      await page.locator(".stats-band").scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      await page.locator(".stats-band").screenshot({ path: `.astro/review/stats-${width}${route === "/" ? "" : "-projects"}.png` });
      const gallery = page.locator("[data-project-gallery]");
      await gallery.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      assert.equal(await page.locator("[data-project-next], [data-project-prev]").count(), 0, "La galería sólo usa puntos, no flechas.");
      assert.equal(await page.locator("[data-project-dot]").count(), photos.filter((photo) => existsSync(`public${photo.image}`)).length);
      const firstDescription = await page.locator(".project-record__description.is-active").textContent();
      await page.locator('[data-project-dot="1"]').click();
      await page.waitForFunction(() => document.querySelector('[data-project-dot="1"]')?.getAttribute("aria-current") === "true");
      await page.waitForFunction(() => !document.querySelector('[data-project-gallery]')?.classList.contains("is-animating"));
      assert.notEqual(await page.locator(".project-record__description.is-active").textContent(), firstDescription);
      if (width >= 896) {
        assert.ok(await page.locator(".project-record").evaluate((el) => el.getBoundingClientRect().height < 750), "El proyecto debe tener una altura similar a las demás fichas.");
        const media = await page.locator(".project-record__media").boundingBox();
        const content = await page.locator(".project-record__content").boundingBox();
        assert.ok(media.x < content.x, "La imagen debe quedar a la izquierda.");
      }
      await page.locator('[data-project-dot="0"]').click();
      await page.waitForFunction(() => document.querySelector('[data-project-dot="0"]')?.getAttribute("aria-current") === "true");
      await page.waitForFunction(() => !document.querySelector('[data-project-gallery]')?.classList.contains("is-animating"));
      if (width >= 896) {
        const box = await gallery.boundingBox();
        await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.5);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.5, { steps: 12 });
        await page.mouse.up();
        await page.waitForFunction(() => document.querySelector('[data-project-dot="1"]')?.getAttribute("aria-current") === "true");
        await gallery.focus();
        await page.keyboard.press("Home");
        await page.waitForFunction(() => document.querySelector('[data-project-dot="0"]')?.getAttribute("aria-current") === "true");
        await page.waitForFunction(() => !document.querySelector('[data-project-gallery]')?.classList.contains("is-animating"));
      }
      await page.locator(".project-record").screenshot({ path: `.astro/review/gallery-${width}${route === "/" ? "" : "-projects"}.png` });
      const accessibility = await new AxeBuilder({ page }).include(".stats-band").include(".project-record").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      const violations = accessibility.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }));
      results.push({ route, width, violations, errors: [...errors] });
      assert.deepEqual(violations, [], `Accessibility ${route} ${width}px`);
      assert.deepEqual(errors, [], `Browser errors ${route} ${width}px`);
      console.log(`OK: ${route} ${width}px; cifras, ilustración, galería y accesibilidad.`);
    }
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(base, { waitUntil: "load" });
  await page.waitForFunction(() => {
    const video = document.querySelector(".hero__video");
    return video?.currentSrc.endsWith("-mobile.mp4") && video.currentTime > 0 && !video.paused;
  });
  assert.equal(await page.locator("[data-hero-playlist] li").count(), 4);
  assert.equal(await page.locator('[data-hero-playlist] [data-src*="HMV"]').count(), 0);
  await page.locator("[data-mobile-pdf]").scrollIntoViewIfNeeded();
  await page.locator("[data-pdf-page] canvas").waitFor({ timeout: 30000 });
  assert.ok(await page.locator("[data-mobile-pdf]").getAttribute("data-url").then((url) => url.endsWith("2026.pdf")));
  await page.locator("[data-pdf-next]").click();
  await page.waitForFunction(() => document.querySelector("[data-pdf-page] canvas")?.getAttribute("aria-label")?.includes("página 2"));
  await page.locator("[data-mobile-pdf]").screenshot({ path: ".astro/review/catalog-2026-mobile.png" });
  await page.close();
  const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(`${base}/proyectos`, { waitUntil: "load" });
  const touchGallery = touchPage.locator("[data-project-gallery]");
  await touchGallery.scrollIntoViewIfNeeded();
  const box = await touchGallery.boundingBox();
  const cdp = await touchContext.newCDPSession(touchPage);
  const y = box.y + box.height * 0.5;
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + box.width * 0.85, y }] });
  for (let step = 1; step <= 10; step++) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + box.width * (0.85 - step * 0.065), y }] });
    await touchPage.waitForTimeout(25);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await touchPage.waitForFunction(() => document.querySelector('[data-project-dot="0"]')?.getAttribute("aria-current") === "false");
  console.log("OK: deslizamiento táctil nativo y descripción sincronizada.");
  await touchContext.close();
} finally {
  await writeFile(".astro/review/audit-2026.json", JSON.stringify(results, null, 2));
  await browser.close();
}
