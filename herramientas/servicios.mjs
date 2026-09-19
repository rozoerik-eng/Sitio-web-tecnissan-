/*
  Genera las paginas de site/servicios/ y remienda las listas de servicios
  que salen en index.html y equipo.html.

  Uso:  node herramientas/servicios.mjs

  El catalogo de abajo (SERVICIOS) es la unica fuente: si cambia un texto,
  se cambia aqui y se vuelve a correr. Editar los HTML a mano se pierde.
*/

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const BASE = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');

const OUT = join(BASE, 'servicios');
mkdirSync(OUT, { recursive: true });

const WA = msg => `data-wa="${msg}"`;
const icoWa = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.4A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.2.9.9-3.1-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>`;
const tick = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;

const SERVICIOS = [
  {
    slug: 'mantenimiento-preventivo',
    nombre: 'Mantenimiento preventivo',
    icono: `<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17 16 10"/><circle cx="12" cy="17" r="1.4"/><path d="M2 20h20"/>`,
    titulo: 'Mantenimiento preventivo para Nissan en Bogotá',
    resumen: 'Mantenimientos de acuerdo con el kilometraje del vehículo, con revisiones cada 5.000 km. A partir de los 20.000 km y sus múltiplos, las revisiones son más completas.',
    meta: 'Mantenimiento preventivo para Nissan en Bogotá, con revisiones cada 5.000 km. Niveles, aceite y filtros, frenos, suspensión, llantas y batería. Tecnissan.',
    gancho: 'La revisión de hoy puede evitar una reparación mayor mañana.',
    cuerpo: [
      'En TECNISSAN realizamos mantenimientos preventivos de acuerdo con el kilometraje del vehículo, con revisiones cada 5.000 km.',
      'Las revisiones de 5.000, 10.000, 15.000 km y demás intervalos de 5.000 km corresponden, en términos generales, a mantenimientos de menor complejidad.',
      'A partir de los 20.000 km y sus múltiplos —40.000, 60.000, 80.000, 100.000 km y sucesivamente— se realizan revisiones más completas, en las que se verifica con mayor profundidad el estado de los diferentes sistemas del vehículo.'
    ],
    incluye: [
      'Revisión de niveles y fluidos',
      'Aceite y filtros, según corresponda',
      'Revisión de frenos',
      'Inspección de suspensión y dirección',
      'Revisión de llantas',
      'Revisión de batería y sistema de carga',
      'Inspección general del vehículo',
      'Diagnóstico y recomendaciones de acuerdo con los hallazgos del técnico'
    ],
    demora: [
      'Revisiones sencillas: aproximadamente 3 a 4 horas, siempre que no se encuentren novedades.',
      'Revisiones más completas: aproximadamente 1 día, cuando el vehículo ingresa temprano y no requiere trabajos adicionales.',
      'Si durante la revisión o el desmontaje se encuentran fallas, desgastes o reparaciones adicionales, el tiempo puede variar según la complejidad del trabajo y la disponibilidad de repuestos.'
    ],
    tiempo: '3 a 4 horas las sencillas, cerca de 1 día las completas',
    cuandoTexto: 'Cada 5.000 km, de acuerdo con el plan de mantenimiento correspondiente al vehículo.',
    cuando: 'Cada 5.000 km, según el plan del vehículo.',
    waMsg: 'Hola Tecnissan, quiero agendar el mantenimiento preventivo de mi Nissan.'
  },
  {
    slug: 'diagnostico-especializado',
    nombre: 'Diagnóstico especializado',
    icono: `<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M7 9l2.5 3L12 8l2 4 3-3"/>`,
    titulo: 'Diagnóstico especializado para Nissan en Bogotá',
    resumen: 'Procesos de diagnóstico para identificar el origen de las fallas mecánicas, eléctricas y electrónicas del vehículo.',
    meta: 'Diagnóstico especializado para Nissan en Bogotá: diagnóstico computarizado, lectura de códigos de falla y revisión de sistemas electrónicos. Tecnissan.',
    gancho: 'Antes de reparar, hay que encontrar la causa.',
    cuerpo: [
      'Realizamos procesos de diagnóstico para identificar el origen de las fallas mecánicas, eléctricas y electrónicas del vehículo.'
    ],
    incluye: [
      'Diagnóstico computarizado',
      'Lectura e interpretación de códigos de falla',
      'Revisión de sistemas electrónicos',
      'Análisis de síntomas',
      'Pruebas y verificaciones según la condición presentada',
      'Recomendación del procedimiento a seguir'
    ],
    demora: [
      'El tiempo depende de la naturaleza de la falla. Algunas pueden identificarse rápidamente, mientras que otras requieren pruebas adicionales, seguimiento o desmontaje de componentes.'
    ],
    tiempo: 'Depende de la naturaleza de la falla',
    cuandoTexto: 'Cuando aparezca un testigo en el tablero, se presenten ruidos, pérdida de potencia, dificultades de encendido o cualquier comportamiento diferente al habitual.',
    cuando: 'Testigo en el tablero, ruidos, pérdida de potencia o algo distinto a lo habitual.',
    waMsg: 'Hola Tecnissan, quiero un diagnóstico especializado para mi Nissan.'
  },
  {
    slug: 'mecanica-general',
    nombre: 'Mecánica general',
    icono: `<path d="M5 15V9a2 2 0 0 1 2-2h3l2-2h3l1 2h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2l-1 2h-3l-2-2H7a2 2 0 0 1-2-2z"/><path d="M9 11v3"/>`,
    titulo: 'Mecánica general para Nissan en Bogotá',
    resumen: 'Reparación y mantenimiento mecánico, partiendo siempre de una evaluación técnica del vehículo: motor, transmisión, refrigeración, frenos, suspensión y dirección.',
    meta: 'Mecánica general para Nissan en Bogotá: motor, transmisión, refrigeración, frenos, suspensión, dirección y sistema de combustible. Tecnissan.',
    gancho: 'Experiencia para diagnosticar. Conocimiento para reparar.',
    cuerpo: [
      'Atendemos diferentes necesidades de reparación y mantenimiento mecánico, partiendo siempre de una evaluación técnica del vehículo.'
    ],
    incluye: [
      'Motor',
      'Transmisión',
      'Sistema de refrigeración',
      'Frenos',
      'Suspensión',
      'Dirección',
      'Sistema de combustible',
      'Reparaciones mecánicas generales'
    ],
    demora: [
      'El tiempo se determina después del diagnóstico y depende de la complejidad de la reparación, el nivel de desmontaje requerido, las condiciones encontradas y la disponibilidad de repuestos.'
    ],
    tiempo: 'Se determina después del diagnóstico',
    cuandoTexto: 'Cuando el vehículo presente ruidos, vibraciones, fugas, pérdida de potencia, calentamiento, dificultades de encendido o cualquier comportamiento anormal.',
    cuando: 'Ruidos, vibraciones, fugas, pérdida de potencia o calentamiento.',
    waMsg: 'Hola Tecnissan, necesito una reparación mecánica para mi Nissan.'
  },
  {
    slug: 'mecanica-express',
    nombre: 'Mecánica rápida / Express',
    icono: `<path d="M13 2 5 13h6l-1 9 8-11h-6z"/>`,
    titulo: 'Mecánica rápida y express para Nissan en Bogotá',
    resumen: 'Servicios de mantenimiento y reparaciones de rápida ejecución, previa revisión de las condiciones del vehículo.',
    meta: 'Mecánica rápida para Nissan en Bogotá: cambio de aceite y filtros, frenos, batería, bujías y revisión de niveles. Tecnissan, servicio express.',
    gancho: 'Servicios esenciales para mantener tu Nissan siempre en el camino.',
    cuerpo: [
      'Realizamos servicios de mantenimiento y reparaciones de rápida ejecución, previa revisión de las condiciones del vehículo.'
    ],
    incluye: [
      'Cambio de aceite y filtros',
      'Revisión y servicio de frenos',
      'Cambio de batería',
      'Cambio de bujías',
      'Revisión de niveles',
      'Revisiones generales',
      'Servicios de mantenimiento preventivo'
    ],
    demora: [
      'Depende del servicio solicitado y de las condiciones encontradas durante la revisión. Si se identifican necesidades adicionales, el tiempo puede variar.'
    ],
    tiempo: 'Según el servicio solicitado',
    cuandoTexto: 'Cuando corresponda realizar un mantenimiento o cuando se detecte desgaste en alguno de los componentes.',
    cuando: 'Cuando toque el mantenimiento o se detecte desgaste.',
    waMsg: 'Hola Tecnissan, quiero un servicio de mecánica rápida para mi Nissan.'
  },
  {
    slug: 'electricidad-y-electronica',
    nombre: 'Electricidad y electrónica automotriz',
    icono: `<path d="M12 3a6 6 0 0 1 3.5 10.9V17h-7v-3.1A6 6 0 0 1 12 3z"/><path d="M9.5 20h5M10 17h4"/>`,
    titulo: 'Electricidad y electrónica automotriz para Nissan en Bogotá',
    resumen: 'Revisamos los sistemas eléctricos y electrónicos para identificar el origen de las fallas y determinar el procedimiento adecuado.',
    meta: 'Electricidad y electrónica automotriz para Nissan en Bogotá: arranque, sistema de carga, batería, sensores y diagnóstico de módulos. Tecnissan.',
    gancho: 'Cuando la falla no es evidente, el diagnóstico hace la diferencia.',
    cuerpo: [
      'Revisamos los sistemas eléctricos y electrónicos para identificar el origen de las fallas y determinar el procedimiento adecuado.'
    ],
    incluye: [
      'Sistema de arranque',
      'Sistema de carga',
      'Batería',
      'Sensores',
      'Componentes eléctricos',
      'Sistemas electrónicos',
      'Diagnóstico de módulos y códigos de falla'
    ],
    demora: [
      'Depende de la naturaleza de la falla. Algunos diagnósticos requieren diferentes pruebas, mediciones o desmontaje de componentes.'
    ],
    tiempo: 'Depende de la naturaleza de la falla',
    cuandoTexto: 'Ante dificultades de encendido, descarga de batería, testigos en el tablero, fallas eléctricas o funcionamiento irregular de los sistemas electrónicos.',
    cuando: 'No enciende, la batería se descarga o hay testigos en el tablero.',
    waMsg: 'Hola Tecnissan, tengo una falla eléctrica en mi Nissan. ¿Me la pueden revisar?'
  },
  {
    slug: 'frenos-suspension-y-direccion',
    nombre: 'Frenos, suspensión y dirección',
    icono: `<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.6"/><path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5"/>`,
    titulo: 'Frenos, suspensión y dirección para Nissan en Bogotá',
    resumen: 'Inspección, diagnóstico y reparación de los principales componentes relacionados con estos sistemas: pastillas, discos, amortiguadores, bujes, rótulas y terminales.',
    meta: 'Frenos, suspensión y dirección para Nissan en Bogotá: pastillas, discos, amortiguadores, bujes, rótulas y terminales. Tecnissan.',
    gancho: 'Seguridad, estabilidad y control en cada recorrido.',
    cuerpo: [
      'Realizamos inspección, diagnóstico y reparación de los principales componentes relacionados con estos sistemas.'
    ],
    incluye: [
      'Pastillas y discos',
      'Amortiguadores',
      'Bujes',
      'Rótulas',
      'Terminales',
      'Componentes de dirección',
      'Inspección general del sistema de frenos'
    ],
    demora: [
      'Depende de los componentes que requieran intervención, su estado y la complejidad del trabajo.'
    ],
    tiempo: 'Según los componentes que requieran intervención',
    cuandoTexto: 'Cuando se presenten ruidos, vibraciones, golpes, inestabilidad, desgaste irregular de llantas, desviaciones o cambios en la respuesta del pedal de freno.',
    cuando: 'Ruidos, vibraciones, golpes o cambios en el pedal de freno.',
    waMsg: 'Hola Tecnissan, quiero que me revisen frenos, suspensión y dirección de mi Nissan.'
  },
  {
    slug: 'aire-acondicionado',
    nombre: 'Aire acondicionado',
    icono: `<path d="M12 3v18M12 7.5 8.5 5M12 7.5 15.5 5M12 16.5 8.5 19M12 16.5 15.5 19"/><path d="M3.8 7.5l16.4 9M3.8 7.5l.3 4.3M3.8 7.5l4-1.5M20.2 16.5l-.3-4.3M20.2 16.5l-4 1.5"/>`,
    titulo: 'Aire acondicionado para Nissan en Bogotá',
    resumen: 'Diagnóstico, mantenimiento y reparación del sistema de aire acondicionado, con detección de posibles fugas y verificación del sistema.',
    meta: 'Aire acondicionado para Nissan en Bogotá: diagnóstico del sistema, revisión de componentes, detección de fugas, mantenimiento y reparación. Tecnissan.',
    gancho: 'El confort también hace parte de una buena experiencia al conducir.',
    cuerpo: [
      'Realizamos diagnóstico, mantenimiento y reparación del sistema de aire acondicionado.'
    ],
    incluye: [
      'Diagnóstico del sistema',
      'Revisión de componentes',
      'Detección de posibles fugas',
      'Verificación del sistema',
      'Mantenimiento y reparación según diagnóstico'
    ],
    demora: [
      'Depende de la causa de la falla y de los componentes que sea necesario revisar o intervenir.'
    ],
    tiempo: 'Depende de la causa de la falla',
    cuandoTexto: 'Cuando el aire no enfríe adecuadamente, presente ruidos, malos olores, pérdida de rendimiento o deje de funcionar.',
    cuando: 'No enfría, hace ruidos, huele mal o dejó de funcionar.',
    waMsg: 'Hola Tecnissan, el aire acondicionado de mi Nissan no está enfriando bien.'
  },
  {
    slug: 'latoneria-y-pintura',
    nombre: 'Latonería y pintura',
    icono: `<path d="M4 13.5 13 4.5a2.5 2.5 0 0 1 3.5 0l1.5 1.5a2.5 2.5 0 0 1 0 3.5l-9 9H4z"/><path d="M11.5 6.5 17 12M3 21h18"/>`,
    titulo: 'Latonería y pintura para Nissan en Bogotá',
    resumen: 'Atendemos vehículos que han sufrido accidentes o presentan daños en su carrocería, realizando los procesos necesarios para su recuperación.',
    meta: 'Latonería y pintura para Nissan en Bogotá: evaluación de daños, reparación de carrocería, preparación, pintura y acabado. Tecnissan.',
    gancho: 'De un golpe a una reparación profesional.',
    cuerpo: [
      'Atendemos vehículos que han sufrido accidentes o presentan daños en su carrocería, realizando los procesos necesarios para su recuperación.'
    ],
    incluye: [
      'Evaluación de daños',
      'Desmonte y montaje de piezas',
      'Reparación de carrocería',
      'Latonería',
      'Preparación para pintura',
      'Pintura y acabado'
    ],
    demora: [
      'El tiempo depende de la magnitud del daño, los procesos requeridos, las piezas que deban repararse o reemplazarse y la disponibilidad de repuestos y materiales.'
    ],
    tiempo: 'Depende de la magnitud del daño',
    cuandoTexto: 'Después de un accidente, golpe o cuando el vehículo presente daños en su carrocería o pintura.',
    cuando: 'Después de un accidente o golpe, o si hay daños en la pintura.',
    waMsg: 'Hola Tecnissan, mi Nissan tiene un golpe. ¿Me dan latonería y pintura?'
  },
  {
    slug: 'alineacion-y-balanceo',
    nombre: 'Alineación y balanceo',
    icono: `<circle cx="6.5" cy="12" r="3.4"/><circle cx="17.5" cy="12" r="3.4"/><path d="M6.5 4.6v3M17.5 4.6v3M6.5 16.4v3M17.5 16.4v3M2 12h1M21 12h1"/>`,
    titulo: 'Alineación y balanceo para Nissan en Bogotá',
    resumen: 'Revisamos las condiciones que pueden afectar la estabilidad del vehículo y el desgaste adecuado de sus llantas.',
    meta: 'Alineación y balanceo para Nissan en Bogotá, con revisión del estado de las llantas y de los componentes de dirección y suspensión. Tecnissan.',
    gancho: 'El desgaste de tus llantas también puede contar una historia.',
    cuerpo: [
      'Revisamos las condiciones que pueden afectar la estabilidad del vehículo y el desgaste adecuado de sus llantas.'
    ],
    incluye: [
      'Alineación',
      'Balanceo',
      'Revisión del estado de las llantas',
      'Inspección de componentes relacionados con dirección y suspensión'
    ],
    demora: [
      'Depende del estado del vehículo y de si se identifican componentes que requieren intervención.'
    ],
    tiempo: 'Depende del estado del vehículo',
    cuandoTexto: 'Cuando se presenten vibraciones, desviaciones, desgaste irregular de las llantas o después de intervenir componentes de suspensión o dirección.',
    cuando: 'Vibraciones, desviaciones o desgaste irregular de las llantas.',
    waMsg: 'Hola Tecnissan, quiero alineación y balanceo para mi Nissan.'
  }
];

