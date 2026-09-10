# Sitio web — Tecnissan

Sitio web multipágina para Tecnissan (taller especialista en Nissan), construido
100% orientado a generar contactos por WhatsApp y por formulario.

- HTML5 + CSS3 + JavaScript **vanilla** (sin frameworks, sin WordPress).
- Mobile-first, responsive de 360px a pantallas grandes.
- Sitio multipágina real: cada servicio tiene su propia URL para SEO.
- Generado desde plantillas simples para que el NAP (nombre, dirección,
  teléfono) y los mensajes de WhatsApp sean consistentes en todo el sitio.

## ⚠️ Antes de publicar: datos pendientes

`build/site-data.js` ya tiene los datos reales que nos compartiste
(dirección, WhatsApp, redes sociales, logo y fotos reales del taller). Sigue
pendiente solo lo siguiente:

- **Ciudad**: se puso "Bogotá" a partir de la dirección (nomenclatura de
  carrera con letra, típica de Bogotá) y del clima/arquitectura en tus fotos.
  **Confírmalo** — si el taller está en otra ciudad, corrige `city`/`region`
  en `build/site-data.js` y corre `npm run build`; se propaga solo a los
  títulos, meta descriptions y H1 de las 16 páginas.
- **Coordenadas exactas** (`latitude`/`longitude`): son un aproximado de la
  dirección para el mapa embebido. Si quieres el pin exacto, abre la
  ubicación en Google Maps, copia las coordenadas de la barra de direcciones
  y actualízalas — o dános el enlace completo de Google Maps del negocio
  (no el acortado `share.google`) y lo hacemos nosotros.
- **Correo de contacto** (`email`): no nos diste uno, se dejó
  `contacto@tecnissan.com` de ejemplo — cámbialo por el correo real donde
  quieres recibir los mensajes del formulario.
- **Código postal** (`postalCode`): opcional, se dejó vacío.
- **IDs de analítica**: `gtmId`, `ga4Id` y `metaPixelId` siguen en
  `PENDIENTE` a propósito — nos dijiste que aún no existen esas cuentas.
- **Reseñas de Google**: usamos tu enlace de Google (`share.google/...`)
  tanto para el mapa como para "ver reseñas" — confirma que ese enlace lleva
  al perfil de Google Business de Tecnissan (y no solo a la ubicación) para
  que el botón "Dejar una reseña" funcione como se espera.

Después de editar `build/site-data.js`, corre `npm run build` para propagar
los cambios a **todas** las páginas automáticamente (no hay que tocar cada
página a mano).

También pendiente de contenido real:

- **Testimonios**: `/testimonios.html` no incluye reseñas inventadas —
  enlaza a tu Google Business Profile y deja espacios para ir agregando
  testimonios reales con nombre, modelo del carro y comentario.
- **Más fotos**: ya se usaron las fotos reales que enviaste (fachada,
  equipo, taller, sala de espera, oficina) en la Galería, el inicio y la
  página "Por qué elegirnos". Si envías más fotos (antes/después de
  reparaciones, otros ángulos), se pueden agregar a
  `public/assets/img/gallery/` siguiendo el mismo tratamiento (incluidas en
  `build/pages/galeria.html`).

## Cómo funciona el proyecto

```
build/
  site-data.js        <- ÚNICA fuente de verdad para NAP, redes, IDs de analítica
  partials/           <- head, header, footer y script (compartidos en todas las páginas)
  pages/               <- contenido de cada página (sin header/footer)
  build.js            <- ensambla todo y genera /public

public/               <- SITIO FINAL, lista para desplegar (no editar a mano)
  assets/css/style.css
  assets/js/main.js
  assets/img/
  index.html, servicios/, contacto.html, etc.
  sitemap.xml, robots.txt
```

**Regla de oro:** no edites archivos dentro de `public/*.html` directamente —
se sobrescriben cada vez que corres `npm run build`. Edita el contenido en
`build/pages/*.html` o los datos en `build/site-data.js`, y vuelve a compilar.

### Comandos

```bash
npm run build   # genera /public a partir de build/
npm run serve   # sirve /public localmente en http://localhost:5000
```

## Formulario de contacto

El formulario de `/contacto.html` usa **Netlify Forms** (gratis, sin backend
ni servidor propio):

