/* ===========================================================
   TECNISSAN: comportamiento compartido por todas las páginas.
   Al cambiar un dato del negocio, se cambia solo aquí arriba.
   =========================================================== */

const TECNISSAN = {
  wa: "573112710738",
  waVisible: "+57 311 271 0738",
  direccion: "Carrera 70G # 69B-70",
  ciudad: "Bogotá, Colombia",
  mapaConsulta: "Carrera 70G # 69B-70, Bogotá, Colombia",
  horarioSemana: "Lunes a viernes, 7:30 a.m. a 6:00 p.m.",
  horarioFinde: "Sábados y domingos cerrado",
  facebook: "https://www.facebook.com/Tecnissan/",
  instagram: "https://www.instagram.com/tecnissan_sas",
  google: "https://share.google/HBCb4Xj500gyGIL2d"
};

/* -------------------- cada pagina abre arriba --------------------
   Safari y Chrome recuerdan por URL donde quedo el scroll y al volver
   a entrar abren la pagina ahi mismo: si la ultima vez se leyo hasta
   abajo, al abrirla de nuevo aparece el pie primero. Le quitamos esa
   restauracion y la mandamos arriba, salvo que la URL traiga un ancla
   (#diagnostico, #llegar...), que ahi si hay que respetar el destino. */
(() => {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (location.hash) return;

  let tocado = false;
  const marcar = () => { tocado = true; };
  const opciones = { passive: true, once: true };
  addEventListener("wheel", marcar, opciones);
  addEventListener("touchstart", marcar, opciones);
  addEventListener("keydown", marcar, { once: true });

  // behavior instant porque html lleva scroll-behavior:smooth y si no
  // se ve la pagina bajando sola al abrirla
  const arriba = () => {
    if (!tocado && scrollY > 0) scrollTo({ top: 0, left: 0, behavior: "instant" });
  };
  arriba();
  addEventListener("load", arriba);
})();

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const waUrl = msg => `https://wa.me/${TECNISSAN.wa}?text=${encodeURIComponent(msg)}`;

/* -------------------- enlaces de WhatsApp y redes -------------------- */
$$("[data-wa]").forEach(el => {
  el.setAttribute("href", waUrl(el.dataset.wa));
  el.setAttribute("target", "_blank");
  el.setAttribute("rel", "noopener");
});
$$("[data-red]").forEach(a => {
  const url = TECNISSAN[a.dataset.red];
  if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
  else a.remove();
});

/* -------------------- datos del negocio en la página -------------------- */
$$("[data-dato]").forEach(el => {
  const v = TECNISSAN[el.dataset.dato];
  if (v) el.textContent = v;
});
const consulta = encodeURIComponent(TECNISSAN.mapaConsulta);
const mapa = $("#mapaIframe");
if (mapa) mapa.src = `https://www.google.com/maps?q=${consulta}&output=embed`;
$$("[data-mapa-link]").forEach(a => {
  a.href = `https://www.google.com/maps/search/?api=1&query=${consulta}`;
  a.target = "_blank"; a.rel = "noopener";
});
const anio = $("#anio");
if (anio) anio.textContent = new Date().getFullYear();

/* Si el navegador bloquea el iframe de Google (politica de seguridad de
   la pagina que nos embebe, bloqueo de rastreadores, red corporativa),
   el marco queda ahi tapando el respaldo. Se quita para que se vea el
   panel con la direccion y el boton a Google Maps. */
if (mapa) {
  addEventListener("securitypolicyviolation", e => {
    const esMarco = String(e.violatedDirective || "").startsWith("frame-src");
    const esGoogle = String(e.blockedURI || "").includes("google.com");
    if (esMarco || esGoogle) mapa.remove();
  });
}

/* -------------------- barra superior -------------------- */
(() => {
  const nav = $("#nav");
  if (!nav) return;
  const alScroll = () => nav.classList.toggle("pegado", window.scrollY > 20);
  alScroll();
  addEventListener("scroll", alScroll, { passive: true });

  const hamb = $("#hamburguesa");
  if (!hamb) return;
  hamb.addEventListener("click", () => {
    const abierto = nav.classList.toggle("abierto");
    hamb.setAttribute("aria-expanded", String(abierto));
    hamb.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });
  $$("#navEnlaces a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("abierto");
    hamb.setAttribute("aria-expanded", "false");
  }));
})();

/* -------------------- entradas al hacer scroll -------------------- */
const entrada = new IntersectionObserver(filas => {
  filas.forEach(f => {
    if (!f.isIntersecting) return;
    f.target.classList.add("dentro");
    entrada.unobserve(f.target);
  });
}, { rootMargin: "0px 0px -10% 0px", threshold: .1 });

