# DIRECCIÓN ARTÍSTICA — COLCRANES

Fecha: 15 de octubre de 2026
Objetivo: sustituir la apariencia de plantilla genérica por una identidad industrial editorial
con momentos cinemáticos, dentro del proyecto Astro existente y con los elementos ya disponibles.

Registro de auditoría y verificación: `AUDITORIA_VISUAL_COLCRANES.md`.
Validez de cada dato publicado: `CONTENT_AUDIT_COLCRANES.md`.

---

## 1. Dirección

**Industrial Editorial + Kinetic Engineering.**

Dos referencias, un solo sistema:

- **Industrial editorial.** La página se comporta como una publicación técnica: planos de
  superficie completos, tipografía condensada de peso alto, datos con su procedencia al lado,
  líneas de regla como estructura, y aire donde el aire significa algo. La jerarquía se construye
  con escala y con material, no con adornos.
- **Ingeniería cinética.** El movimiento explica el equipo. Nada se anima para llamar la atención:
  el titular se eleva desde una máscara como una carga; un carro amarillo se desplaza por el
  índice; una línea de sistema se traza al recorrer las etapas; las anotaciones técnicas aparecen
  después de su línea guía, como en un plano que se dibuja.

Los momentos cinemáticos son tres y están repartidos, no acumulados: la apertura a sangre
completa, el panel de equipos con anotaciones sobre la fotografía, y la franja oscura del ciclo
de servicio entre dos planos claros.

**Lo que se abandona.** Una sola superficie oscura para todo. A partir de ahora la página alterna
materiales y la alternancia significa algo: portada oscura (la máquina en su nave), franja oscura
(firmas), blanco industrial (equipos), franja oscura (ciclo), blanco (capacidad), acero (registro
de proyectos), blanco (cotización), oscuro (pie). La oscuridad marca los momentos de densidad
—máquina, servicio, cierre—; el claro es donde se lee y se comprueba.

---

## 2. Cromo

Anclado en la identidad de marca 2026 (azul corporativo + cian + amarillo de grúa). Ni una gota
de color fuera de ahí.

| Token | Valor | Función |
| --- | --- | --- |
| `--ink` | `#0c1420` | Negro técnico. Superficies de máxima densidad y texto principal sobre claro |
| `--ink-2` | `#16233a` | Azul profundo. Planos secundarios dentro de lo oscuro |
| `--navy` | `#2b3a8f` | Azul corporativo (isotipo). Acento de dato, foco de campo |
| `--cyan` | `#29abe2` | Cian de marca. Segunda línea del titular, foco visible |
| `--signal` | `#f2b705` | Amarillo de maquinaria. Estado activo, acción, marcadores. **Es el único color que señala** |
| `--signal-deep` | `#d99f00` | Amarillo sobre claro, donde el puro no alcanza contraste |
| `--paper` | `#f4f5f7` | Blanco industrial. Superficie de lectura |
| `--steel-100` | `#e9ecf0` | Acero claro. Lienzo donde se imprimen las fotografías de producto |
| `--steel-200` | `#d9dee5` | Acero medio. Franjas y planos secundarios |
| `--steel-300` | `#bcc4cf` | Acero mineral. Bordes y campos de formulario |
| `--steel-500` | `#6f7b8b` | Texto secundario sobre claro |
| `--line-dark` | `rgba(12,20,32,.14)` | Reglas sobre claro |
| `--line-light` | `rgba(255,255,255,.16)` | Reglas sobre oscuro |

**Regla de uso del amarillo.** El amarillo nunca decora: o marca estado (etapa activa, fila
activa, pestaña seleccionada), o es acción (botón principal, nodo de la línea de sistema), o es
el propio equipo fotografiado. La segunda línea del titular en cian es la única excepción
tipográfica, y responde al descriptor de marca.

---

## 3. Tipografía

| Familia | Uso | Motivo |
| --- | --- | --- |
| **Archivo** (variable, ejes `wdth` 62..125 y `wght` 300..900) | Titulares y rótulos de equipo | Una sola familia cubre el titular condensado de peso 800 al 76 % de ancho y el texto de lectura. El eje de ancho permite apretar el display sin cambiar de archivo |
| **JetBrains Mono** | Datos, anotaciones, etiquetas, micros | El monoespaciado es el registro de lo técnico: códigos de ficha, cotas, unidades, procedencia |

Se retiraron Outfit y Plus Jakarta Sans: dos familias geométricas sin relación con el metal.

### Escala

| Clase | Tamaño | Uso |
| --- | --- | --- |
| `.d1` | `clamp(2.5rem, 6.9vw, 6.25rem)` | Titular de portada, cuatro renglones |
| `.d2` | `clamp(2.1rem, 4.9vw, 4.25rem)` | Titulares de sección |
| `.d3` | `clamp(1.5rem, 2.5vw, 2.1rem)` | Rótulos de familia, cliente, capacidad |
| `.d4` | `clamp(1.15rem, 1.55vw, 1.4rem)` | Rótulos de apoyo |

