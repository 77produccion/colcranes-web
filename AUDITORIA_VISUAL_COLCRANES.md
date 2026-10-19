# AUDITORÍA VISUAL — COLCRANES

Fecha: 15 de octubre de 2026
Ámbito: reescritura de la portada de `colcranes.com` en el proyecto Astro existente
Alcance: dirección de arte, composición, contraste, comportamiento responsive, movimiento y controles

Este documento es el registro de la auditoría y de la verificación técnica posterior a la
intervención. El sistema visual resultante se describe en
`DIRECCION_ARTISTICA_COLCRANES.md`. El origen y la validez de cada dato publicado se
documentan en `CONTENT_AUDIT_COLCRANES.md`.

---

## 1. Método

La revisión no se apoyó en impresiones sobre capturas: se instrumentó el navegador.

| Herramienta | Qué resuelve |
| --- | --- |
| `scripts/measure.mjs` | Mide en vivo, a 8 anchos, el `scrollWidth` frente al `innerWidth`, la altura real de la portada, la altura de cada sección y **todo elemento cuya caja sobresale de la ventana** (ignorando los contenedores con desplazamiento propio, que son intencionales) |
| `scripts/shoot.mjs` | Captura con el protocolo de DevTools: viewport exacto, página completa real, movimiento congelado en su estado final |
| `scripts/interact.mjs` | Prueba cada control visible (pestañas, etapas, menú, formulario, encabezado) en dos escenarios de movimiento |
| `scripts/probe.mjs` | Consulta puntual al DOM cuando una captura no explica el estado de un elemento |
| `scripts/crop.mjs` | Recortes a resolución completa para inspección de detalle |

### Tres correcciones al instrumental que cambiaron el diagnóstico

Estos defectos del propio arnés produjeron falsos positivos en las primeras rondas. Se
documentan porque invalidaban las conclusiones que se estaban sacando de las imágenes:

1. **`--window-size` no produce el viewport pedido.** Chrome en Windows impone un ancho mínimo
   de ventana (~500 px), de modo que una captura "a 390 px" era un recorte de un layout más
   ancho. Se veía como desbordamiento horizontal y no lo era. Medido con `--window-size`:
   el botón `Cotizar` terminaba en x=389 sobre un viewport de 390 px.
   **Solución:** manejar el navegador con `Emulation.setDeviceMetricsOverride` y
   `Page.captureScreenshot({ captureBeyondViewport: true })`.

2. **La barra de herramientas de desarrollo de Astro aparecía en todas las capturas.** Es una
   píldora flotante en la parte inferior de la pantalla que durante varias rondas se leyó como
   un elemento del sitio. **Solución:** auditar contra la compilación de producción
   (`astro build` + `astro preview`) y no contra el servidor de desarrollo.

Además, la emulación móvil de Chrome descarta en la captura las capas con `mix-blend-mode`, así
que las fotografías de producto sobre acero aparecían como cajas vacías aunque el DOM las
diera por cargadas y medidas (`naturalWidth: 2000`, `319×143` renderizados). Confirmado con
`probe.mjs` y resuelto capturando a ancho estrecho con `mobile: false`: la composición depende
sólo del ancho y el layout es el mismo.

3. **La captura de página completa competía con la decodificación de las imágenes.** Varias
   rondas salieron con las fotografías de las secciones inferiores en blanco —pie de foto sin
   imagen, panel de equipos con las anotaciones pero sin el equipo— mientras el DOM las daba por
   buenas. La causa era una ventana fija de 1,2 s tras forzar `loading="eager"`. Ahora
   `shoot.mjs` **espera a que todas las imágenes con caja estén decodificadas**
   (`complete && naturalWidth > 0`, hasta 12 s), recorre la página para forzar el pintado y
   vuelve al inicio antes de capturar. La propia captura informa cuántas imágenes quedaron
   cargadas, así que una imagen ausente ya no se puede confundir con un error de composición:
   las seis imágenes de los paneles de familia sin abrir se excluyen a propósito porque no tienen
   caja.

---

## 2. Estado de partida

