# Auditoría inicial — Tech Doctor

Fecha: 2026-11-20
Repo clonado desde: https://github.com/Cristobal-Sandoval/TechDoctor
Estado: sitio estático (HTML + CSS + JS puro, sin backend ni dependencias en runtime).

> Nota: `https://techdoctor.cl` no resolvió DNS desde este entorno. Verificar dominio/HTTPS antes de usar canonical, sitemap y OG como fuente de verdad.

---

## Estado de implementación (rama `mejoras/auditoria-2026-11`)

Ya aplicado en esta rama: **A1, A2, A4 (parcial: `ContactPoint`, sin CTA de llamadas por decisión del negocio), A5, B1, B4, B5, B6, C1–C6** y **A3** (4 páginas de servicio con schema propio, enlaces internos y sitemap actualizado).

Toda la conversión del sitio apunta a WhatsApp; no hay enlaces `tel:` visibles.

Queda pendiente fuera del código: gestionar el **Google Business Profile** (A4 completa), medir con **PageSpeed Insights / Search Console**, y validar el despliegue con las cabeceras del hosting.

Verificación local: servidor `python3 -m http.server 8080`, sin errores de consola, interactividad del selector/cotizador OK, y Lighthouse **100/100/100** en accesibilidad, buenas prácticas y SEO tanto en `index.html` como en una página de servicio.

---

## Resumen ejecutivo

El proyecto está **muy bien encaminado en rendimiento base y accesibilidad**: no hay CDN en runtime, fuentes autohospedadas, lazy loading, ARIA, skip-link, `prefers-reduced-motion` y datos estructurados. No hay vulnerabilidades evidentes de XSS (el input del formulario solo se codifica en la URL de WhatsApp).

Las mayores oportunidades están en **SEO local / posicionamiento** (una sola URL indexable, H1 sin keywords, ficha de Google Business Profile) y en **corregir inconsistencias de contenido** (precios en FAQ y texto obsoleto de recargo). En performance quedan recortes fáciles: ~156 KB de imágenes sin usar, CSS/JS sin minificar y 3 hojas CSS bloqueantes.

---

## 🔴 Prioridad alta

### A1. Inconsistencia de precios en FAQ (visible + JSON-LD)
- **Evidencia:** `index.html:199` y `index.html:1085` dicen «limpieza $30.000, pack $40.000» sin distinguir equipo.
- **Realidad:** `assets/js/main.js:25-88` → Notebook: limpieza $20.000 / pack $30.000. PC: limpieza $30.000 / pack $40.000.
- **Impacto:** pérdida de confianza, contradicción entre lo que lee el usuario y lo que cotiza el JS, y dato estructurado erróneo para Google.
- **Acción:** reescribir ambas copias (HTML y schema) con ambos equipos, p. ej. «Notebook: formateo $20.000, limpieza $20.000, pack $30.000. PC: formateo $20.000, limpieza $30.000, pack $40.000.»

### A2. Texto obsoleto de recargo (+$5.000) y código muerto
- **Evidencia:** `index.html:878` → `PC de Escritorio / Torre Gamer (+ $5.000 CLP)`; `main.js:29,60` → `surcharge: 0`; `main.js:441-443` → rama que nunca se ejecuta.
- **Impacto:** antes de que corra el JS (o si falla) se muestra un precio falso.
- **Acción:** quitar «(+ $5.000 CLP)» del `<option>` y eliminar `surcharge` y su rama en `calculateEstimate()`.

### A3. Una sola URL indexable (techo de posicionamiento)
- **Evidencia:** todo el contenido vive en `index.html` (SPA por anclas); `servicios.html` es `noindex` + redirect; `sitemap.xml` solo contiene `/`.
- **Impacto:** Google no tiene páginas específicas para «formateo notebook Concepción», «pasta térmica Concepción», «página web para pymes Concepción», etc. Las anclas no crean superficie indexable nueva.
- **Acción:** crear 4–6 páginas reales y útiles con `<title>`/`<h1>`/schema propios y enlaces internos cruzados. Ejemplos:
  - `/servicio-tecnico-notebook-concepcion`
  - `/limpieza-pasta-termica-concepcion`
  - `/formateo-pc-concepcion`
  - `/desarrollo-web-concepcion`
  - `/preguntas-frecuentes` (o FAQ por servicio)
  - Evitar *doorway pages*: cada URL debe tener contenido sustancial y distinto. Actualizar `sitemap.xml` y canonicals por página.