/* Frase corta para las tarjetas del inicio: el resumen completo es muy
   largo para una rejilla de tres columnas. */
const CORTO = {
  'mantenimiento-preventivo': 'Revisiones cada 5.000 km. Las de 20.000 y sus múltiplos son las más completas.',
  'diagnostico-especializado': 'Identificamos el origen de las fallas mecánicas, eléctricas y electrónicas.',
  'mecanica-general': 'Motor, transmisión, refrigeración, frenos, suspensión, dirección y combustible.',
  'mecanica-express': 'Aceite y filtros, frenos, batería, bujías y niveles, de rápida ejecución.',
  'electricidad-y-electronica': 'Arranque, carga, batería, sensores y diagnóstico de módulos.',
  'frenos-suspension-y-direccion': 'Pastillas, discos, amortiguadores, bujes, rótulas y terminales.',
  'aire-acondicionado': 'Diagnóstico, detección de fugas, mantenimiento y reparación del sistema.',
  'latoneria-y-pintura': 'Evaluación de daños, reparación de carrocería, pintura y acabado.',
  'alineacion-y-balanceo': 'Alineación, balanceo y revisión del estado de las llantas.'
};

const navEnlaces = `
    <a href="../index.html">Inicio</a>
    <a href="index.html" aria-current="page">Servicios</a>
    <a href="../index.html#diagnostico">Diagnóstico</a>
    <a href="../index.html#nosotros">Nosotros</a>
    <a href="../equipo.html">Equipo</a>
    <a href="../index.html#preguntas">Preguntas</a>
    <a href="../index.html#llegar">Cómo llegar</a>`;

