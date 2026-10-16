# Informe 2: Estado Post-Cambios (Comparativa Antes vs. Después y Verificación)

Este informe detalla las modificaciones aplicadas en todos los archivos de **COLCRANES S.A.S.** tras ejecutar el proceso de limpieza con **Humanizer** y la optimización conjunta de **SEO On-Page / Local / Entity SEO**, **GEO (Generative Engine Optimization)** y **Marketing B2B**.

---

## 1. Comparativa Antes vs. Después por Componente

### A. Metadatos y Datos Estructurados (`src/layouts/Layout.astro` y `src/pages/index.astro`)

#### Antes
- **Title**: `COLCRANES | Fabricación, montaje y mantenimiento de puentes grúa y polipastos`
- **Description**: `"Colcranes fabrica, monta, mantiene y moderniza puentes grúa, pórticos, grúas bandera y polipastos para la industria colombiana. Más de 25 años y más de 800 proyectos."`
- **Schema JSON-LD**: Solo contenía `name`, `url`, `email`, `telephone` y `addressLocality` (`Barranquilla`, `Bogotá`) sin direcciones físicas (`streetAddress`), sin `@id`, sin `logo`, sin `contactPoint` diferenciados ni `sameAs`.

#### Después
- **Title**: `COLCRANES | Fabricación, montaje y mantenimiento de puentes grúa y polipastos en Colombia`
- **Description**: `"Colcranes S.A.S. diseña, fabrica, monta y mantiene puentes grúa, pórticos, grúas bandera y polipastos en Colombia. Más de 25 años de trayectoria y 800 proyectos desde Barranquilla y Bogotá."`
- **Schema JSON-LD (`Entity SEO` + `Local SEO`)**:
  - `@id`: `https://colcranes.com/#organization`
  - `logo`: URL canónica del logotipo
  - `address`: Direcciones físicas completas (`Cra. 67 # Vía 40-62, piso 3` en Barranquilla y `Cra. 128 # 14B-31` en Bogotá)
  - `contactPoint`: Tres líneas estructuradas (`sales`, `technical support`, `customer service`)
  - `sameAs`: Enlaces verificados a LinkedIn, Instagram, Facebook y X.

---

### B. Cabecera y Portada (`src/components/Header.astro` y `src/components/Hero.astro`)

| Elemento | Antes (*con AI Slop*) | Después (*Humanizado + SEO/GEO*) | Regla aplicada |
| :--- | :--- | :--- | :--- |
| **Atributo `aria-label` logo** | `COLCRANES — Inicio` | `COLCRANES · Inicio` | Humanizer §8 (Eliminación de raya `—`) |
| **Horario en `readouts`** | `Lun–Vie 07:30–17:30` | `Lun a Vie 07:30 a 17:30` | Humanizer §8 (Eliminación de semirraya `–`) |
| **Etiquetas de portada (`hero__locale`)** | `Cobertura nacional` · `Fabricación propia` · `Ingeniería de elevación` | `Puentes grúa, pórticos y polipastos` · `Fabricación en Colombia` · `Sedes en Barranquilla y Bogotá` | Humanizer §6 (Fin de tríada genérica) + SEO/GEO (Entidades y palabras clave en el primer pliegue) |

---

### C. Explorador de Maquinaria (`src/components/MachineExplorer.astro`)

