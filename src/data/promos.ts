/** Selección editorial explícita: rutas estables y descriptivas, sin depender del orden del directorio. */
import { existsSync } from "node:fs";
export const PROMO_IMAGES = [
  "/images/imagenes-promocionales/puente-grua-amarillo-en-planta.webp",
  "/images/imagenes-promocionales/puente-grua-en-taller-industrial.webp",
  "/images/imagenes-promocionales/equipo-tecnico-en-planta.webp",
  "/images/imagenes-promocionales/montaje-en-nave-industrial.webp",
  "/images/imagenes-promocionales/izaje-en-taller-de-produccion.webp",
  "/images/imagenes-promocionales/equipos-de-izaje-en-nave.webp",
  "/images/imagenes-promocionales/puentes-grua-en-almacen.webp",
  "/images/imagenes-promocionales/puentes-grua-en-linea-de-produccion.webp",
  "/images/proyecto-1/vista-aerea-naves-equipos-izaje.webp",
  "/images/imagenes-promocionales/puente-grua-sobre-maquinaria.webp",
  "/images/imagenes-promocionales/grua-bandera-en-interior.webp",
  "/images/proyecto-1/vista-exterior-nave-industrial.webp",
  "/images/proyecto-1/montaje-cerramiento-nave.webp",
  "/images/imagenes-promocionales/mantenimiento-en-altura-puente-grua.webp",
  "/images/imagenes-promocionales/tecnicos-montaje-puente-grua.webp",
  "/images/proyecto-1/equipos-izaje-interior-nave.webp",
].map((src) => existsSync(`public${src}`) ? src : "/images/planta-bodega.webp");
