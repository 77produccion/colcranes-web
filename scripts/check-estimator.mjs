import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

// Load the pure TS calculation without producing test artifacts in src/.
const modules = new Map();
function load(file) {
  file = resolve(file);
  if (modules.has(file)) return modules.get(file);
  const exports = {};
  const code = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInThisContext(`(function(exports, require) { ${code}\n})`)(exports, specifier => load(resolve(dirname(file), `${specifier}.ts`)));
  modules.set(file, exports);
  return exports;
}
const { estimate, requestText } = load('src/utils/estimator.ts');
const { INITIAL_STATE } = load('src/data/estimator.ts');

const element = () => ({ innerHTML: '', textContent: '', value: '', addEventListener() {}, querySelectorAll: () => [] });
// docs/ is a local, gitignored archive. The checked-in digest also verifies clean clones.
const original = existsSync('docs/estimador-colcranes.html')
  ? vm.createContext({ document: { querySelector: element, querySelectorAll: () => [], getElementById: element } }) : null;
if (original) vm.runInContext(readFileSync('docs/estimador-colcranes.html', 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1], original);
const baseline = [];
let cases = 0;
for (const service of ['insp', 'A', 'B', 'C']) {
  for (const zone of ['bq', 'bog', 'med', 'per', 'car', 'nac']) {
    for (const schedule of ['hab', 'noc', 'sab', 'sabn', 'dom', 'domn']) {
      for (const technicians of [1, 2]) {
        const state = { ...INITIAL_STATE, service, zone, schedule, technicians, siso: cases % 2 === 0, heights: cases % 3 === 0, vehicle: cases % 4 === 0, scaffold: cases % 2, scissor: cases % 3, manlift: cases % 2,
          rows: [{ type: 'bi', capacity: 'c3', quantity: 1 }, { type: 'mono', capacity: 'c1', quantity: 2 }, { type: 'poli', capacity: 'c1', quantity: 1 }] };
        const legacy = { servicio: service, zona: zone, horario: schedule, tec: technicians, siso: state.siso, alturas: state.heights, vehiculo: state.vehicle, andamio: state.scaffold, tijera: state.scissor, manlift: state.manlift, filas: state.rows.map(row => ({ tipo: row.type, cap: row.capacity, cant: row.quantity })) };
        const result = estimate(state);
        if (original) {
          vm.runInContext(`Object.assign(estado, ${JSON.stringify(legacy)}); calcular();`, original);
          const expected = vm.runInContext('ultimo', original);
          assert.equal(result.low, expected.lo);
          assert.equal(result.high, expected.hi);
          assert.equal(result.days, expected.dias);
        }
        baseline.push([result.low, result.high, result.days]);
        cases++;
      }
    }
  }
}
// Verified against the supplied HTML (rates dated 2026-11-10).
assert.equal(createHash('sha256').update(JSON.stringify(baseline)).digest('hex'), '838ce7b450ce0508435fc30a3c9a8bf9955bfad4c21d67d40d8d8042326994c2', 'Calculation differs from the validated reference.');
assert.equal(estimate({ ...INITIAL_STATE, rows: [] }).total, 0);
assert.equal(estimate(INITIAL_STATE).low, 730000);
assert.equal(estimate(INITIAL_STATE).high, 930000);
const text = requestText({ ...INITIAL_STATE, heights: true, scaffold: 1 }, { company: '<Empresa & Cía.>', name: 'María', phone: '+57 300', city: 'Bogotá' });
assert.ok(text.includes('No incluido en el rango: coordinador de alturas y andamios'));
assert.ok(text.includes('Empresa: <Empresa & Cía.>'));
console.log(`${cases} combinations match the original HTML; empty estimate and request exclusions verified.`);

if (process.argv.includes('--browser')) {
  const base = process.env.AUDIT_URL || 'http://127.0.0.1:4322';
  const browser = await chromium.launch({ channel: process.env.AUDIT_BROWSER || 'chrome' });
  mkdirSync('.astro/estimator', { recursive: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(`${base}/estimador/`);
    await page.locator('[data-controls]:not([disabled])').waitFor();
    assert.match(await page.locator('[data-range]').innerText(), /730\.000/);
    await page.locator('[name="heights"]').check();
    await page.locator('[name="scaffold"]').fill('1');
    assert.match(await page.locator('[data-notes]').innerText(), /coordinador de alturas y andamios/);
    await page.locator('[name="company"]').fill('Empresa & Cía.');
    const wa = new URL(await page.locator('[data-whatsapp]').getAttribute('href'));
    assert.equal(wa.pathname, '/573156293396');
    assert.ok(wa.searchParams.get('text').includes('Empresa: Empresa & Cía.'));
    assert.ok(wa.searchParams.get('text').includes('No incluido en el rango'));
    const mail = await page.locator('[data-email]').getAttribute('href');
    assert.ok(mail.startsWith('mailto:soporte.ventas@colcranes.com?'));
    await page.locator('[data-add]').click();
    assert.equal(await page.locator('[data-row]').count(), 2);
    await page.locator('[data-remove]').last().click();
    assert.equal(await page.locator('[data-row]').count(), 1);
    assert.equal(await page.locator('[data-remove]').isDisabled(), true);
    await page.locator('[name="quantity"]').fill('0');
    assert.equal(await page.locator('[data-whatsapp]').getAttribute('aria-disabled'), 'true');
    assert.equal(await page.locator('[data-whatsapp]').getAttribute('href'), null);
    await page.locator('[name="quantity"]').fill('2');
    await page.locator('[name="quantity"]').blur();
    assert.equal(await page.locator('[data-whatsapp]').getAttribute('aria-disabled'), null);
    await page.locator('[name="scissor"]').fill('11');
    assert.equal(await page.locator('[data-copy]').isDisabled(), true);
    await page.locator('[name="scissor"]').blur();
    assert.equal(await page.locator('[name="scissor"]').inputValue(), '10');
    await page.locator('[name="scissor"]').fill('0');
    await page.locator('[name="scissor"]').blur();
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('denied')) } }));
    await page.locator('[data-copy]').click();
    assert.equal(await page.locator('[data-fallback]').isVisible(), true);
    assert.ok((await page.locator('[data-fallback]').inputValue()).includes('Empresa & Cía.'));
    await page.locator('[name="company"]').fill('Empresa');
    for (const width of [320, 390, 768, 1080, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => window.scrollTo(0, 0));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow at ${width}`);
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      assert.equal(audit.violations.length, 0, JSON.stringify(audit.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target) }))));
      await page.screenshot({ path: `.astro/estimator/${width}.png`, fullPage: true });
      console.log(`${width}px: no overflow or WCAG A/AA violations.`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('.header-cta').click();
    await page.waitForFunction(() => document.querySelector('[data-quote-drawer]')?.getAttribute('aria-hidden') === 'false');
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => document.querySelector('[data-quote-drawer]')?.getAttribute('aria-hidden') === 'true');
    await page.locator('[data-drawer-toggle]').click();
    await page.locator('.mobile-nav-group').nth(1).locator('summary').click();
    assert.equal(await page.locator('.mobile-drawer a[href="/estimador"]').isVisible(), true);
    const noJS = await browser.newPage({ javaScriptEnabled: false });
    await noJS.goto(`${base}/estimador/`);
    assert.equal(await noJS.locator('noscript').isVisible(), true);
    assert.equal(await noJS.locator('[data-controls]').getAttribute('disabled'), '');
    assert.deepEqual(errors, []);
    console.log('Links, invalid quantities, row management, clipboard fallback, navigation, quotation dialog and no-JS fallback verified.');
  } finally { await browser.close(); }
}
