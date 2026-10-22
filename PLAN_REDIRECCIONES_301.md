# Plan de Redirecciones 301 — Migración `colcranes.com`

Este documento detalla el mapa de redirecciones permanentes (`HTTP 301`) para preservar el posicionamiento orgánico (SEO), la autoridad de enlaces entrantes y el tráfico desde marcadores o campañas al publicar el nuevo sitio web de **COLCRANES S.A.S.**

Las reglas ya están implementadas y listas para producción en:
- `public/_redirects` (para despliegues en **Cloudflare Pages** o **Netlify**)
- `vercel.json` (para despliegues en **Vercel**)

---

## 1. Páginas Corporativas, Cotizadores y Legales

| URL anterior en `colcranes.com` | Nueva URL en el sitio Astro | Estado |
| :--- | :--- | :---: |
| `/` | `/` | Se mantiene (`200 OK`) |
| `/nosotros/` · `/quienes-somos/` · `/sobre-nosotros/` | `/nosotros` | `301` |
| `/proyectos/` | `/proyectos` | Se mantiene (`200 OK`) |
| `/contacto/` | `/contacto` | Se mantiene (`200 OK`) |
| `/trabaje-con-nosotros/` · `/trabaja-con-nosotros/` | `/trabaje-con-nosotros` | Se mantiene (`200 OK` / `301`) |
| `/cotizador_proyectos/` | `/contacto` | `301` |
| `/cotizador_servicios/` | `/contacto` | `301` |
| `/cotizador_repuestos/` | `/contacto` | `301` |
| `/cotizar/` | `/contacto` | `301` |
| `/politica-de-privacidad/` · `/politica-tratamiento-de-datos/` | `/politica-tratamiento-datos` | `301` |

---

## 2. Páginas Individuales de Equipos (`/equipos/*`)

| URL anterior en `colcranes.com` | Nueva URL en el sitio Astro | Código |
| :--- | :--- | :---: |
| `/productos/` | `/equipos` | `301` |
| `/puente-grua/` · `/puentes-grua/` · `/productos/puente-grua/` | `/equipos/puentes-grua` | `301` |
| `/grua-portico/` · `/gruas-portico/` · `/productos/grua-portico/` | `/equipos/gruas-portico` | `301` |
| `/grua-bandera/` · `/gruas-bandera/` · `/productos/grua-bandera/` | `/equipos/gruas-bandera` | `301` |
| `/polipastos/` · `/productos/polipastos/` | `/equipos/polipastos` | `301` |
| `/kit-puente-grua/` · `/kits-puente-grua/` · `/productos/kit-puente-grua/` | `/equipos/kits-puente-grua` | `301` |
| `/sistema-electrificacion/` · `/productos/sistema-electrificacion/` | `/equipos/sistemas-electrificacion` | `301` |

---

## 3. Páginas Individuales de Servicios (`/servicios/*`)

| URL anterior en `colcranes.com` | Nueva URL en el sitio Astro | Código |
| :--- | :--- | :---: |
| `/servicios/` | `/servicios` | Se mantiene (`200 OK`) |
| `/montaje-y-puesta-en-marcha/` | `/servicios/montaje-puesta-en-marcha` | `301` |
| `/mantenimiento-preventivo/` | `/servicios/mantenimiento-preventivo` | `301` |
| `/contratos-de-mantenimiento-y-repuestos/` | `/servicios/contratos-mantenimiento-repuestos` | `301` |
| `/suministro-de-repuestos/` · `/repuestos/` | `/servicios/suministro-repuestos` | `301` |
| `/accesorios-de-elevacion-bajo-gancho/` | `/servicios/accesorios-bajo-gancho` | `301` |
| `/fabricacion-de-puentes-grua/` | `/servicios/fabricacion-puentes-grua` | `301` |
| `/modernizacion-de-puente-grua/` | `/servicios/modernizacion-puente-grua` | `301` |
| `/servicios-tecnicos/` | `/servicios/servicios-tecnicos` | `301` |
| `/servicio-de-garantias/` | `/servicios/servicio-garantias` | `301` |
| `/asesorias-integrales-de-ingenieria/` | `/servicios/asesorias-ingenieria` | `301` |

---

## 4. Archivos Técnicos de Indexación

| URL anterior | Nueva URL | Código |
| :--- | :--- | :---: |
| `/sitemap_index.xml` · `/wp-sitemap.xml` | `/sitemap.xml` | `301` |
| `/robots.txt` | `/robots.txt` | `200 OK` |

> **Recomendación previa al corte DNS:** Si existen URLs adicionales en Google Search Console (pestaña *Páginas → Indexadas*), exporte el CSV de Search Console y envíenoslo para agregar cualquier ruta histórica adicional a `public/_redirects` y `vercel.json`.
