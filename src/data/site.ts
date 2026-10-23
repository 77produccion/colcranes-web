export const SITE_URL = "https://colcranes.com";

export const CONTACT = {
  companyName: "COLCRANES S.A.S.",
  nit: "900.298.414-2",
  salesPhone: "+57 315 629 3396",
  salesPhoneHref: "tel:+573156293396",
  whatsappNumber: "573156293396",
  whatsappUrl: "https://wa.me/573156293396",
  supportPhone: "+57 310 704 3333",
  supportPhoneHref: "tel:+573107043333",
  customerServicePhone1: "+57 322 249 2904",
  customerServicePhone1Href: "tel:+573222492904",
  customerServicePhone2: "+57 315 306 5795",
  customerServicePhone2Href: "tel:+573153065795",
  // Pendiente de confirmación definitiva por el cliente antes de publicar:
  bogotaPhone: "Por confirmar · Línea nacional +57 315 629 3396",
  bogotaPhoneHref: "tel:+573156293396",
  commercialEmail: "comercial@colcranes.com",
  careersEmail: "seleccion@colcranes.com",
  privacyEmail: "protecciondatos@colcranes.com",
  schedule: "Lunes a viernes, 07:30 – 17:30",
  offices: [
    {
      city: "Barranquilla",
      role: "Sede Principal y Planta de Fabricación",
      address: "Cra. 67 # Vía 40-62, piso 3",
      phone: "+57 315 629 3396",
      phoneHref: "tel:+573156293396",
    },
    {
      city: "Bogotá",
      role: "Sede Comercial y Servicio Técnico Zona Centro",
      address: "Cra. 128 # 14B-31",
      phone: "+57 315 629 3396 (Teléfono fijo Bogotá por confirmar)",
      phoneHref: "tel:+573156293396",
    },
  ],
  socials: [
    { href: "https://co.linkedin.com/company/colcranes-s-a-s", label: "LinkedIn" },
    { href: "https://www.instagram.com/colcranes_sas/", label: "Instagram" },
    { href: "https://www.facebook.com/Colcranespuentegruasypolipastos", label: "Facebook" },
    { href: "https://twitter.com/colcranes", label: "X" },
  ],
};

/**
 * Sección de cifras clave (Punto 4.2).
 * Lista para actualizar con los números exactos cuando el cliente los confirme.
 */
export const COMPANY_STATS = [
  {
    value: "+800",
    label: "Proyectos ejecutados",
    detail: "Puentes grúa, pórticos, polipastos y modernizaciones en plantas de Colombia",
  },
  {
    value: "+25",
    label: "Años de experiencia",
    detail: "Trayectoria en diseño, cálculo estructural, fabricación y montaje de sistemas de izaje",
  },
  {
    value: "100%",
    label: "Técnicos propios",
    detail: "Personal directo certificado en trabajo en alturas, riesgo eléctrico y pruebas de carga",
  },
  {
    value: "2",
    label: "Sedes en Colombia",
    detail: "Barranquilla (planta de fabricación de 3.000 m²) y Bogotá, con cobertura nacional",
  },
];

/**
 * Marcas y proveedores autorizados (Punto 1).
 * - Se mantienen: R&M, Worldhoists, Diepa, SRP, Black Bear, Autec.
 * - Se agrega: CMAK.
 * - Se incluye: NOVALIFT como línea propia SIN enlace externo.
 * - Se retiran: Felemamg, Conductix y Drivecon hasta confirmación.
 * - Si el archivo de logo existe en `public/`, se muestra la imagen; si aún está pendiente
 *   de entrega, se muestra el espacio reservado para el logo oficial monocromo.
 * - Los logos nuevos viven en `public/images/marks-logo/`; R&M, Worldhoists, Diepa y SRP
 *   se mantienen en `public/images/` porque los genera `scripts/build-assets.mjs`.
 */
export interface BrandItem {
  name: string;
  shortName: string;
  img: string;
  url: string | null;
  ownLine?: boolean;
}

export const BRANDS: BrandItem[] = [
  {
    name: "R&M Materials Handling",
    shortName: "R&M",
    img: "/images/marks-logo/trim/RM-Logo.png",
    url: "https://www.rmhoist.com/",
  },
  {
    name: "World Hoists",
    shortName: "Worldhoists",
    img: "/images/brand-world-hoist.png",
    url: "https://worldhoists.com/",
  },
  {
    name: "DIEPA Special Wire Ropes",
    shortName: "DIEPA",
    img: "/images/brand-diepa.png",
    url: "https://www.diepa.com/",
  },
  {
    name: "SRP Crane Controls",
    shortName: "SRP",
    img: "/images/brand-srp.png",
    url: "https://www.srpcranes.com/",
  },
  {
    name: "Black Bear Hoists",
    shortName: "Black Bear",
    img: "/images/marks-logo/black-bear-logo.png",
    url: "https://www.blackbearhoists.com/",
  },
  {
    name: "AUTEC Radio Remote Control",
    shortName: "AUTEC",
    img: "/images/marks-logo/autec-logo.svg",
    url: "https://www.autecsafety.com/",
  },
  {
    name: "CMAK Crane Systems",
    shortName: "CMAK",
    img: "/images/marks-logo/cmak-logo.png",
    url: "https://cmak.com/",
  },
  {
    name: "NOVALIFT · Línea propia COLCRANES",
    shortName: "NOVALIFT (Línea propia)",
    img: "/images/marks-logo/novalift-logo.png",
    url: null,
    ownLine: true,
  },
];

/**
 * Franja de logos de clientes (Punto 4.1).
 * Los archivos PNG/SVG autorizados viven en `public/images/logos/`.
 */
