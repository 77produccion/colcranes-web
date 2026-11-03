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

```sh
npm run optimize:images
# Requiere instalar FFmpeg y definir FFMPEG_PATH con la ruta al ejecutable:
npm run optimize:videos
npm run build
npm run check:media
```

Los scripts conservan los originales antes de convertir y los reutilizan al volver a ejecutarse, evitando recomprimir sucesivamente la misma imagen.
