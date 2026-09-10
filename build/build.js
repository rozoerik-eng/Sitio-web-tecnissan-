#!/usr/bin/env node
/**
 * Generador estático del sitio Tecnissan.
 * Lee build/partials/*.html + build/pages/*.html, inyecta los datos de
 * build/site-data.js y escribe el sitio final (listo para hosting) en /public.
 *
 * Uso: node build/build.js   (o: npm run build)
 */
const fs = require("fs");
const path = require("path");
const data = require("./site-data.js");

const ROOT = path.join(__dirname, "..");
const PARTIALS = path.join(__dirname, "partials");
const PAGES = path.join(__dirname, "pages");
const OUT = path.join(ROOT, "public");

const read = (p) => fs.readFileSync(p, "utf8");

const head = read(path.join(PARTIALS, "head.html"));
const header = read(path.join(PARTIALS, "header.html"));
const footer = read(path.join(PARTIALS, "footer.html"));
const scriptsFooter = read(path.join(PARTIALS, "scripts-footer.html"));

/* ----------------------------------------------------------------------
 * Tokens globales (disponibles en cualquier partial o página)
 * -------------------------------------------------------------------- */
const globalTokens = {
  BUSINESS_NAME: data.businessName,
  LEGAL_NAME: data.legalName,
  TAGLINE: data.tagline,
  SLOGAN: data.slogan,
  CITY: data.city,
  REGION: data.region,
  COUNTRY: data.country,
  ADDRESS_LINE: data.addressLine,
  ADDRESS_SHORT: data.addressShort,
  PHONE_DISPLAY: data.phoneDisplay,
  PHONE_E164: data.phoneE164,
  WHATSAPP_NUMBER: data.whatsappNumber,
  EMAIL: data.email,
  HOURS_WEEKDAY: data.hoursWeekday,
  HOURS_WEEKDAY_RANGE: data.hoursWeekdayRange,
  HOURS_SATURDAY: data.hoursSaturday,
  HOURS_SATURDAY_RANGE: data.hoursSaturdayRange,
  INSTAGRAM_HANDLE: data.instagramHandle,
  INSTAGRAM_URL: data.instagramUrl,
  FACEBOOK_URL: data.facebookUrl,
  GOOGLE_REVIEWS_URL: data.googleReviewsUrl,
  SITE_URL: data.siteUrl,
  MAP_EMBED_SRC: data.mapEmbedSrc,
  MAP_LINK_URL: data.mapLinkUrl,
  GTM_ID: data.gtmId,
  META_PIXEL_ID: data.metaPixelId,
  YEAR: String(new Date().getFullYear()),
  YEARS_EXPERIENCE: data.yearsExperience,
  FORM_NAME: data.formName,
  MODELS_LIST: data.models.join(", "),
};

function waLink(message) {
  return `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(message.trim())}`;
}

function applyTokens(str, tokens) {
  let out = str;
  // {{WA:mensaje libre}} -> enlace wa.me con el mensaje precargado
  out = out.replace(/\{\{WA:([^}]*)\}\}/g, (_, msg) => waLink(msg));
  const all = Object.assign({}, globalTokens, tokens || {});
  out = out.replace(/\{\{([A-Z0-9_]+)\}\}/g, (m, key) => {
    if (Object.prototype.hasOwnProperty.call(all, key)) return all[key];
    return m; // deja el token si no se reconoce, para detectarlo a simple vista
  });
  return out;
}

function renderModelsChips() {
  return data.models.map((m) => `<span>${m}</span>`).join("\n");
}

function renderBreadcrumbs(trail) {
  if (!trail || !trail.length) return "";
  const items = trail
    .map((t, i) => {
      const isLast = i === trail.length - 1;
      return isLast
        ? `<span aria-current="page">${t.label}</span>`
        : `<a href="${t.url}">${t.label}</a><span aria-hidden="true">/</span>`;
    })
    .join(" ");
  return `<nav class="breadcrumbs" aria-label="Ruta de navegación">${items}</nav>`;
}

function breadcrumbSchema(trail) {
  if (!trail || trail.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.label,
      item: t.url ? data.siteUrl + t.url : undefined,
    })),
  };
}