const marca = () => `<a class="marca" href="../index.html" aria-label="Tecnissan, inicio">
    <img src="../assets/logo.png" alt="Logo de Tecnissan" width="160" height="142">
    <span class="marca-txt">
      <span class="marca-nombre">Tec<b>nissan</b></span>
      <span class="marca-sub">Servicio especializado</span>
    </span>
  </a>`;

const pie = `<footer>
  <div class="pie-rejilla">
    <div>
      ${marca()}
      <p class="lema">Taller especializado en vehículos Nissan. Diagnóstico primero, presupuesto antes, y te explicamos todo.</p>
    </div>
    <div>
      <h4>Servicios</h4>
${SERVICIOS.map(s => `      <a href="${s.slug}.html">${s.nombre}</a>`).join('\n')}
    </div>
    <div>
      <h4>Taller</h4>
      <div class="pie-dato" data-dato="direccion"></div>
      <div class="pie-dato" data-dato="ciudad"></div>
      <div class="pie-dato" data-dato="horarioSemana"></div>
      <div class="pie-dato" data-dato="horarioFinde"></div>
      <a data-mapa-link>Abrir en Google Maps</a>
    </div>
    <div>
      <h4>Contacto</h4>
      <a data-wa="Hola Tecnissan, tengo una pregunta sobre mi Nissan.">WhatsApp +57 311 271 0738</a>
      <a data-red="facebook">Facebook</a>
      <a data-red="instagram">Instagram</a>
      <a data-red="google">Reseñas en Google</a>
      <a href="../index.html#preguntas">Preguntas frecuentes</a>
    </div>
  </div>
  <div class="pie-base">
    <span>© <span id="anio">2026</span> Tecnissan. Taller independiente especializado en Nissan.</span>
    <span>No somos concesionario ni estamos afiliados a Nissan Motor Co.</span>
  </div>
</footer>

<a class="wa-flota" id="waFlota" aria-label="Escribir a Tecnissan por WhatsApp"
   data-wa="Hola Tecnissan, quiero agendar un diagnóstico para mi Nissan.">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.2.4-.5.5-.7.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6 0-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.3c.1.2 2 3.3 5 4.5 2.9 1.1 3.3.9 3.9.8.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5 0-.2-.2-.3-.4-.4z"/><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.4A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.2.9.9-3.1-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>
</a>

<script src="../assets/app.js"></script>
</body>
</html>`;

