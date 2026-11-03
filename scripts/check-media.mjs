import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory()
    ? walk(join(dir, entry.name)) : [join(dir, entry.name)]))).flat();
}

const files = await walk("dist");
const pages = files.filter((file) => file.endsWith(".html"));
const references = new Set();
const unescape = (value) => value.replaceAll("&amp;", "&").replaceAll("&#39;", "'").replaceAll("&quot;", '"');
const add = (url) => {
  if (!url.startsWith("/") || url.startsWith("//")) return;
  references.add(decodeURI(unescape(url).split(/[?#]/)[0]));
};

for (const file of files.filter((file) => /\.(html|css)$/.test(file))) {
  const content = await readFile(file, "utf8");
  for (const match of content.matchAll(/(?:src|href|poster|data-src|data-mobile-src)="([^"]+)"/g)) add(match[1]);
  for (const match of content.matchAll(/srcset="([^"]+)"/g)) {
    for (const entry of match[1].split(",")) add(entry.trim().split(/\s+/)[0]);
  }
  for (const match of content.matchAll(/url\(["']?([^"')]+)["']?\)/g)) add(match[1]);
  for (const match of content.matchAll(/data-sources="([^"]+)"/g)) {
    JSON.parse(unescape(match[1])).forEach(add);
  }
}

const missing = [...references].filter((url) => !existsSync(join("dist", url)) && !existsSync(join("dist", url, "index.html")));
assert.deepEqual(missing, [], `Referencias locales inexistentes: ${missing.join(", ")}`);
assert.ok(!files.some((file) => /\.(zip|dng|psd|mov)$/i.test(file)), "No publicar originales pesados.");
assert.equal(pages.length, 24);
const home = await readFile("dist/index.html", "utf8");
assert.equal((home.match(/data-mobile-src=/g) ?? []).length, 9);
assert.ok(home.includes("srcset="), "Faltan imágenes adaptativas.");
assert.ok(home.includes("gancho-completo.webp"), "Falta la transición del gancho.");
const bytes = (await Promise.all(files.map(async (file) => (await stat(file)).size))).reduce((sum, value) => sum + value, 0);
console.log(`OK: ${pages.length} páginas, ${references.size} referencias locales, sin recursos rotos ni originales pesados.`);
console.log(`Publicación completa: ${(bytes / 1048576).toFixed(2)} MB (no equivale a la descarga inicial).`);
