/** Ejecutar una vez para importar originales; repetir desde source-media sin recomprimir derivados.
 * node scripts/prepare-2026-media.mjs images
 * FFMPEG_PATH=... node scripts/prepare-2026-media.mjs videos (tras revisar los clips)
 * QPDF_PATH=... node scripts/prepare-2026-media.mjs pdf
 */
import sharp from "sharp";
import { existsSync } from "node:fs";
import { mkdir, readdir, rename, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { spawn } from "node:child_process";

const mode = process.argv[2] ?? "images";
const sourceProject = "source-media/images/proyecto-1";
const sourceVideos = "source-media/videos/videos-proyecto-1";
async function archive(from, to) {
  if (!existsSync(from)) return;
  if (existsSync(to)) throw new Error(`No se sobrescribe el original: ${to}`);
  await mkdir(dirname(to), { recursive: true });
  await rename(from, to);
}
async function image(source, output, avif = false) {
  await mkdir(dirname(output), { recursive: true });
  for (const width of [640, 960, 1600]) {
    const dest = output.replace(/\.webp$/, width === 1600 ? ".webp" : `.w${width}.webp`);
    await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 6 }).toFile(dest);
  }
  if (avif) for (const width of [640, 1600]) {
    await sharp(source).rotate().resize({ width, withoutEnlargement: true }).avif({ quality: 55, effort: 5 }).toFile(output.replace(/\.webp$/, width === 1600 ? ".avif" : `.w${width}.avif`));
  }
  console.log(`${output}: ${Math.round((await stat(output)).size / 1024)} KB`);
}

if (mode === "images") {
  for (const file of await readdir("public/images/proyecto-1")) {
    if (/\.jpe?g$/i.test(file)) await archive(join("public/images/proyecto-1", file), join(sourceProject, file));
  }
  await archive("public/videos/videos-proyecto-1", sourceVideos);
  await archive("public/videos/wetransfer_pagina-web-colcranes_2026-11-04_2217.zip", "source-media/videos/wetransfer_pagina-web-colcranes_2026-11-04_2217.zip");
  await archive("public/catalogos/Brochure Colcranes 2026.pdf", "source-media/catalogos/Brochure Colcranes 2026.pdf");
  await archive("public/catalogos/colcranes-catalogo-2023.pdf", "source-media/catalogos/colcranes-catalogo-2023.pdf");
  // El PDF vigente se copia sin pérdida; se puede optimizar aparte conservando su original.
  const { copyFile } = await import("node:fs/promises");
  if (!existsSync("public/catalogos/colcranes-catalogo-2026.pdf")) await copyFile("source-media/catalogos/Brochure Colcranes 2026.pdf", "public/catalogos/colcranes-catalogo-2026.pdf");
  const selected = [
    ["DJI_0452.JPG", "vista-aerea-naves-equipos-izaje"],
    ["DJI_0458.JPG", "equipos-izaje-interior-nave"],
    ["DJI_0512.JPG", "vista-exterior-nave-industrial"],
    ["DJI_0388.JPG", "estructura-metalica-en-montaje"],
    ["DJI_0484.JPG", "cubierta-nave-vista-aerea"],
    ["DJI_0508.JPG", "montaje-cerramiento-nave"],
  ];
  for (const [file, name] of selected) await image(join(sourceProject, file), `public/images/proyecto-1/${name}.webp`, true);
  const promoNames = [
    "puente-grua-amarillo-en-planta", "puente-grua-en-taller-industrial", "equipo-tecnico-en-planta", "montaje-en-nave-industrial",
    "izaje-en-taller-de-produccion", "equipos-de-izaje-en-nave", "puentes-grua-en-almacen", "puentes-grua-en-linea-de-produccion",
    null, "puente-grua-sobre-maquinaria", "grua-bandera-en-interior", null, null, "mantenimiento-en-altura-puente-grua", "tecnicos-montaje-puente-grua", null,
  ];
  const promos = (await readdir("source-media/images/imagenes-promocionales")).filter((file) => /\.jpe?g$/i.test(file)).sort();
  for (let index = 0; index < promos.length; index++) {
    if (promoNames[index]) await image(join("source-media/images/imagenes-promocionales", promos[index]), `public/images/imagenes-promocionales/${promoNames[index]}.webp`);
  }
  // Retirar exclusivamente los derivados antiguos, preservados en el archivo local.
  for (const file of await readdir("public/images/imagenes-promocionales")) {
    if (file.startsWith("WhatsApp Image ")) await archive(join("public/images/imagenes-promocionales", file), join("source-media/legacy-promo-derivatives", file));
  }
} else if (mode === "videos") {
  const ffmpeg = process.env.FFMPEG_PATH;
  if (!ffmpeg) throw new Error("Defina FFMPEG_PATH.");
  // Únicamente tomas reales DJI; ningún render HMV se incorpora al hero.
  const clips = [
    { file: "DJI_0406.MP4", name: "10-nave-industrial", start: 18 },
    { file: "DJI_0472.MP4", name: "11-equipos-en-nave", start: 3 },
    { file: "DJI_0519.MP4", name: "12-gruas-en-nave", start: 14 },
  ];
  const report = [];
  for (const clip of clips) for (const mobile of [false, true]) {
    const output = `public/videos/hero/${clip.name}${mobile ? "-mobile" : ""}.mp4`;
    const filter = mobile
      ? "crop=ih*4/5:ih,scale=864:1080:flags=lanczos,fps=24"
      : "scale=1920:1080:force_original_aspect_ratio=decrease:flags=lanczos,fps=24";
    await new Promise((resolve, reject) => {
      const child = spawn(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-ss", String(clip.start), "-i", join(sourceVideos, clip.file), "-t", "7", "-map", "0:v:0", "-an", "-sn", "-dn", "-map_metadata", "-1", "-vf", filter, "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-maxrate", mobile ? "2M" : "4M", "-bufsize", mobile ? "4M" : "8M", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-threads", "2", output], { stdio: "inherit" });
      child.on("error", reject);
      child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`FFmpeg: ${code}`)));
    });
    const bytes = (await stat(output)).size;
    report.push({ source: clip.file, output, bytes, mobile });
    console.log(`${output}: ${(bytes / 1048576).toFixed(2)} MB`);
  }
  await writeFile("source-media/project-2026-video-report.json", JSON.stringify(report, null, 2));
} else if (mode === "pdf") {
  const qpdf = process.env.QPDF_PATH;
  if (!qpdf) throw new Error("Defina QPDF_PATH con el ejecutable de QPDF.");
  const source = "source-media/catalogos/Brochure Colcranes 2026.pdf";
  const output = "public/catalogos/colcranes-catalogo-2026.pdf";
  await new Promise((resolve, reject) => {
    const child = spawn(qpdf, ["--object-streams=generate", "--recompress-flate", "--compression-level=9", "--optimize-images", "--jpeg-quality=85", source, output], { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`QPDF: ${code}`)));
  });
  console.log(`Catálogo: ${((await stat(output)).size / 1048576).toFixed(2)} MB`);
} else throw new Error("Modo esperado: images, videos o pdf");
