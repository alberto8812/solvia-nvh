# Protección anti-bots (Vercel + Turnstile)

## Qué resuelve

El sitio es una SPA estática (Vite + React 19 + React Router) desplegada en Vercel, **sin backend**. Se identificaron dos vectores de riesgo:

1. **Scraping/crawlers agresivos** — consumo de bandwidth, clonado de contenido. No hay ningún formulario que explotar porque no hay backend.
2. **Spam en el flujo de chat/WhatsApp** — bots que automatizan el `FloatingChatWidget` (precalificación de 5 preguntas en `src/data/contact.json`) y disparan el link final de `wa.me` masivamente.

Se resolvió con dos capas independientes: **Vercel Bot Protection** (dashboard, sin código) para el vector de scraping, y **Cloudflare Turnstile client-side** para gatear el botón final del chat.

## Decisión clave: Turnstile solo client-side

Turnstile funciona en dos partes: un widget que el usuario resuelve en el browser, y una verificación server-side del token que devuelve (contra la API de Cloudflare) antes de confiar en que el challenge se resolvió de verdad. **Este proyecto no tiene backend**, así que se decidió implementar solo la parte client-side.

Esto significa:
- ✅ Frena bots simples y headless browsers que no ejecutan JavaScript o no resuelven el challenge.
- ❌ **No es criptográficamente infalible.** Un bot que ya conozca la URL de `wa.me` construida (`https://wa.me/<numero>?text=...`) puede llamarla directo, sin pasar por el widget. La protección real requeriría un endpoint (Vercel Function) que verifique el token contra Cloudflare antes de considerar el flujo válido.

Se aceptó este trade-off explícitamente para no introducir el primer endpoint serverless al proyecto. Si el volumen de spam sigue siendo un problema, el siguiente paso natural es agregar `/api/verify-turnstile` como Vercel Function (gratis en el plan actual).

## Parte 1 — Vercel Bot Protection

Configuración manual, no versionable (vive en el dashboard, no en el repo):

1. Vercel Dashboard → proyecto `fondi-landing` → **Firewall**.
2. Activar **Bot Filtering / Managed Rules** (requiere plan Pro) — bloquea scrapers y headless browsers conocidos a nivel edge, antes de que la request llegue a la app.
3. Activar **Attack Challenge Mode** (disponible incluso en Hobby) — capa adicional automática ante picos de tráfico sospechoso.

## Parte 2 — Turnstile en el chat widget

### Archivos tocados

| Archivo | Cambio |
|---|---|
| `index.html` | Script `https://challenges.cloudflare.com/turnstile/v0/api.js` (`async defer`) |
| `src/types/turnstile.d.ts` | Tipo ambiental para `window.turnstile` (no hay wrapper de React instalado) |
| `src/components/floating-chat-widget.tsx` | Estado `turnstileToken`, efecto de render/reset, gateo del botón |
| `.gitignore` | Agregado `.env` / `.env.local` |
| `.env.example` *(pendiente, creado manualmente)* | `VITE_TURNSTILE_SITE_KEY=` |

### Cómo funciona

1. **Estado**: `ChatState` suma `turnstileToken: string | null` (arranca en `null`).

2. **Render del widget**: un `useEffect` con dependencias `[chat.open, chat.done]` se dispara cuando el usuario llega a la pantalla de revisión (todas las preguntas respondidas). Ahí:
   - Resetea `turnstileToken` a `null` (por si el usuario ya había resuelto un challenge en un intento anterior).
   - Si `window.turnstile` ya cargó, renderiza el widget con `window.turnstile.render(container, { sitekey, callback, 'expired-callback' })`.
   - Si el script todavía no cargó (es `async`), hace polling cada 150ms hasta que esté disponible.
   - El `callback` de Turnstile guarda el token resuelto en `chat.turnstileToken`; el `expired-callback` lo vuelve a `null` si el challenge vence.
   - En el cleanup del efecto, se hace `window.turnstile.remove(widgetId)` para no dejar widgets huérfanos si el usuario cierra el chat.

3. **Gateo del botón**: el botón "Enviar por WhatsApp" pasa de:
   ```tsx
   <Button href={waHref} target="_blank" rel="noopener noreferrer">
   ```
   a:
   ```tsx
   <Button
     href={chat.turnstileToken ? waHref : undefined}
     target={chat.turnstileToken ? '_blank' : undefined}
     rel={chat.turnstileToken ? 'noopener noreferrer' : undefined}
     className={chat.turnstileToken ? '...' : '... opacity-50 pointer-events-none'}
   >
   ```
   Sin `href`, el componente `Button` (`src/components/ui/button.tsx`) renderiza un `<button>` sin `onClick` — es decir, un botón inerte, no solo "visualmente deshabilitado". Con `href`, vuelve a ser el link normal a WhatsApp.

