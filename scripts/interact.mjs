/**
 * Prueba de interacción sobre el navegador.
 *
 * Comprueba que cada control visible hace lo que aparenta —pestañas del
 * explorador, paradas del ciclo, menú móvil y envío del formulario— y guarda
 * un pliego de recortes del panel de equipos para revisar las siete familias
 * una por una. Una captura estática no dice nada sobre esto.
 *
 * Uso: node scripts/interact.mjs [baseUrl] [outDir]
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:4400";
const outDir = process.argv[3] ?? "docs/_capturas/interaccion";
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profile = "C:/Users/ACER/AppData/Local/Temp/opencode/cinteract";
const port = 9337;

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

const evaluate = async (client, expression) => {
  const res = await client.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (res.exceptionDetails) {
    throw new Error(res.exceptionDetails.exception?.description ?? "error en la página");
  }
  return res.result.value;
};

await debuggerUrl();
const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const client = connect(list.find((t) => t.type === "page").webSocketDebuggerUrl);
await client.ready;

await client.send("Page.enable");
await client.send("Runtime.enable");

const failures = [];
const check = (name, ok, detail = "") => {
  if (!ok) failures.push(`${name} ${detail}`);
  console.log(`${ok ? "ok  " : "FALLA"} ${name}${detail ? ` — ${detail}` : ""}`);
};

await client.send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});

/* Cada control se prueba dos veces: con la animación disponible y con
   `prefers-reduced-motion: reduce`. Lo segundo no es una variante exótica:
   es la preferencia del sistema y, si algo depende de ella, los usuarios
   afectados se quedan sin la función. */
