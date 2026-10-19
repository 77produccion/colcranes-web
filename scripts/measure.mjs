/**
 * Medición de layout en vivo con el protocolo de DevTools.
 *
 * Complementa a shoot.mjs: allí se mira la composición, aquí se comprueban
 * los números que una captura no revela —desbordamiento horizontal, altura
 * real de la portada, tamaño de cada sección y elementos que sobresalen de
 * la ventana—. Sin esto, un desbordamiento silencioso (body con
 * `overflow-x: clip`) pasa desapercibido en las imágenes.
 *
 * Uso: node scripts/measure.mjs [baseUrl]
 */
import { spawn } from "node:child_process";

const base = process.argv[2] ?? "http://localhost:4321";
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profile = "C:/Users/ACER/AppData/Local/Temp/opencode/cmeasure";
const port = 9333;

const widths = [
  { name: "móvil 360", w: 360, h: 780 },
  { name: "móvil 390", w: 390, h: 844 },
  { name: "móvil ancho 430", w: 430, h: 900 },
  { name: "tablet 768", w: 768, h: 1024 },
  { name: "tablet 834", w: 834, h: 1112 },
  { name: "portátil 1180", w: 1180, h: 820 },
  { name: "escritorio 1440", w: 1440, h: 900 },
  { name: "ancho 1920", w: 1920, h: 1080 },
];

const child = spawn(chrome, [
  "--headless=old",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${port}`,
  "about:blank",
]);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function endpoint() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      const json = await res.json();
      if (json.webSocketDebuggerUrl) return json.webSocketDebuggerUrl;
    } catch {
      /* el puerto aún no responde */
    }
    await wait(250);
  }
  throw new Error("no se pudo abrir el puerto de depuración");
}

/** Cliente mínimo de DevTools sobre WebSocket. */
function connect(url) {
  const ws = new WebSocket(url);
  let id = 0;
  const pending = new Map();
  const ready = new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    const slot = pending.get(msg.id);
    if (!slot) return;
    pending.delete(msg.id);
    if (msg.error) slot.reject(new Error(JSON.stringify(msg.error)));
    else slot.resolve(msg.result);
  });
  return {
    ready,
    send(method, params = {}) {
      id += 1;
      const message = { id, method, params };
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify(message));
      });
    },
    close: () => ws.close(),
  };
}

/* Recoge, para el ancho dado, todo lo que la captura no puede mostrar. */
const probe = `(() => {
  const vw = window.innerWidth;
  const out = {
    innerWidth: vw,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    docHeight: document.documentElement.scrollHeight,
    offenders: [],
    sections: [],
    heroHeight: 0,
  };

  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    /* Sólo se reportan desbordes reales: los contenedores con scroll propio
       (tablas y carruseles horizontales) son intencionales. */
    let scrollable = false;
    for (let p = el.parentElement; p; p = p.parentElement) {
      const px = getComputedStyle(p).overflowX;
      if (px === "auto" || px === "scroll") { scrollable = true; break; }
    }
    if (scrollable) continue;
    if (r.right > vw + 1 || r.left < -1) {
      out.offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && el.className.toString().slice(0, 60)) || "",
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
      });
    }
  }

  const hero = document.querySelector(".hero");
  if (hero) out.heroHeight = Math.round(hero.getBoundingClientRect().height);

  for (const el of document.querySelectorAll("main > section, footer.site-footer")) {
    const r = el.getBoundingClientRect();
    out.sections.push({
      id: el.id || el.className.toString().split(" ")[0],
      top: Math.round(r.top + window.scrollY),
      height: Math.round(r.height),
    });
  }
  return JSON.stringify(out);
})()`;

await endpoint();
const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const page = list.find((t) => t.type === "page");
const client = connect(page.webSocketDebuggerUrl);
await client.ready;

await client.send("Page.enable");
await client.send("Runtime.enable");

const report = [];

for (const vp of widths) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: vp.w,
    height: vp.h,
    deviceScaleFactor: 1,
    mobile: vp.w < 700,
  });
  await client.send("Page.navigate", { url: base });
  await wait(2200);
  const res = await client.send("Runtime.evaluate", {
    expression: probe,
    returnByValue: true,
    awaitPromise: false,
  });
  report.push({ viewport: vp, data: JSON.parse(res.result.value) });
}

for (const entry of report) {
  const { viewport, data } = entry;
  const overflow = data.scrollWidth - data.innerWidth;
  console.log(
    `\n=== ${viewport.name} (${viewport.w}px) — scrollWidth ${data.scrollWidth} / innerWidth ${data.innerWidth}` +
      `${overflow > 1 ? `  ⚠ DESBORDE +${overflow}px` : "  ✓ sin desborde"}`
  );
  console.log(`    documento ${data.docHeight}px · portada ${data.heroHeight}px`);
  if (data.offenders.length) {
    const seen = new Set();
    for (const o of data.offenders) {
      const key = `${o.tag}.${o.cls}`;
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`    ⚠ ${key} → left ${o.left} right ${o.right} (ancho ${o.width})`);
    }
  }
  console.log(
    "    secciones: " +
      data.sections.map((s) => `${s.id}:${s.height}`).join("  ")
  );
}

client.close();
child.kill();