La intervención partió de una portada compuesta por once secciones —`Welcome`, `Partners`,
`Products`, `Services`, `About`, `Team`, `CaseStudies`, `Contact` y el pie— sobre una única
superficie azul marino. Las piezas se auditaron leyendo el código fuente, componente por
componente, antes de reescribirlas. Las observaciones que sostienen el diagnóstico:

- **Una sola superficie.** Todas las secciones compartían el mismo fondo oscuro: no había
  cambio de material, ni de luz, ni de escala entre la portada, el catálogo de equipos, los
  servicios y el contacto. Sin contraste entre secciones no hay jerarquía, y sin jerarquía la
  página se lee como un bloque continuo.
- **La misma caja repetida.** Tarjeta con esquinas redondeadas, rejilla de tres columnas,
  encabezado centrado y rejilla de tres columnas otra vez. La estructura se repite en
  `Products`, `Services` y `CaseStudies` con distinto contenido.
- **Iconografía en el lugar de la fotografía.** Los servicios y las capacidades se ilustraban
  con iconos genéricos donde el material del archivo técnico y de la planta de producción
  permitía mostrar equipos reales.
- **Datos sin respaldo.** "Más de una Década", "+1,200 Equipos Instalados" y "Hasta 200T" no
  coinciden con la información publicada por la compañía ni con el archivo de fichas técnicas.
- **Movimiento uniforme.** El mismo revelado `fade-up` aplicado a todo, con lo que la animación
  no distinguía nada y terminaba estorbando a la lectura.
- **Contradicciones de contenido internas.** El sitio corporativo publica diez servicios y tres
  flujos de cotización independientes; la portada mostraba cuatro servicios y un formulario
  único.

La limitación de esta sección: el proyecto no estaba bajo control de versiones
(`git log` no tiene ningún commit), así que los componentes originales no son recuperables. Las
observaciones anteriores son las registradas al leer el código fuente, no una reconstrucción
posterior.

---

## 3. Defectos encontrados y corregidos

Todos se detectaron con el instrumental descrito y se volvieron a comprobar después de
corregirlos. Cada uno tenía una consecuencia real para quien usa la página.

### 3.1 Interactividad perdida con movimiento reducido — **crítico**

`setupLifecycle()` estaba dentro del bloque `gsap.matchMedia("(prefers-reduced-motion:
no-preference)")`. Con la preferencia de movimiento reducido activa:

- Los siete botones del ciclo de servicio quedaban sin manejador: **ninguno respondía**.
- Las siete etapas se servían con `class="stop is-active"`, así que **las siete aparecían
  resaltadas a la vez** y la información de "en qué etapa estoy" desaparecía.

El estado del sistema en la máquina de auditoría tiene el movimiento reducido activado, de modo
que la primera tanda de capturas mostraba la página en ese estado —y el defecto pasó
inadvertido justamente porque parecía un diseño de puntos alternados.

Seleccionar una etapa no es movimiento. La corrección separa las dos capas:

- `setupLifecycle()` — interacción (clic, foco, hover, `aria-pressed`, `is-active`). Siempre se
  ejecuta.
- `animateLifecycle()` — sólo el trazado de la línea de sistema y el revelado de las etapas.
  Dentro del bloque de movimiento.

Además, `Lifecycle.astro` ahora marca `is-active` y `aria-pressed="true"` únicamente en la
primera etapa, de modo que sin JavaScript el estado inicial también es correcto.

Verificado en `interact.mjs` en los dos escenarios. Salida:

```
--- Escenario: movimiento reducido ---
ok   Ciclo de vida: arranca sólo la primera activa — activas 1
ok   Ciclo de vida: la etapa pulsada pasa a activa y es la única — activa 4/1, aria-pressed true/1
```

### 3.2 El formulario confirmaba sin enviar — **crítico**

El manejador hacía `event.preventDefault()`, no enviaba nada a ninguna parte y respondía:
*"Solicitud registrada para {empresa}…"*. Quien completaba el formulario recibía una confirmación
falsa y su solicitud se perdía. Un formulario que miente es peor que uno que falla.

El sitio es estático y no tiene backend, así que la corrección hace que el control **produzca un
efecto real** en lugar de simularlo: la solicitud se compone con los datos del formulario y se
entrega al canal verificado (WhatsApp de la línea de ventas, `+57 315 629 3396`), que ya estaba
publicado en la misma sección. El mensaje de estado dice exactamente lo que ocurrió, y si el
navegador bloquea la ventana entrega el enlace de respaldo.

