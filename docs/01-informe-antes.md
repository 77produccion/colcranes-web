# Informe 1: Diagnóstico Pre-Cambios (Auditoría de AI Slop, SEO, GEO y Marketing)

Este informe documenta el estado original de los textos en el código fuente de **COLCRANES S.A.S.** antes de realizar las correcciones, evaluado bajo las reglas de **Humanizer** (patrones §1–§26 de escritura generada por IA) y las metodologías de **SEO On-Page / Entity / Local SEO**, **GEO (Generative Engine Optimization)** y **Marketing / Copywriting B2B**.

---

## 1. Hallazgos de AI Slop (Reglas de Humanizer)

| Regla Humanizer | Patrón detectado | Ubicación en el código | Texto original con *AI Slop* | Diagnóstico técnico |
| :--- | :--- | :--- | :--- | :--- |
| **§1. Not X but Y** (*Contrastes negativos artificiales*) | Cola negativa recortada (`..., no X`) | `src/components/Capacity.astro` (L11) | *"La estructura del puente, los testeros y los componentes del sistema de izaje se fabrican en Colcranes, **no se revenden**."* | Niega una acusación que nadie hizo para inflar la frase en lugar de detallar qué se fabrica en taller. |
| **§1. Not X but Y** + **§8. Raya universal** | Contraste `X en lugar de Y` + inciso con rayas (`—...—`) | `src/components/Capacity.astro` (L50-53) | *"Eso permite responder por el equipo completo **—estructura, mecanismos, montaje y mantenimiento— en lugar de delegar cada etapa en un tercero**."* | Doble patrón de IA: usa rayas como conector comodín y cierra con un contraste retórico innecesario. |
| **§1. Not X but Y** + **§2. Closer dramático** | Apertura dramática por negación | `src/components/Lifecycle.astro` (L74-76) | *"Un puente grúa **no termina cuando se entrega**. Colcranes interviene en las siete etapas..."* | Escenifica importancia (*staging*) negando algo obvio antes de ir al grano sobre el soporte posventa. |
| **§1. Not X but Y** + **§25. Hablar del documento** | Contraste defensivo sobre la página web | `src/components/Projects.astro` (L73-75) | *"Este es un extracto de ese registro, **no una selección de imágenes de archivo**."* | El texto habla sobre el diseño de la página web y se defiende de usar fotos de stock, en vez de hablar de la ingeniería ejecutada. |
| **§1. Not X but Y** | Contraste defensivo en microcopy de formulario | `src/components/Quote.astro` (L185) | *"Respondemos con una propuesta técnica, **no con una lista de precios**."* | Tono defensivo típico de IA. Un comprador industrial espera alcance, planos preliminares y oferta económica formal. |
| **§3 / §2. Frase hecha / Closer** | Metáfora cliché de cierre | `src/components/MachineExplorer.astro` (L133) | *"Cierran el circuito completo del sistema de izaje."* | Oración final que repite la idea con un juego de palabras vacío sobre "cerrar el circuito". |
| **§6. Tríadas forzadas** | Etiquetas de relleno en 3 elementos | `src/components/Hero.astro` (L52-54) | `Cobertura nacional` · `Fabricación propia` · `Ingeniería de elevación` | El tercer ítem (`Ingeniería de elevación`) repite "Ingeniería" del H1 solo para completar una tríada simétrica. |
| **§8. Rayas (`—` y `–`)** | Uso de em-dash y en-dash como conectores | `Header.astro`, `Hero.astro`, `Capacity.astro`, `MachineExplorer.astro` | `COLCRANES — Inicio`, `Lun–Vie`, `—Barranquilla y Bogotá—`, `1 – 15 t`, `${family.name} — ${family.short}` | La regla §8 de Humanizer exige eliminar todas las rayas (`—`) y semirrayas (`–`) en prosa y etiquetas, reemplazándolas por preposiciones, comas o dos puntos. |
| **§11. Voz pasiva y sujetos omitidos** | Abuso de pasiva refleja (`se dimensiona`, `se fabrica`, `se ha fabricado`) | `MachineExplorer.astro` (L30-93), `Projects.astro` (L68) | *"Lo que se ha fabricado y montado"*, *"Se dimensiona según..."*, *"Se fabrica en..."*, *"También se suministran..."* | Esconde quién ejecuta la acción (Colcranes), restando autoridad técnica y claridad directa. |
| **§16. Lenguaje publicitario vacío** + **§19. Negrita/Mayúsculas decorativas** | Fluff corporativo genérico + `<strong>EXPERIENCIA</strong>` | `src/components/MachineExplorer.astro` (L176-177) | *"Más de 25 años de **EXPERIENCIA** en el mercado. Ofrecemos una gran variedad de equipos de carga de las más prestigiosas compañías en el ámbito del manejo de carga del mundo con el fin de adaptarnos a sus necesidades."* | Caso crítico de *slop* publicitario: redundancia ("equipos de carga... manejo de carga"), hipérbole vacía ("las más prestigiosas compañías... del mundo"), relleno ("con el fin de adaptarnos a sus necesidades") y palabra en mayúsculas sostenidas. |
| **§25. Escribir sobre el documento en vez del tema** | Meta-narración del proceso de extracción de datos | `Capacity.astro` (L31-35, L100-115), `Projects.astro` (L116-119) | `fuente: sitio corporativo`, columna `colcranes.com` repetida 5 veces, *"los rangos publicados en la sección de equipos"*, *"La capacidad se transcribe de la propia ficha y sólo se publica cuando allí está declarada"* | Rastro evidente de un agente de IA explicando cómo armó la tabla o de dónde copió los datos (narración metodológica del borrador). |