El display va al 76 % de ancho, peso 800, interletrado `-0.015em`, interlínea `0.88`, todo en
mayúsculas. El título de portada mide el ancho del cuerpo, no el del contenedor: 16ch, para que
cada línea sea una declaración y no una frase que se acomoda.

Detalles que sostienen el registro técnico:

- La versalita no se usa como adorno: `.eyebrow` siempre introdujo una sección real y su línea de
  28 px es un elemento de regla, no un subrayado.
- `.italic-accent` — itálico condensado al 82 % — es un eco del descriptor de marca, disponible
  para cuando haga falta acentuar sin sumar color.
- Las etiquetas de dato (`dt`) son mono al 60 % del cuerpo con `0.12em` de interletrado: se leen
  como grabado en el equipo, no como copy.

---

## 4. Materiales

Cinco superficies con funciones distintas. La diferencia entre ellas es lo que crea el ritmo.

| Superficie | Token | Dónde | Función |
| --- | --- | --- | --- |
| Negro técnico | `--ink` | Portada, firmas, ciclo, columna de cotización, pie | Máquina y servicio: densidad, foco, autoridad |
| Blanco industrial | `--paper` | Equipos, capacidad, cotización | Lectura y comprobación |
| Acero | `--steel-100` | Registro de proyectos, panel de equipos, pareja de detalle | Lienzo donde se apoyan los datos y las fotografías de producto |
| Acero medio | `--steel-200` | Pie del panel de equipos | Separar dato de descripción sin salir del metal |
| Papel de trabajo | `#fff` | Campos de formulario | Lo que el usuario va a escribir |

### La fotografía de producto se imprime, no se enmarca

Las fotografías de catálogo tienen fondo blanco de estudio. En vez de meterlas en una tarjeta,
se funden con el panel de acero mediante `mix-blend-mode: multiply`: el blanco desaparece en el
`--steel-100` y el equipo queda **impreso sobre el metal**. Sin caja, sin borde, sin sombra.
(Cómo se corrigió el contexto de apilado que rompía este efecto:
`AUDITORIA_VISUAL_COLCRANES.md`, 3.3.)

Cuando la imagen no es un recorte de catálogo sino una fotografía de planta, se declara como tal
—`.stage__fig.is-photo`— y se le da borde y encuadre de documento: son dos tipos de imagen y se
leen distinto.

### Sin radios

No hay una sola esquina redondeada en toda la página. Las superficies son planos con aristas.
Los únicos círculos del sistema son el gancho fotografiado y el punto del `radio` de la familia
de grúas bandera.

---

## 5. Métrica y composición

| Token | Valor | Función |
| --- | --- | --- |
| `--wrap` | `1560px` | Ancho máximo de contenido |
| `--gutter` | `clamp(1.15rem, 4vw, 4.5rem)` | Margen lateral |
| `--band` | `clamp(4.5rem, 9vw, 9.5rem)` | Ritmo vertical entre secciones |
| `--ease-out` | `cubic-bezier(.16, 1, .3, 1)` | Salida general |
| `--ease-mech` | `cubic-bezier(.65, 0, .35, 1)` | Movimiento mecánico |

### Proporciones por sección

Ninguna sección repite la retícula de otra. Ése es el punto.

| Sección | Estructura |
| --- | --- |
| Portada | Una columna. Titular, párrafo, acciones y banda de datos anclados abajo; la fotografía ocupa todo el plano y el texto se apoya sobre ella |
| Firmas | Registro 5×2 de ancho completo. Etiqueta de sección arriba, regla, marcas igualadas por peso óptico |
| Equipos | Índice 4 / panel 8. El índice es una lista con marcador que se desplaza; el panel es un plano técnico con anotaciones |
| Ciclo | Titular a la izquierda, entradilla a la derecha, y una línea de sistema con siete nodos sobre la que las etapas se desplazan alternando altura |
| Capacidad | Titular e introducción a la izquierda, entradilla a la derecha; pareja fotográfica **7 / 5** alineada por la base; capacidades 1.15fr y tabla de compañía 1fr, ambos alineados arriba |
| Proyectos | Titular e introducción; tres fichas en una fila; registro de 20 referencias en tabla completa |
| Cotización | **5 / 7**: columna oscura de canales y botón de WhatsApp a la izquierda, formulario sobre blanco a la derecha, pegados sin separación |
| Pie | **1.5 / 1 / 1 / 1**: marca y descripción, equipos, servicios, empresa |

### Asimetría con intención

- El titular de capacidad ocupa tres renglones y la entradilla arranca a su derecha, desalineada
  de la base: la asimetría obliga a leer el titular primero.