El envío a un endpoint propio queda a una línea: `const ENDPOINT = null` en
`src/components/Quote.astro`; al asignarlo, la solicitud pasa a enviarse por `POST`.

El enlace se construye con `document.createElement`, nunca con `innerHTML`: el contenido del
formulario es entrada del usuario y no debe interpretarse como HTML.

Verificado:

```
ok   Cotización: el envío devuelve un estado visible — estado null → ok
ok   Cotización: la solicitud se entrega a un canal real — estado ok, destino https://wa.me/573156293396…
ok   Cotización: el mensaje entregado lleva los datos de la operación
```

### 3.3 El `mix-blend-mode` no fundía nada

Las fotografías de producto tienen fondo blanco de estudio. Para que se imprimieran sobre el
panel de acero sin convertirse en tarjetas se usó `mix-blend-mode: multiply`. Pero
`.stage__media` declara `z-index: 2`, lo que crea un contexto de apilado: dentro de ese grupo el
fondo del respaldo era **transparente**, y multiplicar contra nada deja la imagen sin alterar.
El resultado era el rectángulo blanco del archivo sobre el acero gris, visible a cualquier
ancho. La medición del navegador no lo delata —la imagen está cargada y posicionada— sólo se ve
en la composición.

**Corrección:** el panel declara su propio fondo (`background: var(--steel-100)`), así que el
multiply tiene contra qué fundirse. La fotografía se lee ahora como una impresión sobre metal.

### 3.4 La tabla de proyectos recortaba su dato principal

En pantallas estrechas la tabla del registro se desplazaba en horizontal, pero sin ninguna señal
de que hubiera más contenido: la columna **Capacidad** quedaba fuera por completo y la columna
Equipo se cortaba a media palabra (`Puente g`, `Semipó`, `Monorri`, `Modific`, `Moderni`).
Precisamente el dato que se viene a buscar era el invisible.

**Corrección:** por debajo de 1024 px cada referencia pasa a ser una ficha —código, cliente y
equipo a la izquierda, capacidad alineada a la derecha— sin desplazamiento horizontal. La fila
de encabezado se conserva para lectores de pantalla mediante recorte accesible.

### 3.5 El epígrafe del bloque fotográfico cruzaba la fotografía

El montaje superpuesto de la sección de capacidad hacía que el pie de la segunda imagen cayera
sobre la primera, sin velo ni fondo: texto sobre fotografía sin garantía de contraste. Además
la segunda fotografía era `teams-02-planta-desenfocada.png`, una imagen **genuinamente
desenfocada** (13 KB una vez optimizada), que al lado de una fotografía nítida se lee como un
error de carga y no como una decisión.

**Corrección:** pareja fotográfica de dos anchos alineada por la base, cada pie bajo su propia
imagen. La segunda imagen es un recorte de una nave con puente grúa Colcranes rotulado, nítido y
verificable, del que se descartó la franja con logotipo y tagline sobreimpresos.

### 3.6 La regla del epígrafe atravesaba el texto

`.eyebrow` era `display: inline-flex` con `align-items: center`: cuando el texto ocupaba más de
un renglón, la línea de 28 px se centraba verticalmente y **cruzaba los renglones intermedios**.
Se veía en la portada, en el epígrafe "Heavy lifting engineering · Diseño, fabricación y montaje"
(con `max-width: 30ch`, partido en cuatro líneas).

**Corrección:** el epígrafe es un bloque y la regla es un `inline-block` alineado al centro
vertical de la primera línea. El ancho del epígrafe de portada sube a 48ch.

### 3.7 Cuatro logotipos de firma ilegibles

De las diez firmas representadas, tres son archivo y siete son rótulos tipográficos. Los tres
archivos llegaban en tres estados distintos y ninguno se leía sobre la franja oscura:

| Archivo | Estado de origen | Problema |
| --- | --- | --- |
| `World_Hoist.png` | opaco, fondo claro (media RGB 235,190,190) | caja blanca sobre el azul marino |
| `DIEPA.png` | negro sobre transparencia | invisible; `brightness(2.4)` sobre negro sigue siendo negro |
| `SRP_Cranes.png` | negro sobre transparencia | ídem |