const cabecera = (titulo, meta, canonical, jsonld) => `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo} | Tecnissan</title>
<meta name="description" content="${meta}">
<meta name="theme-color" content="#FFFFFF">
<link rel="canonical" href="https://tecnissan.com/servicios/${canonical}">

<meta property="og:type" content="website">
<meta property="og:title" content="${titulo} | Tecnissan">
<meta property="og:description" content="${meta}">
<meta property="og:image" content="https://tecnissan.com/assets/taller.jpg">
<meta name="twitter:card" content="summary_large_image">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=JetBrains+Mono:wght@400;600&family=Sora:wght@300..600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/style.css">
<link rel="icon" type="image/png" href="../assets/favicon-64.png">
<link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
${jsonld}
</head>
<body>
<a class="salta" href="#contenido">Saltar al contenido</a>

<nav class="nav" id="nav">
  ${marca()}
  <button class="hamburguesa" id="hamburguesa" aria-label="Abrir menú" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
  <div class="nav-enlaces" id="navEnlaces">${navEnlaces}
  </div>
  <a class="btn btn-wa" data-wa="Hola Tecnissan, quiero agendar una cita para mi Nissan.">
    ${icoWa}
    Agendar cita
  </a>
  <div class="nav-progreso" id="navProgreso" aria-hidden="true"><span></span></div>
</nav>

<main id="contenido">`;