export const CLIENTS = [
  { name: "Steckerl Aceros", logo: "/images/logos/trim/steckerlaceros.png", sector: "Siderurgia y aceros" },
  { name: "AA Metals", logo: "/images/logos/trim/aa-metals.png", sector: "Metalmecánica y distribución" },
  { name: "Agofer", logo: "/images/logos/trim/agofer.png", sector: "Acero y construcción" },
  { name: "Energía Solar", logo: "/images/logos/trim/energia-solar.png", sector: "Manufactura arquitectónica" },
  { name: "Litoplas", logo: "/images/logos/trim/litoplas.png", sector: "Industria de empaques" },
  { name: "Triple A", logo: "/images/logos/trim/triple-a.png", sector: "Servicios públicos e infraestructura" },
];

/**
 * Casos de éxito / Proyectos destacados (Punto 4.3).
 * 4 casos con espacio para fotografía propia (cero stock / cero IA), cliente, capacidad, luz y alcance.
 */
export interface CaseStudy {
  id: string;
  code: string;
  client: string;
  location: string;
  title: string;
  capacity: string;
  span: string;
  scope: string;
  summary: string;
  image: string;
  slotSpec: string;
  alt: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "aa-metals-bodega-23a",
    code: "FT-110201",
    client: "AA Metals · Bodegas 22 y 23",
    location: "Barranquilla, Atlántico",
    title: "Puentes grúa para operación de almacenamiento y despacho de acero",
    capacity: "15 t · 12,8 t · 12,5 t",
    span: "Dimensionada a medida de cada nave",
    scope: "Diseño estructural, fabricación de viga cajón, montaje y pruebas de carga",
    summary:
      "Suministro e instalación de seis puentes grúa dimensionados bodega por bodega (capacidades de 3 t, 5 t, 12,5 t, 12,8 t y 15 t) para manejo continuo de bobinas y láminas de acero.",
    image: "/images/proyectos/caso-01.webp",
    slotSpec: "1600 × 1000 px · Proporción 16:10 · WebP / JPG",
    alt: "Fotografía del proyecto de puentes grúa en AA Metals",
  },
  {
    id: "agofer-semiportico",
    code: "FT-107102",
    client: "Agofer",
    location: "Colombia",
    title: "Grúas semipórtico y puente grúa para manejo de perfiles estructurales",
    capacity: "17 t y 5 t",
    span: "Configuración semipórtico sobre riel de piso y testero elevado",
    scope: "Ingeniería de cálculo, fabricación propia, suministro de polipastos y puesta en marcha",
    summary:
      "Diseño y fabricación de grúa semipórtico de 17 toneladas (FT-107102), semipórtico de 5 toneladas (FT-107101) y puente grúa de 5 toneladas (FT-107103) para agilizar el cargue y acopio.",
    image: "/images/proyectos/caso-02.webp",
    slotSpec: "1600 × 1000 px · Proporción 16:10 · WebP / JPG",
    alt: "Fotografía del proyecto de grúa semipórtico de 17 t en Agofer",
  },
  {
    id: "steckerl-aceros-plantas",
    code: "FT-1044 · FT-1080",
    client: "Steckerl Aceros",
    location: "Itagüí · Ricaurte · Bucaramanga · Cali · Pereira · Palmira",
    title: "Fabricación de puentes grúa, modificación de pórticos y modernización",
    capacity: "Múltiples capacidades por centro de distribución",
    span: "Adecuación de luz y altura en 6 plantas",
    scope: "Fabricación, modificación estructural de pórticos, alineación de vías y modernización",
    summary:
      "Nueve proyectos base documentados en seis centros operativos a nivel nacional, incluyendo fabricación de puentes grúa nuevos y modificación estructural de pórticos en operación.",
    image: "/images/proyectos/caso-03.webp",
    slotSpec: "1600 × 1000 px · Proporción 16:10 · WebP / JPG",
    alt: "Fotografía de proyecto ejecutado para Steckerl Aceros",
  },
  {
    id: "energia-solar-naves",
    code: "FT-108301 – FT-108304",
    client: "Energía Solar · ES Windows",
    location: "Barranquilla, Atlántico",
    title: "Sistema integral de puentes grúa, pórtico y puente colgante",
    capacity: "5 t · 3 t · 2 t",
    span: "Cobertura en Nave 1, Nave 2 y áreas de ensamble",
    scope: "Ingeniería, fabricación en taller propio, montaje mecánico, electrificación y puesta en marcha",
    summary:
      "Equipamiento de naves de producción mediante puentes grúa de 3 t y 5 t, grúa pórtico de 2 t y puente colgante de 3 t, integrados al flujo de manufactura continua.",
    image: "/images/proyectos/caso-04.webp",
    slotSpec: "1600 × 1000 px · Proporción 16:10 · WebP / JPG",
    alt: "Fotografía de proyecto ejecutado en Energía Solar",
  },
];

/**
 * Familias de equipos con páginas individuales para SEO (/equipos/[slug]).
 */
export interface EquipmentFamily {
  id: string;
  slug: string;
  num: string;
  name: string;
  pluralName: string;
  short: string;
  seoTitle: string;
  seoDescription: string;
  copy: string;
  longDescription: string[];
  image: string;
  alt: string;
  photo?: boolean;
  notes: { text: string; pos: "tl" | "tr" | "bl" | "br" }[];
  specs: { label: string; value: string }[];
  tags: string[];
  applications: string[];
  features: string[];
}

