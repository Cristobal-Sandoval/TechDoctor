/**
 * Tech Doctor (@techdoctor.ccp) - Script Principal Frontend (SPA Edition)
 * Servicio técnico de computadores y desarrollo web en Concepción, Chile.
 * 
 * =========================================================================
 * ⚙️ CONFIGURACIÓN DE CONTACTO:
 * Reemplaza '569XXXXXXXX' por tu número de WhatsApp real con código de país.
 * Ejemplo para Chile: '56912345678'
 * =========================================================================
 */

const TECH_DOCTOR_CONFIG = {
  // LÍNEA 14: Reemplaza aquí tu número de WhatsApp real (ej: '56912345678')
  phone: "569XXXXXXXX",
  
  instagramUrl: "https://www.instagram.com/techdoctor.ccp/",
  instagramHandle: "@techdoctor.ccp",
  city: "Concepción, Chile"
};

/**
 * Genera un enlace directo a WhatsApp con texto codificado
 * @param {string} message - Mensaje prellenado
 * @returns {string} URL formateada para wa.me
 */
function getWhatsAppUrl(message) {
  const cleanPhone = TECH_DOCTOR_CONFIG.phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Actualizar año en el Footer
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Control del Menú Móvil (Hamburguesa)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  const closeMobileMenu = () => {
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
      if (menuIconOpen && menuIconClose) {
        menuIconOpen.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
      }
    }
  };

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
      
      if (menuIconOpen && menuIconClose) {
        menuIconOpen.classList.toggle('hidden');
        menuIconClose.classList.toggle('hidden');
      }
    });

    // Cerrar menú al hacer clic en cualquier enlace interno
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }

  // 3. Vincular enlaces dinámicos a WhatsApp con clase .js-wa-link
  const waLinks = document.querySelectorAll('.js-wa-link');
  waLinks.forEach(link => {
    const customMessage = link.getAttribute('data-wa-message') || '¡Hola Tech Doctor! Vi su página web y me gustaría hacer una consulta.';
    link.href = getWhatsAppUrl(customMessage);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  // 4. Botón flotante de WhatsApp
  const floatingWaBtn = document.getElementById('floating-whatsapp-btn');
  if (floatingWaBtn) {
    const floatMessage = floatingWaBtn.getAttribute('data-wa-message') || '¡Hola Tech Doctor! 👋 Vi su página web y quisiera consultar por sus servicios en Concepción.';
    floatingWaBtn.href = getWhatsAppUrl(floatMessage);
    floatingWaBtn.target = '_blank';
    floatingWaBtn.rel = 'noopener noreferrer';
  }

  // 5. ScrollSpy para el Navbar SPA con IntersectionObserver
  const sections = document.querySelectorAll('section[id], header[id="inicio"]');
  const navLinks = document.querySelectorAll('.spa-nav-link');

  if ('IntersectionObserver' in window && sections.length > 0 && navLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    };

    const activeClasses = ['bg-dose-paper-2', 'border-dose-rule', 'text-dose-ink', 'font-semibold'];
    const inactiveClasses = ['text-dose-muted', 'hover:text-dose-ink', 'hover:bg-dose-paper-2', 'font-medium'];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.remove(...inactiveClasses);
              link.classList.add(...activeClasses);
            } else if (href && href.startsWith('#')) {
              link.classList.remove(...activeClasses);
              link.classList.add(...inactiveClasses);
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  // 6. Calculadora Dinámica y Formulario de Cotización a WhatsApp
  const quoteForm = document.getElementById('whatsapp-quote-form');
  const deviceSelect = document.getElementById('form-device');
  const serviceSelect = document.getElementById('form-service');
  const estimateDisplay = document.getElementById('estimate-price-display');
  const estimateNote = document.getElementById('estimate-note-display');

  const calculateEstimate = () => {
    if (!serviceSelect || !estimateDisplay) return;

    const serviceVal = serviceSelect.value;
    const deviceVal = deviceSelect ? deviceSelect.value : 'notebook';
    let basePrice = 0;
    let isTechService = false;
    let note = '';

    switch (serviceVal) {
      case 'pack':
        basePrice = 30000;
        isTechService = true;
        note = 'Incluye limpieza física profunda + formateo optimizado';
        break;
      case 'formateo':
        basePrice = 20000;
        isTechService = true;
        note = 'Instalación limpia, drivers y respaldo de datos';
        break;
      case 'limpieza':
        basePrice = 20000;
        isTechService = true;
        note = 'Desensamble, limpieza de turbinas y nueva pasta térmica';
        break;
      case 'web-basica':
        basePrice = 60000;
        isTechService = false;
        note = 'Landing page frontend hasta 2 páginas + botón WhatsApp';
        break;
      case 'web-dominio':
        basePrice = 70000;
        isTechService = false;
        note = 'Página web + registro de dominio oficial .cl en NIC Chile';
        break;
      default:
        basePrice = 0;
        note = 'Diagnóstico o consulta especial a coordinar';
        break;
    }

    // Recargo de $5.000 para PC de escritorio en servicios técnicos
    let surcharge = 0;
    if (isTechService && deviceVal === 'pc') {
      surcharge = 5000;
      note += ' (+ $5.000 CLP recargo por PC de escritorio)';
    }

    if (basePrice > 0) {
      const total = basePrice + surcharge;
      estimateDisplay.textContent = `$${total.toLocaleString('es-CL')} CLP`;
      if (estimateNote) estimateNote.textContent = note;
    } else {
      estimateDisplay.textContent = 'A convenir';
      if (estimateNote) estimateNote.textContent = note || 'Consulta técnica personalizada';
    }
  };

  if (serviceSelect) {
    serviceSelect.addEventListener('change', calculateEstimate);
  }
  if (deviceSelect) {
    deviceSelect.addEventListener('change', calculateEstimate);
  }
  // Ejecutar cálculo inicial
  calculateEstimate();

  // Enlaces de tarjetas que apuntan al formulario con parámetro preseleccionado
  const formTriggerLinks = document.querySelectorAll('.js-select-service');
  formTriggerLinks.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const targetService = trigger.getAttribute('data-service-val');
      if (targetService && serviceSelect) {
        serviceSelect.value = targetService;
        calculateEstimate();
      }
    });
  });

  // Envío del Formulario Rápido a WhatsApp
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const name = nameInput ? nameInput.value.trim() : '';
      const deviceText = deviceSelect && deviceSelect.selectedOptions[0] ? deviceSelect.selectedOptions[0].text : 'No especificado';
      const serviceText = serviceSelect && serviceSelect.selectedOptions[0] ? serviceSelect.selectedOptions[0].text : 'Consulta General';
      const problemInput = document.getElementById('form-problem');
      const problem = problemInput ? problemInput.value.trim() : 'Sin detalles adicionales';
      const estimateText = estimateDisplay ? estimateDisplay.textContent : 'A convenir';

      if (!name) {
        alert('Por favor, ingresa tu nombre para que Tech Doctor pueda atenderte de forma personalizada.');
        if (nameInput) nameInput.focus();
        return;
      }

      // Estructura limpia y amigable para el mensaje de WhatsApp
      const waMessage = 
`¡Hola Tech Doctor! 👋
Vengo desde su sitio web y me gustaría solicitar una cotización:

👤 *Nombre:* ${name}
💻 *Equipo:* ${deviceText}
🛠️ *Servicio de interés:* ${serviceText}
💰 *Valor estimado en web:* ${estimateText}
📝 *Detalle del problema:* ${problem}

¿Tienen disponibilidad y cómo podemos coordinar en Concepción? ¡Muchas gracias!`;

      // Abrir en nueva pestaña
      const url = getWhatsAppUrl(waMessage);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // 7. Elevación sutil del Navbar al hacer scroll
  const navbar = document.getElementById('main-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 15) {
        navbar.classList.add('shadow-sm');
      } else {
        navbar.classList.remove('shadow-sm');
      }
    }, { passive: true });
  }
});