$$("[data-anim]").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i % 5, 4) * 65}ms`;
  entrada.observe(el);
});

/* -------------------- botón flotante -------------------- */
(() => {
  const flota = $("#waFlota");
  if (!flota) return;
  const ancla = $("#hero") || $("#encabezado");
  if (!ancla) { flota.classList.add("dentro"); return; }
  new IntersectionObserver(([f]) => {
    flota.classList.toggle("dentro", !f.isIntersecting);
  }, { threshold: .04 }).observe(ancla);
})();

/* -------------------- cifras que cuentan -------------------- */
$$("[data-cuenta]").forEach(el => {
  const fin = parseInt(el.dataset.cuenta, 10);
  const pequeno = el.querySelector("small");
  const pinta = n => { el.textContent = String(n); if (pequeno) el.appendChild(pequeno); };
  const obs = new IntersectionObserver(([f]) => {
    if (!f.isIntersecting) return;
    obs.disconnect();
    if (reduce) { pinta(fin); return; }
    const t0 = performance.now(), dur = 1000;
    const paso = t => {
      const p = Math.min((t - t0) / dur, 1);
      pinta(Math.round(fin * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }, { threshold: .5 });
  obs.observe(el);
});

/* -------------------- pasos del proceso -------------------- */
(() => {
  const pasos = $("#pasos"), barra = $("#pasosProgreso");
  if (!pasos || !barra) return;
  const items = $$(".paso", pasos);
  const vertical = () => matchMedia("(max-width:900px)").matches;
  new IntersectionObserver(([f]) => {
    if (!f.isIntersecting) return;
    items.forEach((p, i) => setTimeout(() => p.classList.add("dentro"), i * 200));
    setTimeout(() => {
      if (vertical()) barra.style.height = "100%";
      else barra.style.width = "100%";
    }, 120);
  }, { threshold: .3 }).observe(pasos);
})();

/* -------------------- diagnóstico por síntoma -------------------- */
const SINTOMAS = [
  { t: "Tirones al acelerar",
    r: "Puede ser bujías, inyectores o el sensor de flujo de aire. El escáner lo separa en minutos, sin desarmar nada.",
    wa: "Hola Tecnissan, mi Nissan da tirones al acelerar. ¿Me hacen el diagnóstico?" },
  { t: "Se encendió un testigo en el tablero",
    r: "Leemos el código y te decimos qué significa antes de tocar una sola pieza. Muchas veces es un sensor barato, no una reparación grande.",
    wa: "Hola Tecnissan, se me encendió un testigo en el tablero del Nissan. ¿Me leen el código?" },
  { t: "Suena o vibra al frenar",
    r: "Casi siempre son pastillas gastadas o discos desnivelados. Medimos el espesor de las pastillas y el estado de los discos, y te decimos cuánto le queda de vida a cada cosa.",
    wa: "Hola Tecnissan, mi Nissan suena y vibra al frenar. ¿Me revisan los frenos?" },
  { t: "Está gastando más gasolina",
    r: "Revisamos inyectores, bujías, filtro y sensor de oxígeno. Casi siempre es uno de esos cuatro.",
    wa: "Hola Tecnissan, mi Nissan está gastando más gasolina de lo normal. ¿Qué me recomiendan revisar?" },
  { t: "Se va para un lado o vibra el timón",
    r: "Revisamos alineación, balanceo y el estado de la suspensión. Es de las fallas que más se sienten al volante y de las más baratas de corregir a tiempo.",
    wa: "Hola Tecnissan, mi Nissan se va para un lado y vibra el timón. ¿Me revisan la alineación?" },
  { t: "Le toca el mantenimiento",
    r: "Te decimos exactamente qué pide tu Nissan en tu kilometraje, y qué no pide todavía. Así no pagas por lo que no necesitas.",
    wa: "Hola Tecnissan, quiero el mantenimiento de mi Nissan. ¿Qué me toca en mi kilometraje?" }
];

(() => {
  const lista = $("#sintomaLista");
  if (!lista) return;
  const cuerpo = $("#sintomaCuerpo"), acciones = $("#sintomaAcciones"), boton = $("#sintomaWa");
  SINTOMAS.forEach(s => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "sintoma-btn";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", "false");
    b.innerHTML = `<span class="punto"></span><span>${s.t}</span>`;
    b.addEventListener("click", () => {
      $$(".sintoma-btn", lista).forEach(o => o.setAttribute("aria-selected", "false"));
      b.setAttribute("aria-selected", "true");
      cuerpo.innerHTML = `<h3>${s.t}</h3><p>${s.r}</p>`;
      cuerpo.classList.remove("fundido");
      void cuerpo.offsetWidth;
      if (!reduce) cuerpo.classList.add("fundido");
      boton.href = waUrl(s.wa);
      acciones.hidden = false;
    });
    lista.appendChild(b);
  });
})();

/* -------------------- formulario: arma el mensaje de WhatsApp -------------------- */
(() => {
  const f = $("#formContacto");
  if (!f) return;
  f.addEventListener("submit", e => {
    e.preventDefault();
    const vacio = [...f.elements].find(el => el.required && !el.value.trim());
    if (vacio) { vacio.focus(); return; }
    const servicio = f.servicio && f.servicio.value ? `\nMe interesa: ${f.servicio.value}.` : "";
    const msg =
      `Hola Tecnissan, soy ${f.nombre.value.trim()}.\n` +
      `Mi carro es un ${f.carro.value.trim()}.${servicio}\n` +
      `${f.mensaje.value.trim()}`;
    window.open(waUrl(msg), "_blank", "noopener");
  });
})();

/* -------------------- fichas del equipo, una por persona -------------------- */
(() => {
  const botones = $$(".persona-abrir");
  if (!botones.length) return;

  const soporta = typeof HTMLDialogElement === "function"
    && typeof HTMLDialogElement.prototype.showModal === "function";
  if (!soporta) {
    // Sin <dialog> no hay nada que abrir: quitamos el boton y el "ver ficha"
    // para no prometer un clic que no pasa nada.
    document.documentElement.classList.add("sin-fichas");
    botones.forEach(b => b.remove());
    return;
  }

  const raiz = document.documentElement;
  let abridor = null;   // a quien le devolvemos el foco al cerrar

  botones.forEach(b => {
    const ficha = document.getElementById(b.dataset.ficha);
    if (!ficha) { b.remove(); return; }
    b.addEventListener("click", () => {
      abridor = b;
      ficha.showModal();
      raiz.classList.add("ficha-abierta");
    });
  });

  $$("dialog.ficha").forEach(ficha => {
    const cerrar = $(".ficha-cerrar", ficha);
    if (cerrar) cerrar.addEventListener("click", () => ficha.close());

    // Clic en el dialog y no en la caja = clic fuera, se cierra.
    ficha.addEventListener("click", e => { if (e.target === ficha) ficha.close(); });

    // Esc lo cierra solo; aqui solo recogemos la mesa.
    ficha.addEventListener("close", () => {
      raiz.classList.remove("ficha-abierta");
      if (abridor) { abridor.focus(); abridor = null; }
    });
  });
})();

/* -------------------- barra de avance de lectura -------------------- */
(() => {
  const barra = $("#navProgreso");
  if (!barra) return;
  const linea = barra.firstElementChild;
  let pedido = false;
  const pinta = () => {
    pedido = false;
    const alto = document.documentElement.scrollHeight - innerHeight;
    const p = alto > 40 ? Math.min(scrollY / alto, 1) : 0;
    linea.style.width = `${(p * 100).toFixed(2)}%`;
  };
  // rAF: el scroll dispara muchisimo mas rapido de lo que el navegador pinta
  const pedir = () => { if (!pedido) { pedido = true; requestAnimationFrame(pinta); } };
  addEventListener("scroll", pedir, { passive: true });
  addEventListener("resize", pedir, { passive: true });
  pinta();
})();

/* -------------------- "sigue bajando" de la portada -------------------- */
(() => {
  const baja = $("#baja");
  if (!baja) return;
  const irse = () => baja.classList.add("ido");
  addEventListener("scroll", () => { if (scrollY > 40) irse(); }, { passive: true, once: false });
  // Si ya entro con la pagina abajo, no tiene nada que invitar.
  if (scrollY > 40) irse();
})();

/* -------------------- la franja de modelos: avisa, empuja y se arrastra -------------------- */
(() => {
  const franja = $("#modelos");
  if (!franja) return;

  /* 1. Desvanecido en el lado donde todavia queda franja por ver. */
  const margenes = () => {
    const resto = franja.scrollWidth - franja.clientWidth;
    if (resto < 8) {
      // En escritorio ancho los diez modelos caben y no hay nada que
      // desplazar: ni desvanecido ni cursor de agarre, que serian mentira.
      franja.style.setProperty("--fade-izq", "0px");
      franja.style.setProperty("--fade-der", "0px");
      franja.classList.remove("corre");
      return;
    }
    franja.classList.add("corre");
    franja.style.setProperty("--fade-izq", franja.scrollLeft > 6 ? "34px" : "0px");
    franja.style.setProperty("--fade-der", franja.scrollLeft < resto - 6 ? "34px" : "0px");
  };
  franja.addEventListener("scroll", margenes, { passive: true });
  addEventListener("resize", margenes, { passive: true });
  margenes();

  /* 2. Un empujon la primera vez que se ve, para que se entienda que corre.
        Mueve el scroll y lo devuelve; no toca el layout. */
  if (!reduce) {
    const empuja = new IntersectionObserver(([f]) => {
      if (!f.isIntersecting) return;
      empuja.disconnect();
      if (franja.scrollWidth - franja.clientWidth < 40) return;
      const t0 = performance.now(), dur = 1150, tope = 30;
      const paso = t => {
        const p = Math.min((t - t0) / dur, 1);
        // ida y vuelta: media vuelta de seno, sin rebote
        franja.scrollLeft = tope * Math.sin(p * Math.PI);
        if (p < 1) requestAnimationFrame(paso); else franja.scrollLeft = 0;
      };
      requestAnimationFrame(paso);
    }, { threshold: .55 });
    empuja.observe(franja);
  }

  /* 3. Arrastrar con el raton. En tactil ya funciona solo, y ahi el
        pointerdown no debe robarle el gesto al navegador. */
  if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  document.documentElement.classList.add("arrastrable");

  let x0 = 0, izq0 = 0, corrido = 0, activo = false;
  franja.addEventListener("pointerdown", e => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    activo = true; corrido = 0; x0 = e.clientX; izq0 = franja.scrollLeft;
    franja.setPointerCapture(e.pointerId);
  });
  franja.addEventListener("pointermove", e => {
    if (!activo) return;
    const dx = e.clientX - x0;
    if (!corrido && Math.abs(dx) > 4) franja.classList.add("arrastrando");
    corrido = Math.max(corrido, Math.abs(dx));
    franja.scrollLeft = izq0 - dx;
  });
  const suelta = () => {
    if (!activo) return;
    activo = false;
    // El pointer-events:none de .arrastrando se levanta despues del click,
    // para que un arrastre no acabe abriendo WhatsApp.
    setTimeout(() => franja.classList.remove("arrastrando"), 0);
  };
  franja.addEventListener("pointerup", suelta);
  franja.addEventListener("pointercancel", suelta);
})();

/* -------------------- puntero propio sobre lo que se puede tocar -------------------- */
(() => {
  if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  const puntero = document.createElement("div");
  puntero.className = "puntero";
  puntero.setAttribute("aria-hidden", "true");
  const disco = document.createElement("span");
  disco.className = "puntero-disco";
  puntero.appendChild(disco);
  document.body.appendChild(puntero);
  document.documentElement.classList.add("con-puntero");

  let x = 0, y = 0, px = 0, py = 0, dentro = false, corriendo = false;

  const cuadro = () => {
    // Persigue con retraso: el disco llega un pelo despues que el raton.
    const k = reduce ? 1 : .22;
    px += (x - px) * k;
    py += (y - py) * k;
    puntero.style.transform = `translate3d(${px.toFixed(1)}px,${py.toFixed(1)}px,0)`;
    if (dentro || Math.abs(x - px) > .5 || Math.abs(y - py) > .5) requestAnimationFrame(cuadro);
    else corriendo = false;
  };
  const arranca = () => { if (!corriendo) { corriendo = true; requestAnimationFrame(cuadro); } };

  addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    x = e.clientX; y = e.clientY;
    arranca();
  }, { passive: true });

  /* Por delegacion y no zona por zona: el data-puntero de la franja de
     modelos aparece y desaparece segun quepa o no, y asi no hay que
     volver a enganchar nada. */
  let zona = null;
  addEventListener("pointerover", e => {
    if (e.pointerType !== "mouse") return;
    const nueva = e.target.closest ? e.target.closest("[data-puntero]") : null;
    if (nueva === zona) return;
    zona = nueva;
    if (!zona) { dentro = false; puntero.classList.remove("visible"); return; }
    disco.textContent = zona.dataset.puntero;
    if (!dentro) { x = px = e.clientX; y = py = e.clientY; }  // sin salto al aparecer
    dentro = true;
    puntero.classList.add("visible");
    arranca();
  }, { passive: true });
  addEventListener("pointerout", e => {
    if (e.pointerType !== "mouse" || !zona) return;
    if (e.relatedTarget && zona.contains(e.relatedTarget)) return;
    zona = null; dentro = false;
    puntero.classList.remove("visible");
  }, { passive: true });

  // Una ficha abierta tapa la tarjeta: el disco no tiene nada que anunciar.
  addEventListener("scroll", () => { if (dentro) return; puntero.classList.remove("visible"); }, { passive: true });
})();