export const EQUIPMENT_FAMILIES: EquipmentFamily[] = [
  {
    id: "fam-cable",
    slug: "polipastos",
    num: "01",
    name: "Polipastos",
    pluralName: "Polipastos eléctricos de cable y de cadena",
    short: "Cable y cadena · Servicio pesado",
    seoTitle: "Polipastos Eléctricos de Cable y de Cadena en Colombia | COLCRANES",
    seoDescription:
      "Suministro, instalación y repuestos de polipastos eléctricos de cable y de cadena (R&M Spacemaster SX, LK, Black Bear, Worldhoists, CMAK) para puentes grúa e industria en Colombia.",
    copy: "Suministro de polipastos de cable y de cadena para distintas configuraciones de puente grúa y necesidades de operación.",
    longDescription: [
      "En COLCRANES S.A.S. seleccionamos y suministramos polipastos eléctricos de cable de acero y de cadena de eslabones de fabricantes internacionales como R&M Materials Handling, Worldhoists, Black Bear y CMAK, además de nuestra línea propia NOVALIFT.",
      "Cada unidad se configura según la capacidad nominal de carga, la altura de izaje efectiva, la velocidad de elevación (una o dos velocidades, o variador de frecuencia), el espacio libre superior disponible (altura normal o bajo perfil) y el grupo de servicio FEM / ISO requerido por su operación.",
    ],
    image: "/images/hoist-double-girder.png",
    alt: "Polipasto de cable para puente grúa biviga con carro motorizado",
    notes: [
      { text: "Carro motorizado", pos: "tl" },
      { text: "Tambor de cable", pos: "br" },
    ],
    specs: [
      { label: "Líneas", value: "R&M · Black Bear · Worldhoists · CMAK · NOVALIFT" },
      { label: "Montaje", value: "Monoviga · Biviga · Suspensión fija" },
      { label: "Alcance", value: "Suministro, montaje, repuestos y retrofit" },
    ],
    tags: ["Ciclos intensivos", "Servicio pesado", "Naves de gran altura"],
    applications: [
      "Integración en puentes grúa monoviga y biviga nuevos",
      "Reemplazo (retrofit) de unidades de izaje en puentes existentes",
      "Estaciones de trabajo con grúas bandera o monorrieles",
      "Operaciones de mantenimiento, ensamble y manufactura pesada",
    ],
    features: [
      "Polipastos de cable R&M Spacemaster SX / SXE para servicio pesado y gran altura de izaje",
      "Polipastos eléctricos de cadena R&M LK y Black Bear (series NHD/NTD y YHS/YSS)",
      "Limitadores de sobrecarga, finales de carrera de elevación y freno electromagnético de alta confiabilidad",
      "Disponibilidad de repuestos originales (cables DIEPA, guías de cable, contactores, botoneras y radiocontroles AUTEC)",
    ],
  },
  {
    id: "fam-puentes",
    slug: "puentes-grua",
    num: "02",
    name: "Puente grúa",
    pluralName: "Puentes grúa monoviga y biviga",
    short: "Monoviga, biviga y colgante",
    seoTitle: "Fabricación y Montaje de Puentes Grúa en Colombia | COLCRANES",
    seoDescription:
      "Diseño, cálculo estructural, fabricación y montaje de puentes grúa monoviga y biviga en Colombia bajo normas CMAA y FEM. Planta propia en Barranquilla y sede en Bogotá.",
    copy: "Para naves industriales con recorrido sobre rieles. Se fabrica en configuración monoviga o biviga y se dimensiona según la luz, la altura de izaje, la carga y el ciclo de trabajo.",
    longDescription: [
      "Diseñamos y fabricamos puentes grúa monoviga, biviga y suspendidos (colgantes) en nuestra planta de 3.000 m² en Barranquilla, cumpliendo con las normas internacionales CMAA (Crane Manufacturers Association of America) y FEM (Fédération Européenne de la Manutention).",
      "Cada puente grúa parte del levantamiento dimensional en su planta: calculamos la viga principal (perfil laminado o viga cajón soldada), definimos los testeros motorizados, el polipasto y la electrificación transversal y longitudinal para garantizar una operación segura, suave y precisa.",
    ],
    image: "/images/productos/puente-grua.jpg",
    alt: "Puente grúa industrial con polipasto de cable y gancho de carga",
    notes: [
      { text: "Viga principal calculada", pos: "tl" },
      { text: "Polipasto de cable", pos: "tr" },
      { text: "Gancho de carga", pos: "br" },
    ],
    specs: [
      { label: "Configuración", value: "Monoviga · Biviga · Colgante" },
      { label: "Capacidad en proyectos", value: "1 t – 50+ t (según ingeniería)" },
      { label: "Normativa", value: "CMAA · FEM / ISO" },
    ],
    tags: ["Siderurgia", "Bodegas de acero", "Manufactura"],
    applications: [
      "Plantas siderúrgicas, bodegas de aceros y centros de corte",
      "Naves de manufactura, metalmecánica, plásticos y ensamble",
      "Centrales hidroeléctricas, sector energético y minería",
      "Talleres de mantenimiento de maquinaria pesada",
    ],
    features: [
      "Vigas cajón y estructuras fabricadas en acero certificado con control dimensional y de soldadura",
      "Configuración monoviga para optimizar altura útil y carga sobre columnas en luces medias",
      "Configuración biviga para grandes capacidades, mayores luces, pasarelas de mantenimiento y ganchos auxiliares",
      "Control por botonera colgante o radiocontrol industrial AUTEC con variadores de velocidad",
    ],
  },
  {
    id: "fam-bandera",
    slug: "gruas-bandera",
    num: "03",
    name: "Grúa bandera",
    pluralName: "Grúas bandera de columna y de pared",
    short: "De columna y de pared",
    seoTitle: "Grúas Bandera o Pescante para Estaciones de Trabajo | COLCRANES",
    seoDescription:
      "Diseño, fabricación e instalación de grúas bandera (pescante) de columna autosoportada o murales de pared para estaciones de trabajo industriales en Colombia.",
    copy: "Atiende puestos de trabajo mediante un brazo giratorio instalado en columna o pared. El alcance y la capacidad se definen para las condiciones de cada estación.",
    longDescription: [
      "Las grúas bandera (también conocidas como grúas pescante o jib cranes) agilizan el izaje localizado en celdas de manufactura, centros de mecanizado, áreas de soldadura y muelles de carga sin ocupar el puente grúa principal de la nave.",
      "Fabricamos grúas bandera de columna autosoportada (con placa base y pernos de anclaje calculados) y grúas bandera murales fijadas a columnas estructurales existentes, con rotación manual o motorizada de 180°, 270° o 360°.",
    ],
    image: "/images/productos/grua-bandera.jpg",
    alt: "Grúa bandera amarilla de columna con polipasto eléctrico",
    notes: [
      { text: "Radio de giro", pos: "tr" },
      { text: "Brazo giratorio", pos: "tl" },
      { text: "Columna estructural", pos: "bl" },
    ],
    specs: [
      { label: "Configuración", value: "Columna autosoportada · Pared" },
      { label: "Giro", value: "180° · 270° · 360°" },
      { label: "Alcance", value: "Diseño, fabricación, montaje" },
    ],
    tags: ["Puestos de trabajo", "Carga puntual", "Mantenimiento"],
    applications: [
      "Alimentación de máquinas herramienta, tornos CNC y mesas de corte",
      "Estaciones de ensamble, soldadura y empaque",
      "Talleres de mantenimiento mecánico y bombas",
      "Puntos de transferencia complementarios al puente grúa principal",
    ],
    features: [
      "Diseño estructural a medida según el radio de giro efectivo y la altura bajo brazo requerida",
      "Compatibles con polipastos eléctricos de cadena (Black Bear, R&M LK) o de cable",
      "Sistema de festón portacables integrado a lo largo del brazo giratorio",
      "Topes mecánicos de giro y opción de rotación motorizada para cargas mayores",
    ],
  },
  {
    id: "fam-kit",
    slug: "kits-puente-grua",
    num: "04",
    name: "Kit puente grúa",
    pluralName: "Kits de puente grúa",
    short: "Testeros, motorización y control",
    seoTitle: "Kits de Puente Grúa: Testeros, Polipasto y Electrificación | COLCRANES",
    seoDescription:
      "Kits de puente grúa con testeros motorizados, polipasto de cable o cadena, tableros eléctricos y mandos para integración sobre viga en Colombia.",
    copy: "Testeros, motorización y control para configurar un puente grúa sobre una viga calculada para la instalación.",
    longDescription: [
      "El kit de puente grúa reúne todos los conjuntos electromecánicos de precisión —polipasto con carro, par de testeros con motorreductores de traslación, tableros de control, festón transversal y mando— listos para ensamblarse sobre la viga principal.",
      "Es una solución eficiente tanto para proyectos donde fabricamos la viga en nuestra planta como para montajes en regiones apartadas donde se optimiza el transporte y la integración en sitio.",
    ],
    image: "/images/productos/kit-puente-grua.jpg",
    alt: "Kit de puente grúa con testeros motorizados, polipasto y sistema de control",
    notes: [
      { text: "Testero motorizado", pos: "tl" },
      { text: "Unidad de izaje y control", pos: "br" },
    ],
    specs: [
      { label: "Contenido", value: "Testeros · Polipasto · Tablero · Mando" },
      { label: "Montaje", value: "Sobre viga monoviga o biviga" },
      { label: "Alcance", value: "Suministro, integración y puesta en marcha" },
    ],
    tags: ["Fabricación propia", "Estandarización", "Montaje rápido"],
    applications: [
      "Integración de puentes grúa nuevos con componentes estandarizados de alta confiabilidad",
      "Proyectos con logística optimizada hacia distintas ciudades de Colombia",
      "Actualización electromecánica completa conservando o fabricando la viga principal",
    ],
    features: [
      "Testeros fabricados y maquinados con ruedas de acero de alta resistencia al desgaste",
      "Motorreductores de traslación suave con control por variador de frecuencia",
      "Tableros eléctricos cableados y probados bajo estándares industriales",
      "Ingeniería de la viga principal incluida para asegurar el acople exacto",
    ],
  },
  {
    id: "fam-electrico",
    slug: "sistemas-electrificacion",
    num: "05",
    name: "Sistema de electrificación",
    pluralName: "Sistemas de electrificación y mandos",
    short: "Recorrido, alimentación y radiocontrol",
    seoTitle: "Sistemas de Electrificación y Radiocontrol para Puentes Grúa | COLCRANES",
    seoDescription:
      "Suministro e instalación de sistemas de electrificación longitudinal y transversal (festón, barras conductoras), radiocontroles AUTEC y cables DIEPA para grúas en Colombia.",
    copy: "Alimentación eléctrica para el puente y el carro, además de mandos por radiocontrol y componentes de reposición.",
    longDescription: [
      "Un suministro eléctrico confiable y un sistema de mando preciso evitan paradas no programadas en la vía de rodadura. Suministramos e instalamos sistemas de electrificación longitudinal (blindo barra / rieles conductores encapsulados) y transversal (sistemas tipo festón con cable plano).",
      "Complementamos la electrificación con radiocontroles industriales de seguridad AUTEC, controles y componentes SRP Crane Controls, y cables de acero de alto rendimiento DIEPA.",
    ],
    image: "/images/productos/sistema-electrificacion.jpg",
    alt: "Sistema de electrificación tipo festón con carros portacables y riel para puente grúa",
    photo: false,
    notes: [
      { text: "Carros portacables", pos: "tl" },
      { text: "Línea de alimentación", pos: "br" },
    ],
    specs: [
      { label: "Incluye", value: "Festón · Barras conductoras · Radiocontrol" },
      { label: "Marcas aliadas", value: "AUTEC · SRP · DIEPA · Worldhoists" },
      { label: "Alcance", value: "Suministro, instalación y repuestos" },
    ],
    tags: ["Recorrido del puente", "Toma de corriente", "Radiocontrol"],
    applications: [
      "Electrificación longitudinal de vías de rodadura en bodegas y patios",
      "Sistemas de festón portacables para el recorrido transversal del polipasto",
      "Conversión de mando por botonera colgante a radiocontrol inalámbrico AUTEC",
      "Reposición de escobillas colectoras, carros portacables, cables planos y botoneras",
    ],
    features: [
      "Sistemas de festón en riel tipo C o viga I con carros portacables para servicio interior o intemperie",
      "Radiocontroles industriales AUTEC con parada de emergencia certificada y baterías recargables",
      "Cables de acero especiales DIEPA con alta resistencia a la fatiga y al aplastamiento en tambor",
      "Instalación y pruebas por técnicos electricistas propios de Colcranes",
    ],
  },
  {
    id: "fam-portico",
    slug: "gruas-portico",
    num: "06",
    name: "Grúa pórtico",
    pluralName: "Grúas pórtico y semipórtico",
    short: "Pórtico y semipórtico",
    seoTitle: "Fabricación de Grúas Pórtico y Semipórtico en Colombia | COLCRANES",
    seoDescription:
      "Diseño, fabricación y montaje de grúas pórtico y semipórtico en Colombia para patios de acopio, prefabricados y naves industriales sin columnas de soporte.",
    copy: "Alternativa para patios y espacios sin una vía de rodadura elevada. La configuración de pórtico o semipórtico se define según la luz libre y las condiciones del lugar.",
    longDescription: [
      "Las grúas pórtico y semipórtico resuelven el izaje de cargas pesadas en patios abiertos de almacenamiento, plantas de prefabricados, astilleros o naves industriales cuyas columnas no fueron diseñadas para soportar una vía de rodadura elevada.",
      "En la configuración de pórtico completo, las dos patas estructurales se desplazan sobre rieles a nivel de piso (o ruedas para taller); en la configuración semipórtico, un extremo corre sobre riel elevado en columna y el otro sobre riel en piso, aprovechando al máximo el pasillo de trabajo.",
    ],
    image: "/images/productos/grua-portico.jpg",
    alt: "Grúa pórtico industrial amarilla con viga principal y estructura de apoyo",
    notes: [
      { text: "Viga principal", pos: "tl" },
      { text: "Estructura de apoyo", pos: "br" },
    ],
    specs: [
      { label: "Configuración", value: "Pórtico · Semipórtico · Monoviga o Biviga" },
      { label: "Capacidad documentada", value: "Hasta 17 t en semipórtico (y a medida)" },
      { label: "Alcance", value: "Diseño, fabricación, montaje y modificación" },
    ],
    tags: ["Patios de acopio", "Naves sin columnas", "Obra civil e industrial"],
    applications: [
      "Patios de acopio de acero, tubería, bloques y prefabricados de concreto",
      "Bodegas arrendadas o naves cuya estructura no admite cargas de puente grúa",
      "Operaciones de cargue y descargue de camiones a cielo abierto",
      "Aprovechamiento parcial de naves amplias mediante configuración semipórtico",
    ],
    features: [
      "Cálculo estructural para trabajo interior o intemperie (protección de motores, pintura epóxica/poliuretano)",
      "Sistemas anticolisión, alarmas sonoras/luminosas de traslación y frenos de estacionamiento",
      "Voladizos laterales opcionales para ampliar el alcance fuera de la trocha de los rieles",
      "Servicio de modificación de luz y altura para reubicación de pórticos existentes",
    ],
  },
];