| Elemento | Antes (*con AI Slop*) | Después (*Humanizado + SEO/GEO/Marketing*) | Mejora lograda |
| :--- | :--- | :--- | :--- |
| **Encabezado H2** | `Nuestros productos` | `Puentes grúa, pórticos y polipastos` (con *eyebrow* `Equipos de izaje`) | **Heading Structure**: H2 descriptivo con palabras clave transaccionales. |
| **Subtítulo / Lede** | *"Más de 25 años de **EXPERIENCIA** en el mercado. Ofrecemos una gran variedad de equipos de carga de las más prestigiosas compañías en el ámbito del manejo de carga del mundo con el fin de adaptarnos a sus necesidades."* | *"Más de 25 años equipando plantas en Colombia. Fabricamos la estructura del puente grúa a la medida de su nave e integramos polipastos, testeros y electrificación de fabricantes especializados como R&M, World Hoists, Conductix-Wampfler, AUTEC y DIEPA."* | **Humanizer §16, §19 + Copywriting FAB**: Se eliminó el relleno publicitario y la palabra en mayúsculas sostenidas; ahora comunica la ventaja competitiva real y nombra las entidades de marca para **GEO**. |
| **Puente grúa (`02`)** | *"Se dimensiona según la luz... Se fabrica en configuración monoviga o biviga."* (`1 – 15 t`) | *"Calculamos y fabricamos puentes grúa monoviga y biviga a partir de la luz entre rieles, la altura bajo gancho, el recorrido longitudinal, la carga nominal y el régimen FEM/ISO de la planta."* (`1 a 15 t`) | **Humanizer §8, §11**: Voz activa, precisión de ingeniería (`régimen FEM/ISO`, `altura bajo gancho`) y eliminación de semirraya. |
| **Grúa pórtico (`06`)** | *"Los apoyos se calculan según el terreno y la luz libre requerida."* | *"Dimensionamos las patas de apoyo, la viga principal y el sistema de traslación según las cargas sobre riel o losa."* | **Humanizer §11**: Voz activa y vocabulario estructural preciso. |
| **Grúa bandera (`03`)** | *"Se dimensiona según el radio de giro, la altura bajo gancho y la carga puntual de la estación."* | *"Cubre un radio fijo sobre columna propia con anclaje al piso o montada sobre la estructura existente, liberando al puente grúa principal de maniobras ligeras."* | **Copywriting B2B**: Explica el beneficio operativo real en planta (descongestionar el puente grúa principal). |
| **Polipastos (`01`)** | *"También se suministran polipastos de cadena..."* | *"Suministramos polipastos de cable Spacemaster SX (R&M Materials Handling) y World Hoists para ciclos continuos y grandes alturas de izaje, junto con polipastos eléctricos de cadena R&M LK y Black Bear..."* | **Humanizer §11 + Entity SEO**: Sujeto activo y vinculación explícita entre línea de producto y fabricante. |
| **Kit puente grúa (`04`)** | *"Permiten estandarizar el equipo sin renunciar al cálculo estructural a medida."* | *"Combina mecanismos estandarizados de serie con el cálculo estructural a la medida de su bodega."* | **Humanizer §1/§3**: Sin giros retóricos ("sin renunciar a"). |
| **Electrificación (`05`)** | *"...Cierran el circuito completo del sistema de izaje."* | *"Líneas de barra blindada y festón Conductix-Wampfler para la traslación del puente y del carro, radiocontroles industriales AUTEC, cables de acero especial DIEPA, electroimanes FELEMAMG y accesorios bajo gancho."* | **Humanizer §2/§3 + GEO**: Se eliminó la frase cliché final y se detallaron los sistemas específicos buscados por jefes de mantenimiento. |
| **Contador de ficha** | `Referencia {family.num} / 07` | `Referencia {family.num} / 06` | Corrección de exactitud (son 6 familias). |
| **Nota al pie** | *"Los rangos de capacidad corresponden a equipos documentados en el archivo técnico de proyectos..."* | *"Definimos la configuración, la luz entre rieles y la capacidad de carga mediante levantamiento dimensional en su planta."* | **Humanizer §25**: Deja de hablar del archivo del sitio web y orienta al cliente hacia el levantamiento en planta. |

---

### D. Ciclo de Vida / Servicios (`src/components/Lifecycle.astro`)

| Elemento | Antes (*con AI Slop*) | Después (*Humanizado + SEO/GEO*) | Mejora lograda |
| :--- | :--- | :--- | :--- |
| **Encabezado H2** | `El ciclo completo de un sistema de izaje` | `Ingeniería, montaje y mantenimiento de grúas` | **Heading Structure**: Incluye los servicios clave buscados en Google y motores de IA. |
| **Párrafo Lede** | *"Un puente grúa no termina cuando se entrega. Colcranes interviene en las siete etapas..."* | *"Acompañamos toda la vida operativa de su sistema de elevación: desde el levantamiento en planta y la fabricación estructural hasta el mantenimiento preventivo, el suministro de repuestos originales y la modernización del equipo."* | **Humanizer §1/§2 + GEO Answer-First**: Se eliminó el arranque dramático negativo y se redactó un párrafo autocontenido citable por motores RAG. |
| **Etapas 01 a 07** | Descripciones abstractas (*"sostener la continuidad de la operación"*, *"recuperar confiabilidad"*) | Términos técnicos concretos (*"alineación topográfica de la vía de rodadura"*, *"pruebas de carga"*, *"conversión a radiocontrol y repotenciación"*) | **E-E-A-T (Expertise)**: Demuestra conocimiento real de campo en lugar de promesas genéricas. |

