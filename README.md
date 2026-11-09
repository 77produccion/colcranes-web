# COLCRANES web

Sitio corporativo de Colcranes, construido con Astro.

## Requisitos

- Node.js `>=22.22.0`
- npm

## Desarrollo

```sh
npm install
npm run dev
```

## Producción

```sh
npm run build
npm run preview
```

Las imágenes publicadas se encuentran en `public/images`. El archivo resultante del build se genera en `dist/` y no se versiona.

## Optimización multimedia

- Fotografías y transparencias: WebP, con variantes `.w640.webp` y `.w960.webp` para pantallas pequeñas.
- Videos: MP4 H.264 sin audio, 24 fps para escritorio y 20 fps en las variantes `-mobile.mp4`; sólo se descarga la variante elegida.
- Los SVG se conservan como vectores. Los iconos de Apple/navegador siguen en PNG y la imagen social en JPEG por compatibilidad.
- El PDF conserva su formato descargable y su visor se carga de forma diferida.
- `source-media/` guarda los originales localmente, está ignorada por Git y queda fuera de `public/`. Nunca colocar ZIP, RAW o material de edición dentro de `public/`.

### Material 2026

- `public/catalogos/colcranes-catalogo-2026.pdf` es el único catálogo publicado. El enlace anterior redirige al vigente en Vercel.
- El proyecto nuevo muestra una fotografía a la vez, a la izquierda en escritorio, junto a una descripción que cambia suavemente con cada foto. Incluye las 86 fotografías disponibles en WebP/AVIF, puntos inferiores en una tira horizontal, arrastre de mouse, deslizamiento táctil y teclado; sin flechas ni reproducción automática. Las fotos originales y los videos de cámara/render se conservan en `source-media/`.
- Los puntos animan el desplazamiento durante 0,7 s con GSAP (`power2.inOut`). Se desactiva temporalmente el snap mientras dura el movimiento para evitar saltos; el arrastre o un clic nuevo puede interrumpir la transición.
- Los tres clips nuevos del hero duran 7 segundos, sin audio, a 24 fps: escritorio hasta 1920 × 1080 y móvil con encuadre 864 × 1080. Se sirven progresivamente, no se descarga toda la lista al entrar.
- El hero selecciona cuatro fragmentos (los tres nuevos y uno de planta). El primero tiene fuentes MP4 responsivas, `autoplay muted playsinline` y bucle nativo desde el HTML. `src/scripts/hero-video.ts` controla los siguientes sin GSAP ni esperar `window.load`. No hay botones de pausa/reproducción ni condiciones que reduzcan las animaciones. Si el navegador bloquea autoplay, se reintenta desde la primera interacción con la página, sin añadir controles; ningún sitio puede anular una restricción del sistema operativo. Comprobar reproducción real con `npm run audit:hero` y galería con `npm run audit:2026`.
- `src/data/promos.ts` mantiene la selección promocional con nombres descriptivos y reutiliza los originales del proyecto donde hay coincidencia. No modificar el orden sin revisar los componentes que lo consumen.
- Importación reproducible: `node scripts/prepare-2026-media.mjs images`; para videos, definir `FFMPEG_PATH` y ejecutar `node scripts/prepare-2026-media.mjs videos`. No ejecutar el optimizador genérico de videos sobre estos recortes: usar este pipeline para conservar el encuadre.
- Compresión del catálogo sin rasterizar sus páginas: definir `QPDF_PATH` y ejecutar `node scripts/prepare-2026-media.mjs pdf`. El documento conserva texto seleccionable, sus ocho páginas y el original local. La versión publicada pesa 6,73 MiB; se descarga al acercarse al visor, no al abrir el home.
- Los derivados de despliegue **sí se versionan** para que el build funcione al clonar; los originales pesados no. Ejecutar `npm run check:media` después del build para detectar material de cámara accidental, recursos rotos y clips de más de 5 MB.

```sh
npm run optimize:images
# Requiere instalar FFmpeg y definir FFMPEG_PATH con la ruta al ejecutable:
npm run optimize:videos
npm run build
npm run check:media
```

Los scripts conservan los originales antes de convertir y los reutilizan al volver a ejecutarse, evitando recomprimir sucesivamente la misma imagen.

### Elegir qué fotografías del proyecto conservar

- Revisar las fotos en `public/images/proyecto-1/`. El nombre de cámara se conserva en `src/data/project-photos.json`, en los atributos de cada fotografía y al pasar el mouse sobre su punto de navegación.
- Borrar el **WebP principal** de la foto (por ejemplo `nave-industrial-dji-0520.webp`, sin `.w640` ni `.w960`) la quita de la galería en la siguiente compilación. Para liberar espacio, borrar también sus variantes del mismo nombre: `.w640.webp`, `.w960.webp`, `.avif` y `.w640.avif`.
- Las fotos reutilizadas como fondos promocionales tienen una imagen alternativa si se descartan. Los originales de `source-media/` no se tocan.
- `node scripts/import-project-photos.mjs` importa/restaura **todas** las fotos desde los originales. No ejecutarlo después de descartar fotos, salvo que se quiera recuperarlas. El build normal no las regenera.