**Corrección:** el pipeline (`scripts/build-assets.mjs`) normaliza los tres a blanco sobre
transparencia tomando la luminancia como canal alfa, con corte en 215 para eliminar el ruido del
fondo, y los iguala por media geométrica a un tamaño óptico común para que ninguno domine la
fila. La franja pasa de filas irregulares con huecos a un registro determinista de 5×2.

### 3.8 La portada no cabía en el primer pliegue

Medido: con la ventana de un portátil (1440×900) la portada medía 923 px y la banda de datos
quedaba fuera de pantalla; en 1180×820 medía 846 px. En móvil de 360 px llegaba a 990 px con la
ventana en 780.

**Corrección:** se comprimió el ritmo del bloque inferior y se recortó el párrafo de entrada a
una sola idea (el detalle de dimensionamiento ya está en la sección de capacidad). El cuerpo del
titular se calibró a `clamp(2.5rem, 6.9vw, 6.25rem)`.

Portada medida después de la corrección:

| Ancho | Alto de portada | Alto de ventana | Resultado |
| --- | --- | --- | --- |
| 360 | 904 | 780 | desborda 124 |
| 390 | 888 | 844 | desborda 44 |
| 430 | 900 | 900 | exacto |
| 768 | 1024 | 1024 | exacto |
| 834 | 1112 | 1112 | exacto |
| 1180 | 820 | 820 | exacto |
| 1440 | 900 | 900 | exacto |
| 1920 | 1080 | 1080 | exacto |

Se acepta el desborde en 360 y 390 px. La altura no está inflada por CSS: la fija el contenido
(titular, párrafo, dos líneas de botones y banda de datos). La acción principal —"Solicitar
cotización técnica"— queda muy por encima del pliegue en los dos casos; lo que cae por debajo es
la banda de datos, que es información de apoyo.

### 3.9 Contraste del encabezado sobre la portada

El encabezado es transparente sobre la fotografía y el texto es blanco. Sobre el techo claro de
la nave, medido en el primer pliegue, el contraste de la navegación quedaba al límite. En
pantallas estrechas el problema empeora porque el párrafo ocupa todo el ancho y cruza la franja
más clara de la fotografía.

**Corrección:** velo reforzado por debajo de 700 px —vertical más denso en el tercio inferior y
un segundo gradiente horizontal que ya no se desvanece del todo a la derecha.

### 3.10 Ruido acumulado en el sistema

- Retícula de plano de 64 px al 5 % **detrás de las fotografías de producto**. Como el fondo de
  las fotografías es blanco y el blend multiplicaba, las líneas de la retícula **se veían a
  través del recorte** del equipo. Eliminada: la fotografía se funde ahora con un panel limpio.
- `.js .reveal { will-change: transform, opacity }`: regla muerta, ningún elemento lleva la clase
  `reveal`.
- `const counter = explorer.querySelector("[data-counter]")`: selector muerto, no existe ese
  elemento en el marcado. La referencia "01 / 07" la sirve cada panel, así que funciona sin
  JavaScript.
- `.plate__caption`: regla muerta, el montaje se rehizo con pies bajo cada imagen.
- `.qa .hero` / `.qa .site-header` y el arnés `?diag=1` en `Layout.astro`: eliminados. Existían
  para forzar la captura de página completa con `--window-size`, que ya no se usa. El código del
  sitio queda sin instrumentación de auditoría.

---

## 4. Verificación de composición

### 4.1 Sin desbordamiento horizontal

Medido a 8 anchos. El único elemento que sobresale de la ventana es `.skip-link`, que está
posicionado a `left: -9999px` a propósito y sólo aparece al recibir foco por teclado.