- En la pareja fotográfica, 7 contra 5 con las dos imágenes ancladas abajo; la diferencia de
  ancho es lo que impide que se lea como una rejilla.
- En el ciclo, las etapas pares bajan 3 rem respecto a las impares. Sobre una línea horizontal,
  ese desplazamiento es lo que hace visible que hay una secuencia y no una fila de columnas.

### La regla como estructura

`--line-dark` y `--line-light` dibujan reglas horizontales y verticales que ordenan sin encerrar:
la línea vertical de la portada (coordenadas de la escena), la línea de sistema del ciclo, las
reglas entre etapas, la regla superior de cada ficha de proyecto, la barra amarilla de
`note-src`. Son la retícula hecha visible, no un borde.

---

## 6. Movimiento

Cuatro gestos. Todos explican algo.

| Gesto | Dónde | Qué comunica |
| --- | --- | --- |
| **Elevación** | Titular de portada | El texto emerge desde una máscara con `overflow: hidden`, como una carga izada. 1 s, `power3.out`, 0,1 s de escalonado entre líneas |
| **Aproximación** | Fotografía de portada | Escala de 1,07 a 1 en 1,6 s; más un paralaje (`yPercent: 12`) con `scrub` sobre el recorrido de la portada. La nave se asienta mientras el texto sube |
| **Translación** | Índice de equipos | Un marcador amarillo se desplaza hasta la fila activa. Es el carro viajando por la viga. 0,55 s, `power3.out` |
| **Trazado** | Línea del ciclo | La línea amarilla se dibuja con `scaleX` de 0 a 1 y `scrub: 0.6` entre el 78 % y el 32 % del viewport: avanza al ritmo de quien lee |
| **Revelado técnico** | Anotaciones del plano | Las anotaciones aparecen después de su línea guía, 0,18 s de retardo, 0,06 s de escalonado. El plano se dibuja por partes |

### Reglas que el movimiento no rompe

- **Nada depende de CSS `opacity: 0`.** Si JavaScript falla, el contenido está visible. Todo el
  revelado usa `gsap.fromTo(..., { immediateRender: false })` con `clearProps` al terminar: si un
  disparador de desplazamiento no llega a activarse, el elemento se queda en su estado natural.
- **`prefers-reduced-motion: reduce` desactiva la capa completa** y —esto se corrigió— **no
  desactiva ningún control**. Seleccionar una etapa del ciclo no es movimiento.
- **Sin secuestro de desplazamiento.** El paralaje es `scrub` sobre el recorrido de la portada;
  la página nunca se detiene ni se ancla.
- **Sin carrusel automático.** El explorador de equipos son pestañas con `input[type=radio]`
  nativos: funcionan sin JavaScript, el contenido completo queda en el HTML (indexable) y el
  foco de teclado es el del navegador. GSAP sólo añade el desplazamiento del marcador.
- Todo vive en `gsap.matchMedia()` y se limpia con `revert()`.

---

## 7. Arquitectura de la página

```
Portada            oscuro    máquina, tesis, datos verificados
Firmas             oscuro    registro de lo que se representa
Equipos            claro     siete familias, índice + plano
Ciclo              oscuro    los siete pasos, línea de sistema
Capacidad          claro     planta real y datos de la compañía
Proyectos          acero     registro verificable de referencias
Cotización         claro     canales oscuros contra formulario claro
Pie                oscuro    cierre
```

El orden no es el de la plantilla anterior. Responde a cómo se convence a un jefe de
mantenimiento: *esto es la máquina* → *con quién trabajamos* → *qué se fabrica* → *qué pasa con
el equipo después* → *quién lo hace* → *demuéstrelo* → *hablemos*.

### Detalle por sección

**Portada.** Fotografía a sangre de un puente grúa en la nave de una acería. Velo vertical
denso abajo (0,94) para sostener el texto, y una línea vertical en el margen izquierdo que marca
las coordenadas de la escena. Titular en dos declaraciones: "Diseñados para izar." en blanco,
"Construidos para durar." en cian. Debajo, el párrafo, las dos acciones y una banda de datos con
procedencia. Sobre la fotografía, el encabezado es transparente y pasa a sólido al salir de la
portada.

**Firmas.** Diez marcas representadas, resueltas como registro: etiqueta de sección, regla y una
rejilla determinista de 5×2. Las tres que tienen archivo se normalizaron a blanco sobre
transparencia y se igualaron por peso óptico —antes había una caja blanca y dos logotipos
invisibles—; las siete restantes se rotulan con la tipografía de marca. Sin huecos muertos ni
filas desbalanceadas.

