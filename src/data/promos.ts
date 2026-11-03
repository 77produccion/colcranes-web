/**
 * Fotografía promocional real de Colcranes.
 * Se listan los archivos de `public/images/imagenes-promocionales/` para poder
 * reutilizarlos en las secciones del home sin duplicar rutas.
 */
import { existsSync, readdirSync } from "node:fs";

const promoDir = "public/images/imagenes-promocionales";

export const PROMO_IMAGES = existsSync(promoDir)
  ? readdirSync(promoDir)
      .filter((file) => /\.(jpe?g|png|webp|avif)$/i.test(file))
      .sort()
      .map((file) => encodeURI(`/images/imagenes-promocionales/${file}`))
  : [];