4. **Sin site key configurada**: si `VITE_TURNSTILE_SITE_KEY` no está seteada, `renderWidget()` corta temprano y el widget nunca se renderiza — el botón queda deshabilitado para siempre. Esto es intencional (fail-closed), pero significa que **el flujo de WhatsApp no funciona en ningún ambiente hasta que se configure la env var**.

## Pasos pendientes (a cargo del usuario)

### 1. Crear `.env.example`

En la raíz del proyecto, archivo `.env.example` (se versiona en git, a diferencia de `.env`):
```
VITE_TURNSTILE_SITE_KEY=
```
Bloqueado por permisos de escritura sobre archivos `.env*` durante la implementación — se creó manualmente.

### 2. Crear el widget en Cloudflare Turnstile

1. [dash.cloudflare.com](https://dash.cloudflare.com/) → **Quick search** (`Cmd+K`) → escribir `Turnstile` (no está listado directo en el sidebar del dashboard nuevo; también se puede llegar expandiendo **Application security**).
2. **Turnstile widgets** → **Add widget manually**.
3. Completar:
   - **Widget name**: cualquiera descriptivo, ej. `fondi-landing-chat`.
   - **Domain / Hostname**: dominio de producción. Agregar también `localhost` si se quiere probar en `pnpm dev`.
   - **Widget Mode**: **Managed** (recomendado por Cloudflare — deja que decida el método de verificación según el riesgo del tráfico).
4. **Create**. Cloudflare muestra dos claves:
   - **Site Key** (pública, ej. `0x4AAAAAAA...`) — es la que va en `VITE_TURNSTILE_SITE_KEY`.
   - **Secret Key** (privada) — **no se usa** en esta implementación (no hay verificación server-side) y **no debe compartirse ni versionarse**. Se guarda solo por si en el futuro se agrega el endpoint de verificación.

### 3. Cargar el Site Key

**Vercel** (producción): Project → **Settings** → **Environment Variables** → nombre `VITE_TURNSTILE_SITE_KEY`, valor el Site Key, marcar **Production** (y **Preview** si se quiere probar ahí). Requiere un **redeploy** para tomar la variable si ya había un deploy corriendo.

**Local**: crear `.env` en la raíz (ya está en `.gitignore`) con:
```
VITE_TURNSTILE_SITE_KEY=tu_site_key_real
```
Vite no relee `.env` en caliente — reiniciar `pnpm dev` después de crearlo/editarlo.

### 4. Activar Bot Protection en Vercel

Ver "Parte 1" arriba — paso manual en el dashboard de Vercel, no versionable.

## Verificación

Se probó el flujo completo con Playwright headless (sin `chromium-cli` disponible en este entorno, se usó Playwright directo vía un proyecto npm de scratch):

- Completar las 5 preguntas del chat → llegar a la pantalla de revisión.
- Sin site key configurada: el botón "Enviar por WhatsApp" renderiza atenuado (`opacity-50 pointer-events-none`) y sin `href`.
- Cero errores de consola.

Para verificar con una site key real:
1. `pnpm dev` con `VITE_TURNSTILE_SITE_KEY` seteada en `.env`.
2. Abrir el chat, completar las preguntas, llegar a la pantalla de revisión.
3. Confirmar que el botón se habilita con el link correcto a `wa.me` y que el flujo abre WhatsApp con el mensaje precargado.
4. Cerrar y reabrir el chat (con las respuestas ya completadas) y confirmar que pide un challenge nuevo cada vez (`turnstileToken` vuelve a `null`).

**Importante — puede no verse ningún checkbox.** En modo **Managed**, Cloudflare decide en base al riesgo del tráfico si muestra un challenge visible, un spinner, o resuelve todo en silencio ("non-interactive"/"invisible"). Probando desde un browser real (no headless, con historial normal), lo más común es que se resuelva sin mostrar nada y el botón se habilite solo — **eso es el comportamiento correcto**, no un bug. Se confirmó diagnosticando dos casos:
- Sin site key: el botón queda permanentemente deshabilitado (sin `href`).
- Con site key real: el botón se habilita (con `href` correcto) sin intervención visible del usuario.
La diferencia entre ambos casos prueba que el flujo está conectado — si hubiera un bug de "siempre habilitado" no habría diferencia entre los dos escenarios.

Para forzar ver el checkbox visualmente: probar en una ventana de incógnito/perfil nuevo (menos señales de confianza acumuladas), o revisar la pestaña **Network** del DevTools durante el flujo — deberían verse requests a `challenges.cloudflare.com` aunque no se muestre nada en pantalla.

## Fuera de alcance (por ahora)

- Verificación server-side del token de Turnstile (requeriría una Vercel Function — ver "Decisión clave" arriba).
- `robots.txt` / meta noindex para crawlers bien portados (no ataca el problema de bots maliciosos, pero es un complemento gratuito si hace falta).
- Rate limiting a nivel edge con Vercel Middleware + KV/Upstash (evaluado, descartado por ahora por requerir infraestructura adicional).