export const HOIST_OPTIONS = [
  {
    image: "/images/productos/polipastos/polipasto-cable-sx-sxe.png",
    alt: "Polipasto de cable SX / SXE",
    name: "Polipasto de cable SX / SXE",
    detail: "Cable de acero · Servicio pesado y alta capacidad",
  },
  {
    image: "/images/productos/polipastos/polipasto-cadenas-lk.jpg",
    alt: "Polipasto de cadena LK",
    name: "Polipasto de cadena LK",
    detail: "Cadena de eslabones · Maniobra ágil y compacta",
  },
  {
    image: "/images/productos/polipastos/polipasto-cadena-black-bear-nhd-ntd.jpeg",
    alt: "Black Bear NHD / NTD",
    name: "Black Bear NHD / NTD",
    detail: "Cadena industrial · Trabajo continuo de alta exigencia",
  },
  {
    image: "/images/productos/polipastos/polipasto-cadena-black-bear-yhs-yss.png",
    alt: "Black Bear YHS / YSS",
    name: "Black Bear YHS / YSS",
    detail: "Cadena · Versatilidad en estaciones y talleres",
  },
];

/**
 * Los 10 servicios de Colcranes con páginas individuales para SEO (/servicios/[slug])
 * y espacio individual de fotografía SIN filtro morado y SIN repetir fotos (Punto 3.2 y Punto 5.3).
 */
