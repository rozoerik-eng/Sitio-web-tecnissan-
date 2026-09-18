/*
  Genera la seccion "uno por uno" de site/equipo.html a partir de datos/equipo.json.

  Uso:  node herramientas/equipo.mjs

  - Reescribe todo lo que hay entre <!-- PERSONAS:INICIO --> y <!-- PERSONAS:FIN -->.
  - Si la lista de personas esta vacia, no deja seccion: la pagina queda como si
    nunca hubiera existido, sin huecos ni titulos sueltos.
  - Tambien mantiene la lista de empleados dentro del JSON-LD de la pagina.
*/

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const JSON_DATOS = join(RAIZ, "datos", "equipo.json");
const PAGINA = join(RAIZ, "site", "equipo.html");
const CARPETA_FOTOS = join(RAIZ, "site", "assets", "equipo");

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/* Iniciales para la tarjeta sin foto: primera letra del nombre y del apellido. */
const iniciales = (nombre) => {
  const partes = String(nombre).trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return "?";
  const primera = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primera + ultima).toUpperCase();
};

/* "anos" acepta un numero (8 -> "8 años en Tecnissan") o una frase ya
   escrita ("Mas de 25 años de experiencia"), porque no todos cuentan lo
   mismo: unos llevan X en la casa y otros X con la marca. */
const slug = (t) =>
  String(t)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const anosTexto = (anos) => {
  if (anos === undefined || anos === null || anos === "") return "";
  const n = Number(anos);
  if (Number.isFinite(n)) {
    if (n <= 0) return "";
    return n === 1 ? "1 año en Tecnissan" : `${n} años en Tecnissan`;
  }
  return String(anos);
};

/* Reemplaza el contenido entre dos marcas, dejando las marcas en su lugar. */
const entreMarcas = (texto, marca, nuevo) => {
  const abre = `<!-- ${marca}:INICIO -->`;
  const cierra = `<!-- ${marca}:FIN -->`;
  const i = texto.indexOf(abre);
  const f = texto.indexOf(cierra);
  if (i === -1 || f === -1) throw new Error(`No encontre las marcas de ${marca} en ${PAGINA}`);
  return texto.slice(0, i + abre.length) + nuevo + texto.slice(f);
};

const datos = JSON.parse(readFileSync(JSON_DATOS, "utf8"));
const personas = Array.isArray(datos.personas) ? datos.personas : [];
const cab = datos.encabezado || {};

/* ---------------------------------------------------------------- tarjetas */

/* La foto de la tarjeta y la de la ficha son el mismo archivo; si falta,
   las dos caen a las iniciales. */
const medioDe = (p, clase) => {
  const nombre = esc(p.nombre);
  if (p.foto && existsSync(join(CARPETA_FOTOS, p.foto))) {
    return (
      `<img class="${clase}" src="assets/equipo/${esc(p.foto)}"\n` +
      `           alt="${nombre}, ${esc(p.cargo)} en Tecnissan" loading="lazy" decoding="async" width="600" height="800">`
    );
  }
  if (p.foto) console.warn(`  ! ${p.nombre}: falta site/assets/equipo/${p.foto}, va con iniciales`);
  return (
    `<div class="${clase} persona-mono" role="img" aria-label="${nombre}">` +
    `<span>${esc(iniciales(p.nombre))}</span></div>`
  );
};

const parrafos = (p) => (Array.isArray(p.detalle) ? p.detalle : p.detalle ? [p.detalle] : []);

