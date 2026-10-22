/**
 * Pipeline de assets Colcranes.
 * Recorta y optimiza fotografía real desde /docs hacia /public/images.
 * Ejecutar: node scripts/build-assets.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "docs";
const OUT = "public/images";
await mkdir(OUT, { recursive: true });

const jobs = [
  {
    name: "planta-bodega.webp",
    from: `${SRC}/06 REDES SOCIALES Y PIEZAS/LINKEDIN/slide-2.png`,
    // Nave real con puente grúa amarillo instalado. Se elimina el bloque de
    // titular inferior y la marca de agua de la pieza de redes.
    crop: { left: 340, top: 0, width: 1820, height: 1330 },
    width: 1800,
  },
  {
    name: "planta-puente-marca.webp",
    from: `${SRC}/04 IDENTIDAD DE MARCA/MARCA 2026/celular-02-planta-fondo cel.png`,
    // Puente grúa Colcranes rotulado, instalado y en operación. Se recorta la
    // franja superior para descartar el logotipo y el tagline sobreimpresos:
    // el isotipo blanco empieza en y=1627, así que el corte queda por encima.
    crop: { left: 0, top: 735, width: 1170, height: 870 },
    width: 1200,
  },
  {
    name: "crane-runway.webp",
    from: "public/images/hero-crane.jpg",
    // Detalle de la misma nave: carro de traslación sobre la vía de rodadura y
    // línea de alimentación por barras. Es el encuadre que documenta recorrido
    // y electrificación, sin repetir la composición de la portada.
    crop: { left: 1240, top: 255, width: 808, height: 606 },
    width: 1200,
  },
  {
    name: "crane-160t.webp",
    from: `${SRC}/06 REDES SOCIALES Y PIEZAS/PIEZAS MARKETING/160t Hoist and Crane.jpg`,
    crop: { left: 0, top: 20, width: 4200, height: 1880 },
    width: 2000,
  },
  {
    name: "hoist-100t.webp",
    from: `${SRC}/06 REDES SOCIALES Y PIEZAS/PIEZAS MARKETING/_mg_8923_full_view_no_path_100ton.jpg`,
    crop: { left: 93, top: 262, width: 2904, height: 2222 },
    width: 1700,
  },
  {
    name: "hoist-open-winch.webp",
    from: `${SRC}/06 REDES SOCIALES Y PIEZAS/PIEZAS MARKETING/_mg_8975_top_view.jpg`,
    crop: { left: 139, top: 340, width: 2506, height: 1814 },
    width: 1700,
  },
  {
    name: "grua-portico.webp",
    from: `${SRC}/04 IDENTIDAD DE MARCA/MARCA 2026/sEMI PORTICO nova.png`,
    width: 1700,
  },
  {
    name: "colcranes-logo-clara.png",
    from: `${SRC}/04 IDENTIDAD DE MARCA/MARCA 2026/COLCRANES-logoC-superficie-clara2.png`,
    width: 1200,
  },
  {
    name: "colcranes-logo-oscura.png",
    from: `${SRC}/04 IDENTIDAD DE MARCA/MARCA 2026/COLCRANES-logoC-superficie-oscura2.png`,
    width: 1200,
  },
];

for (const job of jobs) {
  try {
    let img = sharp(job.from, { failOn: "none" });
    if (job.crop) img = img.extract(job.crop);
    img = img.resize({ width: job.width, withoutEnlargement: true });
    img = job.name.endsWith(".png")
      ? img.png({ compressionLevel: 9 })
      : img.webp({ quality: 82 });
    await img.toFile(`${OUT}/${job.name}`);
    console.log("ok  ", job.name);
  } catch (error) {
    console.log("FAIL", job.name, error.message);
  }
}

/* --------------------------------------------------------------------------
   Logos de firmas representadas.
   Los archivos originales llegan en tres estados distintos: uno opaco con
   fondo claro, y dos en negro sobre transparencia. Sobre la franja oscura
   ninguno se leía. Se normalizan a blanco sobre transparencia tomando la
   luminancia como canal alfa, y se iguala el peso óptico por media geométrica
   para que ninguna marca domine la fila.
   -------------------------------------------------------------------------- */