---

### E. Capacidad y Planta (`src/components/Capacity.astro`)

| Elemento | Antes (*con AI Slop*) | Después (*Humanizado + SEO/GEO*) | Mejora lograda |
| :--- | :--- | :--- | :--- |
| **Encabezado H2** | `Ingeniería colombiana para operaciones reales` | `Fabricación propia y montaje en toda Colombia` | **Humanizer §3 + SEO**: Sustituye el cliché "para operaciones reales" por la propuesta de valor real y local. |
| **Párrafo Lede** | *"...Eso permite responder por el equipo completo —estructura, mecanismos, montaje y mantenimiento— en lugar de delegar cada etapa en un tercero."* | *"Integramos bajo una misma dirección técnica el cálculo estructural, la fabricación en taller, el montaje en sitio y el mantenimiento posventa. Así respondemos directamente por la estructura, los mecanismos de izaje y la continuidad operativa del equipo."* | **Humanizer §1, §8**: Sin rayas ni contrastes `en lugar de`. |
| **Capacidad 01** | *"...se fabrican en Colcranes, no se revenden."* | *"Construimos en nuestros talleres las vigas cajón, los testeros y las estructuras portantes con acero certificado y procesos de soldadura controlada."* | **Humanizer §1 + E-E-A-T**: Elimina la cola negativa `, no se revenden` y aporta detalle constructivo real (`vigas cajón`, `acero certificado`, `soldadura controlada`). |
| **Capacidad 04** | *"Dos sedes —Barranquilla y Bogotá— y desplazamiento..."* | *"Operamos desde nuestras sedes de Barranquilla y Bogotá con desplazamiento de ingenieros y técnicos a plantas industriales en todo el país."* | **Humanizer §8 + §11**: Sin rayas y con verbo conjugado activo. |
| **Tabla `companyData`** | Columna derecha repetía `colcranes.com` 5 veces y el título decía `fuente: sitio corporativo` | Título `Ficha operativa de Colcranes S.A.S.` y columna derecha con contexto operativo (`Siderurgia, manufactura, minería y puertos`, `Planta costa Caribe y sede centro`, etc.) | **Humanizer §25 + GEO**: Elimina la autorreferencia al sitio web y convierte la tabla en una fuente rica de entidades para extracción por IA. |

---

### F. Proyectos, Cotización y Pie de Página (`src/components/Projects.astro`, `src/components/Quote.astro`, `src/components/Footer.astro`)

- **`src/components/Projects.astro`**:
  - **H2**: De `"Lo que se ha fabricado y montado"` (voz pasiva refleja) a `"Equipos fabricados e instalados en Colombia"`.
  - **Lede**: Se eliminó el contraste defensivo *"...no una selección de imágenes de archivo"* (§1 y §25).
  - **Nota al pie**: Se eliminó la narración del borrador (*"La capacidad se transcribe de la propia ficha y sólo se publica cuando allí está declarada"*, §25) y se reemplazó por información útil para el comprador industrial: *"Referencias tomadas del archivo de ingeniería de Colcranes S.A.S. Las memorias de cálculo y dossiers de fabricación están disponibles para revisión durante las visitas técnicas."*
- **`src/components/Quote.astro`**:
  - **Microcopy junto al botón**: De *"Respondemos con una propuesta técnica, no con una lista de precios."* (§1) a *"Un ingeniero de proyectos revisa sus datos y entrega la propuesta técnica y comercial."*
- **`src/components/Footer.astro`**:
  - **Resumen corporativo**: Redactado en primera persona del plural activa (*"Diseñamos, fabricamos, montamos y mantenemos..."*) mencionando explícitamente **Colombia**, **Barranquilla** y **Bogotá** para reforzar señales locales y de entidad.
