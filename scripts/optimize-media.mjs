import sharp from "sharp";
import { spawn } from "node:child_process";
import { access, copyFile, mkdir, readFile, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";

const publicDir = "public";
const archive = "source-media";
const mode = process.argv[2] ?? "images";

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory()
    ? walk(join(dir, entry.name)) : [join(dir, entry.name)]));
  return nested.flat();
}

async function backup(file) {
  const dest = join(archive, relative(publicDir, file));
  const candidates = [dest, ...(/\.webp$/i.test(dest) ? [".png", ".jpg", ".jpeg"].map((ext) => dest.replace(/\.webp$/i, ext)) : [])];
  for (const candidate of candidates) {
    try { await access(candidate); return candidate; } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  await mkdir(dirname(dest), { recursive: true });
  try { await copyFile(file, dest, 1); } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
  return dest;
}

if (mode === "images") {
  const files = (await walk(publicDir)).filter((file) => /\.(png|jpe?g|webp)$/i.test(file) && !/\.w\d+\.webp$/.test(file));
  const report = [];
  for (const file of files) {
    const original = await backup(file);
    const before = (await stat(original)).size;
    const normalized = file.replaceAll("\\", "/");
    // Este archivo sólo se usa para preparar los recortes, no en la web.
    if (normalized === "public/images/assets/brazo.png") {
      await unlink(file);
      report.push({ file: normalized, before, after: 0, archived: true });
      continue;
    }
    const rootIcon = dirname(file) === publicDir;
    const social = normalized.endsWith("/og-colcranes.jpg");
    const logo = /logo|\/brand-|\/iso-|\/favicon/i.test(normalized);
    const beam = normalized.endsWith("/stats-beam.webp");
    const output = rootIcon || social ? file : file.replace(/\.(png|jpe?g)$/i, ".webp");
    let pipeline = sharp(original).rotate();
    if (rootIcon) {
      pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 95 });
    } else if (social) {
      pipeline = pipeline.resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true });
    } else {
      pipeline = pipeline.resize({
        width: beam ? 3840 : logo ? 800 : 1600,
        height: beam ? 360 : logo ? 600 : 1800,
        fit: "inside",
        withoutEnlargement: true,
      }).webp({ quality: logo ? 88 : beam ? 86 : 78, alphaQuality: 95, effort: 6 });
    }
    const result = await pipeline.toBuffer();
    const sameFormat = extname(output) === extname(original);
    // No incrementar archivos que ya eran más pequeños.
    await writeFile(output, sameFormat && before < result.length ? await readFile(original) : result);
    if (output !== file) await unlink(file);
    const { width } = await sharp(output).metadata();
    if (!rootIcon && !social && !logo && !normalized.includes("/assets/") && width > 1000) {
      for (const size of [640, 960]) {
        if (width <= size) continue;
        await sharp(original).rotate().resize({ width: size, withoutEnlargement: true })
          .webp({ quality: 76, effort: 6 })
          .toFile(output.replace(/\.webp$/, `.w${size}.webp`));
      }
    }
    const after = (await stat(output)).size;
    report.push({ file: normalized, output: output.replaceAll("\\", "/"), before, after });
    console.log(`${Math.round(before / 1024)} -> ${Math.round(after / 1024)} KB: ${output}`);
  }
  await writeFile(join(archive, "images-report.json"), JSON.stringify(report, null, 2));
  const before = report.reduce((sum, item) => sum + item.before, 0);
  const after = report.reduce((sum, item) => sum + item.after, 0);
  console.log(`Imágenes base: ${(before / 1048576).toFixed(2)} -> ${(after / 1048576).toFixed(2)} MB`);
} else if (mode === "videos") {
  const ffmpeg = process.env.FFMPEG_PATH;
  if (!ffmpeg) throw new Error("Defina FFMPEG_PATH con la ruta al ejecutable FFmpeg.");
  const files = (await walk("public/videos/hero")).filter((file) => file.endsWith(".mp4") && !file.endsWith("-mobile.mp4"));
  const report = [];
  for (const file of files) {
    const original = await backup(file);
    for (const mobile of [false, true]) {
      const output = mobile ? file.replace(/\.mp4$/, "-mobile.mp4") : file;
      const args = ["-hide_banner", "-loglevel", "error", "-y", "-i", original,
        "-map", "0:v:0", "-an", "-sn", "-dn", "-map_metadata", "-1",
        "-vf", `scale=w=-2:h='min(ih,${mobile ? 854 : 1280})':flags=lanczos,fps=${mobile ? 20 : 24}`,
        "-c:v", "libx264", "-preset", "slow", "-crf", mobile ? "30" : "28",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-threads", "2", output];
      await new Promise((resolve, reject) => {
        const child = spawn(ffmpeg, args, { stdio: "inherit" });
        child.on("error", reject);
        child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`FFmpeg terminó con código ${code}`)));
      });
      const before = (await stat(original)).size;
      const after = (await stat(output)).size;
      report.push({ file: output, before, after, mobile });
      console.log(`${Math.round(before / 1024)} -> ${Math.round(after / 1024)} KB: ${output}`);
    }
  }
  await writeFile(join(archive, "videos-report.json"), JSON.stringify(report, null, 2));
} else {
  throw new Error("Modo esperado: images o videos");
}
