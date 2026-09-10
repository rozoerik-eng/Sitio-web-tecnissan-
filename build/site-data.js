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
  city: "Cali",
  region: "Valle del Cauca",
  country: "Colombia",
  addressLine: "PENDIENTE — Dirección completa del taller", // PENDIENTE
  addressShort: "Cali, Colombia",
  postalCode: "760001", // PENDIENTE
  mapEmbedSrc:
    "https://www.google.com/maps?q=Cali,Colombia&output=embed", // PENDIENTE: reemplazar con el pin exacto del taller
  mapLinkUrl: "https://maps.google.com/?q=Cali,Colombia", // PENDIENTE
  latitude: "3.4516", // PENDIENTE
  longitude: "-76.5320", // PENDIENTE

  // --- Contacto ---
  phoneDisplay: "+57 300 123 4567", // PENDIENTE
  phoneE164: "+573001234567", // PENDIENTE
  whatsappNumber: "573001234567", // PENDIENTE (solo dígitos, con indicativo de país)
  email: "contacto@tecnissan.com", // PENDIENTE

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
  instagramHandle: "@tecnissan",
  instagramUrl: "https://instagram.com/tecnissan", // PENDIENTE
  facebookUrl: "https://facebook.com/tecnissan", // PENDIENTE
  tiktokUrl: "", // PENDIENTE (dejar vacío si no aplica)
  googleReviewsUrl: "https://g.page/r/PENDIENTE/review", // PENDIENTE: enlace real de reseñas de Google Business Profile

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
  defaultOgImage: "/assets/img/og-tecnissan.jpg", // PENDIENTE: crear imagen 1200x630

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
