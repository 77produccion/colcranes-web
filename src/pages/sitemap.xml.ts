import type { APIRoute } from "astro";
import { SITE_URL, EQUIPMENT_FAMILIES, SERVICES } from "../data/site";

export const GET: APIRoute = () => {
  const now = new Date().toISOString().split("T")[0];

  const staticRoutes = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/equipos", priority: "0.9", changefreq: "weekly" },
    { path: "/servicios", priority: "0.9", changefreq: "weekly" },
    { path: "/proyectos", priority: "0.9", changefreq: "monthly" },
    { path: "/nosotros", priority: "0.8", changefreq: "monthly" },
    { path: "/contacto", priority: "0.8", changefreq: "monthly" },
    { path: "/trabaje-con-nosotros", priority: "0.6", changefreq: "monthly" },
    { path: "/politica-tratamiento-datos", priority: "0.4", changefreq: "yearly" },
  ];

  const equipmentRoutes = EQUIPMENT_FAMILIES.map((item) => ({
    path: `/equipos/${item.slug}`,
    priority: "0.85",
    changefreq: "monthly",
  }));

  const serviceRoutes = SERVICES.map((item) => ({
    path: `/servicios/${item.slug}`,
    priority: "0.85",
    changefreq: "monthly",
  }));

  const allRoutes = [...staticRoutes, ...equipmentRoutes, ...serviceRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