---

## 2. Diagnóstico Pre-Cambios de SEO, GEO y Marketing

### A. SEO On-Page y Estructura de Encabezados (`heading-structure` & `content-optimization`)
1. **Encabezados H2 genéricos o pasivos**:
   - En `src/components/MachineExplorer.astro`, el H2 dice únicamente `"Nuestros productos"`, desaprovechando la intención de búsqueda principal (*puentes grúa, pórticos, polipastos y equipos de izaje*).
   - En `src/components/Capacity.astro`, el H2 `"Ingeniería colombiana para operaciones reales"` usa un adjetivo retórico ("operaciones reales") en lugar de términos de búsqueda B2B (*fabricación de puentes grúa y montaje en planta*).
   - En `src/components/Projects.astro`, el H2 `"Lo que se ha fabricado y montado"` es impersonal y carece de contexto sectorial o geográfico (*proyectos de izaje industrial en Colombia*).
2. **Inconsistencia en contador técnico**:
   - En `src/components/MachineExplorer.astro` aparece `Referencia {family.num} / 07`, cuando el catálogo tiene **06** familias de equipos.

### B. GEO / AEO y Entity SEO (`generative-engine-optimization`, `entity-seo`, `local-seo`)
1. **Datos estructurados (`Schema.org`) incompletos en `src/layouts/Layout.astro`**:
   - Falta `@id` canónico (`https://colcranes.com/#organization`) para anclar la entidad en el Knowledge Graph.
   - Faltan `logo`, `sameAs` (perfiles oficiales de LinkedIn, Instagram, Facebook y X que sí están en el footer) y `contactPoint` diferenciados (Ventas, Soporte técnico, Servicio al cliente).
   - Las direcciones en `address` no incluyen la dirección física exacta (`streetAddress`: `Cra. 67 # Vía 40-62, piso 3` en Barranquilla y `Cra. 128 # 14B-31` en Bogotá), rompiendo la consistencia **NAP (Name, Address, Phone)** requerida por `local-seo`.
2. **Desperdicio de contexto semántico en tablas**:
   - En `src/components/Capacity.astro`, la tercera columna de la tabla repite `colcranes.com` cinco veces en lugar de aportar atributos citables por motores RAG (ChatGPT, Perplexity, Google AI Overviews).

### C. Marketing Industrial B2B (`copywriting`)
1. **Propuesta de valor diluida en el explorador de equipos**:
   - El texto introductorio de `src/components/MachineExplorer.astro` suena a folleto genérico importador en vez de destacar la ventaja competitiva real de Colcranes: **fabricación estructural propia en Colombia combinada con componentes de firmas internacionales** (R&M, World Hoists, Conductix-Wampfler, AUTEC, DIEPA).
2. **Llamados a la acción (CTAs) y reducción de fricción**:
   - En `src/components/Quote.astro`, el mensaje bajo el botón de envío está redactado en negativo (*"no con una lista de precios"*), en lugar de reforzar la promesa de valor (entrega de propuesta técnica y económica dimensionada para la planta).
