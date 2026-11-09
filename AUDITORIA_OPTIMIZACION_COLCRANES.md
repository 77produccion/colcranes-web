# Optimización y validación — 4 de noviembre de 2026

## Cambios aplicados

- Fuentes Barlow y Saira alojadas localmente en WOFF2, con `font-display: swap`, precarga de las dos fuentes principales y licencias OFL incluidas. La compilación no requiere Google Fonts.
- Variantes pequeñas de logos sin sobrescribir originales. Ejemplos: Black Bear, 48.6 → 18.8 KB; CMAK, 25.7 → 7.0 KB; Steckerl, 26.6 → 6.6 KB.
- Imágenes adaptativas y dimensiones intrínsecas en productos, servicios, marcas y clientes. Se reutiliza el helper de imágenes en las páginas que lo consumen.
- Prioridad alta para el logo de portada, visible sin esperar la animación de entrada.
- Revelados de contenido inicializados al entrar en pantalla, mediante un observador compartido, en lugar de medir todas las tarjetas al cargar.
- PDF móvil y su worker diferidos hasta acercarse al catálogo. El iframe nativo solo se inicializa en escritorio; región desplazable etiquetada y accesible por teclado.
- Foco atrapado dentro del formulario de cotización, cierre con Escape y devolución del foco al control de apertura.
- Enlace telefónico separado del control del acordeón. Contraste corregido en los números del menú móvil y los detalles del diálogo de WhatsApp.
- Control de pausa/reanudación del video de portada. Por solicitud posterior, la cinta de clientes se mantiene siempre activa, sin botón y sin pausa al pasar el cursor.
- Póster de portada en AVIF con fallback WebP, logos de cabecera más pequeños y precarga de la imagen identificada como LCP. El póster de 960 px pasa de 64.5 KB WebP a 29.5 KB AVIF sin sobrescribir originales.
- Imágenes decorativas del cambio de página cargadas al detectar intención de navegación, no durante la carga inicial.
- Entradas de portada en CSS, independientes de la descarga de GSAP. Arranque de JavaScript diferido dos fotogramas, con protección para no perder clics tempranos en menú, cotización o WhatsApp durante la descarga.
- Estilos pequeños de página insertados en el HTML (límite 8 KiB), manteniendo el CSS compartido como archivo cacheable. Se probó insertar todo el CSS: solo dio una mejora pequeña y aumentó el HTML comprimido a 35 KB, por lo que se descartó esa alternativa.
- Canonical normalizado y coherente con el sitemap. Se eliminó `lastmod` basado en la fecha de compilación, que no representaba una actualización real de contenido.
- Cabeceras de caché para fuentes y catálogos en Vercel, sin caché inmutable para archivos sin hash.
- Comandos reproducibles para tipos, SEO estructural, recursos, accesibilidad y rendimiento.

Las animaciones de productos (vertical en escritorio, horizontal en móvil) y submenús solicitadas permanecen activas incluso con movimiento reducido. Se corrigió una condición que omitía la transición de productos en escritorio con esa preferencia y se agregó una prueba de regresión para ambos ejes y la aparición del texto.

## Resultados locales

Medición sobre la compilación estática servida en `http://127.0.0.1:4322`, no sobre producción. Lighthouse 13.5.0, perfil móvil simulado Slow 4G y CPU x4, Chrome. Rendimiento y métricas: mediana de tres pasadas secuenciales con caché fría; otras categorías: última pasada completa.

| Categoría / métrica | Resultado |
| --- | --- |
| Rendimiento | 86/100 (86 en las tres pasadas) |
| Accesibilidad | 100/100 |
| Buenas prácticas | 100/100 |
| SEO | 100/100 |
| First Contentful Paint | 2.132 s |
| Largest Contentful Paint | 3.837 s |
| Total Blocking Time | 5 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 2.132 s |

La referencia anterior era una pasada con 84 puntos, LCP 4.230 s, FCP 1.972 s y TBT 25 ms. La mejora del LCP es de unos 393 ms (9 %); la descarga registrada pasó aproximadamente de 1,763 a 1,663 KiB. El FCP no mejoró en esta muestra y sigue siendo un punto de trabajo: no se afirma que todas las métricas hayan mejorado ni que una sola referencia anterior constituya un ensayo estadístico.

Estas puntuaciones son una muestra de laboratorio y pueden variar. No equivalen a certificación WCAG ni a datos de usuarios reales.

