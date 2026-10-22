# Guía de Especificaciones de Fotografía, Video y Logos — COLCRANES

Esta guía detalla las medidas mínimas, proporciones (aspect ratio), formatos recomendados y criterios visuales para cada sección del sitio web, con el fin de facilitar la selección de su archivo de proyectos y la sesión fotográfica profesional.

> **Nota práctica:** Si nos entregan las fotografías y videos originales en **alta resolución (JPG/PNG/TIFF/RAW o MP4 sin textos ni logos sobreimpresos)**, nuestro pipeline (`scripts/build-assets.mjs`) se encarga de recortarlas, optimizarlas a `.webp` y generar los tamaños responsivos automáticamente.

---

## 1. Resumen de Medidas y Proporciones por Sección

| Sección del sitio | Cantidad requerida | Proporción (Aspect Ratio) | Medida mínima recomendada (px) | Formato de entrega | Peso máx. en web (ya optimizado) | Ruta destino en el proyecto |
| :--- | :---: | :---: | :---: | :--- | :---: | :--- |
| **1. Hero — Video en bucle** *(ideal)* | 1 video | **16:9** (Horizontal) | **1920 × 1080 px** (Full HD, 24–30 fps, 8 a 15 seg, sin audio) | `.mp4` (H.264) / `.webm` | ≤ 4,5 MB | `public/videos/hero-colcranes.mp4` |
| **1b. Hero — Fotografía principal / Poster** | 1 a 4 fotos | **16:9** o **16:10** (Horizontal) | **2400 × 1500 px** (mínimo 1920 × 1080 px) | `.jpg` / `.png` / `.webp` | ≤ 280 KB | `public/images/hero-colcranes-obra.webp` |
| **2. Catálogo de Equipos (6 familias)** | 6 fotos (+ 4 sub-modelos de polipastos) | **4:3** o **16:10** (Horizontal) | **1600 × 1200 px** (mínimo 1200 × 900 px) | `.png` (si es recorte sobre fondo limpio) o `.jpg` de obra real | ≤ 180 KB | `public/images/productos/` |
| **3. Tarjetas de los 10 Servicios** | **10 fotos distintas** (1 por servicio) | **4:5** (Vertical) o **4:3** (con margen para recorte vertical/horizontal) | **1200 × 1500 px** (vertical en tarjeta home) o **1600 × 1200 px** (para usar también en la cabecera interna del servicio) | `.jpg` / `.png` / `.webp` **sin filtros de color** | ≤ 160 KB | `public/images/servicios/` |
| **4. Casos de Éxito / Proyectos (3 a 4 casos)** | **3 a 4 fotos** (1 a 2 por caso) | **16:10** (Horizontal) | **1600 × 1000 px** (mínimo 1280 × 800 px) | `.jpg` / `.png` / `.webp` | ≤ 200 KB | `public/images/proyectos/` |
| **5. Nosotros y Capacidad (Pareja editorial)** | 2 fotos de planta | Foto 1: **16:9**<br>Foto 2: **4:3** | Foto 1: **1920 × 1080 px**<br>Foto 2: **1400 × 1050 px** | `.jpg` / `.png` / `.webp` | ≤ 220 KB | `public/images/` |
| **6. Galería Interactiva ("Cotiza con nosotros")** | 4 fotos verticales | **3:4** (Vertical) | **1200 × 1600 px** | `.jpg` / `.png` / `.webp` | ≤ 180 KB | `public/images/galeria/` |
| **7. Logos de Marcas (CMAK, NOVALIFT, etc.)** | 8 logos | Horizontal libre | Vectorial o **mínimo 600 px de ancho** | **`.svg` (ideal)**, `.ai`, `.eps` o `.png` con fondo transparente | ≤ 30 KB | `public/images/brands/` |
| **8. Franja de Logos de Clientes** | 6 a 12 logos autorizados | Horizontal libre | Vectorial o **mínimo 500 px de ancho** | **`.svg` (ideal)** o `.png` con fondo transparente | ≤ 30 KB | `public/images/clientes/` |
| **9. Imagen para Redes (`og:image`)** | 1 imagen | **1.91:1** | **1200 × 630 px** exactos | `.jpg` o `.png` | ≤ 300 KB | `public/images/og-colcranes.jpg` *(ya generada)* |

---

## 2. Guía Detallada de Qué Fotografiar / Seleccionar en cada Sección