```
=== móvil 360        scrollWidth 360 / innerWidth 360   ✓ sin desborde   documento 15307px
=== móvil 390        scrollWidth 390 / innerWidth 390   ✓ sin desborde   documento 14868px
=== móvil ancho 430  scrollWidth 430 / innerWidth 430   ✓ sin desborde   documento 14629px
=== tablet 768       scrollWidth 753 / innerWidth 768   ✓ sin desborde   documento 12478px
=== tablet 834       scrollWidth 819 / innerWidth 834   ✓ sin desborde   documento 12619px
=== portátil 1180    scrollWidth 1165 / innerWidth 1180 ✓ sin desborde   documento 8861px
=== escritorio 1440  scrollWidth 1425 / innerWidth 1440 ✓ sin desborde   documento 9514px
=== ancho 1920       scrollWidth 1905 / innerWidth 1920 ✓ sin desborde   documento 9999px
```

(Los valores de `documento` son el alto total de la página en cada ancho. En 360 px el registro
de proyectos se despliega como fichas, y eso explica la diferencia frente a 430 px.)

### 4.2 Controles

`node scripts/interact.mjs` — 46 comprobaciones, en dos escenarios de movimiento
(`no-preference` y `reduce`). Todas pasan.

```
--- Escenario: movimiento activo ---   … 23 comprobaciones
--- Escenario: movimiento reducido --- … 23 comprobaciones
Todas las comprobaciones pasaron
```

Cubre:

- **Explorador de equipos** — las siete pestañas activan su panel, el encabezado nombra la
  familia correcta, la referencia ("Referencia 04 / 07") corresponde, y el medio está cargado y
  medido (`768×384`) en cada una.
- **Ciclo de servicio** — siete etapas, arranca sólo la primera activa, y la etapa pulsada pasa a
  activa siendo la única, con `aria-pressed="true"` en una sola.
- **Formulario** — cinco campos obligatorios, el envío produce estado visible, el estado se
  anuncia (`role="status"` + `aria-live="polite"`) y el mensaje entregado lleva los datos.
- **Menú móvil** — el botón abre el panel, refleja `aria-expanded="true"` y cambia la etiqueta a
  "Cerrar"; al elegir un enlace se cierra solo.
- **Encabezado** — transparente sobre la portada, sólido al desplazar, vuelve a transparente al
  regresar arriba.

Pliego de recortes por familia en `docs/_capturas/interaccion/`
(`familia-0N-<escenario>.png`). Aviso: la captura por región en este motor headless es
inestable con las imágenes fundidas por `mix-blend-mode` —una de cada dos aproximadamente sale
sin la fotografía aunque el fotograma esté cargado—. La evidencia de que cada panel muestra su
medio es la comprobación `la figura tiene medio cargado` (que consulta `complete` y
`naturalWidth` en el DOM), no el recorte.

### 4.3 Movimiento

- Ninguna regla CSS deja contenido en `opacity: 0`. Todo el revelado usa
  `gsap.fromTo(..., { immediateRender: false })` con `clearProps` al terminar: si el disparador
  de desplazamiento no se activa, el contenido queda en su estado natural y visible.
- Toda la capa de movimiento vive dentro de `gsap.matchMedia()` y se revierte con `revert()`.
- Con `prefers-reduced-motion: reduce` no se anima nada y —tras la corrección 3.1— **todos los
  controles siguen funcionando**.
- Sin desplazamiento secuestrado: el paralaje de la portada es `scrub` sobre el propio recorrido
  de la portada, sin fijar la posición de desplazamiento.

### 4.4 Capturas

En `docs/_capturas/`:

| Archivo | Qué es |
| --- | --- |
| `00-movil-360-pliegue.png` | primer pliegue real a 360 px |
| `00-escritorio-pliegue.png` | primer pliegue real a 1440 px |
| `01-movil-completa.png` | página completa a 390 px |
| `02-tablet-completa.png` | página completa a 834 px |
| `03-escritorio-completa.png` | página completa a 1440 px |
| `04-ancho-completa.png` | página completa a 1920 px |

Reproducibles con:

```
npm run build
npx astro preview --port 4400
node scripts/shoot.mjs http://localhost:4400
node scripts/measure.mjs http://localhost:4400
node scripts/interact.mjs http://localhost:4400
```

---

## 5. Cumplimiento del pliego de prohibiciones

