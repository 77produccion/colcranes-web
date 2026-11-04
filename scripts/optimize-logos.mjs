import sharp from "sharp";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

// Only generate smaller derivatives. Never recompress or overwrite base logos.
for (const directory of ["public/images/marks-logo", "public/images/logos/trim"]) {
  for (const name of await readdir(directory)) {
    if (!name.endsWith(".webp") || /\.w\d+\.webp$/.test(name)) continue;
    const source = join(directory, name);
    const { width } = await sharp(source).metadata();
    if (width <= 320) continue;
    const output = source.replace(/\.webp$/, ".w320.webp");
    await sharp(source).resize({ width: 320, withoutEnlargement: true })
      .webp({ quality: 85, alphaQuality: 95, effort: 6 }).toFile(output);
    console.log(output);
  }
}