### A4. Google Business Profile (la palanca #1 en SEO local)
- No se arregla en código, pero es crítico: ficha reclamada, categoría **Computer repair service**, NAP idéntico al sitio (teléfono `+569 5662 8609`, Concepción, Biobío), horarios, fotos reales y reseñas.
- **Acción en código relacionada:** mostrar el teléfono como texto y enlace `tel:+56956628609` en header/footer (además del WhatsApp) y añadir `ContactPoint` al JSON-LD de `LocalBusiness`. Hoy el teléfono solo existe en el schema y en `wa.me`. El teléfono está duplicado en `main.js:13`, `index.html` (varios) y `404.html:37` → centralizar o documentar.

### A5. Cabeceras de seguridad y HTTPS (nivel hosting)
- No hay CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` ni reglas de caché.
- **Acción:** añadir `_headers` (Netlify/Cloudflare Pages) o `vercel.json`. Ejemplo:
  ```
  /*
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: geolocation=(), camera=(), microphone=()
    X-Frame-Options: DENY
    Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
    Content-Security-Policy: default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'
  /assets/*
    Cache-Control: public, max-age=31536000, immutable
  ```
- **Ojo con CSP y Schema:** Googlebot exige que los bloques `<script type="application/ld+json">` sean **inline** (Googlebot no descarga JSON-LD referenciado mediante atributo `src`). Se mantienen inline en el HTML para compatibilidad total con Googlebot y Rich Snippets, respaldados en `assets/json/*.json`.
- Redirigir HTTP→HTTPS y `www`→dominio canónico en el hosting. Se configuró `cleanUrls: true` en `vercel.json` y URLs canónicas limpias.

---

## 🟡 Prioridad media

### B1. H1 sin keyword ni ubicación
- **Evidencia:** `index.html:360-362` → «Tu computador como nuevo, rápido.»
- **Impacto:** buen copy emocional, pero el H1 no menciona «servicio técnico», «computadores» ni «Concepción».
- **Acción:** probar «Servicio técnico de computadores en Concepción» como H1 y mover el eslogan al subtítulo, o combinar: «Tu computador como nuevo, rápido. Servicio técnico en Concepción». Validar en Search Console (CTR + impresiones).

### B2. Prueba social / E-E-A-T
- **Evidencia:** no hay reseñas, fotos reales, casos, años de experiencia ni garantía concreta. El sello «Garantizado 100% probado» (`index.html:407-410`) y «garantía real» (`index.html:1187`) son afirmaciones sin detalle.
- **Acción:** testimonios reales con permiso, fotos antes/después, días exactos de garantía y enlace a reseñas de Google.
- **Importante:** **no** añadir `Review`/`AggregateRating` propios dentro de `LocalBusiness`/`Organization`: Google lo considera *self-serving* y puede generar una acción manual. Las reseñas deben vivir en Google Business Profile y mostrarse de forma compliant.

### B3. FAQ schema con expectativa incorrecta
- Google limitó los *rich results* de `FAQPage` a sitios gubernamentales y de salud (2023). Mantener el schema es inofensivo y ayuda a entender el contenido, pero **no contar con estrellas/desplegables en SERP**.
- Priorizar en su lugar: páginas de servicio (A3), datos locales (A4) y contenido visible bien estructurado.

### B4. Performance: recortes fáciles
| Ítem | Evidencia | Acción |
|---|---|---|
| Imágenes sin usar | `assets/logo.jpg` (116 KB), `assets/img/logo-128.jpg` (12 KB), `assets/img/logo-256.jpg` (28 KB) — 0 referencias | Eliminar del repo (~156 KB) |
| CSS bloqueante ×3 | `index.html:41,44,47` (fonts.css, tailwind.css, styles.css) | Unificar/minificar en un único `styles.min.css` |
| CSS/JS sin minificar | `styles.css` 12 KB, `main.js` 24 KB | Minificar (~40–60% de ahorro) |
| Script sin `defer` | `index.html:1250` | Añadir `defer` (o mover a `<head defer>`) |
| Icono táctil pesado | `apple-touch-icon.png` 56 KB | Optimizar PNG/WebP |
| 2 pesos de DM Mono | `fonts.css:25-41` (~32 KB) | Valorar un solo archivo mono o mostrarlo solo donde aporta |
| Sin medición | — | Ejecutar PageSpeed Insights / Lighthouse y revisar CrUX en Search Console |
- Nota positiva: `font-display: swap`, `preload` de Jakarta+Inter, `loading="lazy"`, sprite SVG y cero requests externos ya están bien.

### B5. Servicios.html: redirect mejorable
- **Evidencia:** `servicios.html:6-13` usa `noindex, follow` + meta refresh + `window.location.replace("/#servicios")` (ruta absoluta).
- **Acción:** 301 real del servidor (`_redirects`: `/servicios  /#servicios  301!`) o `vercel.json`. Evita una URL intermedia y funciona igual en subpath.

### B6. Sitemap estático
- **Evidencia:** `sitemap.xml` solo `/` y `lastmod` escrito a mano (`2026-11-19`).
- **Acción:** regenerarlo en el pipeline de deploy (GitHub Action) con todas las páginas nuevas y `lastmod` real. Mantener `robots.txt` apuntando a él (ya correcto).

---

## 🟢 Prioridad baja / detalle

- **C1. Semántica del selector de equipo:** `role="group"` + `aria-pressed` funciona, pero `role="tablist"`/`aria-selected` con un `tabpanel` (o `radiogroup`) sería más preciso para lectores de pantalla.
- **C2. Menú móvil:** no bloquea el scroll del body ni atrapa el foco (`main.js:159-223)`. Escape y clic fuera ya funcionan.
- **C3. Botón flotante:** `fixed bottom-6 right-6` (`index.html:1239`) puede tapar el footer en móvil; añadir padding inferior al body u ocultarlo al llegar al footer.
- **C4. Contrastes a verificar:** placeholders `text-dose-muted/60` (`index.html:865,906`) y `text-dose-paper/60` (`index.html:1159`). Pasar Lighthouse a11y para confirmar.
- **C5. `<details>` sin `name`:** las 7 FAQs pueden abrirse a la vez; añadir `name="faq"` para acordeón exclusivo si se desea.
- **C6. Limpieza cosmética:** `meta keywords` (`index.html:9`) ignorado por Google; comentarios duplicados en `tailwind.css:1-6`; `scroll-smooth` duplicado (clase en `<html>` + `styles.css:60`); `theme-color: #F7F5EE` (`index.html:12`) vs `--color-paper: #FAF8F3` (`styles.css:12`).

---

## Plan sugerido (por lotes)

1. **Lote 1 — Correcciones (1–2 h):** A1, A2, C6, teléfono `tel:` + `ContactPoint`.
2. **Lote 2 — Bloque técnico (2–3 h):** A5 (headers + CSP con JSON-LD externo), B4 (minificar, quitar assets, `defer`), B5, B6.
3. **Lote 3 — Contenido y SEO local (1–2 semanas):** A3 (páginas de servicio), A4 (Google Business Profile), B1 (H1), B2 (prueba social).
4. **Lote 4 — Validación:** Lighthouse/PSI, Search Console, Core Web Vitals, A/B del CTA.

## Qué NO hacer

- No comprar enlaces ni generar páginas geo-duplicadas solo para posicionar.
- No inventar reseñas ni marcar reseñas propias con schema.
- No esperar rich results de FAQ.
- No añadir analytics/trackers sin base legal de consentimiento (hoy no hay ninguno: punto a favor de privacidad).
