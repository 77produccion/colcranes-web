/**
 * Sonda puntual sobre el navegador: ejecuta una expresión en una página a un
 * ancho dado y devuelve el resultado. Sirve para comprobar estados que una
 * captura no explica (imágenes que no cargan, cajas sin contenido, etc.).
 *
 * Uso: node scripts/probe.mjs <url> <ancho> <alto> "<expresión js>"
 */
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";

let [url, wRaw, hRaw, expression] = process.argv.slice(2);

/* Permite pasar la expresión en un archivo (`@ruta.js`) para evitar el
   entrecomillado del shell en fragmentos largos. */
if (expression?.startsWith("@")) {
  expression = await readFile(expression.slice(1), "utf8");
}
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profile = "C:/Users/ACER/AppData/Local/Temp/opencode/cprobe";
const port = 9336;
const w = Number(wRaw ?? 390);
const h = Number(hRaw ?? 844);

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

function connect(target) {
  const ws = new WebSocket(target);
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
const client = connect(list.find((t) => t.type === "page").webSocketDebuggerUrl);
await client.ready;

await client.send("Page.enable");
await client.send("Runtime.enable");
await client.send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: "reduce" }],
});
await client.send("Emulation.setDeviceMetricsOverride", {
  width: w,
  height: h,
  deviceScaleFactor: 1,
  mobile: w < 700,
});
await client.send("Page.navigate", { url });
await wait(2500);

const res = await client.send("Runtime.evaluate", {
  expression,
  returnByValue: true,
  awaitPromise: true,
});
console.log(JSON.stringify(res.result.value ?? res.result.description, null, 2));

client.close();
child.kill();