- Al desplegar en Netlify, detecta automáticamente el `<form data-netlify="true">`.
- Cada envío llega por correo a la cuenta de Netlify del sitio y queda
  registrado en el panel de Netlify (Forms).
- Incluye un campo honeypot (`bot-field`) oculto para filtrar spam de bots.
- Al enviar, redirige a `/gracias.html` (útil para marcar la conversión en
  Google Analytics/Tag Manager como "página vista").

Si el sitio se hospeda en un proveedor distinto a Netlify (por ejemplo
Hostinger/cPanel), Netlify Forms no funcionará y hay que reemplazar el
`action` del formulario por otro servicio (Formspree, Getform) o un
endpoint propio.

## SEO on-page (ya implementado)

- Title y meta description únicos por página, pensados para CTR.
- URLs limpias por servicio (`/servicios/mantenimiento-preventivo-nissan.html`, etc.).
- Jerarquía de encabezados H1 → H2 → H3 en cada página.
- Datos estructurados (Schema.org) vía JSON-LD:
  - `AutoRepair` (LocalBusiness) con NAP, horario y geo en todas las páginas.
  - `BreadcrumbList` en páginas internas.
  - `Service` + `FAQPage` en cada página de servicio (las preguntas frecuentes
    visibles en la página son las mismas que alimentan el schema — no hay
    contenido oculto).
- `sitemap.xml` y `robots.txt` generados automáticamente a partir del dominio
  configurado en `site-data.js`.
- Enlazado interno entre páginas de servicio relacionadas.

## Analítica (dejar listo, activar con IDs reales)

El `<head>` de cada página ya incluye:

- **Google Tag Manager** (contenedor `{{gtmId}}` — reemplázalo en
  `site-data.js`). El `dataLayer` recibe eventos personalizados en:
  - `whatsapp_click_header`, `whatsapp_click_hero`, `whatsapp_click_float`,
    y un evento por cada botón de WhatsApp de cada página (ver
    `data-track="..."` en el HTML).
  - `generate_lead` al enviar el formulario de contacto.
  - Puedes configurar estos eventos como conversiones en GA4 (a través de GTM)
    sin tocar el código de nuevo.
- **Meta Pixel** (`metaPixelId`) con `PageView` automático — actívalo solo si
  vas a correr Meta Ads, reemplazando el ID de ejemplo.

Pasos pendientes (fuera del código, requieren acceso a las cuentas reales):

1. Crear el contenedor de Google Tag Manager y la propiedad GA4, y actualizar
   `gtmId`/`ga4Id` en `site-data.js`.
2. Dentro de GTM, crear las etiquetas de GA4 para los eventos de `dataLayer`
   mencionados arriba.
3. Vincular la propiedad de GA4 con Google Search Console.
4. Si vas a correr Meta Ads, verificar el dominio en Meta Business y
   actualizar `metaPixelId`.

## Checklist de publicación

1. Confirmar ciudad/coordenadas y completar los `PENDIENTE` restantes en
   `build/site-data.js` (correo, analítica) y correr `npm run build`.
2. Agregar testimonios reales en `/testimonios.html` cuando estén disponibles.
3. Conectar el dominio real y activar HTTPS (obligatorio).
4. Desplegar en Netlify (o Vercel/Hostinger) usando `public/` como carpeta publicada.
5. Probar en móvil y desktop, en al menos dos navegadores: enlaces, botones
   de WhatsApp, formulario y mapa.
6. Dar de alta el sitio en Google Search Console y enviar `sitemap.xml`.
7. Crear o verificar el perfil de Google Business Profile con el mismo NAP
   exacto que aparece en el sitio (footer y página de Contacto).
8. Activar Google Tag Manager / GA4 y, si aplica, el Meta Pixel, con los IDs reales.

## Despliegue rápido en Netlify

1. Sube este repositorio a GitHub (ya está en la rama del proyecto).
2. En Netlify: "Add new site" → "Import an existing project" → selecciona el repo.
3. Build command: `node build/build.js` — Publish directory: `public`
   (ya configurado en `netlify.toml`, Netlify lo detecta automáticamente).
4. Una vez desplegado, activa **Forms** en el panel de Netlify (se activa
   solo al detectar el formulario en el HTML) y verifica a qué correo llegan
   las notificaciones.
5. Conecta el dominio real desde "Domain settings".
