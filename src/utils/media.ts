import { existsSync } from "node:fs";
import sharp from "sharp";

const widths = new Map<string, Promise<number | undefined>>();

/** Variantes locales: el navegador elige según el ancho y la densidad de píxeles. */
export async function responsiveImage(src: string, sizes = "100vw") {
  if (!src.startsWith("/images/") || !src.endsWith(".webp")) return {};
  const variants = [640, 960].flatMap((width) => {
    const url = src.replace(/\.webp$/, `.w${width}.webp`);
    return existsSync(`public${decodeURI(url)}`) ? [`${url} ${width}w`] : [];
  });
  if (!variants.length) return {};
  const path = `public${decodeURI(src)}`;
  if (!widths.has(path)) widths.set(path, sharp(path).metadata().then((meta) => meta.width));
  const width = await widths.get(path);
  return { srcset: [...variants, `${src} ${width}w`].join(", "), sizes };
}