const tarjeta = (p) => {
  const nombre = esc(p.nombre);
  const anos = anosTexto(p.anos);
  const id = `ficha-${slug(p.nombre)}`;
  const abrible = parrafos(p).length > 0;

  const placa = p.numero
    ? `<span class="persona-placa" aria-hidden="true">${esc(p.numero)}</span>`
    : "";

  return [
    `      <article class="persona${abrible ? " persona-abrible" : ""}" data-anim${
      abrible ? ' data-puntero="Ver ficha"' : ""
    }>`,
    `        <div class="persona-medio">${placa}${medioDe(p, "persona-foto")}</div>`,
    `        <div class="persona-txt">`,
    `          <h3>${nombre}</h3>`,
    `          <span class="cargo">${esc(p.cargo)}</span>`,
    `          <p>${esc(p.texto)}</p>`,
    `          <div class="persona-pie">`,
    anos ? `            <span class="anos">${esc(anos)}</span>` : null,
    abrible
      ? `            <span class="persona-mas" aria-hidden="true">Ver ficha <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12.5 6l6 6-6 6"/></svg></span>`
      : null,
    `          </div>`,
    `        </div>`,
    abrible
      ? `        <button class="persona-abrir" type="button" aria-haspopup="dialog" data-ficha="${id}">` +
        `<span class="solo-lectores">Ver la ficha de ${nombre}</span></button>`
      : null,
    `      </article>`,
  ]
    .filter(Boolean)
    .join("\n");
};

/* ---------------------------------------------------------------- fichas */

const ficha = (p) => {
  const cuerpo = parrafos(p);
  if (!cuerpo.length) return null;

  const id = `ficha-${slug(p.nombre)}`;
  const anos = anosTexto(p.anos);

  return [
    `    <dialog class="ficha" id="${id}" aria-labelledby="${id}-tit">`,
    `      <div class="ficha-caja">`,
    `        <button class="ficha-cerrar" type="button" aria-label="Cerrar la ficha">`,
    `          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
    `        </button>`,
    `        ${medioDe(p, "ficha-foto")}`,
    `        <div class="ficha-cab">`,
    `          <span class="etiqueta">El equipo</span>`,
    `          <h3 id="${id}-tit">${esc(p.nombre)}</h3>`,
    `          <span class="cargo">${esc(p.cargo)}</span>`,
    anos ? `          <span class="anos">${esc(anos)}</span>` : null,
    `        </div>`,
    `        <div class="ficha-cuerpo">`,
    ...cuerpo.map((t) => `          <p>${esc(t)}</p>`),
    `        </div>`,
    `      </div>`,
    `    </dialog>`,
  ]
    .filter(Boolean)
    .join("\n");
};

let seccion = "\n";
if (personas.length) {
  seccion = `
<section class="seccion hueso" id="personas">
  <div class="envoltura">
    <div class="cabeza" data-anim="izq">
      <div>
        <span class="etiqueta">${esc(cab.etiqueta || "Uno por uno")}</span>
        <h2>${esc(cab.titulo || "Quién es quién en el taller")}</h2>
      </div>
      ${cab.entrada ? `<p class="plomo">${esc(cab.entrada)}</p>` : ""}
    </div>

    <div class="equipo-rejilla">
${personas.map(tarjeta).join("\n\n")}
    </div>

${personas.map(ficha).filter(Boolean).join("\n\n")}
  </div>
</section>
`;
}

/* ---------------------------------------------------------------- JSON-LD */

const negocio = {
  "@type": "AutoRepair",
  name: "Tecnissan",
  url: "https://tecnissan.com/",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Carrera 70G # 69B-70",
    addressLocality: "Bogot\u00e1",
    addressCountry: "CO",
  },
  telephone: "+573112710738",
};

if (personas.length) {
  negocio.employee = personas.map((p) => ({
    "@type": "Person",
    name: p.nombre,
    jobTitle: p.cargo,
    ...(p.foto ? { image: `https://tecnissan.com/assets/equipo/${p.foto}` } : {}),
  }));
}

const datosEstructurados =
  "\n" +
  '<script type="application/ld+json">\n' +
  JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "El equipo de Tecnissan",
      url: "https://tecnissan.com/equipo.html",
      about: negocio,
    },
    null,
    2
  ) +
  "\n<\/script>\n";

/* ---------------------------------------------------------------- escribir */

let html = readFileSync(PAGINA, "utf8");
html = entreMarcas(html, "PERSONAS", seccion);
html = entreMarcas(html, "EMPLEADOS", datosEstructurados);
writeFileSync(PAGINA, html);

console.log(
  personas.length
    ? `equipo.html: ${personas.length} tarjeta(s) generada(s).`
    : "equipo.html: sin personas en datos/equipo.json, la seccion queda fuera."
);
