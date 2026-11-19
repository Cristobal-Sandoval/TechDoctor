/**
 * Tech Doctor (@techdoctor.ccp) - Script Principal Frontend (SPA Edition)
 * Servicio técnico de computadores y desarrollo web en Concepción, Chile.
 *
 * =========================================================================
 * ⚙️ CONFIGURACIÓN DE CONTACTO:
 * Número oficial de WhatsApp: +56 9 5662 8609 (56956628609)
 * =========================================================================
 */

const TECH_DOCTOR_CONFIG = {
  // Número de WhatsApp oficial de Tech Doctor en Concepción, Chile
  phone: "56956628609",

  instagramUrl: "https://www.instagram.com/techdoctor.ccp/",
  instagramHandle: "@techdoctor.ccp",
  city: "Concepción, Chile"
};

/**
 * Catálogo único de precios y textos.
 * Es la ÚNICA fuente de verdad para tarjetas, selectores y cotizador.
 * Si cambias un precio aquí, se actualiza en toda la página.
 */
const CATALOG = {
  notebook: {
    label: "Notebook",
    badge: "Notebook",
    surcharge: 0,
    subheading: "Valores claros y fijos para tu notebook. Diagnóstico honesto, sin costos sorpresa ni diagnósticos inflados.",
    services: {
      formateo: {
        price: 20000,
        desc: "Para notebooks lentos, con virus o fallas de Windows.",
        subtext: "Notebook · Windows limpio y rápido",
        note: "Instalación limpia, drivers y respaldo de datos",
        waMessage: "¡Hola Tech Doctor! 👋 Me gustaría agendar el servicio de Formateo y Optimización para mi notebook ($20.000 CLP). ¿Cómo coordinamos en Concepción?"
      },
      pack: {
        price: 30000,
        oldPrice: 40000,
        stampNote: "Precio pack",
        desc: "Tu notebook renovado por dentro y por fuera.",
        subtext: "Limpieza profunda + Formateo completo",
        note: "Incluye limpieza física profunda + formateo optimizado",
        waMessage: "¡Hola Tech Doctor! 👋 Quiero agendar el Pack Completo (Limpieza + Formateo) para mi notebook ($30.000 CLP). ¿Cómo coordinamos en Concepción?"
      },
      limpieza: {
        price: 20000,
        desc: "Para notebooks que calientan mucho, hacen ruido o se apagan.",
        subtext: "Notebook · Mantención térmica preventiva",
        note: "Desensamble, limpieza de turbinas y nueva pasta térmica",
        waMessage: "¡Hola Tech Doctor! 👋 Quiero agendar una Limpieza Física y Mantención para mi notebook ($20.000 CLP). ¿Cómo coordinamos en Concepción?"
      }
    }
  },
  pc: {
    label: "PC de Escritorio",
    badge: "PC Escritorio",
    surcharge: 0,
    subheading: "Valores claros y fijos para PC de escritorio (Torre / Gamer). Diagnóstico honesto y mantención dedicada.",
    services: {
      formateo: {
        price: 20000,
        desc: "Para computadores de escritorio o PC gamer lentos, con virus o fallas de Windows.",
        subtext: "PC de Escritorio · Windows limpio y rápido",
        note: "Instalación limpia, drivers y respaldo de datos",
        waMessage: "¡Hola Tech Doctor! 👋 Me gustaría agendar el servicio de Formateo y Optimización para mi PC de escritorio ($20.000 CLP). ¿Cómo coordinamos en Concepción?"
      },
      pack: {
        price: 40000,
        oldPrice: 50000,
        stampNote: "Ahorras $10.000",
        desc: "Tu PC de escritorio o torre gamer renovado por dentro y por fuera.",
        subtext: "Limpieza profunda + Formateo completo",
        note: "Incluye limpieza física profunda + formateo optimizado",
        waMessage: "¡Hola Tech Doctor! 👋 Quiero agendar el Pack Completo (Limpieza + Formateo) para mi PC de escritorio ($40.000 CLP). ¿Cómo coordinamos en Concepción?"
      },
      limpieza: {
        price: 30000,
        desc: "Para PC de escritorio o torre gamer con polvo acumulado, temperaturas altas o ventiladores ruidosos.",
        subtext: "PC de Escritorio · Mantención térmica preventiva",
        note: "Desensamble, limpieza de turbinas y nueva pasta térmica",
        waMessage: "¡Hola Tech Doctor! 👋 Quiero agendar una Limpieza Física y Mantención para mi PC de escritorio ($30.000 CLP). ¿Cómo coordinamos en Concepción?"
      }
    }
  }
};