/* ---------------- páginas de servicio ---------------- */
for (const [i, s] of SERVICIOS.entries()) {
  const otros = SERVICIOS.filter(o => o.slug !== s.slug).slice(0, 3);
  const jsonld = `
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"Service",
  "name":"${s.nombre} para Nissan",
  "description":"${s.resumen.replace(/"/g, '\\"')}",
  "serviceType":"${s.nombre}",
  "areaServed":{"@type":"City","name":"Bogotá"},
  "provider":{
    "@type":"AutoRepair",
    "name":"Tecnissan",
    "telephone":"+573112710738",
    "address":{"@type":"PostalAddress","streetAddress":"Carrera 70G # 69B-70","addressLocality":"Bogotá","addressCountry":"CO"}
  }
}
</script>`;

  const html = `${cabecera(s.titulo, s.meta, s.slug + '.html', jsonld)}

<section class="encabezado" id="encabezado">
  <div class="envoltura">
    <p class="miga"><a href="../index.html">Inicio</a><span>/</span><a href="index.html">Servicios</a><span>/</span>${s.nombre}</p>
    <span class="etiqueta">Servicio</span>
    <h1 style="margin-top:18px">${s.titulo}</h1>
    <!-- El resumen ya no va en la portada de la pagina: repetia lo que dice
         el cuerpo justo debajo. Sigue usandose en la ficha de datos
         estructurados (lo que muestra Google) y en las tarjetas del indice
         de servicios, que es donde si hace falta. -->
    <div class="acciones">
      <a class="btn btn-wa" ${WA(s.waMsg)}>
        ${icoWa}
        Agendar por WhatsApp
      </a>
      <a class="btn btn-linea" href="index.html">Ver todos los servicios</a>
    </div>
  </div>
</section>

<section class="seccion">
  <div class="envoltura detalle">
    <div>
      <h2 data-anim style="font-size:clamp(24px,3vw,40px)">${s.gancho}</h2>
${s.cuerpo.map(p => `      <p class="plomo" data-anim style="margin-top:18px">${p}</p>`).join('\n')}

      <h3 data-anim style="margin-top:clamp(30px,3.4vw,46px)">Qué incluye</h3>
      <ul class="lista-check" data-anim>
${s.incluye.map(li => `        <li>${tick}<span>${li}</span></li>`).join('\n')}
      </ul>

      <h3 data-anim style="margin-top:clamp(30px,3.4vw,46px)">¿Cuánto se demora?</h3>
${s.demora.map(t => `      <p class="plomo" data-anim style="margin-top:14px">${t}</p>`).join('\n')}

      <h3 data-anim style="margin-top:clamp(30px,3.4vw,46px)">¿Cuándo hacerlo?</h3>
      <p class="plomo" data-anim style="margin-top:14px">${s.cuandoTexto}</p>
    </div>

    <aside class="aparte" data-anim>
      <div class="icono-caja"><svg viewBox="0 0 24 24" aria-hidden="true">${s.icono}</svg></div>
      <h3 style="margin-top:16px">${s.nombre}</h3>
      <!-- Fuera "Cuanto se demora": el cuerpo de la pagina ya lleva su propia
           seccion "¿Cuanto se demora?" con el detalle completo, y en la
           tarjeta quedaba la version corta diciendo lo mismo. El relleno de
           arriba pasa al dato que ahora queda primero. -->
      <div class="dato" style="padding-top:18px">
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>
        <div><div class="k">Cuándo hacerlo</div><div class="v" style="font-size:15px">${s.cuando}</div></div>
      </div>
      <div class="dato">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-5.4-7-10.5A7 7 0 0 1 19 10.5C19 15.6 12 21 12 21z"/><circle cx="12" cy="10.4" r="2.6"/></svg>
        <div><div class="k">Dónde</div><div class="v" style="font-size:15px"><span data-dato="direccion"></span>, <span data-dato="ciudad"></span></div></div>
      </div>
      <a class="btn btn-wa" ${WA(s.waMsg)}>
        ${icoWa}
        Pedir precio por WhatsApp
      </a>
      <p class="nota" style="margin-top:12px">Te respondemos hoy. El precio te lo damos antes de tocar el carro.</p>
    </aside>
  </div>
</section>

<section class="seccion hueso">
  <div class="envoltura">
    <div class="cabeza" data-anim="izq">
      <div>
        <span class="etiqueta">Otros servicios</span>
        <h2 style="font-size:clamp(24px,2.8vw,38px)">También hacemos esto</h2>
      </div>
      <p class="plomo">Todo para tu Nissan en el mismo taller, con el mismo diagnóstico y el mismo trato.</p>
    </div>
    <div class="rejilla r3" style="margin-top:clamp(26px,3vw,40px)">
${otros.map(o => `      <article class="tarjeta" data-anim>
        <div class="icono-caja"><svg viewBox="0 0 24 24" aria-hidden="true">${o.icono}</svg></div>
        <h3>${o.nombre}</h3>
        <p>${o.resumen.split('.')[0]}.</p>
        <a class="mas" href="${o.slug}.html">Ver el servicio <span>→</span></a>
      </article>`).join('\n')}
    </div>
  </div>
</section>

<section class="seccion">
  <div class="envoltura">
    <div class="banda" data-anim>
      <div class="banda-icono"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4M9 14l2 2 4-4"/></svg></div>
      <div>
        <span class="etiqueta">Agenda tu cita</span>
        <h3>¿Listo para traer tu Nissan?</h3>
        <p>Escríbenos por WhatsApp y te decimos qué revisamos primero. Te responde una persona, no un robot.</p>
      </div>
      <a class="btn btn-wa" ${WA(s.waMsg)}>
        ${icoWa}
        Agendar por WhatsApp
      </a>
    </div>
  </div>
</section>

</main>

${pie}
`;
  writeFileSync(`${OUT}/${s.slug}.html`, html);
}