- 24 páginas revisadas con axe: sin infracciones automáticas WCAG A/AA detectadas en la vista inicial móvil.
- Revisión adicional de los estados abiertos del formulario, WhatsApp y menú móvil, con corrección de interacciones anidadas y contraste.
- Sin errores JavaScript, recursos locales rotos ni desbordamientos horizontales en esas 24 páginas a 390 px. Portada comprobada también a 320, 768 y 1440 px.
- Interacciones: foco y cierre del formulario, submenús, flechas de productos y paginación PDF comprobados en Chrome.
- Prueba adicional en WebKit 27.2 emulado a 390 px: menú, productos y segunda página del PDF funcionando, sin errores JavaScript ni desbordamiento.
- Chrome y WebKit: clic temprano en el menú con descarga del módulo artificialmente demorada, imagen de portada decodificada y navegación entre páginas sin dejar la cubierta de transición bloqueada. WebKit en Windows utilizó el fallback WebP correctamente.
- `astro check`: sin errores ni advertencias; aviso informativo preexistente de importación no utilizada en la página de empleo.
- `npm audit`: 0 vulnerabilidades reportadas al momento de la revisión.

## Repetir las pruebas

1. `npm ci`
2. `npm run check`
3. `npm run build`
4. `npm run check:site`
5. `npm run check:media`
6. Servir la compilación: `npm run preview -- --host 127.0.0.1 --port 4322`.
7. Con Chrome instalado: `npm run audit:browser`, `npm run audit:lighthouse` y `npm run audit:load` (tres pasadas de rendimiento).

Los resultados detallados se guardan en `docs/audits/browser.json`, `docs/audits/load.json` y `.astro/lighthouse-*.json` (directorios ignorados por Git). Las herramientas de auditoría son dependencias de desarrollo, no se envían al navegador.

Mantenimiento: `npm run sync:fonts` actualiza fuentes y licencias; `npm run optimize:logos` genera las variantes pequeñas sin recomprimir originales; `npm run optimize:critical` genera los derivados de portada y cabecera.

## Por qué no da 100 en rendimiento

La puntuación no es un porcentaje de errores resueltos. En una de las tres pasadas, Lighthouse asignó estos pesos y puntuaciones:

| Métrica | Peso | Puntuación de esa métrica |
| --- | --- | --- |
| LCP, 3.8 s | 25 % | 54/100 |
| FCP, 2.1 s | 10 % | 80/100 |
| TBT | 30 % | 100/100 |
| CLS | 25 % | 100/100 |
| Speed Index | 10 % | 99/100 |

El LCP explica aproximadamente 11.5 de los 14 puntos que faltan; el FCP explica otros 2. No se debe principalmente a errores de JavaScript, saltos de diseño ni al visor PDF: el bloqueo es bajo, CLS es 0 y el PDF no se descarga en la portada inicial.

La primera vista todavía necesita CSS compartido, la fuente variable Saira (unos 99 KB) y las imágenes. El primer video móvil aporta unos 944 KB a la transferencia observada; también se descargan algunas imágenes inferiores cercanas al umbral de `loading="lazy"`. Estos tamaños y la competencia de recursos son oportunidades adicionales, pero no se atribuye automáticamente todo el retraso del LCP al video ni se promete una puntuación por quitar un archivo.

Las siguientes alternativas requieren medir el efecto y revisar el compromiso visual: servir video solo tras interacción o en conexiones rápidas, comprimir/recortar específicamente imágenes de tarjetas y reducir el conjunto de variaciones de la tipografía. No se eliminaron video ni identidad visual para perseguir una puntuación.

## PageSpeed Insights y sitio publicado

Se comprobó `https://colcranes.com/`: al momento de esta revisión devuelve la web anterior en WordPress, no este proyecto de Astro. Por tanto, no sería válido usar su puntuación para certificar estos cambios locales. Posteriormente se confirmó la URL de este proyecto: `https://colcranes-web.vercel.app/`. Las mediciones externas deben apuntar a ese despliegue después de que publique el commit nuevo, no a una compilación anterior.

