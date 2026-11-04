import { existsSync } from "node:fs";
import sharp from "sharp";

const dimensions = new Map<string, Promise<{ width: number; height: number }>>();

/** Variantes locales: el navegador elige según el ancho y la densidad de píxeles. */
export async function responsiveImage(src: string, sizes = "100vw"): Promise<{ width?: number; height?: number; srcset?: string; sizes?: string }> {
  if (!src.startsWith("/images/") || !/\.(webp|svg|png|jpe?g)$/i.test(src)) return {};
  const path = `public${decodeURI(src)}`;
  if (!existsSync(path)) return {};
  if (!dimensions.has(path)) dimensions.set(path, sharp(path).metadata().then((meta) => ({ width: meta.width!, height: meta.height! })));
  const { width, height } = await dimensions.get(path)!;
  const variants = (src.endsWith(".webp") ? [320, 640, 960] : []).filter((candidate) => candidate < width).flatMap((width) => {
    const url = src.replace(/\.webp$/, `.w${width}.webp`);
    return existsSync(`public${decodeURI(url)}`) ? [`${url} ${width}w`] : [];
  });
  return { width, height, ...(variants.length ? { srcset: [...variants, `${src} ${width}w`].join(", "), sizes } : {}) };
}