/* ---------------- índice de servicios ---------------- */
const jsonldIndex = `
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"ItemList",
  "name":"Servicios de Tecnissan para Nissan en Bogotá",
  "itemListElement":[
${SERVICIOS.map((s, i) => `    {"@type":"ListItem","position":${i + 1},"name":"${s.nombre}","url":"https://tecnissan.com/servicios/${s.slug}.html"}`).join(',\n')}
  ]
}
</script>`;

const indice = `${cabecera('Servicios para Nissan en Bogotá', 'Los nueve servicios de Tecnissan para Nissan en Bogotá: mantenimiento preventivo, diagnóstico, mecánica general y express, electricidad, frenos, aire acondicionado, latonería y alineación.', 'index.html', jsonldIndex)}

<section class="encabezado" id="encabezado">
  <div class="envoltura">
    <p class="miga"><a href="../index.html">Inicio</a><span>/</span>Servicios</p>
    <span class="etiqueta">Nuestros servicios</span>
    <h1 style="margin-top:18px">Todo lo que tu Nissan necesita, en un solo taller</h1>
    <p class="plomo">Nueve servicios, un mismo método: diagnosticamos primero, te damos el precio completo antes de empezar y te explicamos qué encontramos.</p>
    <div class="acciones">
      <a class="btn btn-wa" data-wa="Hola Tecnissan, quiero agendar una cita para mi Nissan.">
        ${icoWa}
        Agendar por WhatsApp
      </a>
    </div>
  </div>
</section>

<section class="seccion">
  <div class="envoltura">
    <div class="rejilla r3">
${SERVICIOS.map(s => `      <article class="tarjeta" data-anim>
        <div class="icono-caja"><svg viewBox="0 0 24 24" aria-hidden="true">${s.icono}</svg></div>
        <h3>${s.nombre}</h3>
        <p>${s.resumen}</p>
        <a class="mas" href="${s.slug}.html">Ver el servicio <span>→</span></a>
      </article>`).join('\n')}
    </div>
  </div>
</section>

<section class="seccion hueso">
  <div class="envoltura">
    <div class="cabeza" data-anim="izq">
      <div>
        <span class="etiqueta">Cómo trabajamos</span>
        <h2>Cuatro pasos, y tú decides en el tercero</h2>
      </div>
      <p class="plomo">Ningún trabajo empieza sin que sepas qué tiene el carro y cuánto cuesta arreglarlo.</p>
    </div>
    <div class="pasos" id="pasos">
      <div class="pasos-progreso" id="pasosProgreso" aria-hidden="true"></div>
      <article class="paso"><div class="globo">1</div><h3>Tú escribes.</h3><p>Cuenta qué siente el carro por WhatsApp. Le responde una persona, no un robot.</p></article>
      <article class="paso"><div class="globo">2</div><h3>Diagnosticamos.</h3><p>Conectamos el escáner y revisamos. Te contamos qué encontramos.</p></article>
      <article class="paso"><div class="globo">3</div><h3>Autorizas tú.</h3><p>Te damos el precio completo antes de empezar. Si dices que no, no se hace.</p></article>
      <article class="paso"><div class="globo">4</div><h3>Entregamos.</h3><p>Con la fecha dicha desde el principio, y te explicamos qué le hicimos.</p></article>
    </div>
  </div>
</section>

<section class="seccion">
  <div class="envoltura">
    <div class="banda" data-anim>
      <div class="banda-icono"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4M9 14l2 2 4-4"/></svg></div>
      <div>
        <span class="etiqueta">Agenda tu cita</span>
        <h3>Tu Nissan, listo para seguir.</h3>
        <p>Escríbenos por WhatsApp y te decimos qué revisamos primero.</p>
      </div>
      <a class="btn btn-wa" data-wa="Hola Tecnissan, quiero agendar una cita para mi Nissan.">
        ${icoWa}
        Agendar por WhatsApp
      </a>
    </div>
  </div>
</section>

</main>

${pie}
`;
writeFileSync(`${OUT}/index.html`, indice);