function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: data.businessName,
    image: data.siteUrl + data.defaultOgImage,
    url: data.siteUrl,
    telephone: data.phoneE164,
    email: data.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: data.addressLine,
      addressLocality: data.city,
      addressRegion: data.region,
      postalCode: data.postalCode,
      addressCountry: "CO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: data.latitude,
      longitude: data.longitude,
    },
    openingHours: data.hoursSchemaSpec,
    sameAs: [data.instagramUrl, data.facebookUrl].filter(Boolean),
    areaServed: `${data.city}, ${data.region}`,
  };
}

function faqSchema(faq) {
  if (!faq || !faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function serviceSchema(page) {
  if (!page.serviceName) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: page.serviceName,
    name: page.serviceName,
    provider: { "@type": "AutoRepair", name: data.businessName, telephone: data.phoneE164 },
    areaServed: `${data.city}, ${data.region}`,
    url: data.siteUrl + "/" + page.out.replace(/index\.html$/, ""),
  };
}

function renderFAQ(faq) {
  if (!faq || !faq.length) return "";
  const items = faq
    .map(
      (f) => `  <details class="faq-item">
    <summary>${f.q}<span class="faq-plus" aria-hidden="true"></span></summary>
    <p>${f.a}</p>
  </details>`
    )
    .join("\n");
  return `<div class="faq-list">\n${items}\n</div>`;
}

function schemaScripts(list) {
  return list
    .filter(Boolean)
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join("\n");
}

/* ----------------------------------------------------------------------
 * Manifiesto de páginas
 * -------------------------------------------------------------------- */
const serviceNavItems = [
  { label: "Diagnóstico computarizado", url: "/servicios/diagnostico-computarizado-nissan.html" },
  { label: "Mantenimiento preventivo", url: "/servicios/mantenimiento-preventivo-nissan.html" },
  { label: "Reparación de motor", url: "/servicios/reparacion-motor-nissan.html" },
  { label: "Sistema eléctrico e inyección", url: "/servicios/sistema-electrico-inyeccion-nissan.html" },
  { label: "Frenos y suspensión", url: "/servicios/frenos-suspension-nissan.html" },
  { label: "Aire acondicionado", url: "/servicios/aire-acondicionado-nissan.html" },
  { label: "Transmisión y caja de cambios", url: "/servicios/transmision-nissan.html" },
  { label: "Revisión pre-viaje", url: "/servicios/revision-pre-viaje-nissan.html" },
];

function relatedServicesHTML(currentUrl) {
  const others = serviceNavItems.filter((s) => s.url !== currentUrl).slice(0, 4);
  return others.map((s) => `<a href="${s.url}">${s.label} <span aria-hidden="true">→</span></a>`).join("\n");
}

const pages = [
  {
    src: "index.html",
    out: "index.html",
    title: "Tecnissan | Taller especialista en Nissan en Bogotá",
    description:
      "Tecnissan es un taller 100% especializado en Nissan en Bogotá. Diagnóstico computarizado, mantenimiento y reparación con garantía. Cotiza por WhatsApp.",
    breadcrumb: [],
    robots: "index, follow",
  },
  {
    src: "servicios-index.html",
    out: "servicios/index.html",
    title: "Servicios para tu Nissan en Bogotá | Tecnissan",
    description:
      "Diagnóstico, mantenimiento preventivo, motor, frenos, eléctrico y más — todos los servicios de Tecnissan para tu Nissan, con especialistas de marca.",
    breadcrumb: [{ label: "Inicio", url: "/" }, { label: "Servicios" }],
  },
  {
    src: "servicio-diagnostico.html",
    out: "servicios/diagnostico-computarizado-nissan.html",
    title: "Diagnóstico Computarizado para Nissan en Bogotá | Tecnissan",
    description:
      "Diagnóstico computarizado especializado para Nissan: escaneo de fallas, testigos del tablero (check engine) y códigos OBD con equipos de marca.",
    serviceName: "Diagnóstico computarizado Nissan",
    breadcrumb: [{ label: "Inicio", url: "/" }, { label: "Servicios", url: "/servicios/" }, { label: "Diagnóstico computarizado" }],
    faq: [
      {
        q: "¿Cada cuánto debo hacer un diagnóstico computarizado a mi Nissan?",
        a: "Recomendamos un chequeo cada 10.000 km o apenas se encienda cualquier testigo del tablero, incluso si el carro se siente normal.",
      },
      {
        q: "¿El diagnóstico tiene costo si luego hago la reparación con ustedes?",
        a: "Sí, tiene un costo fijo por el uso del equipo y la revisión técnica; te lo confirmamos por WhatsApp antes de agendar.",
      },
      {
        q: "¿Qué diferencia hay entre un diagnóstico genérico y uno especializado en Nissan?",
        a: "Nuestro equipo lee los códigos específicos de las ECU Nissan (no solo los genéricos OBD-II), lo que permite identificar fallas propias de la marca con mayor precisión.",
      },
    ],
  },
  {
    src: "servicio-mantenimiento.html",
    out: "servicios/mantenimiento-preventivo-nissan.html",
    title: "Mantenimiento Preventivo Nissan (Cambio de Aceite y Filtros) | Tecnissan",
    description:
      "Cambio de aceite, filtros, bujías y correas para tu Nissan en Bogotá. Mantenimiento preventivo con repuestos de calidad y kilometraje al día.",
    serviceName: "Mantenimiento preventivo Nissan",
    breadcrumb: [{ label: "Inicio", url: "/" }, { label: "Servicios", url: "/servicios/" }, { label: "Mantenimiento preventivo" }],
    faq: [
      {
        q: "¿Cada cuántos kilómetros debo cambiar el aceite de mi Nissan?",
        a: "Depende del modelo y del tipo de aceite, pero en general cada 5.000 a 10.000 km. Te confirmamos el intervalo exacto según tu referencia.",
      },
      {
        q: "¿Usan repuestos originales?",
        a: "Trabajamos con repuestos originales o de marcas homologadas de alta calidad, según lo que prefieras y el presupuesto disponible.",
      },
      {
        q: "¿Cuánto tarda un mantenimiento preventivo completo?",
        a: "Un mantenimiento básico toma entre 45 minutos y 1.5 horas, dependiendo del modelo y los servicios incluidos.",
      },
    ],
  },
  {
    src: "servicio-motor.html",
    out: "servicios/reparacion-motor-nissan.html",
    title: "Reparación de Motor Nissan en Bogotá | Tecnissan",
    description:
      "Reparación y reconstrucción de motores Nissan: fugas de aceite, sobrecalentamiento, ruidos y pérdida de potencia. Diagnóstico antes de cotizar.",
    serviceName: "Reparación de motor Nissan",
    breadcrumb: [{ label: "Inicio", url: "/" }, { label: "Servicios", url: "/servicios/" }, { label: "Reparación de motor" }],
    faq: [
      {
        q: "¿Mi Nissan se sobrecalienta, puede ser el motor?",
        a: "Puede ser el termostato, la bomba de agua o el radiador, entre otras causas. Un diagnóstico nos permite decirte exactamente qué es antes de cotizar.",
      },
      {
        q: "¿Reconstruyen motores completos?",
        a: "Sí, hacemos reparaciones parciales y reconstrucción completa según el diagnóstico y el estado real del motor.",
      },
    ],
  },
  {
    src: "servicio-electrico.html",
    out: "servicios/sistema-electrico-inyeccion-nissan.html",
    title: "Sistema Eléctrico e Inyección Nissan | Tecnissan",
    description:
      "Reparación del sistema eléctrico y de inyección para Nissan: batería, alternador, sensores, bujías de encendido e inyectores.",
    serviceName: "Sistema eléctrico e inyección Nissan",
    breadcrumb: [{ label: "Inicio", url: "/" }, { label: "Servicios", url: "/servicios/" }, { label: "Sistema eléctrico e inyección" }],
    faq: [
      {
        q: "¿Por qué mi Nissan no enciende?",
        a: "Las causas más comunes son batería descargada, alternador defectuoso o un sensor del sistema de inyección. Con el diagnóstico identificamos la causa exacta.",
      },
      {
        q: "¿Atienden fallas intermitentes (que aparecen y desaparecen)?",
        a: "Sí, este tipo de fallas eléctricas es justo donde un equipo de diagnóstico especializado en Nissan marca la diferencia frente a un taller genérico.",
      },
    ],
  },
  {
    src: "servicio-frenos.html",
    out: "servicios/frenos-suspension-nissan.html",
    title: "Frenos y Suspensión para Nissan en Bogotá | Tecnissan",
    description:
      "Pastillas, discos, amortiguadores y rótulas para Nissan. Seguridad y estabilidad en cada viaje, con revisión completa del sistema de frenos.",
    serviceName: "Frenos y suspensión Nissan",
    breadcrumb: [{ label: "Inicio", url: "/" }, { label: "Servicios", url: "/servicios/" }, { label: "Frenos y suspensión" }],
    faq: [
      {
        q: "¿Cada cuánto debo cambiar las pastillas de freno?",
        a: "En promedio cada 20.000 a 40.000 km, según el uso del vehículo. Si escuchas un chillido al frenar, es momento de revisarlas.",
      },
      {
        q: "¿Cómo sé si necesito cambiar los amortiguadores?",
        a: "Señales comunes: el carro rebota después de un bache, se inclina en las curvas o el desgaste de las llantas es irregular.",
      },
    ],
  },
  {
    src: "servicio-ac.html",
    out: "servicios/aire-acondicionado-nissan.html",
    title: "Aire Acondicionado para Nissan en Bogotá | Tecnissan",
    description:
      "Diagnóstico y reparación de aire acondicionado para Nissan: recarga de gas, fugas, compresor y olores extraños en el sistema de A/C.",
    serviceName: "Aire acondicionado Nissan",
    breadcrumb: [{ label: "Inicio", url: "/" }, { label: "Servicios", url: "/servicios/" }, { label: "Aire acondicionado" }],
    faq: [
      {
        q: "¿Por qué mi aire acondicionado enfría poco?",
        a: "Generalmente es falta de gas refrigerante por una fuga, o el compresor está fallando. Lo revisamos con equipo especializado.",
      },
      {
        q: "¿Cada cuánto se debe hacer mantenimiento al A/C?",
        a: "Recomendamos una revisión anual, incluso si el aire sigue enfriando bien, para evitar daños mayores al compresor.",
      },
    ],
  },
  {
    src: "servicio-transmision.html",
    out: "servicios/transmision-nissan.html",
    title: "Transmisión y Caja de Cambios Nissan | Tecnissan",
    description:
      "Diagnóstico y reparación de caja automática y mecánica para Nissan: cambios bruscos, patinado, fugas de líquido y fallas de la CVT.",
    serviceName: "Transmisión y caja de cambios Nissan",
    breadcrumb: [{ label: "Inicio", url: "/" }, { label: "Servicios", url: "/servicios/" }, { label: "Transmisión y caja de cambios" }],
    faq: [
      {
        q: "¿Es normal que la caja automática (CVT) patine o tarde en responder?",
        a: "No. Es una señal de alerta que debe revisarse pronto: el retraso en la respuesta o el patinado suelen indicar bajo nivel o desgaste del líquido de la CVT.",
      },
      {
        q: "¿Trabajan cajas automáticas y mecánicas?",
        a: "Sí, diagnosticamos y reparamos ambos tipos de transmisión en los modelos Nissan que atendemos.",
      },
    ],
  },
  {
    src: "servicio-preventiva.html",
    out: "servicios/revision-pre-viaje-nissan.html",
    title: "Revisión Pre-Viaje para Nissan en Bogotá | Tecnissan",
    description:
      "Revisión preventiva antes de un viaje largo: frenos, llantas, niveles de fluidos, batería y luces. Sal de viaje con la tranquilidad de un chequeo completo.",
    serviceName: "Revisión pre-viaje Nissan",
    breadcrumb: [{ label: "Inicio", url: "/" }, { label: "Servicios", url: "/servicios/" }, { label: "Revisión pre-viaje" }],
    faq: [
      {
        q: "¿Con cuánta anticipación debo hacer la revisión antes de viajar?",
        a: "Idealmente 2 o 3 días antes del viaje, para tener tiempo de conseguir repuestos si la revisión detecta algo por cambiar.",
      },
      {
        q: "¿Qué incluye la revisión pre-viaje?",
        a: "Frenos, suspensión, niveles de aceite y refrigerante, batería, luces, presión y estado de las llantas, y una prueba de diagnóstico general.",
      },
    ],
  },
  {
    src: "por-que-elegirnos.html",
    out: "por-que-elegirnos.html",
    title: "Por Qué Elegirnos | Especialistas en Nissan — Tecnissan",
    description:
      "Somos especialistas exclusivos en Nissan: diagnóstico confiable, repuestos de calidad, garantía por escrito y atención cercana en cada servicio.",
    breadcrumb: [{ label: "Inicio", url: "/" }, { label: "Por qué elegirnos" }],
  },
  {
    src: "galeria.html",
    out: "galeria.html",
    title: "Galería de Trabajos | Tecnissan",
    description: "Fotos reales del taller y de los vehículos Nissan que hemos atendido en Tecnissan.",
    breadcrumb: [{ label: "Inicio", url: "/" }, { label: "Galería" }],
  },
  {
    src: "testimonios.html",
    out: "testimonios.html",
    title: "Testimonios y Reseñas | Tecnissan",
    description: "Lo que dicen nuestros clientes de Tecnissan y nuestras reseñas en Google Business Profile.",
    breadcrumb: [{ label: "Inicio", url: "/" }, { label: "Testimonios" }],
  },
  {
    src: "contacto.html",
    out: "contacto.html",
    title: "Contacto | Tecnissan — Taller Especialista en Nissan en Bogotá",
    description: "Escríbenos por WhatsApp, llama o llena el formulario. Encuentra la dirección, horario y mapa de Tecnissan en Bogotá.",
    breadcrumb: [{ label: "Inicio", url: "/" }, { label: "Contacto" }],
  },
  {
    src: "gracias.html",
    out: "gracias.html",
    title: "¡Gracias por escribirnos! | Tecnissan",
    description: "Recibimos tu mensaje. Un asesor de Tecnissan te contactará muy pronto.",
    breadcrumb: [],
    robots: "noindex, follow",
  },
  {
    src: "404.html",
    out: "404.html",
    title: "Página no encontrada | Tecnissan",
    description: "La página que buscas no existe. Vuelve al inicio de Tecnissan.",
    breadcrumb: [],
    robots: "noindex, follow",
  },
];

/* ----------------------------------------------------------------------
 * Build
 * -------------------------------------------------------------------- */
function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function depthPrefix(outPath) {
  // no longer needed: usamos rutas absolutas "/", se deja por si se requiere en el futuro
  return "";
}

pages.forEach((page) => {
  const srcPath = path.join(PAGES, page.src);
  let content = read(srcPath);

  const pageTokens = {
    TITLE: page.title,
    META_DESCRIPTION: page.description,
    ROBOTS_CONTENT: page.robots || "index, follow",
    CANONICAL: data.siteUrl + "/" + page.out.replace(/index\.html$/, "").replace(/^index\.html$/, ""),
    OG_IMAGE_ABS: data.siteUrl + data.defaultOgImage,
    BODY_PAGE: page.out.replace(/\.html$/, "").replace(/\/index$/, "") || "home",
  };

  // FAQ (si aplica) -> HTML + schema
  if (page.faq) {
    content = content.replace("{{FAQ_HTML}}", () => renderFAQ(page.faq));
  }
  if (page.out.startsWith("servicios/") && page.out !== "servicios/index.html") {
    content = content.replace("{{RELATED_SERVICES}}", () => relatedServicesHTML("/" + page.out));
  }
  content = content.replace(/\{\{MODELS_CHIPS\}\}/g, renderModelsChips());

  const schemas = [localBusinessSchema(), breadcrumbSchema(page.breadcrumb), faqSchema(page.faq), serviceSchema(page)];
  const schemaJson = schemaScripts(schemas);
  const headWithSchema = head.replace("{{SCHEMA_JSON}}", () => schemaJson);

  const breadcrumbHtml = renderBreadcrumbs(page.breadcrumb);
  content = content.replace(/\{\{BREADCRUMBS\}\}/g, breadcrumbHtml);

  let html = [headWithSchema, header, `<main id="main">`, content, `</main>`, footer, scriptsFooter].join("\n");

  html = applyTokens(html, pageTokens);

  const outPath = path.join(OUT, page.out);
  ensureDir(outPath);
  fs.writeFileSync(outPath, html);
  console.log("✔", page.out);
});

/* ----------------------------------------------------------------------
 * sitemap.xml + robots.txt
 * -------------------------------------------------------------------- */
const sitemapUrls = pages
  .filter((p) => !/^noindex/.test(p.robots || ""))
  .map((p) => {
    const loc = data.siteUrl + "/" + p.out.replace(/index\.html$/, "");
    return `  <url><loc>${loc}</loc></url>`;
  })
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`;
fs.writeFileSync(path.join(OUT, "sitemap.xml"), sitemap);

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${data.siteUrl}/sitemap.xml\n`;
fs.writeFileSync(path.join(OUT, "robots.txt"), robots);

console.log("\nSitio generado en /public ✅");
