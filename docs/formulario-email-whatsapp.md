# Formulario de contacto → Email (Lambda + SES) + WhatsApp

## Qué resuelve

El formulario de contacto actual (`src/components/sections/contact-section.tsx`) tiene campos de nombre, teléfono y "cuánto necesitás", pero el `handleSubmit` es cosmético — no manda los datos a ningún lado. A futuro se va a agregar también **tipo de documento**.

Se necesita que al enviar el formulario:
1. Llegue un email con los datos completados.
2. Se redirija al usuario a WhatsApp para continuar la conversación (el número `19804068356` ya existe en `src/data/contact.json` y se reutiliza, no hace falta duplicarlo en variables de entorno).

Se investigaron alternativas sin backend propio (EmailJS, Formspree), pero se descartaron: como los datos incluyen información de identidad/financiera (monto a prestar, tipo de documento), en ambos casos los datos pasarían por la infraestructura de un tercero antes de llegar al destino. Se opta por una Lambda mínima + SES, que mantiene el dato dentro de la cuenta de AWS y no requiere administrar ningún servidor.

## Arquitectura

```
Formulario (fetch POST)  →  Lambda Function URL  →  Lambda (Node.js)  →  SES  →  bandeja de entrada
```

- **Lambda Function URL** en vez de API Gateway completo: es un solo endpoint POST, no se necesitan las features extra de API Gateway (throttling avanzado, múltiples rutas, etc.). Se configura CORS restringido al dominio del sitio (no `*`).
- **SES en modo sandbox alcanza**: el destino es la casilla propia, no hace falta pedir "production access". Se verifica el email remitente y el email destino en el panel de SES.
- **Costo**: Lambda tiene 1M de invocaciones gratis por mes; SES enviando desde Lambda tiene del orden de 62.000 emails gratis por mes. El volumen de un formulario de contacto no se acerca a esos números — costo real: $0.

## Variables de entorno — separación crítica entre frontend y backend

- **Backend (Lambda)**, nunca visibles para el usuario: `SENDER_EMAIL`, `DEST_EMAIL`.
- **Frontend (Vite)**: nada nuevo necesario. El número de WhatsApp ya vive en `contact.json`, que cumple la misma función que una env var (config separada del código) sin necesitar el prefijo `VITE_`.

Cualquier valor `VITE_*` queda embebido en el bundle JS público en build time — por eso nunca se pone ahí un destinatario de mail ni nada sensible. Solo las Lambdas tienen variables realmente privadas, porque corren del lado del servidor.

## Paso a paso de implementación

1. **SES**: verificar `SENDER_EMAIL` (remitente) y `DEST_EMAIL` (destino) en el panel de SES → *Verified identities*.
2. **Lambda**: crear función Node.js con un handler que:
   - Parsea el body del request.
   - Llama a `SendEmailCommand` de `@aws-sdk/client-ses`.
   - Devuelve `200` en éxito o `400` si faltan datos.
   - Variables de entorno configuradas: `SENDER_EMAIL`, `DEST_EMAIL`.
   - Rol IAM con permiso únicamente de `ses:SendEmail` (mínimo privilegio).
3. **Lambda Function URL**: habilitar, configurar CORS con `AllowOrigin` = dominio de producción (no `*`), método `POST`.
4. **Frontend**:
   - Convertir los inputs de `contact-section.tsx` de no controlados a controlados (`useState` + `name`/`value`/`onChange`).
   - Conectar `handleSubmit` a un `fetch(LAMBDA_URL, { method: 'POST', body: JSON.stringify(datos) })`.
   - En el `.then` exitoso, redirigir a `https://wa.me/${contact.waNumber}?text=<resumen precargado>`.
5. **Anti-abuso básico** (recomendado, mínimo esfuerzo): un campo honeypot oculto en el form — si viene lleno, se descarta el submit sin llamar a SES. Evita bots simples sin necesitar reCAPTCHA todavía.
6. **Probar**: enviar el formulario en `pnpm dev` contra la Function URL real, confirmar que llega el mail y que se abre WhatsApp con el mensaje precargado.

## Fuera de alcance (por ahora)

- reCAPTCHA / AWS WAF para anti-abuso avanzado (el honeypot alcanza para el volumen inicial).
- Guardar las solicitudes en una base de datos (hoy solo se envían por mail, no se persisten).
