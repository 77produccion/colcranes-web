/** Importación explícita de TODAS las fotografías; no se ejecuta durante el build.
 * Repetir este comando restaura también las fotografías descartadas de public.
 * Los originales se leen, nunca se modifican ni se eliminan.
 */
import sharp from "sharp";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outputDir = "public/images/proyecto-1";
const manifest = "src/data/project-photos.json";
const previous = existsSync(manifest)
  ? JSON.parse(await readFile(manifest, "utf8"))
  : (await import("../src/data/project-gallery.ts")).PROJECT_GALLERY;
const selected = new Map([
  ["DJI_0452.JPG", "vista-aerea-naves-equipos-izaje"],
  ["DJI_0458.JPG", "equipos-izaje-interior-nave"],
  ["DJI_0512.JPG", "vista-exterior-nave-industrial"],
  ["DJI_0388.JPG", "estructura-metalica-en-montaje"],
  ["DJI_0484.JPG", "cubierta-nave-vista-aerea"],
  ["DJI_0508.JPG", "montaje-cerramiento-nave"],
]);
const sources = [];
for (const dir of ["source-media/images/proyecto-1", "source-media/videos/videos-proyecto-1"]) {
  for (const file of (await readdir(dir)).filter((file) => /\.jpe?g$/i.test(file)).sort()) sources.push({ file, path: join(dir, file) });
}
const priority = [...selected.keys(), "DJI_0459.JPG", "DJI_0520.JPG", "DJI_0521.JPG"];
sources.sort((a, b) => {
  const ai = priority.indexOf(a.file), bi = priority.indexOf(b.file);
  return (ai < 0 ? priority.length : ai) - (bi < 0 ? priority.length : bi) || a.file.localeCompare(b.file);
});
const photos = sources.map(({ file }) => {
  const number = Number(file.match(/\d+/)[0]);
  const name = selected.get(file) || `nave-industrial-${file.replace(/\.[^.]+$/, "").replaceAll("_", "-").toLowerCase()}`;
  const image = `/images/proyecto-1/${name}.webp`;
  const existing = previous.find((photo) => photo.source === file || photo.image === image);
  const interior = [458, 459, 520, 521].includes(number);
  const caption = interior ? "Equipos de izaje en el interior de la nave." : number < 452 ? "Estructura metálica de las naves durante la obra." : number < 502 ? "Avance de las cubiertas y vista del conjunto industrial." : "Detalle exterior de la nave durante la obra.";
  const description = interior
    ? "En el interior de la nave se observan puentes grúa y grúas bandera amarillas, sus apoyos y la estructura de cubierta. La fotografía permite apreciar la disposición de los equipos y el espacio de trabajo."
    : number < 452
      ? "Registro de la estructura metálica y del entorno de las naves durante la obra. Este encuadre complementa las vistas de los equipos y de las distintas zonas del conjunto."
      : number < 502
        ? "Vista del avance de la obra y de las cubiertas de las naves. La fotografía forma parte del registro del conjunto industrial desde distintos puntos de observación."
        : "Registro del exterior de la nave, sus cerramientos y el entorno de obra. La imagen complementa las fotografías de la estructura y de los equipos de izaje en el interior.";
  return { image, alt: existing?.alt || `${caption.replace(/\.$/, "")} Registro ${file.replace(/\.JPG$/i, "")}`, caption: existing?.caption || caption, description: existing?.description || description, source: file };
});

await mkdir(outputDir, { recursive: true });
let index = 0;
async function worker() {
  while (index < photos.length) {
    const position = index++;
    const photo = photos[position];
    const source = sources[position].path;
    for (const width of [640, 960, 1600]) {
      const output = `public${photo.image.replace(/\.webp$/, width === 1600 ? ".webp" : `.w${width}.webp`)}`;
      if (!existsSync(output)) await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(output);
    }
    for (const width of [640, 1600]) {
      const output = `public${photo.image.replace(/\.webp$/, width === 1600 ? ".avif" : `.w${width}.avif`)}`;
      if (!existsSync(output)) await sharp(source).rotate().resize({ width, withoutEnlargement: true }).avif({ quality: 52, effort: 4 }).toFile(output);
    }
    console.log(`${position + 1}/${photos.length}: ${photo.source} -> ${photo.image}`);
  }
}
await Promise.all([worker(), worker()]);
await writeFile(manifest, JSON.stringify(photos, null, 2) + "\n");
const files = (await readdir(outputDir)).filter((file) => /\.(webp|avif)$/.test(file));
const bytes = (await Promise.all(files.map(async (file) => (await stat(join(outputDir, file))).size))).reduce((a, b) => a + b, 0);
console.log(`Listas ${photos.length} fotografías; ${files.length} derivados, ${(bytes / 1048576).toFixed(2)} MiB. Originales intactos.`);