export interface ServiceItem {
  num: string;
  slug: string;
  name: string;
  shortTitle: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  longDescription: string[];
  deliverables: string[];
  image: string;
  slotSpec: string;
  alt: string;
}

export const SERVICES: ServiceItem[] = [
  {
    num: "01",
    slug: "montaje-puesta-en-marcha",
    name: "Montaje y puesta en marcha de grúa",
    shortTitle: "Montaje y puesta en marcha",
    body: "Instalamos el equipo, alineamos la vía de rodadura y verificamos su funcionamiento con pruebas en planta antes de entrar en operación.",
    seoTitle: "Montaje y Puesta en Marcha de Puentes Grúa en Colombia | COLCRANES",
    seoDescription:
      "Servicio especializado de izaje, montaje mecánico, alineación de vía de rodadura, electrificación y pruebas de carga para puentes grúa y pórticos en Colombia.",
    longDescription: [
      "Nuestro equipo propio de montaje ejecuta la instalación mecánica y eléctrica de puentes grúa, pórticos y grúas bandera en todo el territorio nacional, coordinando las maniobras de izaje en planta sin comprometer la seguridad ni la continuidad de su operación.",
      "Antes de entregar el equipo a producción, verificamos la nivelación y paralelismo de los rieles de rodadura, ajustamos finales de carrera y limitadores de carga, y realizamos las pruebas estáticas y dinámicas junto al cliente.",
    ],
    deliverables: [
      "Planeación de maniobra de izaje y cumplimiento de normas de seguridad en alturas",
      "Inspección y alineación de la vía de rodadura y rieles",
      "Montaje estructural, mecánico y conexión del sistema de electrificación",
      "Pruebas en vacío, pruebas con carga nominal y acta de entrega en operación",
    ],
    image: "/images/servicios/01-montaje-puesta-en-marcha.webp",
    slotSpec: "1200 × 1500 px · Proporción 4:5 · Sin filtro de color",
    alt: "Montaje y puesta en marcha de puente grúa en planta por técnicos de Colcranes",
  },
  {
    num: "02",
    slug: "mantenimiento-preventivo",
    name: "Mantenimiento preventivo",
    shortTitle: "Mantenimiento preventivo",
    body: "Inspecciones y rutinas programadas para detectar desgaste a tiempo y mantener la disponibilidad operativa de sus equipos.",
    seoTitle: "Mantenimiento Preventivo de Puentes Grúa y Polipastos | COLCRANES",
    seoDescription:
      "Programas de mantenimiento preventivo e inspección técnica para puentes grúa y polipastos en Colombia. Reduzca paradas no programadas con técnicos propios.",
    longDescription: [
      "El mantenimiento preventivo periódico evita fallas críticas en frenos, cables de acero, reductores y contactores que pueden detener una línea de producción completa.",
      "Nuestros técnicos inspeccionan los puntos críticos mecánicos, eléctricos y estructurales de sus puentes grúa y polipastos de cualquier marca, entregando un informe técnico detallado con el estado de cada subsistema y las recomendaciones oportunas.",
    ],
    deliverables: [
      "Inspección de cable de acero, gancho, pasteca, tambor y guía de cable",
      "Revisión y ajuste de frenos de izaje y traslación",
      "Verificación de tableros eléctricos, contactores, variadores, finales de carrera y mandos",
      "Lubricación técnica e informe de diagnóstico por equipo",
    ],
    image: "/images/servicios/02-mantenimiento-preventivo.webp",
    slotSpec: "1200 × 1500 px · Proporción 4:5 · Sin filtro de color",
    alt: "Inspección y mantenimiento preventivo de polipasto y puente grúa",
  },
  {
    num: "03",
    slug: "contratos-mantenimiento-repuestos",
    name: "Contratos de mantenimiento y repuestos",
    shortTitle: "Contratos de mantenimiento",
    body: "Planes anuales o plurianuales que integran visitas programadas, atención prioritaria y suministro de componentes para su planta.",
    seoTitle: "Contratos de Mantenimiento y Repuestos para Grúas | COLCRANES",
    seoDescription:
      "Contratos de mantenimiento programado y provisión de repuestos para flotas de puentes grúa y polipastos en plantas industriales de Colombia.",
    longDescription: [
      "Para plantas con múltiples equipos de izaje o regímenes de trabajo continuo, diseñamos contratos de mantenimiento a medida que aseguran visitas programadas según las horas reales de operación y tiempos de respuesta preferenciales ante emergencias.",
      "El contrato incluye el seguimiento histórico de cada activo (hoja de vida técnica) y la planificación anticipada de consumibles y repuestos críticos para que su planta nunca se detenga por falta de un componente.",
    ],
    deliverables: [
      "Cronograma anual de visitas preventivas ajustado a las paradas de planta",
      "Trazabilidad e historial técnico por código de equipo",
      "Stock programado de repuestos de rotación y desgaste",
      "Atención técnica prioritaria en Barranquilla, Bogotá y cobertura nacional",
    ],
    image: "/images/servicios/03-contratos-mantenimiento.webp",
    slotSpec: "1200 × 1500 px · Proporción 4:5 · Sin filtro de color",
    alt: "Contrato de mantenimiento programado y gestión de repuestos en planta",
  },
  {
    num: "04",
    slug: "suministro-repuestos",
    name: "Suministro de repuestos",
    shortTitle: "Suministro de repuestos",
    body: "Cables de acero, guías, frenos, ruedas, contactores, botoneras y radiocontroles originales para equipos de izaje.",
    seoTitle: "Repuestos para Puentes Grúa y Polipastos en Colombia | COLCRANES",
    seoDescription:
      "Suministro de repuestos originales para puentes grúa y polipastos: cables DIEPA, radiocontroles AUTEC, componentes R&M, Worldhoists, Black Bear y SRP.",
    longDescription: [
      "Contamos con respaldo directo de los fabricantes que representamos (R&M Materials Handling, Worldhoists, DIEPA, SRP Crane Controls, Black Bear, AUTEC y CMAK) y componentes para nuestra línea NOVALIFT.",
      "Identificamos la referencia exacta a partir de la placa del equipo o mediante levantamiento técnico, despachando repuestos genuinos a cualquier ciudad de Colombia.",
    ],
    deliverables: [
      "Cables de acero especiales DIEPA para polipastos de alta exigencia",
      "Guías de cable, discos de freno, bobinas, ruedas de testero y topes de caucho",
      "Radiocontroles industriales AUTEC, botoneras colgantes, festones y escobillas colectoras",
      "Variadores de velocidad, contactores y finales de carrera de elevación y traslación",
    ],
    image: "/images/servicios/04-suministro-repuestos.webp",
    slotSpec: "1200 × 1500 px · Proporción 4:5 · Sin filtro de color",
    alt: "Suministro de repuestos originales para puentes grúa y polipastos",
  },
  {
    num: "05",
    slug: "accesorios-bajo-gancho",
    name: "Accesorios de elevación bajo gancho",
    shortTitle: "Accesorios bajo gancho",
    body: "Balancines, vigas separadoras, pinzas portabobinas y dispositivos seleccionados según la geometría de la carga.",
    seoTitle: "Accesorios de Elevación Bajo Gancho y Balancines de Carga | COLCRANES",
    seoDescription:
      "Diseño, fabricación y suministro de accesorios de elevación bajo gancho en Colombia: vigas separadoras (spreader beams), balancines, ganchos C y pinzas.",
    longDescription: [
      "El puente grúa es tan seguro y eficiente como el elemento que sujeta la carga. Diseñamos, fabricamos y suministramos dispositivos bajo gancho adaptados a la geometría, el peso y el centro de gravedad de sus materiales.",
      "Desde vigas separadoras (spreader beams) para cargas largas hasta ganchos tipo C para bobinas de acero, cada accesorio se entrega calculado y probado para trabajar en conjunto con su polipasto.",
    ],
    deliverables: [
      "Vigas separadoras (spreader beams) y balancines de izaje",
      "Ganchos tipo C para manejo de bobinas de acero",
      "Pinzas mecánicas, eslingas y accesorios de sujeción industrial",
      "Memoria de cálculo y placa de identificación de capacidad nominal",
    ],
    image: "/images/servicios/05-accesorios-bajo-gancho.webp",
    slotSpec: "1200 × 1500 px · Proporción 4:5 · Sin filtro de color",
    alt: "Accesorios de elevación bajo gancho, balancín y gancho C para bobinas",
  },
  {
    num: "06",
    slug: "fabricacion-puentes-grua",
    name: "Fabricación de puentes grúa",
    shortTitle: "Fabricación de puentes grúa",
    body: "Diseño y fabricación en nuestra planta de 3.000 m² según la luz, capacidad, altura de izaje y condiciones de la nave.",
    seoTitle: "Fabricación Propia de Puentes Grúa en Colombia | COLCRANES",
    seoDescription:
      "Fabricación nacional de puentes grúa monoviga, biviga, pórticos y grúas bandera en nuestra planta de 3.000 m². Ingeniería bajo normas CMAA y FEM.",
    longDescription: [
      "En nuestra planta de fabricación de 3.000 m² en Barranquilla construimos vigas cajón, vigas de perfil laminado, testeros, columnas de grúas bandera y estructuras de pórtico con acero certificado y procesos de soldadura controlados.",
      "Combinamos fabricación estructural colombiana de alta precisión con paquetes electromecánicos de marcas líderes a nivel mundial, logrando plazos de entrega competitivos y soporte directo de fábrica durante toda la vida útil del equipo.",
    ],
    deliverables: [
      "Ingeniería de detalle y planos de fabricación bajo normas CMAA / FEM",
      "Corte, armado y soldadura de vigas principales y testeros en taller propio",
      "Preparación de superficie, pintura industrial anticorrosiva y pre-ensamble",
      "Integración de polipastos, motorización y tableros eléctricos antes del despacho",
    ],
    image: "/images/servicios/06-fabricacion-puentes-grua.webp",
    slotSpec: "1200 × 1500 px · Proporción 4:5 · Sin filtro de color",
    alt: "Fabricación de vigas y estructuras de puente grúa en planta de Colcranes",
  },
  {
    num: "07",
    slug: "modernizacion-puente-grua",
    name: "Modernización de puente grúa",
    shortTitle: "Modernización (Retrofit)",
    body: "Actualización de polipastos, controles, variadores, radiocontrol y electrificación tras evaluar el estado del equipo.",
    seoTitle: "Modernización y Repotenciación de Puentes Grúa | COLCRANES",
    seoDescription:
      "Servicio de modernización (retrofit) de puentes grúa y pórticos en Colombia: cambio de polipasto, actualización a variadores de frecuencia y radiocontrol.",
    longDescription: [
      "La estructura metálica de un puente grúa suele tener una vida útil superior a la de sus componentes eléctricos y mecánicos. Mediante una modernización (retrofit) extendemos la vida operativa del equipo, mejoramos la seguridad y reducimos el costo de mantenimiento sin reemplazar toda la estructura.",
      "Realizamos desde la conversión a variadores de frecuencia y radiocontrol inalámbrico AUTEC hasta el reemplazo completo del carro-polipasto, la modificación de luz o la repotenciación de capacidad previa verificación estructural.",
    ],
    deliverables: [
      "Diagnóstico mecánico, eléctrico y estructural del equipo existente",
      "Reemplazo de polipasto o unidad de izaje abierta (winch)",
      "Actualización de tableros eléctricos con variadores de frecuencia y protecciones modernas",
      "Instalación de radiocontrol industrial, nueva electrificación festón y pruebas de carga",
    ],
    image: "/images/servicios/07-modernizacion-puente-grua.webp",
    slotSpec: "1200 × 1500 px · Proporción 4:5 · Sin filtro de color",
    alt: "Modernización electromecánica y actualización de control en puente grúa",
  },
  {
    num: "08",
    slug: "servicios-tecnicos",
    name: "Servicios técnicos",
    shortTitle: "Servicios técnicos",
    body: "Soporte especializado en campo para diagnóstico de fallas, reparaciones correctivas, alineación y pruebas de carga.",
    seoTitle: "Servicio Técnico y Reparación de Puentes Grúa en Colombia | COLCRANES",
    seoDescription:
      "Atención técnica especializada para diagnóstico de fallas, mantenimiento correctivo, cambio de cables y reparación de puentes grúa y polipastos en Colombia.",
    longDescription: [
      "Cuando un equipo de izaje presenta una falla eléctrica o mecánica, cada hora cuenta. Nuestro departamento de servicio técnico atiende requerimientos correctivos desde Barranquilla y Bogotá con desplazamiento a plantas en todo el país.",
      "Realizamos diagnóstico en sitio, reemplazo de cables de acero, reparación de reductores y frenos, corrección de descarrilamientos o desalineación de testeros y restablecimiento seguro de la operación.",
    ],
    deliverables: [
      "Diagnóstico de fallas eléctricas, electrónicas (variadores) y mecánicas en sitio",
      "Cambio de cable de acero, guía de cable, gancho y componentes de freno",
      "Alineación mecánica de testeros y verificación de ruedas y rieles",
      "Pruebas operativas posteriores a la intervención",
    ],
    image: "/images/servicios/08-servicios-tecnicos.webp",
    slotSpec: "1200 × 1500 px · Proporción 4:5 · Sin filtro de color",
    alt: "Técnicos de Colcranes realizando servicio técnico correctivo en campo",
  },
  {
    num: "09",
    slug: "servicio-garantias",
    name: "Servicio de garantías",
    shortTitle: "Servicio de garantías",
    body: "Respaldo directo, atención y seguimiento técnico de garantías para todos los equipos suministrados por Colcranes.",
    seoTitle: "Respaldo y Servicio de Garantías de Equipos de Izaje | COLCRANES",
    seoDescription:
      "Respaldo directo de fábrica y gestión de garantías en Colombia para puentes grúa, pórticos y polipastos suministrados por Colcranes S.A.S.",
    longDescription: [
      "Cada equipo fabricado o suministrado por COLCRANES S.A.S. cuenta con respaldo directo de ingeniería, taller propio y representación autorizada de las marcas que integramos.",
      "Atendemos cualquier requerimiento de garantía con personal técnico propio y repuestos originales, asegurando la continuidad operativa de su inversión.",
    ],
    deliverables: [
      "Atención directa por ingenieros y técnicos propios de Colcranes",
      "Trazabilidad por número de serie y ficha técnica de proyecto (código FT)",
      "Respaldo directo de fábrica con nuestros proveedores internacionales",
      "Verificación en planta y acompañamiento postventa",
    ],
    image: "/images/servicios/09-servicio-garantia.webp",
    slotSpec: "1200 × 1500 px · Proporción 4:5 · Sin filtro de color",
    alt: "Respaldo técnico y atención de garantía en equipos suministrados por Colcranes",
  },
  {
    num: "10",
    slug: "asesorias-ingenieria",
    name: "Asesorías integrales de ingeniería",
    shortTitle: "Asesorías de ingeniería",
    body: "Acompañamiento técnico desde la concepción del proyecto para definir capacidades, cargas sobre vías y selección de equipos.",
    seoTitle: "Asesoría e Ingeniería en Sistemas de Izaje Industrial | COLCRANES",
    seoDescription:
      "Consultoría e ingeniería para proyectos de izaje en Colombia: levantamiento en planta, cálculo de cargas por rueda, vías de rodadura y selección de puentes grúa.",
    longDescription: [
      "Acompañamos a gerentes de proyecto, firmas de ingeniería civil y jefes de planta desde la etapa de diseño de una nueva bodega o ampliación industrial para definir la solución de izaje óptima antes de construir.",
      "Entregamos las reacciones y cargas máximas por rueda para el diseño de columnas y ménsulas, verificamos los gálibos laterales y superiores, diseñamos extensiones de vías de rodadura y especificamos el régimen de trabajo bajo normas CMAA y FEM.",
    ],
    deliverables: [
      "Levantamiento dimensional y evaluación operativa en planta",
      "Definición de gálibos, altura bajo gancho y reacciones por rueda sobre la estructura",
      "Diseño y cálculo de vías de rodadura nuevas o extensiones de carrilera",
      "Especificación técnica para licitaciones e inversiones de capital (CAPEX)",
    ],
    image: "/images/servicios/10-asesorias-ingenieria.webp",
    slotSpec: "1200 × 1500 px · Proporción 4:5 · Sin filtro de color",
    alt: "Ingeniería de cálculo y levantamiento dimensional en planta industrial",
  },
];
