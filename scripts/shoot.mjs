/**
 * Capturas de auditoría visual con Chrome headless sobre el protocolo de
 * DevTools.
 *
 * Por qué no se usa `--window-size`: Chrome en Windows impone un ancho mínimo
 * de ventana (~500px), así que una captura a 390px devolvía una imagen
 * recortada de un layout más ancho. El resultado parecía desbordamiento
 * horizontal y no lo era. Con `Emulation.setDeviceMetricsOverride` la ventana
 * lógica es la que se pide, y `captureBeyondViewport` toma la página completa
 * sin tocar el código del sitio.
 *
 * El movimiento se congela emulando `prefers-reduced-motion: reduce`, que es
 * el estado final de la composición; así la auditoría ve lo que verá quien
 * tenga esa preferencia activa.
 *
 * Uso: node scripts/shoot.mjs [baseUrl] [outDir]
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:4321";
const outDir = process.argv[3] ?? "docs/_capturas";
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profile = "C:/Users/ACER/AppData/Local/Temp/opencode/cshot";
const port = 9334;

const shots = [
  { name: "00-movil-360-pliegue", w: 360, h: 780, fold: true },
  { name: "00-escritorio-pliegue", w: 1440, h: 900, fold: true },
  { name: "01-movil-completa", w: 390, h: 844 },
  { name: "02-tablet-completa", w: 834, h: 1112 },
  { name: "03-escritorio-completa", w: 1440, h: 900 },
  { name: "04-ancho-completa", w: 1920, h: 1080 },
];

await mkdir(outDir, { recursive: true });

const child = spawn(chrome, [
  "--headless=old",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--hide-scrollbars",
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${port}`,
  "about:blank",
]);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function debuggerUrl() {
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
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    },
    close: () => ws.close(),
  };
}

await debuggerUrl();
const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const page = list.find((t) => t.type === "page");
const client = connect(page.webSocketDebuggerUrl);
await client.ready;

await client.send("Page.enable");
await client.send("Runtime.enable");
await client.send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: "reduce" }],
});

/** Espera a que se decodifiquen las imágenes visibles. */
async function settleImages() {
  /* El motor headless no resuelve `loading="lazy"` más allá de la ventana: se
     fuerza la carga antes de esperar. Las imágenes de los paneles ocultos se
     excluyen —no tienen caja— porque cargan al abrir su pestaña. */
  await client.send("Runtime.evaluate", {
    expression: `(() => {
      document.querySelectorAll("img[loading='lazy']").forEach((img) => {
        img.loading = "eager";
        img.src = img.src;
      });
      return document.images.length;
    })()`,
    returnByValue: true,
  });

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const res = await client.send("Runtime.evaluate", {
      expression: `(() => {
        const shown = Array.from(document.images).filter((img) => img.getClientRects().length > 0);
        return JSON.stringify({
          shown: shown.length,
          pending: shown.filter((img) => !img.complete || img.naturalWidth === 0).length,
        });
      })()`,
      returnByValue: true,
    });
    const state = JSON.parse(res.result.value);
    if (state.pending === 0) return state;
    await wait(400);
  }
  return null;
}

for (const shot of shots) {
  try {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: shot.w,
      height: shot.h,
      deviceScaleFactor: 1,
      /* Deliberadamente `mobile: false` incluso a 390px. La emulación móvil de
         Chrome descarta en la captura las capas con `mix-blend-mode`, así que
         las fotografías de producto sobre acero aparecían como cajas vacías
         pese a estar correctamente cargadas y medidas en el DOM. La composición
         depende sólo del ancho, de modo que un viewport de escritorio estrecho
         reproduce el layout real sin ese artefacto. */
      mobile: false,
    });
    await client.send("Page.navigate", { url: base });
    await wait(2000);

    const settled = await settleImages();
    /* Un recorrido por la página garantiza que el navegador pinte todo antes
       de la captura de página completa, y deja la posición en el inicio. */
    await client.send("Runtime.evaluate", {
      expression: `(async () => {
        const step = Math.round(window.innerHeight * 0.8);
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 250));
      })()`,
      awaitPromise: true,
      returnByValue: true,
    });
    await wait(600);

    const { data } = await client.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: !shot.fold,
      fromSurface: true,
    });
    await writeFile(`${outDir}/${shot.name}.png`, Buffer.from(data, "base64"));
    console.log(
      "ok  ",
      shot.name,
      `${shot.w}x${shot.h}`,
      settled ? `${settled.shown} imágenes cargadas` : "⚠ imágenes sin confirmar"
    );
  } catch (error) {
    console.log("FAIL", shot.name, String(error).slice(0, 200));
  }
}

client.close();
child.kill();
