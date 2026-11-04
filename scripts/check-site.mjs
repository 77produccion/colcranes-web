import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory()
    ? walk(join(directory, entry.name)) : [join(directory, entry.name)]))).flat();
}

const pages = (await walk("dist")).filter((file) => file.endsWith(".html"));
const titles = new Set();
const canonicals = new Set();
const sitemap = await readFile("dist/sitemap.xml", "utf8");
for (const file of pages) {
  const html = await readFile(file, "utf8");
  const route = `/${relative("dist", file).split(sep).join("/").replace(/index\.html$/, "").replace(/\/$/, "")}`;
  const check = (condition, message) => assert.ok(condition, `${route}: ${message}`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  check(title && !titles.has(title), "Título ausente o duplicado");
  titles.add(title);
  check(/<html[^>]+lang="es"/.test(html), "Falta idioma español");
  check((html.match(/<h1(?:\s|>)/g) ?? []).length === 1, "Se requiere un único H1");
  check(/<main[^>]+id="contenido"/.test(html), "Falta destino del salto al contenido");
  check(/<meta name="description" content="[^"]+"/.test(html), "Falta descripción SEO");
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  check(canonical === `https://colcranes.com${route}`, "Canonical incorrecto");
  check(!canonicals.has(canonical), "Canonical duplicado");
  canonicals.add(canonical);
  check(sitemap.includes(`<loc>${canonical}</loc>`), "Página ausente del sitemap");
  check(/<meta property="og:image" content="https:\/\//.test(html), "Falta imagen social absoluta");
  check(!/fonts\.(?:googleapis|gstatic)\.com/.test(html), "Fuentes externas bloquean la carga");
  const ids = new Set();
  for (const match of html.matchAll(/\sid="([^"]+)"/g)) {
    check(!ids.has(match[1]), `ID duplicado: ${match[1]}`);
    ids.add(match[1]);
  }
  // Astro may serialize empty decorative alt attributes as just `alt`.
  for (const match of html.matchAll(/<img\b[^>]*>/g)) check(/\salt(?:\s|=|>)/.test(match[0]), "Imagen sin atributo alt");
  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    const schema = JSON.parse(match[1]);
    check(schema["@context"] === "https://schema.org", "Datos estructurados inválidos");
  }
}
assert.equal((sitemap.match(/<loc>/g) ?? []).length, pages.length, "Sitemap y páginas no coinciden");
console.log(`OK: ${pages.length} páginas con H1, títulos únicos, metadatos, canonical, sitemap, imágenes con alt y sin IDs duplicados.`);