/** Servicios de desarrollo web: no dependen del tipo de equipo. */
const WEB_SERVICES = {
  "web-basica": {
    price: 60000,
    label: "Página Web Básica",
    note: "Landing page frontend hasta 2 páginas + botón WhatsApp"
  },
  "web-dominio": {
    price: 70000,
    label: "Página Web + Dominio .cl",
    note: "Página web + registro de dominio oficial .cl en NIC Chile"
  }
};

/** Opciones del cotizador que no tienen precio fijo. */
const FREE_SERVICES = {
  consulta: {
    label: "Consulta Técnica / Otro problema",
    note: "Diagnóstico o consulta especial a coordinar"
  }
};

/** Formatea un número como precio chileno: 30000 -> "$30.000" */
function formatCLP(value) {
  return `$${Number(value).toLocaleString("es-CL")}`;
}

/** Genera un enlace directo a WhatsApp con texto codificado */
function getWhatsAppUrl(message) {
  const cleanPhone = TECH_DOCTOR_CONFIG.phone.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/** Abre WhatsApp; si el navegador bloquea la pestaña nueva, navega directo. */
function openWhatsApp(message) {
  const url = getWhatsAppUrl(message);
  // Nota: "noopener" dentro de features hace que window.open devuelva null,
  // por eso se anula el opener después de abrir.
  const win = window.open(url, "_blank");
  if (win) {
    try {
      win.opener = null;
    } catch (error) {
      /* Ignorado: algunos navegadores no permiten tocar opener */
    }
  } else {
    window.location.href = url;
  }
}

/** Devuelve los datos de un servicio técnico según el equipo elegido. */
function getTechService(device, serviceId) {
  const deviceData = CATALOG[device] || CATALOG.notebook;
  return deviceData.services[serviceId] || null;
}

document.addEventListener("DOMContentLoaded", () => {
  /* -----------------------------------------------------------------------
     1. Año del footer
     --------------------------------------------------------------------- */
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------------------------------
     2. Menú móvil (accesible: Escape, clic fuera, foco y aria)
     --------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIconOpen = document.getElementById("menu-icon-open");
  const menuIconClose = document.getElementById("menu-icon-close");

  function isMobileMenuOpen() {
    return !!mobileMenu && !mobileMenu.classList.contains("is-hidden");
  }

  function setMobileMenu(open) {
    if (!mobileMenu || !mobileMenuBtn) return;
    mobileMenu.classList.toggle("is-hidden", !open);
    mobileMenuBtn.setAttribute("aria-expanded", String(open));
    mobileMenuBtn.setAttribute("aria-label", open ? "Cerrar menú de navegación" : "Abrir menú de navegación");
    if (menuIconOpen && menuIconClose) {
      menuIconOpen.classList.toggle("is-hidden", open);
      menuIconClose.classList.toggle("is-hidden", !open);
    }
  }

  function closeMobileMenu(returnFocus) {
    if (!isMobileMenuOpen()) return;
    setMobileMenu(false);
    if (returnFocus && mobileMenuBtn) {
      mobileMenuBtn.focus();
    }
  }

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      setMobileMenu(!isMobileMenuOpen());
    });

    // Cerrar al elegir un enlace interno
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMobileMenu(false));
    });

    // Cerrar con Escape y devolver el foco al botón
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu(true);
      }
    });

    // Cerrar al hacer clic fuera del menú y del botón
    document.addEventListener("click", (event) => {
      if (!isMobileMenuOpen()) return;
      const target = event.target;
      if (!mobileMenu.contains(target) && !mobileMenuBtn.contains(target)) {
        closeMobileMenu(false);
      }
    });

    // Si la ventana pasa a escritorio, el menú móvil deja de existir visualmente
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const handleDesktopChange = (event) => {
      if (event.matches) closeMobileMenu(false);
    };
    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", handleDesktopChange);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(handleDesktopChange);
    }
  }

  /* -----------------------------------------------------------------------
     3. Enlaces dinámicos a WhatsApp (.js-wa-link y botón flotante)
     --------------------------------------------------------------------- */
  document.querySelectorAll(".js-wa-link").forEach((link) => {
    const customMessage =
      link.getAttribute("data-wa-message") ||
      "¡Hola Tech Doctor! Vi su página web y me gustaría hacer una consulta.";
    link.href = getWhatsAppUrl(customMessage);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const floatingWaBtn = document.getElementById("floating-whatsapp-btn");
  if (floatingWaBtn) {
    const floatMessage =
      floatingWaBtn.getAttribute("data-wa-message") ||
      "¡Hola Tech Doctor! 👋 Vi su página web y quisiera consultar por sus servicios en Concepción.";
    floatingWaBtn.href = getWhatsAppUrl(floatMessage);
    floatingWaBtn.target = "_blank";
    floatingWaBtn.rel = "noopener noreferrer";
  }

  /* -----------------------------------------------------------------------
     4. ScrollSpy del navbar SPA
     --------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id], header[id="inicio"]');
  const navLinks = document.querySelectorAll(".spa-nav-link");

  if ("IntersectionObserver" in window && sections.length > 0 && navLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -65% 0px",
      threshold: 0
    };

    const activeClasses = ["bg-dose-paper-2", "border-dose-rule", "text-dose-ink", "font-semibold"];
    const inactiveClasses = ["text-dose-muted", "hover:text-dose-ink", "hover:bg-dose-paper-2", "font-medium", "border-transparent"];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const currentId = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          if (href === `#${currentId}`) {
            link.classList.remove(...inactiveClasses);
            link.classList.add(...activeClasses);
            link.setAttribute("aria-current", "location");
          } else if (href && href.startsWith("#")) {
            link.classList.remove(...activeClasses);
            link.classList.add(...inactiveClasses);
            link.removeAttribute("aria-current");
          }
        });
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }

  /* -----------------------------------------------------------------------
     5. Precios y selector Notebook / PC
     --------------------------------------------------------------------- */
  const tabNotebook = document.getElementById("tab-notebook");
  const tabPc = document.getElementById("tab-pc");
  const deviceSelect = document.getElementById("form-device");
  const serviceSelect = document.getElementById("form-service");
  const deviceHint = document.getElementById("device-hint");
  let currentSelectedDevice = "notebook";

  /** Pinta las 3 tarjetas de servicio técnico para un equipo dado. */
  function renderPriceCards(device) {
    const data = CATALOG[device];
    if (!data) return;

    const subheading = document.getElementById("services-subheading");
    if (subheading) subheading.textContent = data.subheading;

    ["formateo", "pack", "limpieza"].forEach((serviceId) => {
      const service = data.services[serviceId];
      if (!service) return;

      const price = document.getElementById(`price-${serviceId}`);
      const badge = document.getElementById(`badge-${serviceId}`);
      const desc = document.getElementById(`desc-${serviceId}`);
      const subtext = document.getElementById(`subtext-${serviceId}`);
      const button = document.getElementById(`btn-wa-${serviceId}`);

      if (price) price.textContent = formatCLP(service.price);
      if (badge) badge.textContent = data.badge;
      if (desc) desc.textContent = service.desc;
      if (subtext) subtext.textContent = service.subtext;
      if (button) {
        button.setAttribute("data-wa-message", service.waMessage);
        button.href = getWhatsAppUrl(service.waMessage);
      }
    });

    const oldPrice = document.getElementById("oldprice-pack");
    if (oldPrice && data.services.pack) oldPrice.textContent = formatCLP(data.services.pack.oldPrice);

    const stampSavings = document.getElementById("stamp-savings");
    if (stampSavings && data.services.pack) stampSavings.textContent = data.services.pack.stampNote;
  }

  /** Reconstruye las opciones del cotizador con los precios del equipo activo. */
  function renderServiceOptions(device) {
    if (!serviceSelect) return;
    const previousValue = serviceSelect.value || "pack";
    const data = CATALOG[device] || CATALOG.notebook;

    const options = [
      { value: "pack", label: `Pack Completo: Limpieza + Formateo (${formatCLP(data.services.pack.price)} CLP)` },
      { value: "formateo", label: `Formateo y Optimización (${formatCLP(data.services.formateo.price)} CLP)` },
      { value: "limpieza", label: `Limpieza Física y Mantención (${formatCLP(data.services.limpieza.price)} CLP)` },
      { value: "web-basica", label: `Página Web Básica (${formatCLP(WEB_SERVICES["web-basica"].price)} CLP)` },
      { value: "web-dominio", label: `Página Web + Dominio .cl (${formatCLP(WEB_SERVICES["web-dominio"].price)} CLP)` },
      { value: "consulta", label: FREE_SERVICES.consulta.label }
    ];

    serviceSelect.replaceChildren(
      ...options.map((option) => {
        const el = document.createElement("option");
        el.value = option.value;
        el.textContent = option.label;
        return el;
      })
    );

    // Restaurar la selección previa si sigue existiendo
    if (options.some((option) => option.value === previousValue)) {
      serviceSelect.value = previousValue;
    }
  }

  /** Activa/desactiva el tipo de equipo según el servicio elegido. */
  function syncDeviceFieldState() {
    if (!deviceSelect || !serviceSelect) return;
    const isWebService = serviceSelect.value in WEB_SERVICES;
    deviceSelect.disabled = isWebService;
    if (deviceHint) deviceHint.classList.toggle("is-hidden", !isWebService);
  }

  function setActiveDeviceTabs(device) {
    if (!tabNotebook || !tabPc) return;
    const isNotebook = device === "notebook";
    tabNotebook.classList.toggle("active", isNotebook);
    tabNotebook.setAttribute("aria-pressed", String(isNotebook));
    tabPc.classList.toggle("active", !isNotebook);
    tabPc.setAttribute("aria-pressed", String(!isNotebook));
  }

  /** Aplica un equipo en tarjetas, selector y cotizador. */
  function updatePriceCards(device) {
    currentSelectedDevice = device;
    setActiveDeviceTabs(device);
    renderPriceCards(device);

    if (deviceSelect && !deviceSelect.disabled && deviceSelect.value !== device) {
      deviceSelect.value = device;
    }

    renderServiceOptions(device);
    syncDeviceFieldState();
    calculateEstimate();
  }

  if (tabNotebook) {
    tabNotebook.addEventListener("click", () => updatePriceCards("notebook"));
  }
  if (tabPc) {
    tabPc.addEventListener("click", () => updatePriceCards("pc"));
  }

  /* -----------------------------------------------------------------------
     6. Cotizador en tiempo real
     --------------------------------------------------------------------- */
  const estimateDisplay = document.getElementById("estimate-price-display");
  const estimateNote = document.getElementById("estimate-note-display");

  function calculateEstimate() {
    if (!serviceSelect || !estimateDisplay) return;

    const serviceVal = serviceSelect.value;
    const deviceVal = deviceSelect ? deviceSelect.value : "notebook";

    // Servicios web: precio fijo, sin recargo por equipo
    if (serviceVal in WEB_SERVICES) {
      const webService = WEB_SERVICES[serviceVal];
      estimateDisplay.textContent = formatCLP(webService.price);
      if (estimateNote) estimateNote.textContent = webService.note;
      return;
    }

    // Consulta sin valor fijo
    if (serviceVal in FREE_SERVICES) {
      estimateDisplay.textContent = "A convenir";
      if (estimateNote) estimateNote.textContent = FREE_SERVICES.consulta.note;
      return;
    }

    // Servicios técnicos: el precio depende del equipo
    const deviceKey = deviceVal === "pc" ? "pc" : "notebook";
    const service = getTechService(deviceKey, serviceVal);

    if (!service) {
      estimateDisplay.textContent = "A convenir";
      if (estimateNote) estimateNote.textContent = "Consulta técnica personalizada";
      return;
    }

    estimateDisplay.textContent = formatCLP(service.price);

    let note = service.note;
    if (deviceVal === "otro") {
      note += " · Valor referencial de notebook, se confirma al revisar el equipo";
    } else if (deviceKey === "pc" && CATALOG.pc.surcharge > 0) {
      note += ` (+ ${formatCLP(CATALOG.pc.surcharge)} CLP recargo por PC de escritorio)`;
    }
    if (estimateNote) estimateNote.textContent = note;
  }

  if (serviceSelect) {
    serviceSelect.addEventListener("change", () => {
      syncDeviceFieldState();
      calculateEstimate();
    });
  }

  if (deviceSelect) {
    deviceSelect.addEventListener("change", () => {
      syncDeviceFieldState();
      calculateEstimate();
      if (deviceSelect.value === "notebook" || deviceSelect.value === "pc") {
        if (deviceSelect.value !== currentSelectedDevice) {
          updatePriceCards(deviceSelect.value);
        }
      }
    });
  }

  // Enlaces "O cotizar en formulario": preseleccionan el servicio
  document.querySelectorAll(".js-select-service").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const targetService = trigger.getAttribute("data-service-val");
      if (targetService && serviceSelect) {
        serviceSelect.value = targetService;
      }
      syncDeviceFieldState();
      calculateEstimate();
    });
  });

  /* -----------------------------------------------------------------------
     7. Envío del formulario a WhatsApp (validación accesible)
     --------------------------------------------------------------------- */
  const quoteForm = document.getElementById("whatsapp-quote-form");
  const nameInput = document.getElementById("form-name");
  const nameError = document.getElementById("form-name-error");

  function showNameError(show) {
    if (!nameInput) return;
    nameInput.setAttribute("aria-invalid", String(show));
    nameInput.classList.toggle("border-dose-accent", show);
    if (nameError) nameError.classList.toggle("is-hidden", !show);
  }

  if (nameInput) {
    nameInput.addEventListener("input", () => {
      if (nameInput.value.trim()) showNameError(false);
    });
  }

  if (quoteForm) {
    quoteForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = nameInput ? nameInput.value.trim() : "";
      if (!name) {
        showNameError(true);
        if (nameInput) nameInput.focus();
        return;
      }
      showNameError(false);

      const isWebService = serviceSelect && serviceSelect.value in WEB_SERVICES;
      const deviceText = isWebService
        ? "No aplica (servicio web)"
        : deviceSelect && deviceSelect.selectedOptions[0]
          ? deviceSelect.selectedOptions[0].text
          : "No especificado";
      const serviceText =
        serviceSelect && serviceSelect.selectedOptions[0]
          ? serviceSelect.selectedOptions[0].text
          : "Consulta General";
      const problemInput = document.getElementById("form-problem");
      const problem = problemInput ? problemInput.value.trim() : "";
      const estimateText = estimateDisplay ? estimateDisplay.textContent : "A convenir";

      const waMessage = `¡Hola Tech Doctor! 👋
Vengo desde su sitio web y me gustaría solicitar una cotización:

👤 *Nombre:* ${name}
💻 *Equipo:* ${deviceText}
🛠️ *Servicio de interés:* ${serviceText}
💰 *Valor estimado en web:* ${estimateText}
📝 *Detalle del problema:* ${problem || "Sin detalles adicionales"}

¿Tienen disponibilidad y cómo podemos coordinar en Concepción? ¡Muchas gracias!`;

      openWhatsApp(waMessage);
    });
  }

  /* -----------------------------------------------------------------------
     8. Elevación sutil del navbar al hacer scroll
     --------------------------------------------------------------------- */
  const navbar = document.getElementById("main-navbar");
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle("shadow-sm", window.scrollY > 15);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* -----------------------------------------------------------------------
     9. Estado inicial
     --------------------------------------------------------------------- */
  renderServiceOptions("notebook");
  syncDeviceFieldState();
  calculateEstimate();
});