### A. Hero (Apertura de la página)
- **Video corto en bucle (ideal):**
  - **Duración:** 8 a 15 segundos, con inicio y fin fluidos para reproducción en bucle (`loop`).
  - **Escena recomendada:** Plano general o medio-abierto de un puente grúa **COLCRANES** (con la marca visible en la viga amarilla) desplazándose sobre la vía de rodadura o izando una carga real en planta, o secuencia de 2–3 tomas lentas (puente grúa operando en nave + taller de fabricación + técnico con uniforme Colcranes en mando por radiocontrol).
  - **Encuadre:** Horizontal **16:9** (`1920 × 1080 px`). Evitar paneos bruscos o cámara en mano con vibración.

### B. Las 10 Fotografías de Servicios (sin filtro de color)
Cada uno de los 10 servicios tiene su propia tarjeta en el Home y su propia página individual (`/servicios/[slug]`). Para que ninguna foto se repita, recomendamos seleccionar estas 10 tomas reales de su archivo o sesión:
1. **01. Montaje y puesta en marcha:** Grúa telescópica o equipo de campo izando la viga principal hacia los rieles de la nave.
2. **02. Mantenimiento preventivo:** Técnico de Colcranes (con dotación y EPP) inspeccionando tablero eléctrico, freno o bloque de gancho.
3. **03. Contratos de mantenimiento y repuestos:** Vista general de una planta cliente con varios puentes grúa operativos o inspección programada con checklist.
4. **04. Suministro de repuestos:** Fotografía nítida de componentes de recambio (cables de acero DIEPA, guías de cable, ruedas, contactores o radiocontrol AUTEC).
5. **05. Accesorios de elevación bajo gancho:** Toma de un balancín de carga, viga separadora (*spreader beam*), gancho tipo C portabobinas o pinza en operación.
6. **06. Fabricación de puentes grúa:** Toma abierta o media del taller de 3.000 m² en Barranquilla (soldadura de viga cajón, armado de testeros o pintura industrial).
7. **07. Modernización de puente grúa:** Detalle de actualización tecnológica (nuevo carro-polipasto instalado, tablero con variadores de frecuencia o conversión a radiocontrol).
8. **08. Servicios técnicos:** Técnico realizando diagnóstico o medición mecánica/eléctrica (calibrador en cable, pinza amperimétrica o alineación de testero).
9. **09. Servicio de garantías:** Puente grúa recién entregado con placa/rótulo de Colcranes o entrega técnica en planta.
10. **10. Asesorías integrales de ingeniería:** Ingeniero de Colcranes en planta realizando levantamiento dimensional (distanciómetro láser, planos estructurales o revisión de vía de rodadura).

### C. Los 6 Equipos del Catálogo (`/equipos/[slug]`)
1. **Polipastos (`/equipos/polipastos`):** Fotos de producto o instalación de polipasto de cable SX/SXE y polipastos de cadena.
2. **Puente grúa (`/equipos/puentes-grua`):** Foto real de un puente grúa monoviga o biviga fabricado por Colcranes en nave industrial.
3. **Grúa bandera (`/equipos/gruas-bandera`):** Foto real de una grúa bandera (pescante) de columna o de pared instalada por Colcranes.
4. **Kit puente grúa (`/equipos/kits-puente-grua`):** Foto de conjunto de testeros motorizados + polipasto + tablero en taller o pre-despacho.
5. **Sistema de electrificación (`/equipos/sistemas-electrificacion`):** Detalle nítido de línea de alimentación (blindo barra / festón portacables) y mando por radiocontrol.
6. **Grúa pórtico (`/equipos/gruas-portico`):** Foto real de una grúa pórtico o semipórtico instalada en patio o bodega (p. ej. el semipórtico de 17 t o 5 t).

### D. Los 3 a 4 Casos de Éxito (`Projects.astro` y `/proyectos`)
Para cada uno de los 3 a 4 casos de éxito, envíennos:
- **1 fotografía horizontal** (`16:10`, mínimo `1600 × 1000 px`) del equipo instalado en la planta del cliente.
- **Datos del caso:**
  1. Nombre del cliente (autorizado) y ciudad/planta.
  2. Tipo de equipo (ej. Puente grúa biviga / Semipórtico).
  3. **Capacidad nominal** (en toneladas).
  4. **Luz entre rieles** (en metros) y altura de izaje (si aplica).
  5. **Alcance ejecutado** (ej. Diseño, fabricación, montaje, electrificación y pruebas de carga).

---

## 3. Recomendaciones Importantes de Entrega
- **Sin textos ni logos sobreimpresos:** Entregar las fotografías limpias (no capturas de piezas de Instagram/LinkedIn con titulares o marcas de agua encima).
- **Iluminación y encuadre:** Priorizar tomas donde la viga amarilla y el rótulo **COLCRANES** se lean con claridad y el personal técnico porte casco, gafas y dotación institucional completa.
