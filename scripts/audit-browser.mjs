import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

// Run against a production build served with `npm run preview` (not the dev server).
const base = process.env.AUDIT_URL || "http://127.0.0.1:4322";
const browser = await chromium.launch({ channel: process.env.AUDIT_BROWSER || "chrome" });
const results = [];
const states = [];
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const path = new URL(match[1]).pathname;
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`);
    });
    await page.goto(`${base}${path}`, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    const violations = accessibility.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }));
    results.push({ path, overflow, errors, violations });
    console.log(`${path}: ${violations.length} accessibility violations, ${errors.length} errors, overflow=${overflow}`);
    await page.close();
  }
  const page = await context.newPage();
  const checkState = async (name) => {
    const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    const violations = audit.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }));
    states.push({ name, violations });
    assert.equal(violations.length, 0, `${name}: ${JSON.stringify(violations)}`);
  };
  await page.goto(base, { waitUntil: "load" });
  await page.waitForTimeout(1200);
  assert.equal(await page.evaluate(() => performance.getEntriesByType("resource").some((entry) => /\.pdf(?:$|[?#])|pdf\.worker|\/pdf\.[^/]+\.js/.test(entry.name))), false, "PDF downloaded before approaching the catalog");
  assert.equal(await page.evaluate(() => performance.getEntriesByType("resource").some((entry) => /fonts\.(googleapis|gstatic)\.com/.test(entry.name))), false, "Fonts still depend on Google");
  assert.equal(await page.evaluate(() => performance.getEntriesByType("resource").some((entry) => /gancho-completo\.webp/.test(entry.name))), false, "Hidden transition art loaded eagerly");
  await page.locator(".header-cta").click();
  await page.waitForFunction(() => document.activeElement?.classList.contains("quote-drawer__panel"));
  await page.waitForTimeout(800);
  await checkState("quotation dialog");
  await page.locator(".quote-drawer__close").focus();
  await page.keyboard.press("Shift+Tab");
  assert.ok(await page.evaluate(() => !!document.activeElement?.closest(".quote-drawer__panel")), "Focus escaped the quotation dialog");
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => document.querySelector("[data-quote-drawer]")?.getAttribute("aria-hidden") === "true");
  assert.ok(await page.locator(".header-cta").evaluate((element) => document.activeElement === element), "Focus was not restored");
  await page.locator("[data-wa-open]").click();
  await page.waitForTimeout(500);
  await checkState("WhatsApp dialog");
  await page.keyboard.press("Escape");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("[data-drawer-toggle]").click();
  const summary = page.locator(".mobile-nav-group summary").first();
  await summary.click();
  await page.waitForFunction(() => document.querySelector(".mobile-nav-group__links")?.style.height === "");
  assert.ok(await page.locator(".mobile-nav-group").first().evaluate((element) => element.open));
  await checkState("expanded mobile menu");
  await summary.click();
  await page.waitForFunction(() => !document.querySelector(".mobile-nav-group")?.open);
  await page.locator("[data-drawer-toggle]").click();
  await page.locator(".family.is-active [data-family-next]").click();
  assert.equal(await page.locator("[data-family-select]").inputValue(), "fam-puentes");
  await page.waitForFunction(() => {
    const figure = document.querySelector(".family.is-active .stage__fig");
    if (!figure) return false;
    const matrix = new DOMMatrixReadOnly(getComputedStyle(figure).transform);
    return Math.abs(matrix.m41) > 1 && Math.abs(matrix.m42) < 1;
  });
  await page.locator(".family.is-active [data-family-prev]").click();
  await page.locator("[data-mobile-pdf]").scrollIntoViewIfNeeded();
  await page.locator("[data-pdf-page] canvas").waitFor();
  await page.locator("[data-pdf-next]").click();
  await page.waitForFunction(() => document.querySelector("[data-pdf-page] canvas")?.getAttribute("aria-label")?.includes("página 2"));
  assert.equal(await page.locator("[data-clients-pause]").count(), 0, "The removed logo pause control is still present");
  const track = page.locator(".clients-band__track");
  await page.locator(".clients-band__marquee").hover();
  assert.equal(await track.evaluate((element) => getComputedStyle(element).animationPlayState), "running", "Logo marquee stopped on hover or reduced-motion mode");
  const viewports = [];
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base, { waitUntil: "load" });
    await page.waitForTimeout(500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    viewports.push({ width, overflow });
    assert.equal(overflow, false, `Horizontal overflow at ${width}px`);
  }
  // Reduced-motion remains enabled: desktop must retain its original vertical slide.
  await page.waitForFunction(() => document.documentElement.classList.contains("js"));
  await page.locator('.index-row[for="fam-puentes"]').click();
  await page.waitForFunction(() => {
    const figure = document.querySelector(".family.is-active .stage__fig");
    const copy = document.querySelector(".family.is-active .stage__foot");
    if (!figure || !copy) return false;
    const matrix = new DOMMatrixReadOnly(getComputedStyle(figure).transform);
    return matrix.m42 > 1 && Math.abs(matrix.m41) < 1 && Number(getComputedStyle(copy).opacity) < 1;
  });
  await page.waitForFunction(() => {
    const copy = document.querySelector(".family.is-active .stage__foot");
    return copy && Number(getComputedStyle(copy).opacity) === 1;
  });
  await page.locator('.index-row[for="fam-cable"]').click();
  await page.waitForFunction(() => {
    const figure = document.querySelector(".family.is-active .stage__fig");
    return figure && new DOMMatrixReadOnly(getComputedStyle(figure).transform).m42 < -1;
  });
  await mkdir("docs/audits", { recursive: true });
  await writeFile("docs/audits/browser.json", JSON.stringify({ testedAt: new Date().toISOString(), environment: "Local production preview, Chrome; not a physical-device test", results, states, viewports, interactions: "quote focus trap/restore, submenu, mobile horizontal and desktop vertical product animations with reduced-motion, PDF pagination and deferred loading passed" }, null, 2) + "\n");
  assert.ok(results.every((result) => !result.overflow && !result.errors.length && !result.violations.length), "Browser audit failed; see docs/audits/browser.json");
  console.log("Browser and interaction checks passed.");
} finally {
  await browser.close();
}