| Prohibido | Cómo queda |
| --- | --- |
| Portada a dos columnas | Composición editorial de una columna; la banda de datos se alinea por la base, no compite con el titular |
| Encabezado centrado + rejilla de tarjetas, repetido | Cada sección tiene una estructura distinta: registro de firmas, índice + panel técnico, línea de sistema, pareja fotográfica + tabla, ficha + tabla + nota, formulario con columna lateral oscura |
| El mismo contenedor redondeado en todo | No hay ninguna tarjeta con esquinas redondeadas. Las superficies son planos a sangre con esquinas rectas |
| Brillos y degradados genéricos | Sólo el velo de legibilidad sobre la fotografía de portada |
| Puntos, retículas o círculos decorativos | Retícula de plano **eliminada** (se veía a través de las fotografías). Los marcadores que quedan son indicadores de estado con función: nodo activo del ciclo, marcador de fila activa, viñeta de botón |
| Cifras gigantes decorativas | La banda de datos es texto mono a 1,15 rem con su etiqueta y su fuente al lado en la tabla de compañía |
| Exceso de texto de marketing | Un párrafo por sección. Se eliminó el cierre redundante de la portada |
| Iconos genéricos donde va la fotografía | 7 familias con fotografía de producto real o diagrama técnico; 2 recortes de planta real; los únicos iconos son flechas de acción y un teléfono con enlace `tel:` |
| Fotografías de banco | Las 9 imágenes provienen de `docs/` (archivo técnico y piezas de la compañía). Se descartaron dos folletos promocionales por no ser fotografía de ingeniería |
| El mismo `fade-up` en todo | Cuatro gestos con intención: elevación enmascarada del titular, traslación del carro amarillo, trazado de la línea de sistema, revelado por etapas |
| Composiciones idénticas repetidas | Ninguna sección repite la retícula de otra |
| Simetría por defecto | Portada a 1 columna con el peso abajo; capacidad 7/5; cotización 5/7; pie 1.5/1/1/1; ciclo con desplazamiento alternado |
| Pantallas artificialmente altas | La portada es `100svh` y la fija su contenido. Medida: exacta en 6 de 8 anchos |
| Desplazamiento horizontal gratuito | Eliminado en la tabla de proyectos (corrección 3.4). No queda ningún contenedor con desplazamiento horizontal |
| Carrusel automático | No hay carrusel. El explorador es un juego de pestañas con radios nativos: funciona sin JavaScript y el contenido completo queda en el HTML |
| Cristal, neón | No se usa `backdrop-filter` decorativo; sólo el desenfoque del encabezado sólido, que es legibilidad |

---

## 6. Archivos modificados

### Sistema

| Archivo | Cambio |
| --- | --- |
| `src/styles/global.css` | Reescrito completo. Sistema de diseño: cromo 2026, tipografía, estructura, superficies, botones, portada, firmas, explorador, ciclo, capacidad, proyectos, cotización, pie |
| `src/layouts/Layout.astro` | Fuentes (Archivo variable + JetBrains Mono), metadatos, Open Graph, JSON-LD. Arnés `?diag=1` eliminado |
| `src/scripts/motion.ts` | Gramática de movimiento. Interacción del ciclo separada de su animación; selector muerto `[data-counter]` eliminado |
| `src/pages/index.astro` | Nuevo orden: Portada → Firmas → Equipos → Ciclo → Capacidad → Proyectos → Cotización → Pie |

### Componentes

| Archivo | Estado | Nota |
| --- | --- | --- |
| `src/components/Header.astro` | conservado | Sin cambios |
| `src/components/Hero.astro` | reescrito | Párrafo recortado a una idea |
| `src/components/Brands.astro` | nuevo | Sustituye a `Partners.astro` |
| `src/components/MachineExplorer.astro` | nuevo | Sustituye a `Products.astro` |
| `src/components/Lifecycle.astro` | nuevo | Sustituye a `Services.astro`; estado inicial corregido |
| `src/components/Capacity.astro` | nuevo | Sustituye a `About.astro`; nueva segunda fotografía |
| `src/components/Projects.astro` | nuevo | Sustituye a `CaseStudies.astro` |
| `src/components/Quote.astro` | nuevo | Sustituye a `Contact.astro`; recepción corregida |
| `src/components/Footer.astro` | conservado | Sin cambios |
| `Welcome.astro` | eliminado | Portada duplicada |
| `Partners.astro` | eliminado | Sustituido por `Brands.astro` |
| `Products.astro` | eliminado | Sustituido por `MachineExplorer.astro` |
| `Services.astro` | eliminado | Sustituido por `Lifecycle.astro` |
| `About.astro` | eliminado | Sustituido por `Capacity.astro` |
| `Team.astro` | eliminado | Sin respaldo documental para el contenido |
| `CaseStudies.astro` | eliminado | Sustituido por `Projects.astro` |
| `Contact.astro` | eliminado | Sustituido por `Quote.astro` |