const logoJobs = [
  { name: "brand-world-hoist.png", from: `${SRC}/04 IDENTIDAD DE MARCA/MARCA 2026/World_Hoist.png` },
  { name: "brand-diepa.png", from: `${SRC}/04 IDENTIDAD DE MARCA/MARCA 2026/DIEPA.png` },
  { name: "brand-srp.png", from: `${SRC}/04 IDENTIDAD DE MARCA/MARCA 2026/SRP_Cranes.png` },
];

const opticalSize = 320;

for (const job of logoJobs) {
  try {
    const { data, info } = await sharp(job.from, { failOn: "none" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const out = Buffer.alloc(info.width * info.height * 4);
    for (let i = 0; i < info.width * info.height; i += 1) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      const a = data[i * 4 + 3];
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      /* Todo lo más claro que 215 se considera fondo; por debajo se reescala
         para conservar el antialias de los trazos. */
      let ink = (215 - lum) / 215;
      ink = ink < 0.08 ? 0 : Math.min(1, (ink - 0.08) / 0.92);
      out[i * 4] = 255;
      out[i * 4 + 1] = 255;
      out[i * 4 + 2] = 255;
      out[i * 4 + 3] = Math.round(ink * (a / 255) * 255);
    }

    const scale = opticalSize / Math.sqrt(info.width * info.height);
    await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
      .trim({ threshold: 1 })
      .resize({ width: Math.round(info.width * scale), withoutEnlargement: false })
      .png({ compressionLevel: 9 })
      .toFile(`${OUT}/${job.name}`);
    console.log("ok  ", job.name);
  } catch (error) {
    console.log("FAIL", job.name, error.message);
  }
}


/* --------------------------------------------------------------------------
   Hero propio (sin recorte residual superior izquierdo) y Open Graph 1200x630
   -------------------------------------------------------------------------- */
try {
  const meta = await sharp(`${OUT}/planta-bodega.webp`).metadata();
  await sharp(`${OUT}/planta-bodega.webp`)
    .extract({ left: 150, top: 0, width: meta.width - 150, height: meta.height })
    .resize({ width: 1920, withoutEnlargement: false })
    .webp({ quality: 86 })
    .toFile(`${OUT}/hero-colcranes-obra.webp`);
  console.log("ok  ", "hero-colcranes-obra.webp");

  const bg = await sharp(`${OUT}/hero-colcranes-obra.webp`)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .toBuffer();

  const overlaySvg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1D1D1B" stop-opacity="0.88"/>
        <stop offset="55%" stop-color="#2D2E83" stop-opacity="0.72"/>
        <stop offset="100%" stop-color="#1D1D1B" stop-opacity="0.92"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <rect x="0" y="618" width="1200" height="12" fill="#00AEEF"/>
    <text x="80" y="360" fill="#FFFFFF" font-family="Arial, sans-serif" font-weight="800" font-size="52" letter-spacing="1">EQUIPOS PARA IZAJE INDUSTRIAL</text>
    <text x="80" y="420" fill="#00AEEF" font-family="Arial, sans-serif" font-weight="700" font-size="28" letter-spacing="1.5">PUENTES GRÚA · PÓRTICOS · POLIPASTOS · SERVICIO TÉCNICO</text>
    <text x="80" y="545" fill="#FFFFFF" fill-opacity="0.8" font-family="Arial, sans-serif" font-weight="600" font-size="22" letter-spacing="2">COLCRANES S.A.S. · BARRANQUILLA &amp; BOGOTÁ · COLOMBIA</text>
  </svg>`);

  const logo = await sharp(`${OUT}/colcranes-logo-oscura.png`)
    .resize({ width: 380 })
    .toBuffer();

  await sharp(bg)
    .composite([
      { input: overlaySvg, top: 0, left: 0 },
      { input: logo, top: 90, left: 80 },
    ])
    .jpeg({ quality: 90 })
    .toFile(`${OUT}/og-colcranes.jpg`);
  console.log("ok  ", "og-colcranes.jpg");
} catch (error) {
  console.log("FAIL og/hero", error.message);
}
