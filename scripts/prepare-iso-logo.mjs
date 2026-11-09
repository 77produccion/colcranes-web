import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// El PNG entregado se conserva intacto. Sólo se genera el derivado web.
await mkdir("public/images/logos", { recursive: true });
const { width, height, size } = await sharp("public/logo-ISO.png")
  .trim()
  .resize({ width: 320, withoutEnlargement: true })
  .webp({ quality: 90, alphaQuality: 95, effort: 6 })
  .toFile("public/images/logos/iso-logo.webp");
console.log(`ISO: ${width} × ${height}, ${(size / 1024).toFixed(1)} KiB`);
