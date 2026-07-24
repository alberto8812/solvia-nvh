# SEO — Implementación y paso a paso

Guía completa de lo que ya está implementado en el proyecto, lo que queda pendiente (depende del dominio final) y la estrategia realista para posicionar la landing en Google.

---

## 1. Qué está implementado (y por qué)

### 1.1 Metadatos en `index.html`

| Elemento | Qué hace | Estado |
|---|---|---|
| `<title>` optimizado | Es el texto azul del resultado de Google. Incluye marca + propuesta de valor + keyword ("créditos rápidos"). | ✅ Listo |
| `<meta name="description">` | El texto gris debajo del título en Google. No afecta ranking directamente, pero define si el usuario hace clic o no (CTR). | ✅ Listo |
| `<link rel="canonical">` | Le dice a Google cuál es la URL "oficial" de la página. Evita contenido duplicado (www vs no-www, http vs https). | ⚠️ Placeholder `TUDOMINIO.com` |
| `<meta name="robots" content="index, follow">` | Autoriza explícitamente a Google a indexar la página y seguir sus enlaces. | ✅ Listo |
| `<meta name="theme-color">` | Colorea la barra del navegador móvil con el azul de marca (`#0B3F7C`). No es SEO puro, pero mejora la percepción de calidad. | ✅ Listo |
| Open Graph (`og:*`) | Controla cómo se ve el link cuando se comparte por **WhatsApp**, Facebook o LinkedIn: título, descripción e imagen. Para Fondi (cuyo canal principal es WhatsApp) es crítico. | ⚠️ Placeholder de dominio + imagen provisoria |
| Twitter Cards | Lo mismo pero para X/Twitter. | ⚠️ Placeholder |
| JSON-LD `FinancialService` | Datos estructurados que le dicen a Google exactamente QUÉ es Fondi: servicio financiero, teléfono, email, idioma, zona de servicio (EE.UU.). Habilita resultados enriquecidos (knowledge panel, teléfono clicable en resultados). | ⚠️ Placeholder de dominio |
| `lang="es"` | Antes decía `es-AR` (español de Argentina), pero el público objetivo es hispanohablante en EE.UU. (teléfono +1, email `.us`). Se cambió a `es` genérico. | ✅ Listo |

**Nota sobre `<meta name="keywords">`**: NO se agregó a propósito. Google la ignora desde 2009 — solo agrega ruido.

### 1.2 Archivos en `public/`

- **`robots.txt`** — Le dice a los crawlers que pueden indexar todo y dónde está el sitemap.
- **`sitemap.xml`** — Lista de URLs del sitio (por ahora una sola: la home). Google lo usa para descubrir e indexar más rápido.

Ambos tienen el placeholder `TUDOMINIO.com`.

---

## 2. Pendientes cuando tengas el dominio

### Paso 1 — Reemplazar el placeholder

Buscar y reemplazar `TUDOMINIO.com` por el dominio real en estos 3 archivos:

```bash
# desde la raíz del proyecto (reemplaza fondi.us por tu dominio real)
grep -rl "TUDOMINIO.com" index.html public/ | xargs sed -i '' 's/TUDOMINIO\.com/fondi.us/g'
```

Archivos afectados:
1. `index.html` — canonical, og:url, og:image, twitter:image, JSON-LD (url, logo, image)
2. `public/robots.txt` — URL del sitemap
3. `public/sitemap.xml` — URL de la home

> Dato: el email de contacto ya es `info@fondi.us` — si el dominio final es `fondi.us`, todo queda consistente.

### Paso 2 — Crear la imagen Open Graph (og-image)

Hoy el `og:image` apunta provisoriamente a `/images/logo-icon.png`. Eso funciona, pero se ve pobre al compartir. Lo correcto:

1. Crear una imagen **1200 × 630 px** en PNG o JPG con: logo de Fondi, fondo azul de marca, y el mensaje principal ("Créditos en menos de 24 horas").
2. Guardarla como `public/og-image.png`.
3. Actualizar en `index.html` las dos referencias de imagen:
   ```html
   <meta property="og:image" content="https://fondi.us/og-image.png" />
   <meta name="twitter:image" content="https://fondi.us/og-image.png" />
   ```
   Y el campo `"image"` del JSON-LD.
4. Verificar cómo se ve con estas herramientas:
   - WhatsApp: mandarse el link a uno mismo
   - Facebook: https://developers.facebook.com/tools/debug/
   - LinkedIn: https://www.linkedin.com/post-inspector/

**Importante**: WhatsApp cachea la imagen. Si la cambiás, usá el debugger de Facebook con "Scrape Again" para refrescar el caché.

### Paso 3 — Google Search Console (OBLIGATORIO)

Sin esto estás ciego: no sabés si Google te indexó ni con qué búsquedas te encuentran.

1. Ir a https://search.google.com/search-console
2. Agregar propiedad → **Dominio** (cubre www, no-www, http, https de una vez)
3. Google te da un registro **TXT** para verificar la propiedad:
   - En GoDaddy: My Products → DNS → Add Record → Type `TXT`, Name `@`, Value el código que te dio Google
   - Esperar 5–30 min y verificar en Search Console