**Equipos.** Siete familias. El índice es una lista de siete líneas con un marcador amarillo que
viaja a la fila activa; el panel muestra la familia con su fotografía anotada —"Viga principal
biviga", "Polipasto de cable", "Gancho de carga"— y un pie con la descripción, las etiquetas de
aplicación y la tabla de especificaciones. La familia 03 no tiene fotografía: en su lugar hay un
diagrama de grúa bandera construido con SVG, con radio de giro, brazo y columna. Es la única
familia sin imagen y se resuelve con un plano, no con un icono.

**Ciclo.** Los siete pasos del servicio sobre una línea de sistema. Cada etapa lleva su número,
su nombre, su descripción y sus referencias reales del catálogo de servicios del sitio
corporativo ("Asesorías integrales de ingeniería", "Contratos de mantenimiento y repuestos"…).
La etapa activa se marca con el nodo amarillo y el nombre en blanco.

**Capacidad.** Dos fotografías de planta real —una bodega de lámina de acero y un puente grúa
Colcranes rotulado— y debajo, cuatro capacidades de la compañía junto a la tabla de datos con la
columna de procedencia visible. La nota al pie dice de dónde sale la información y qué falta por
confirmar.

**Proyectos.** Tres fichas destacadas y, debajo, el registro real: 20 referencias construidas con
los códigos de las fichas técnicas del área de ingeniería (`FT-110201`, `FT-107102`…), con
cliente, equipo e intervención, y capacidad. Se optó por esto en lugar de casos de éxito
ilustrados porque el archivo existe y es verificable, y porque el registro **demuestra** el
volumen de trabajo en vez de afirmarlo. La nota metodológica lo dice explícitamente y ofrece el
registro completo.

**Cotización.** Columna oscura con los cinco canales verificados —línea de ventas, soporte
técnico, servicio al cliente, correo y sedes— y el botón de WhatsApp. A la derecha, el formulario
con los tres tipos de solicitud en paralelo —proyecto nuevo, servicio, repuestos— replicando los
tres flujos del sitio corporativo sin convertirlo en un asistente por pasos.

**Pie.** Marca, descripción, redes y las cuatro columnas. Cierra en oscuro, como abre.

---

## 8. Cómo se comporta el sistema en pantallas estrechas

El responsive no es el escritorio apilado: es un problema de dirección de arte aparte.

- **Orden distinto.** En el explorador de equipos, en móvil el panel de la familia se lee **antes**
  que el índice (`order`). En el escritorio el índice es la columna de la izquierda; en móvil no
  tiene sentido pedir que se elija algo antes de saber qué se está eligiendo.
- **La tabla de proyectos se convierte en fichas.** Cada referencia pasa a ser un registro de
  tres líneas —código, cliente, equipo— con la capacidad alineada a la derecha. Se descartó el
  desplazamiento horizontal: recortaba justo el dato que se busca.
- **La barra oscura del ciclo** sustituye la línea de sistema por una regla vertical continua con
  las etapas separadas por reglas horizontales. Las etapas no alternan altura porque no hay línea
  sobre la que alternar.
- **La pareja fotográfica** pasa a una columna, cada imagen con su pie.
- **La portada** comprime el ritmo (menos separación entre titular, párrafo y acciones) y refuerza
  el velo, porque el párrafo ocupa todo el ancho y cruza la franja más clara de la fotografía.
- **La marca de maquinaria** se mantiene: el amarillo sigue señalando lo mismo a cualquier ancho.

Medición de portada y documento por ancho, sin desbordamiento horizontal en ninguno:
`AUDITORIA_VISUAL_COLCRANES.md`, secciones 4.1 y 3.8.

---

## 9. Límites de esta dirección

Lo que el sistema **no** hace, a propósito:

- **No usa cifras grandes como decoración.** Los datos van en mono al 1,15 rem, con etiqueta y,
  en la tabla de compañía, con su fuente en la tercera columna. Un número sin procedencia al lado
  es una promesa, no un dato.
- **No usa retículas ni puntos decorativos.** La retícula de plano que existía detrás de las
  fotografías de producto se eliminó: se veía a través de los recortes y parecía un defecto de
  impresión. Los marcadores que quedan son indicadores de estado.
- **No usa cristal ni neón.** El único `backdrop-filter` está en el encabezado sólido y es
  legibilidad, no efecto.
- **No usa fotografías de banco.** Todo el material viene del archivo técnico y de las piezas de
  la compañía. Dos folletos promocionales (`service-maintenance.jpg`, `service-parts.jpg`) se
  descartaron por no ser fotografía de ingeniería.
- **No inventa.** Cuando falta un activo —grúa bandera, montaje en planta, taller de
  fabricación— el hueco se resuelve con estructura (un diagrama, una lista, una tabla) o se deja
  fuera, nunca con un sustituto genérico. La lista de lo que falta está en
  `AUDITORIA_VISUAL_COLCRANES.md`, sección 7.
