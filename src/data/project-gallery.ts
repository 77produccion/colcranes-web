import { existsSync } from "node:fs";
import photos from "./project-photos.json";

/** Borrar el WebP principal excluye la fotografía en la siguiente compilación.
 * El build nunca regenera fotos descartadas ni necesita los originales locales.
 */
export const PROJECT_GALLERY = photos.filter((photo) => existsSync(`public${photo.image}`));