### Herramientas

| Archivo | Estado | Nota |
| --- | --- | --- |
| `scripts/build-assets.mjs` | reescrito | Recorte y optimización desde `docs/`; normalización de logotipos de firma |
| `scripts/shoot.mjs` | reescrito | Captura por DevTools con viewport exacto |
| `scripts/measure.mjs` | nuevo | Medición de layout y desbordamientos |
| `scripts/interact.mjs` | nuevo | Prueba de controles en dos escenarios de movimiento |
| `scripts/probe.mjs` | nuevo | Consulta puntual al DOM |
| `scripts/crop.mjs` | conservado | Recorte de regiones |

### Imágenes

Procesadas desde `docs/` hacia `public/images/`:

`hero-crane.jpg`, `planta-bodega.webp`, `planta-puente-marca.webp`, `crane-runway.webp`,
`crane-160t.webp`, `hoist-100t.webp`, `hoist-open-winch.webp`, `grua-portico.webp`,
`colcranes-logo-clara.png`, `colcranes-logo-oscura.png`, `brand-world-hoist.png`,
`brand-diepa.png`, `brand-srp.png`.

Retiradas: `planta-desenfoque.webp` (imagen desenfocada) y `planta-instalacion.webp` (tinte azul
de la pieza de marca y marca de agua de terceros).

### Compilación

```
npm run build  →  1 página
dist/index.html                                                  48,5 KB
dist/_astro/index.*.css                                          44,0 KB
dist/_astro/Layout.astro_astro_type_script_index_0_lang.*.js    114,5 KB  (GSAP + ScrollTrigger)
```

---

## 7. Activos faltantes

Lo que la dirección de arte pide y el archivo actual **no puede dar**. Se listan porque
condicionan la siguiente iteración:

| Falta | Consecuencia | Sustituto actual |
| --- | --- | --- |
| **Fotografía de montaje en planta** — equipo de campo izando e instalando | La etapa "Montaje y puesta en marcha" se sostiene sólo con texto | Nada |
| **Grúa bandera real** | La familia 03 es la única sin fotografía y usa un diagrama | Diagrama SVG construido |
| **Interior de taller de fabricación** | "Fabricación propia" es la afirmación central de la compañía y no hay una sola imagen de la fábrica | Recortes de planta instalada |
| **Retratos de planta con resolución suficiente** | Todas las tomas de instalación son recortes de piezas de redes sociales o fondos de móvil, entre 1.100 y 2.304 px de ancho; ampliadas pierden definición | — |
| **Logotipos de las siete firmas restantes** en vectorial | Se rotulan con la tipografía de marca, que es un recurso, no una falta de información | Rótulo tipográfico |
| **Ficha de producto por familia** con luz, altura y capacidad normalizadas | Las capacidades publicadas son rangos extraídos de fichas de proyecto, no catálogo | Rangos documentados con nota de origen |
| **Fotografía de polipasto de cadena** (líneas R&M LK y Black Bear) | La familia 04 nombra las líneas de cadena sin imagen | Sólo texto |

Pendientes de decisión de la compañía, no de ejecución:

- **Autorización de publicación de nombres de cliente.** El registro publica 20 referencias con
  nombre de cliente asociado a su código de ficha técnica. Es información verificable, pero la
  autorización es una decisión de la compañía.
- **Correo `comercial@colcranes.com`.** Viene de la compilación anterior y no se ha podido
  confirmar en el sitio corporativo. El canal verificado es el teléfono de ventas.
- **Certificación ISO 45001.** Existe `public/images/iso-45001.png` y la afirmación se retiró del
  sitio por no poder confirmarse.
