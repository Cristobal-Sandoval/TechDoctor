# 🩺 Tech Doctor (@techdoctor.ccp)

Sitio web frontend estático, ultraligero y de alta conversión para **Tech Doctor**, servicio técnico de computadores (notebooks y PC de escritorio) y desarrollo web en Concepción, Chile.

Arquitectura **Single Page Application (SPA)** estática, 100% responsiva, sin backend y con rendimiento optimizado (cero dependencias de CDN en runtime).

---

## 🎨 Identidad Visual y Paleta de Colores

Inspirada en el sistema editorial y minimalista de **Hallmark (Tema Dose)**:

- **80% Fondos y Superficies Claras:** Papel cálido `#F7F5EE`, tarjetas `#FFFEFC` y divisiones sutiles `#E3E1D8`.
- **15% Tinta y Estructura:** Petróleo carbón profundo `#16302F` para tipografías principales y botones de acción (anti-verde WhatsApp).
- **5% Acento de Marca:** Menta suave `#5BB8A9` para badges y estados.

---

## 📁 Estructura del Proyecto

```text
tech-doctor/
├── index.html                # SPA principal (HTML5 semántico, Schema.org y FAQ)
├── 404.html                  # Página de error 404 personalizada
├── servicios.html            # Redirección amigable a index.html#servicios
├── robots.txt                # Directivas de rastreo para buscadores
├── sitemap.xml               # Mapa del sitio para indexación
├── assets/
│   ├── logo.jpg              # Logo original de alta resolución
│   ├── css/
│   │   ├── tailwind.css      # Utilidades CSS precompiladas (estático)
│   │   ├── fonts.css         # Declaraciones @font-face locales
│   │   └── styles.css        # Variables de diseño, controles y animaciones
│   ├── fonts/                # Tipografías WOFF2 locales (Inter, Jakarta, DM Mono)
│   ├── img/                  # Favicons, iconos táctiles y OpenGraph preview
│   └── js/
│       └── main.js           # Catálogo de servicios, ScrollSpy, cotizador y WhatsApp
└── README.md
```

---

## ⚙️ Configuración de Contacto

Los canales de contacto se gestionan de forma centralizada en `assets/js/main.js`:

```javascript
const TECH_DOCTOR_CONFIG = {
  phone: "569XXXXXXXX", // Número de WhatsApp oficial (código de país + número)
  instagramUrl: "https://www.instagram.com/techdoctor.ccp/",
  city: "Concepción, Chile"
};
```

Todos los botones de WhatsApp del sitio, el botón flotante y el formulario de cotización en tiempo real se vinculan automáticamente a esta configuración.

---

## 🛠️ Características Principales

- **Navegación Fluida (SPA):** Scroll suave mediante anclas (`#inicio`, `#servicios`, `#desarrollo-web`, `#cotizador`, `#por-que-nosotros`, `#preguntas-frecuentes`).
- **ScrollSpy Activo:** Detección de sección visible en el navbar con `IntersectionObserver`.
- **Selector de Equipo Dinámico:** Permite alternar entre precios y detalles para **Notebook** y **PC de Escritorio**.
- **Cotizador en Tiempo Real:** Calcula el presupuesto estimado y genera el mensaje de WhatsApp preformateado listo para enviar.
- **Catálogo Centralizado (`CATALOG`):** Fuente única de verdad en JavaScript para sincronizar precios y notas en todo el sitio.
- **Rendimiento sin CDN:** Tipografías autohospedadas y CSS precompilado para carga instantánea en móviles.
- **SEO & Datos Estructurados:** Metaetiquetas OpenGraph, Twitter Cards y Schema.org JSON-LD (`LocalBusiness` y `FAQPage`).
- **Accesibilidad (a11y):** Soporte de navegación por teclado, enlace de salto `.skip-link`, etiquetas ARIA y contrastes calibrados.

---

## 🚀 Despliegue

El proyecto es 100% estático (HTML, CSS y JS puro) y puede desplegarse en cualquier servicio de hosting estático:

1. **Vercel / Netlify / Cloudflare Pages (Recomendado):** Conectar el repositorio de GitHub para despliegues automáticos en la raíz del dominio.
2. **GitHub Pages:** Habilitar desde *Settings > Pages* seleccionando la rama `main` y la carpeta `/ (root)`.