for (const motion of [
  { name: "movimiento activo", value: "no-preference" },
  { name: "movimiento reducido", value: "reduce" },
]) {
  console.log(`\n--- Escenario: ${motion.name} ---`);
  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: motion.value }],
  });
  await client.send("Page.navigate", { url: base });
  await wait(2500);

  /* --- 1. Explorador: las siete pestañas cambian el panel --- */
  const total = await evaluate(
    client,
    `document.querySelectorAll(".explorer input[type=radio]").length`
  );
  check("Explorador: siete familias declaradas", total === 7, `encontradas ${total}`);

  for (let i = 0; i < total; i += 1) {
    const state = await evaluate(
      client,
      `(async () => {
        const inputs = Array.from(document.querySelectorAll(".explorer input[type=radio]"));
        inputs[${i}].click();
        const fig0 = document.querySelectorAll(".stage__fig")[${i}];
        for (let attempt = 0; attempt < 30; attempt += 1) {
          const media = fig0.querySelector("img");
          if (!media || (media.complete && media.naturalWidth > 0)) break;
          await new Promise((r) => setTimeout(r, 100));
        }
        await new Promise((r) => setTimeout(r, 200));
        const families = Array.from(document.querySelectorAll(".family"));
        const figs = Array.from(document.querySelectorAll(".stage__fig"));
        const activeFamily = families.findIndex((f) => f.classList.contains("is-active"));
        const activeFig = figs.findIndex((f) => f.classList.contains("is-active"));
        const fig = figs[${i}];
        const img = fig && fig.querySelector("img");
        const rect = fig.getBoundingClientRect();
        const metas = Array.from(families[${i}]?.querySelectorAll(".stage__head .mono") ?? []).map((m) => m.textContent.trim());
        return {
          activeFamily,
          activeFig,
          head: metas[0] ?? null,
          ref: metas[1] ?? null,
          figW: Math.round(rect.width),
          figH: Math.round(rect.height),
          hasMedia: !!(img || fig.querySelector("svg")),
          mediaLoaded: img ? img.complete && img.naturalWidth > 0 : true,
          clipY: Math.round(rect.top + window.scrollY) - 130,
          clipH: Math.round(rect.height) + 320,
        };
      })()`
    );
    const label = `Familia ${i + 1}`;
    check(`${label}: el panel activo corresponde a la pestaña`, state.activeFamily === i && state.activeFig === i,
      `familia ${state.activeFamily}, figura ${state.activeFig}`);
    check(`${label}: el encabezado del panel nombra la familia`,
      state.head === `${String(i + 1).padStart(2, "0")} · ${(state.head ?? "").split(" · ")[1]}` && Boolean(state.head),
      `mostró "${state.head}"`);
    check(`${label}: la referencia del panel es la correcta`,
      state.ref === `Referencia ${String(i + 1).padStart(2, "0")} / 07`, `mostró "${state.ref}"`);
    check(`${label}: la figura tiene medio cargado`, state.hasMedia && state.mediaLoaded && state.figW > 200,
      `${state.figW}x${state.figH}, cargado ${state.mediaLoaded}`);

    if (i > 0) {
      /* Pausa fuera de la página para garantizar que el fotograma con la
         imagen ya decodificada esté pintado antes de recortar la región. */
      await wait(400);
      const shot = await client.send("Page.captureScreenshot", {
        format: "png",
        clip: { x: 0, y: Math.max(0, state.clipY), width: 1440, height: state.clipH, scale: 0.62 },
        captureBeyondViewport: true,
      });
      await writeFile(`${outDir}/familia-0${i + 1}-${motion.value}.png`, Buffer.from(shot.data, "base64"));
    }
  }

  /* --- 2. Ciclo de vida: la etapa pulsada queda activa --- */
  const stopState = await evaluate(
    client,
    `(async () => {
      const stops = Array.from(document.querySelectorAll(".rail .stop"));
      const initial = stops.findIndex((s) => s.classList.contains("is-active"));
      const initialActive = stops.filter((s) => s.classList.contains("is-active")).length;
      const target = stops[4];
      target.querySelector(".stop__toggle").click();
      await new Promise((r) => setTimeout(r, 140));
      return {
        total: stops.length,
        initial,
        initialActive,
        active: stops.findIndex((s) => s.classList.contains("is-active")),
        activeCount: stops.filter((s) => s.classList.contains("is-active")).length,
        pressed: target.querySelector(".stop__toggle").getAttribute("aria-pressed"),
        pressedCount: stops.filter((s) => s.querySelector(".stop__toggle").getAttribute("aria-pressed") === "true").length,
      };
    })()`
  );
  check("Ciclo de vida: siete etapas", stopState.total === 7, `encontradas ${stopState.total}`);
  check("Ciclo de vida: arranca sólo la primera activa",
    stopState.initial === 0 && stopState.initialActive === 1,
    `activas ${stopState.initialActive}`);
  check("Ciclo de vida: la etapa pulsada pasa a activa y es la única",
    stopState.active === 4 && stopState.activeCount === 1 && stopState.pressed === "true" && stopState.pressedCount === 1,
    `activa ${stopState.active}/${stopState.activeCount}, aria-pressed ${stopState.pressed}/${stopState.pressedCount}`);

  /* --- 3. Formulario de cotización: valida y confirma --- */
  const formState = await evaluate(
    client,
    `(async () => {
      const form = document.querySelector("[data-quote-form]");
      if (!form) return { missing: true };
      const status = document.querySelector("[data-quote-status]");
      /* Se intercepta window.open para registrar a qué canal se entrega la
         solicitud sin abrir una pestaña real en el navegador de auditoría. */
      window.__waOpened = null;
      const realOpen = window.open;
      window.open = function (u) { window.__waOpened = u; return { closed: false }; };
      const invalid = [];
      form.querySelectorAll("[required]").forEach((f) => { if (!f.checkValidity()) invalid.push(f.name || f.id); });

      const set = (name, value) => {
        const field = form.querySelector('[name="' + name + '"]');
        if (!field) return;
        if (field.type === "checkbox") field.checked = true;
        else field.value = value;
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
      };
      set("nombre", "Prueba de auditoría");
      set("empresa", "Colcranes QA");
      set("correo", "qa@ejemplo.com");
      set("telefono", "3000000000");
      set("politica", "on");

      const beforeSubmit = {
        emptyInvalid: invalid.length,
        stillInvalid: Array.from(form.querySelectorAll("[required]")).filter((f) => !f.checkValidity()).map((f) => f.name),
        statusState: status ? status.dataset.state ?? null : null,
        statusText: status ? status.textContent.trim() : null,
      };

      form.requestSubmit();
      await new Promise((r) => setTimeout(r, 700));

      return {
        beforeSubmit,
        afterState: status ? status.dataset.state ?? null : null,
        afterText: status ? status.textContent.trim().slice(0, 140) : null,
        afterHasLink: status ? Boolean(status.querySelector("a")) : false,
        waOpened: window.__waOpened ?? null,
        live: status ? status.getAttribute("aria-live") : null,
        role: status ? status.getAttribute("role") : null,
      };
    })()`
  );
  check("Cotización: el formulario existe", !formState.missing);
  check("Cotización: los cinco campos obligatorios existen al cargar", formState.beforeSubmit?.emptyInvalid === 5,
    `${formState.beforeSubmit?.emptyInvalid} obligatorios`);
  check("Cotización: el envío devuelve un estado visible", Boolean(formState.afterState),
    `estado ${formState.beforeSubmit?.statusState} → ${formState.afterState}`);
  check("Cotización: el estado se anuncia al lector de pantalla",
    formState.live === "polite" && formState.role === "status", `aria-live=${formState.live}, role=${formState.role}`);
  check("Cotización: el mensaje describe el siguiente paso",
    Boolean(formState.afterText && formState.afterText.length > 40), `"${formState.afterText}"`);
  check("Cotización: la solicitud se entrega a un canal real",
    formState.afterState === "ok" && Boolean(formState.waOpened) && formState.waOpened.includes("wa.me"),
    `estado ${formState.afterState}, destino ${String(formState.waOpened).slice(0, 70)}…`);
  check("Cotización: el mensaje entregado lleva los datos de la operación",
    Boolean(formState.waOpened && /Colcranes%20QA/.test(formState.waOpened) && /Nombre/.test(formState.waOpened)), "");

  /* --- 4. Menú móvil: abre, marca aria-expanded y cierra --- */
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send("Page.navigate", { url: base });
  await wait(2200);

  const drawerState = await evaluate(
    client,
    `(async () => {
      const drawer = document.querySelector("[data-drawer]");
      const toggle = document.querySelector("[data-drawer-toggle]");
      if (!drawer || !toggle) return { missing: true };
      toggle.click();
      await new Promise((r) => setTimeout(r, 500));
      const opened = { open: drawer.dataset.open, expanded: toggle.getAttribute("aria-expanded"), label: toggle.textContent.trim() };
      const link = drawer.querySelector("a");
      if (link) link.click();
      await new Promise((r) => setTimeout(r, 400));
      return { opened, after: { open: drawer.dataset.open, expanded: toggle.getAttribute("aria-expanded") } };
    })()`
  );
  check("Menú móvil: existe el botón y el panel", !drawerState.missing);
  check("Menú móvil: el botón abre el panel", drawerState.opened?.open === "true" && drawerState.opened?.expanded === "true",
    JSON.stringify(drawerState.opened));
  check("Menú móvil: al elegir un enlace se cierra", drawerState.after?.open === "false" && drawerState.after?.expanded === "false",
    JSON.stringify(drawerState.after));

  /* --- 5. Encabezado: pasa a fondo sólido al salir de la portada --- */
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send("Page.navigate", { url: base });
  await wait(2200);

  const headerState = await evaluate(
    client,
    `(async () => {
      const header = document.querySelector("[data-header]");
      if (!header) return { missing: true };
      const atTop = header.classList.contains("is-solid");
      window.scrollTo(0, 1600);
      await new Promise((r) => setTimeout(r, 600));
      const scrolled = header.classList.contains("is-solid");
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 600));
      return { atTop, scrolled, back: header.classList.contains("is-solid") };
    })()`
  );
  check("Encabezado: transparente en la portada", headerState.atTop === false);
  check("Encabezado: sólido al desplazar", headerState.scrolled === true);
  check("Encabezado: vuelve a transparente arriba", headerState.back === false);

  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
}

console.log(
  failures.length ? `\n${failures.length} comprobación(es) fallida(s)` : "\nTodas las comprobaciones pasaron"
);

client.close();
child.kill();
process.exitCode = failures.length ? 1 : 0;
