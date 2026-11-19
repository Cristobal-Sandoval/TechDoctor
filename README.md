# 🩺 Tech Doctor (@techdoctor.ccp)

Sitio web frontend moderno, ultraligero y de alta conversión para **Tech Doctor**, servicio técnico de computadores (notebooks y PC de escritorio) y desarrollo web en Concepción, Chile.

Desarrollado como una **Single Page Application (SPA)** estática, 100% responsiva y optimizada bajo los principios de diseño de **Hallmark (Tema Dose)** con una paleta sobria y elegante.

---

## 🎨 Identidad Visual y Paleta de Colores
* **80% Fondos y Superficies Claras (Dose):** Papel cálido `#F7F5EE`, tarjetas `#FFFEFC` y divisiones sutiles `#E3E1D8`.
* **15% Tinta y Estructura:** Petróleo carbón profundo `#16302F` para tipografías principales y todos los botones CTA hacia WhatsApp (anti-verde WhatsApp).
* **5% Acento de Marca:** Menta suave `#5BB8A9` para badges y detalles de estado.

---

## 📁 Estructura del Proyecto

```text
tech-doctor/
├── index.html              # Single Page Application (SPA) principal
├── servicios.html          # Redirección automática a index.html#servicios
├── assets/
│   ├── logo.jpg            # Logo oficial de Tech Doctor
│   ├── css/
│   │   └── styles.css      # Sistema de diseño Hallmark Dose y animaciones
│   └── js/
│       └── main.js         # Lógica SPA, ScrollSpy, cotizador interactivo y WhatsApp
├── .gitignore              # Archivos ignorados por Git
└── README.md               # Documentación y guía de despliegue
```

---

## 📱 Número de WhatsApp Configurado

El número de contacto oficial está centralizado en JavaScript:

```javascript
phone: "56956628609", // Tech Doctor Concepción (+56 9 5662 8609)
```

Todos los botones de WhatsApp del sitio, el botón flotante y el formulario de cotización en tiempo real abren directamente una conversación con este número.

---

## 🛠️ Características Principales

- **Arquitectura SPA:** Navegación suave por anclas (`#inicio`, `#servicios`, `#desarrollo-web`, `#cotizador`, `#por-que-nosotros`).
- **ScrollSpy en vivo:** El menú superior resalta automáticamente la sección visible.
- **Cotizador en tiempo real:** Permite elegir equipo y servicio, calculando el total estimado (incluyendo el recargo de PC de escritorio) y preparando el mensaje de WhatsApp preformateado.
- **Sin backend:** Redirección directa hacia WhatsApp (`wa.me`) e Instagram oficial (`@techdoctor.ccp`).
- **SEO & Datos Estructurados:** Etiquetas OpenGraph, Twitter Cards y Schema.org (`LocalBusiness`) con catálogo de precios en CLP.
- **Rendimiento:** 0 dependencias pesadas, HTML5 semántico, Google Fonts preconectadas y CSS optimizado.

---

## 🚀 Despliegue Gratuito (Recomendado)

Al ser un proyecto estático:
1. **GitHub Pages:**
   - Ve a los *Settings* del repositorio en GitHub.
   - En la sección **Pages**, selecciona la rama `main` y la carpeta `/ (root)`.
   - Tu sitio quedará publicado en `https://cristobal-sandoval.github.io/TechDoctor/`.
2. **Vercel / Netlify:**
   - Conecta tu repositorio de GitHub directamente a Vercel o Netlify para despliegues automáticos con cada `git push`.
