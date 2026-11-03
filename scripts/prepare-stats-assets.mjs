import sharp from "sharp";

// Derivados del PNG original; el remuestreo mejora la presentación, no añade
// detalle fotográfico. Mantener el original para sustituirlo por uno de más calidad.
const source = "source-media/images/assets/brazo.png";

await sharp(source)
  .extract({ left: 300, top: 394, width: 360, height: 110 })
  .resize(3840, 360, { kernel: "lanczos3", fit: "fill" })
  .sharpen({ sigma: 0.6 })
  .webp({ quality: 94 })
  .toFile("public/images/assets/stats-beam.webp");

const { data, info } = await sharp(source)
  .extract({ left: 698, top: 430, width: 244, height: 245 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// Separar el polipasto azul de la viga amarilla, sin tocar el gancho inferior.
for (let y = 0; y < 90; y++) {
  for (let x = 0; x < info.width; x++) {
    const offset = (y * info.width + x) * 4;
    const [r, g, b] = data.subarray(offset, offset + 3);
    if ((r > g * 1.12 && g > b * 1.25) || (r > g * 1.4 && r > b * 1.4)) {
      data[offset + 3] = 0;
    }
  }
}

await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .resize({ width: 732, kernel: "lanczos3" })
  .sharpen({ sigma: 0.6 })
  .webp({ quality: 96, alphaQuality: 100 })
  .toFile("public/images/assets/stats-hoist.webp");

console.log("Preparados: viga adaptable de 3840 px y polipasto independiente.");
