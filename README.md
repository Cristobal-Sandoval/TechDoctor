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
├── index.html                          # SPA principal (HTML5 semántico y datos externos)
├── 404.html                            # Página de error 404 personalizada
├── servicios.html                      # Redirección a index.html#servicios (fallback)
├── servicio-tecnico-notebook-concepcion.html
├── formateo-pc-concepcion.html
├── limpieza-pasta-termica-concepcion.html
├── desarrollo-web-concepcion.html      # Páginas de servicio con contenido y schema propios
├── robots.txt                          # Directivas de rastreo para buscadores
├── sitemap.xml                         # Mapa del sitio (página principal + guías)
├── _headers / vercel.json              # Cabeceras de seguridad y caché
├── _redirects / vercel.json            # Redirección 301 de /servicios
├── serve.json                          # Clean URLs para el servidor local (npm run dev)
├── scripts/sync-jsonld.mjs             # Sincroniza assets/json con el JSON-LD inline
├── assets/
│   ├── css/
│   │   ├── main.css                    # Entrada de compilación (@import)
│   │   ├── main.min.css                # CSS final (fuentes + utilidades + tokens)
│   │   ├── fonts.css                   # @font-face locales
│   │   ├── tailwind.css                # Utilidades generadas
│   │   ├── utilities-extra.css         # Utilidades faltantes en la compilación original
│   │   └── styles.css                  # Variables de diseño, controles y animaciones
│   ├── fonts/                          # WOFF2 locales (Inter, Jakarta, DM Mono)
│   ├── img/                            # Favicons, iconos táctiles y OpenGraph
│   ├── js/
│   │   ├── main.js                     # Fuente: catálogo, ScrollSpy, cotizador, WhatsApp
│   │   └── main.min.js                 # JS final minificado
│   └── json/                           # Copia de referencia del JSON-LD inline
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

### Regenerar CSS/JS compilados

Después de editar `assets/css/*.css` (excepto `main.min.css`) o `assets/js/main.js`:

```bash
# Compilar todo en un solo comando:
npm run build

# O individualmente:
npm run build:css
npm run build:js
```

Los datos estructurados Schema.org (`LocalBusiness`, `FAQPage`, `Service`, `BreadcrumbList`) están embebidos inline en cada HTML. Eso es lo correcto: un `<script type="application/ld+json">` es un *data block* y el estándar HTML no permite usar `src` en él; Google lee el markup directamente de la página. Como los data blocks no se ejecutan, el CSP `script-src 'self'` no los bloquea.

Los archivos en `assets/json/*.json` son una copia de referencia generada desde el HTML, no se cargan en tiempo de ejecución. Para mantenerlos sincronizados:

```bash
npm run sync:schema    # regenera assets/json desde el JSON-LD inline
npm run check:schema   # falla si hay diferencias
```

`npm run build` ejecuta `check:schema` antes de compilar, así que evita publicar un schema de referencia desactualizado.

### Servidor local

```bash
npm install
npm run dev
# http://localhost:8080
```

`serve.json` activa las clean URLs (`/formateo-pc-concepcion` en vez de `/formateo-pc-concepcion.html`). `serve` no aplica `_headers`; para probar el CSP real hay que usar el hosting o un servidor que envíe esas cabeceras.

### Cabeceras, Clean URLs y redirecciones

`_headers` y `_redirects` cubren Netlify/Cloudflare Pages; `vercel.json` cubre Vercel (con `cleanUrls: true`). Incluyen CSP, HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, caché de larga duración para `/assets/*` y el 301 de `/servicios` a `/#servicios`.

El proyecto es 100% estático (HTML, CSS y JS puro) y puede desplegarse en cualquier servicio de hosting estático:

1. **Vercel / Netlify / Cloudflare Pages (Recomendado):** Conectar el repositorio de GitHub para despliegues automáticos en la raíz del dominio.
2. **GitHub Pages:** Habilitar desde *Settings > Pages* seleccionando la rama `main` y la carpeta `/ (root)`. Ojo: GitHub Pages no soporta clean URLs ni `_headers`; los enlaces sin `.html` darían 404 y no se aplicarían CSP/HSTS. Para ese hosting habría que volver a enlaces `.html` o usar un proveedor con clean URLs.
