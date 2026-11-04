import sharp from "sharp";
import { stat } from "node:fs/promises";

// Generate derivatives only; keep the source photographs and logos intact.
for (const width of [640, 960, 1600]) {
  const output = `public/images/hero-video-poster.w${width}.avif`;
  await sharp("public/images/hero-video-poster.webp").resize({ width, withoutEnlargement: true })
    .avif({ quality: 45, effort: 6 }).toFile(output);
  console.log(`${output}: ${(await stat(output)).size} bytes`);
}
for (const name of ["colcranes-logo-oscura", "colcranes-logo-clara", "logo-colcranes-dark-480"]) {
  const output = `public/images/${name}.w320.webp`;
  await sharp(`public/images/${name}.webp`).resize({ width: 320, withoutEnlargement: true })
    .webp({ quality: 88, alphaQuality: 95, effort: 6 }).toFile(output);
  console.log(`${output}: ${(await stat(output)).size} bytes`);
}
