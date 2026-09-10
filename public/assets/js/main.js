/**
 * TECNISSAN — JS del sitio (vanilla, sin dependencias).
 * - Menú móvil
 * - Tracking de conversiones vía dataLayer (GTM/GA4)
 * - Validación de formulario de contacto
 */
(function () {
  "use strict";

  window.dataLayer = window.dataLayer || [];
  function track(eventName, params) {
    window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
  }

  /* ---------------- Menú móvil ---------------- */
  var body = document.body;
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var isOpen = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
  document.querySelectorAll(".mobile-nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      body.classList.remove("nav-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------------- Tracking de clics ---------------- */
  document.querySelectorAll("[data-track]").forEach(function (el) {
    el.addEventListener("click", function () {
      track(el.getAttribute("data-track"), {
        page_path: window.location.pathname,
        link_label: (el.textContent || "").trim().slice(0, 60),
      });
    });
  });

  /* ---------------- Formulario de contacto ---------------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var successBox = form.querySelector(".form-success");
    var failBox = form.querySelector(".form-fail");

    function setInvalid(row, message) {
      row.classList.add("invalid");
      var err = row.querySelector(".form-error");
      if (err && message) err.textContent = message;
    }
    function clearInvalid(row) {
      row.classList.remove("invalid");
    }

    function validate() {
      var valid = true;
      form.querySelectorAll("[data-required]").forEach(function (field) {
        var row = field.closest(".form-row");
        var value = (field.value || "").trim();
        if (!value) {
          setInvalid(row, "Este campo es obligatorio.");
          valid = false;
        } else if (field.type === "tel" && value.replace(/\D/g, "").length < 7) {
          setInvalid(row, "Ingresa un teléfono válido.");
          valid = false;
        } else {
          clearInvalid(row);
        }
      });
      return valid;
    }

    form.querySelectorAll("[data-required]").forEach(function (field) {
      field.addEventListener("blur", function () {
        validate();
      });
    });

    form.addEventListener("submit", function (e) {
      if (successBox) successBox.style.display = "none";
      if (failBox) failBox.style.display = "none";

      if (!validate()) {
        e.preventDefault();
        var firstInvalid = form.querySelector(".invalid input, .invalid select, .invalid textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      track("generate_lead", {
        page_path: window.location.pathname,
        form_service: form.querySelector('[name="servicio"]')
          ? form.querySelector('[name="servicio"]').value
          : undefined,
      });

      // Si el sitio corre en Netlify, el envío normal (POST -> /gracias.html)
      // se encarga del resto. Este bloque es solo una mejora progresiva por
      // si se agrega un endpoint propio vía fetch en el futuro.
    });
  }

  /* ---------------- Año dinámico en footer (respaldo) ---------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
