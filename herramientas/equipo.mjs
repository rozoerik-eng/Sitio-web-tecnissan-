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

const tarjeta = (p) => {
  const nombre = esc(p.nombre);
  const cargo = esc(p.cargo);

  let medio;
  if (p.foto) {
    if (!existsSync(join(CARPETA_FOTOS, p.foto))) {
      console.warn(`  ! ${p.nombre}: falta site/assets/equipo/${p.foto}, va con iniciales`);
      medio = null;
    } else {
      medio =
        `<img class="persona-foto" src="assets/equipo/${esc(p.foto)}"\n` +
        `           alt="${nombre}, ${cargo} en Tecnissan" loading="lazy" decoding="async" width="600" height="800">`;
    }
  }
  if (!medio) {
    medio =
      `<div class="persona-foto persona-mono" role="img" aria-label="${nombre}">` +
      `<span>${esc(iniciales(p.nombre))}</span></div>`;
  }

  const placa = p.numero
    ? `<span class="persona-placa" aria-hidden="true">${esc(p.numero)}</span>`
    : "";
  const anos = anosTexto(p.anos);

  return [
    `      <article class="persona" data-anim>`,
    `        <div class="persona-medio">${placa}${medio}</div>`,
    `        <div class="persona-txt">`,
    `          <h3>${nombre}</h3>`,
    `          <span class="cargo">${cargo}</span>`,
    `          <p>${esc(p.texto)}</p>`,
    anos ? `          <span class="anos">${esc(anos)}</span>` : null,
    `        </div>`,
    `      </article>`,
  ]
    .filter(Boolean)
    .join("\n");
};

let seccion = "\n";
if (personas.length) {
  seccion = `
<section class="seccion hueso" id="personas">
  <div class="envoltura">
    <div class="cabeza" data-anim>
      <div>
        <span class="etiqueta">${esc(cab.etiqueta || "Uno por uno")}</span>
        <h2>${esc(cab.titulo || "Quién es quién en el taller")}</h2>
      </div>
      ${cab.entrada ? `<p class="plomo">${esc(cab.entrada)}</p>` : ""}
    </div>

    <div class="equipo-rejilla">
${personas.map(tarjeta).join("\n\n")}
    </div>
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

const ficha =
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
html = entreMarcas(html, "EMPLEADOS", ficha);
writeFileSync(PAGINA, html);

console.log(
  personas.length
    ? `equipo.html: ${personas.length} tarjeta(s) generada(s).`
    : "equipo.html: sin personas en datos/equipo.json, la seccion queda fuera."
);