console.log('Generadas', SERVICIOS.length + 1, 'páginas en', OUT);

/* ---------------- el inicio y el pie de las otras paginas ----------------
   El catalogo vive solo aqui, asi que este script tambien reescribe las
   tarjetas del inicio, el schema y la columna "Servicios" de los pies. */
const RAIZ = BASE;

const tarjetasInicio = SERVICIOS.map(s => `      <article class="tarjeta" data-anim>
        <div class="icono-caja"><svg viewBox="0 0 24 24" aria-hidden="true">${s.icono}</svg></div>
        <h3>${s.nombre}</h3>
        <p>${CORTO[s.slug]}</p>
        <a class="mas" href="servicios/${s.slug}.html">Ver el servicio <span>→</span></a>
      </article>`).join('\n');

const entreMarcas = (txt, abre, cierra, nuevo) => {
  const i = txt.indexOf(abre), j = txt.indexOf(cierra, i);
  if (i < 0 || j < 0) throw new Error('no encontre ' + abre);
  return txt.slice(0, i + abre.length) + nuevo + txt.slice(j);
};

let inicio = readFileSync(`${RAIZ}/index.html`, 'utf8');

inicio = entreMarcas(inicio,
  '<div class="rejilla r3" style="margin-top:clamp(30px,3.6vw,48px)">\n',
  '    </div>\n\n    <div style="margin-top:clamp(28px,3vw,42px)',
  tarjetasInicio + '\n');

inicio = entreMarcas(inicio, '  "makesOffer":[\n', '\n  ]\n}',
  SERVICIOS.map(s => `    {"@type":"Offer","itemOffered":{"@type":"Service","name":"${s.nombre}"}}`).join(',\n'));

const columnaPie = pre => SERVICIOS.map(s => `      <a href="${pre}${s.slug}.html">${s.nombre}</a>`).join('\n');

inicio = entreMarcas(inicio, '      <h4>Servicios</h4>\n', '\n    </div>\n    <div>\n      <h4>Taller</h4>',
  columnaPie('servicios/'));

writeFileSync(`${RAIZ}/index.html`, inicio);

let equipo = readFileSync(`${RAIZ}/equipo.html`, 'utf8');
equipo = entreMarcas(equipo, '      <h4>Servicios</h4>\n', '\n    </div>\n    <div>\n      <h4>Taller</h4>',
  columnaPie('servicios/'));
writeFileSync(`${RAIZ}/equipo.html`, equipo);

console.log('Actualizados index.html y equipo.html con', SERVICIOS.length, 'servicios');