4. Una vez verificado: **Sitemaps → Agregar sitemap** → `https://fondi.us/sitemap.xml`
5. **Inspección de URLs** → pegar la URL de la home → "Solicitar indexación" (acelera la primera aparición en Google de días a horas)

### Paso 4 — Verificación post-deploy

Checklist después de publicar con el dominio real:

- [ ] `https://fondi.us/robots.txt` responde
- [ ] `https://fondi.us/sitemap.xml` responde
- [ ] `www.fondi.us` redirige a `fondi.us` (o al revés — pero UNA sola versión canónica; en CloudFront se configura con una Function de redirect o alias)
- [ ] `http://` redirige a `https://` (CloudFront: Viewer Protocol Policy = "Redirect HTTP to HTTPS")
- [ ] Rich Results Test pasa: https://search.google.com/test/rich-results
- [ ] PageSpeed Insights ≥ 90 en móvil: https://pagespeed.web.dev/

---

## 3. Performance (Core Web Vitals — SÍ afecta ranking)

Google usa la experiencia de página como factor de ranking. Estado actual y mejoras recomendadas, en orden de impacto:

### 3.1 Video de fondo del hero (impacto ALTO)

`hero-bg.mp4` carga inmediatamente en la sección más importante. Recomendaciones:

- Comprimir el video (H.264, sin audio, ≤ 1–2 MB si es posible):
  ```bash
  ffmpeg -i hero-bg.mp4 -an -vcodec libx264 -crf 28 -preset slow -movflags +faststart hero-bg-optimized.mp4
  ```
- Agregar `preload="metadata"` y un `poster` (imagen estática del primer frame) al `<video>` para que el LCP sea la imagen, no el video.

### 3.2 Fuentes de Google (impacto MEDIO)

El `<link rel="stylesheet">` de Google Fonts es render-blocking y requiere 2 conexiones extra. La mejora: **self-hostear las fuentes** con [Fontsource](https://fontsource.org/):

```bash
npm install @fontsource-variable/inter @fontsource/jetbrains-mono @fontsource-variable/source-serif-4
```

Luego importarlas en `src/main.tsx` y borrar los 3 `<link>` de fonts del `index.html`. Beneficios: sin conexiones externas, las fuentes viajan por el mismo CDN (CloudFront), y cumplís mejor con privacidad (GDPR no aplica en EE.UU., pero igual es buena práctica).

### 3.3 Imágenes

- Toda `<img>` debe tener `alt` descriptivo (Google Imágenes + accesibilidad).
- `loading="lazy"` en imágenes debajo del fold (testimonios, videos).
- `width` y `height` explícitos para evitar layout shift (CLS).

---

## 4. La parte que el código NO resuelve (estrategia)

Los metadatos son el requisito de entrada, no la ventaja competitiva. Para keywords competitivas ("créditos rápidos", "préstamos personales") compiten bancos y fintechs con años de autoridad de dominio. La estrategia realista:

1. **Búsquedas de marca primero**: con lo implementado + Search Console, quien busque "Fondi créditos" te va a encontrar bien presentado. Eso es lo alcanzable en semanas.
2. **Keywords long-tail**: "crédito solo con pasaporte", "préstamo sin fiador para migrantes" — menos volumen, mucho menos competencia, y describe EXACTAMENTE tu diferencial. Considerar contenido futuro (blog/FAQ) apuntando ahí.
3. **Google Ads**: para keywords transaccionales competitivas, es la única vía de aparecer arriba a corto plazo. SEO orgánico en este nicho toma 6–12 meses mínimo.
4. **Backlinks**: directorios de negocios hispanos en EE.UU., prensa local, partnerships. La autoridad de dominio se construye con enlaces entrantes de calidad.
5. **Sección FAQ en la landing** (recomendado como próximo paso): preguntas reales ("¿Puedo pedir un crédito solo con pasaporte?", "¿Cuánto tarda el desembolso?") con schema `FAQPage`. Doble beneficio: contenido indexable con long-tail keywords + posibilidad de rich snippet en Google.

### Nota arquitectónica: CSR y SEO

La app es una SPA de React (client-side rendering): el HTML llega casi vacío y JavaScript pinta el contenido. Implicaciones:

- **Googlebot** renderiza JavaScript — indexa el contenido completo sin problema.
- **WhatsApp/Facebook/Twitter** NO ejecutan JS — pero leen los metadatos estáticos del `index.html`, que es exactamente lo que implementamos. Cubierto.
- Si a futuro el sitio crece a múltiples páginas/rutas con contenido indexable, ahí sí conviene evaluar prerendering (vite-plugin-ssr / Astro / Next). Para una landing de una página, NO hace falta.

---

## 5. Resumen de archivos tocados

| Archivo | Cambio |
|---|---|
| `index.html` | Metadatos completos: canonical, robots, theme-color, Open Graph, Twitter Cards, JSON-LD FinancialService. `lang` corregido de `es-AR` a `es`. |
| `public/robots.txt` | Nuevo — permite indexación y apunta al sitemap. |
| `public/sitemap.xml` | Nuevo — sitemap con la home. |
| `docs/seo-implementacion.md` | Este documento. |

**Placeholders pendientes**: buscar `TODO` y `TUDOMINIO.com` en el repo cuando tengas el dominio final.
