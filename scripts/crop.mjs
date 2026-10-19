/**
 * Recorte de regiones de las capturas para inspección detallada.
 * Uso: node scripts/crop.mjs <origen.png> <x> <y> <w> <h> <destino.png> [...más]
 */
import sharp from "sharp";

const [src, ...rest] = process.argv.slice(2);
if (!src || rest.length % 5 !== 0) {
  console.error("Uso: node scripts/crop.mjs <origen> <x> <y> <w> <h> <destino> [...]");
  process.exit(1);
}

for (let i = 0; i < rest.length; i += 5) {
  const [x, y, w, h, out] = rest.slice(i, i + 5);
  const meta = await sharp(src).metadata();
  const left = Math.max(0, Math.min(Number(x), meta.width - 1));
  const top = Math.max(0, Math.min(Number(y), meta.height - 1));
  const width = Math.min(Number(w), meta.width - left);
  const height = Math.min(Number(h), meta.height - top);
  await sharp(src).extract({ left, top, width, height }).toFile(out);
  console.log(`ok ${out} [${width}x${height}] de ${meta.width}x${meta.height}`);
}