Se intentó la API de PageSpeed Insights para esa URL; respondió HTTP 429 `RESOURCE_EXHAUSTED` / cuota diaria excedida. No se dispone de un resultado externo válido. Para medir esta versión con [PageSpeed Insights](https://pagespeed.web.dev/), primero se necesita una URL pública de despliegue de esta versión. No se publicaron cambios ni se modificó el dominio durante la auditoría.

## Pendientes y límites

- Medir de nuevo en el dominio desplegado: red real, CDN, compresión, caché y TTFB no quedan certificados por una prueba local.
- El LCP móvil de laboratorio sigue por encima del objetivo de 2.5 s. El 100 de rendimiento exige además tiempos mejores que el mero umbral de «bueno». No se declara el sitio «100 % optimizado».
- La cinta de logos siempre activa es una decisión solicitada; retirar su mecanismo de pausa puede incumplir criterios manuales de movimiento continuo (WCAG 2.2.2). El 100 automático de accesibilidad no verifica ese criterio ni constituye conformidad WCAG.
- Probar manualmente en iPhone/Safari y Android físicos, en redes lentas, con VoiceOver/TalkBack y teclado. WebKit emulado no sustituye estas pruebas.
- El canvas del PDF es una vista visual; no sustituye una capa de texto accesible ni certifica que el PDF original esté etiquetado. Se conserva el enlace al documento original.
- El formulario mantiene su flujo actual por WhatsApp; no se ha incorporado un backend de correo ni se ha enviado una solicitud real durante las pruebas.

## Actualización de contenido y medios — 6 de noviembre de 2026

- Se retiró el logo duplicado sobre el H1 y los diez logos superpuestos en servicios. La fotografía de servicios queda más abierta en la parte superior. El hero reserva espacio inferior para que WhatsApp no tape los botones; se eliminó una regla de espaciado duplicada que anulaba ese margen.
- Se conserva la viga amarilla y el polipasto por decisión del cliente: texto oscuro sin sombras, cuatro columnas en escritorio y 2 × 2 hasta 1100 px. En móvil se reserva espacio propio para la maquinaria, sin tapar las cifras. El componente compartido actualiza también proyectos y las demás páginas que lo usan.
- Nuevo registro fotográfico compartido entre inicio (tres fotografías) y proyectos (seis), con WebP/AVIF, variantes responsivas, leyendas y galería horizontal móvil accesible por controles. Se describe lo visible sin inventar cliente, ubicación, capacidades o alcance contractual.
- Tres fragmentos reales DJI de siete segundos se suman al hero. Los dos videos HMV de modelado 3D quedan archivados y no se publican. Escritorio: 1920 × 1080, 2,99–3,52 MiB por clip; móvil: recorte 864 × 1080, 1,40–1,79 MiB. H.264, 24 fps, sin audio, descarga progresiva. Se revisaron fotogramas comprimidos en ambos encuadres.
- Las fotos promocionales usan nombres descriptivos y una lista editorial explícita. Cuatro imágenes coincidentes con el proyecto se sustituyeron por derivados de los originales de cámara. Se actualizaron también las referencias directas en capacidad y la búsqueda de imágenes del bloque aliado.
- Sólo se publica el catálogo 2026 (ocho páginas, 6,73 MiB, con carga diferida). Se retiró el documento 2023 y su URL anterior redirige al vigente mediante Vercel. El original se conserva fuera del despliegue; QPDF verificó la estructura del nuevo documento.
- Fuera de `public/` y de Git: 84 originales JPG (449 MiB), carpeta nueva de videos/fotos (2539 MiB) y un ZIP antiguo detectado en `public/videos` (1730 MiB). Todos permanecen en `source-media/`; no se borraron originales. La publicación completa es de 70,49 MiB, no la transferencia inicial del home.
- `check:media` comprueba ausencia de originales de cámara, nombres WhatsApp, catálogos antiguos, archivos de edición/ZIP y videos de más de 5 MiB. Los derivados optimizados necesarios para compilar sí se versionan.

Validación local final:

- `npm run check`, `npm run build`, `npm run check:site` y `npm run check:media`: correctos. Persiste únicamente el aviso informativo preexistente de importación no utilizada en empleo.
- `npm run audit:browser`: 24 páginas sin errores de navegador, desbordamientos ni infracciones automáticas de accesibilidad; interacciones existentes comprobadas.
- `npm run audit:2026`: inicio y proyectos a 320, 390, 768, 1440 y 1920 px; cifras, polipasto, galería y accesibilidad correctos. Video móvil y paginación del catálogo 2026 comprobados. Capturas y resultados en `.astro/review/` (ignorado por Git).
- `npm run audit:load`: tres muestras Lighthouse móvil sobre preview local. Rendimiento 89/87/89; mediana FCP 1,812 s, LCP 3,685 s, TBT 13 ms y CLS 0,015. Transferencia observada en esa ventana inicial: 678 317 bytes; **no incluye el consumo posterior de toda la secuencia de videos ni del PDF**. No equivale a una medición del despliegue ni elimina los límites indicados arriba.

### Corrección posterior: reproducción del hero y ficha compacta

- Se reprodujo el fallo: con movimiento reducido o ahorro de datos, el reproductor anterior no asignaba ninguna fuente (readyState 0). El primer fragmento ahora tiene fuentes responsivas en el HTML y `autoplay muted playsinline`, con bucle nativo si JavaScript no ejecuta. La secuencia selecciona cuatro fragmentos; su controlador independiente no espera a GSAP ni a `window.load` y no excluye dispositivos por sus preferencias de datos/movimiento.
- Se añaden recuperación ante error de archivo (otra variante y después otro fragmento), control visible al bloquearse autoplay y reproducción iniciada desde el gesto del usuario. Se conserva pausa manual y al salir de pantalla. Las restricciones de batería/autoplay del navegador no se pueden anular desde una web; en ese caso se ofrece reproducción con un toque. Los fundidos se omiten con movimiento reducido.
- La ficha nueva ya no es un mosaico: una imagen 4:3 a la izquierda y texto a la derecha, alternando con la imagen a la derecha del siguiente proyecto. Mismo componente en inicio y proyectos, seis fotos, únicamente puntos debajo de la imagen y una descripción específica por foto con fundido suave. Arrastre con mouse, desplazamiento táctil nativo y teclado, sin flechas ni avance automático; altura estable al cambiar el texto.
- `npm run audit:hero`: reproducción real verificada en Chrome y WebKit, escritorio y móvil, movimiento reducido, ahorro de datos/2G simulado, módulo de animaciones bloqueado, JavaScript desactivado, bloqueo de autoplay y archivo realmente inexistente. Comprobados también pausa, reanudación y cambio al siguiente fragmento. Resultados en `.astro/review/hero-playback.json`.
- `npm run audit:2026`: inicio/proyectos a 320–1920 px, puntos y texto sincronizados, imagen a la izquierda, altura compacta en escritorio, arrastre de mouse, teclado y gesto táctil nativo comprobados. `audit:browser`: las 24 páginas siguen sin errores, desbordamientos ni infracciones automáticas detectadas.
- `check`, `build`, `check:site` y `check:media` correctos. La medición Lighthouse de la sección anterior precede a esta carga inmediata del video y **no certifica el rendimiento de esta estrategia nueva**. No se ha desplegado ni probado en dispositivos físicos.

### Ajuste solicitado: sin controles de video

- Retirados el botón de reproducción/pausa, sus estilos y toda su lógica. No hay controles visibles ni condiciones de movimiento reducido en `src/`; se mantienen los fundidos y el desplazamiento suave de la galería.
- El hero conserva autoplay silencioso y la recuperación de archivos. Ante un bloqueo del navegador, reintenta desde la primera interacción con la página, sin insertar botones.
- Verificados `check`, `build`, `check:media`, `audit:hero` (Chrome y WebKit, incluidos bloqueo de autoplay y archivo inexistente) y `audit:2026` (320–1920 px, mouse, teclado y touch).
- Límite de accesibilidad: retirar la pausa de contenido en movimiento continuo requiere revisión manual del criterio WCAG 2.2.2; las pruebas automáticas no certifican ese criterio.

### Galería completa para selección del cliente

- A petición del cliente se incorporan las 86 fotografías: 84 de la carpeta original de imágenes y dos JPG de la carpeta de videos. No se descartó ningún original, incluidas tomas similares o repetidas.
- Se conservan los seis nombres de imágenes existentes y se agregan los demás con identificador de cámara. Los interiores DJI_0459, DJI_0520 y DJI_0521 se sitúan después de la selección inicial para facilitar su revisión.
- 430 derivados WebP/AVIF (43,40 MiB en conjunto), con tamaños adaptables y carga diferida; no equivalen a la transferencia inicial. Se verificó la correspondencia exacta entre los 86 originales y el manifiesto `src/data/project-photos.json`.
- Los puntos se mantienen en una sola tira horizontal desplazable, sin aumentar la altura de la ficha. Los originales se identifican al pasar el cursor por el punto correspondiente y mediante atributos de la fotografía.
- El cliente puede descartar una foto borrando su WebP principal en `public/images/proyecto-1/`; el siguiente build la omite sin regenerarla. Para liberar espacio debe retirar también los derivados del mismo nombre. Las imágenes reutilizadas como fondos promocionales tienen alternativa si se descartan. Los originales siguen fuera de Git y del despliegue.
- La importación completa se repite explícitamente con `node scripts/import-project-photos.mjs`; no forma parte del build y restauraría las imágenes descartadas. Verificados build, tipos, SEO y referencias de medios; navegación a la última fotografía y ausencia de desbordamiento comprobadas a 390 y 1440 px.
