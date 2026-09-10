/**
 * Datos centrales del negocio (NAP + config de tracking).
 * Edita SOLO este archivo y corre `npm run build` para propagar los
 * cambios a todas las páginas del sitio (public/).
 *
 * Todo lo marcado como "PENDIENTE" es un dato de ejemplo — reemplázalo
 * por la información real de Tecnissan antes de publicar el sitio.
 */

module.exports = {
  businessName: "Tecnissan",
  legalName: "Tecnissan Servicio Especializado",
  tagline: "Servicio Especializado",
  slogan: "Diseñado para los que viven Nissan.",
  yearsExperience: "10", // PENDIENTE: años reales de operación
  foundingYear: "2016", // PENDIENTE

  // --- Ubicación / NAP (Name, Address, Phone) ---
  // Nota: la ciudad se infirió de la dirección (nomenclatura de carreras con
  // letra, típica de Bogotá) y de las fotos del taller (arquitectura y clima
  // de Bogotá). Si el taller está en otra ciudad, corrige "city"/"region"
  // aquí y corre `npm run build` — se propaga a título, meta description y
  // H1 de todas las páginas.
  city: "Bogotá",
  region: "Bogotá D.C.",
  country: "Colombia",
  addressLine: "Cra. 70G # 69B-70",
  addressShort: "Cra. 70G # 69B-70, Bogotá, Colombia",
  postalCode: "", // PENDIENTE (opcional)
  mapEmbedSrc:
    "https://www.google.com/maps?q=Cra.+70G+%2369B-70,+Bogot%C3%A1,+Colombia&output=embed",
  mapLinkUrl: "https://share.google/HBCb4Xj500gyGIL2d",
  latitude: "4.6614", // aproximado por dirección — PENDIENTE afinar con el pin exacto si se requiere precisión
  longitude: "-74.0989", // aproximado por dirección — PENDIENTE afinar con el pin exacto si se requiere precisión

  // --- Contacto ---
  phoneDisplay: "+57 311 271 0738",
  phoneE164: "+573112710738",
  whatsappNumber: "573112710738",
  email: "contacto@tecnissan.com", // PENDIENTE (no proporcionado)

  // --- Horario ---
  hoursWeekday: "Lunes a Viernes",
  hoursWeekdayRange: "8:00 a.m. – 6:00 p.m.",
  hoursSaturday: "Sábados",
  hoursSaturdayRange: "8:00 a.m. – 1:00 p.m.",
  hoursSchemaSpec: [
    "Mo-Fr 08:00-18:00",
    "Sa 08:00-13:00",
  ],

  // --- Redes sociales ---
  instagramHandle: "@tecnissan_sas",
  instagramUrl: "https://www.instagram.com/tecnissan_sas",
  facebookUrl: "https://www.facebook.com/Tecnissan/",
  tiktokUrl: "", // PENDIENTE (dejar vacío si no aplica)
  googleReviewsUrl: "https://share.google/HBCb4Xj500gyGIL2d", // enlace de Google compartido por el negocio (perfil/ubicación)

  // --- Modelos que más se atienden ---
  models: [
    "Versa",
    "Sentra",
    "March",
    "Kicks",
    "X-Trail",
    "Qashqai",
    "NP300",
    "Frontier",
  ],

  // --- Dominio / SEO ---
  siteUrl: "https://www.tecnissan.com", // PENDIENTE: dominio real una vez conectado
  defaultOgImage: "/assets/img/og-tecnissan.jpg",

  // --- Analítica / Tracking (dejar placeholders hasta tener las cuentas reales) ---
  gtmId: "GTM-XXXXXXX", // PENDIENTE
  ga4Id: "G-XXXXXXXXXX", // PENDIENTE (si no usas GTM para cargar GA4)
  metaPixelId: "0000000000000000", // PENDIENTE

  // --- Formulario ---
  // El formulario usa Netlify Forms (gratis en hosting Netlify, sin backend).
  // Si se hospeda en otro proveedor, hay que reemplazar por otro handler
  // (Formspree, Getform, o un endpoint propio) — ver README.md.
  formName: "contacto-tecnissan",
};
