# Historias de Usuario — Página de Carreras y Portal de Empleo

Documentación retroactiva de las historias de usuario para las secciones agregadas en `feat/jobs-page-careers`: página `/careers` y el flujo de postulación vía chat flotante.

---

## HU-01 — Hero de la página de Carreras

**Como** visitante interesado en trabajar en Fondi
**Quiero** ver una sección de bienvenida clara al entrar a `/careers`
**Para** entender rápidamente que esta página es para postularme a un empleo en la empresa

### Criterios de aceptación

```gherkin
Escenario: Visitante entra a la página de carreras
  Dado que navego a "/careers"
  Entonces veo un encabezado con el texto "Únete al equipo Fondi"
  Y veo un párrafo introductorio explicando la propuesta de la empresa
  Y veo una imagen ilustrativa junto al texto
```

### Notas técnicas
- `src/pages/jobs-page.tsx`, sección header.

---

## HU-02 — Sección "Por qué Fondi" (valores)

**Como** candidato evaluando la oferta
**Quiero** ver los beneficios de trabajar en Fondi
**Para** decidir si la propuesta de valor de la empresa me interesa

### Criterios de aceptación

```gherkin
Escenario: Visitante revisa los valores de la empresa
  Dado que estoy en "/careers"
  Entonces veo 3 tarjetas con ícono, título y descripción
  Y los títulos son "Crecimiento profesional", "Estabilidad y respaldo" e "Impacto real"
```

### Notas técnicas
- `src/pages/jobs-page.tsx`, constante `WHY_FONDI` (array hardcodeado, 3 ítems).

---

## HU-03 — Sección "¿Qué esperamos de ti?"

**Como** candidato evaluando si aplico a una vacante
**Quiero** conocer los requisitos y expectativas del puesto antes de postular
**Para** no perder tiempo si no cumplo con el perfil buscado

### Criterios de aceptación

```gherkin
Escenario: Visitante revisa los requisitos esperados
  Dado que estoy en "/careers"
  Entonces veo 4 expectativas: actitud comercial, orientación al servicio,
    buena presentación personal, experiencia en ventas o servicio al cliente
  Y veo una nota indicando que debo tener mi situación migratoria definida
```

### Notas técnicas
- `src/pages/jobs-page.tsx`, constante `EXPECTATIONS` (array hardcodeado, 4 ítems).

---

## HU-04 — Listado de vacantes abiertas

**Como** candidato
**Quiero** ver las vacantes activas con su ciudad, modalidad y fecha de publicación
**Para** identificar cuál se ajusta a mi ubicación y disponibilidad

### Criterios de aceptación

```gherkin
Escenario: Hay vacantes activas
  Dado que existen vacantes con "active: true" en la fuente de datos
  Cuando entro a "/careers"
  Entonces veo una tarjeta por cada vacante activa
  Y cada tarjeta muestra título, badge de modalidad, ubicación,
    fecha de publicación y salario (si está definido)
  Y cada tarjeta tiene un botón "Ver detalle completo" y un botón "Aplicar"

Escenario: No hay vacantes activas
  Dado que no existen vacantes con "active: true"
  Cuando entro a "/careers"
  Entonces veo un estado vacío indicando que no hay vacantes abiertas
  Y veo un botón "Contáctanos" que abre el chat en modo postulación genérica
```

### Notas técnicas
- `src/pages/jobs-page.tsx`, filtra `jobs` (de `src/data/index.ts`) por `job.active`.
- Modelo de datos: `src/data/jobs.json` (campos variables por ciudad) + `ADVISOR_ROLE` en `src/data/index.ts` (campos compartidos) → tipo `JobOpening` en `src/types/content.types.ts`.
- Actualmente las 3 vacantes activas son el mismo rol ("Asesor Comercial") duplicado por ciudad (Dallas TX, San Antonio TX, Raleigh NC).

---

## HU-05 — Detalle de vacante en modal

**Como** candidato
**Quiero** ver el detalle completo de una vacante sin salir de la página
**Para** informarme antes de decidir si aplico

### Criterios de aceptación

```gherkin
Escenario: Candidato abre el detalle de una vacante
  Dado que estoy en "/careers" viendo el listado de vacantes
  Cuando hago clic en "Ver detalle completo" de una tarjeta
  Entonces se abre un modal con título, modalidad, ubicación,
    fecha de publicación, descripción completa y salario (si aplica)
  Y veo un bloque de contacto con teléfono y email
  Y puedo cerrar el modal para volver al listado
```

### Notas técnicas
- `src/components/job-modal.tsx` (elemento nativo `<dialog>`).
- El modal no tiene botón "Aplicar" propio; ese CTA vive solo en la tarjeta (HU-04).

---

## HU-06 — Postulación conversacional vía chat flotante

**Como** candidato interesado en una vacante
**Quiero** postularme completando un flujo de preguntas paso a paso en el chat
**Para** enviar mis datos sin llenar un formulario largo de una sola vez

### Criterios de aceptación

```gherkin
Escenario: Candidato inicia postulación desde una vacante puntual
  Dado que hago clic en "Aplicar" en la tarjeta de una vacante
  Entonces se abre el chat flotante en modo "application"
  Y el título de la vacante ya queda preseleccionado (no se pregunta)
  Y el chat pregunta, una por vez: nombre completo, teléfono,
    autorización para trabajar en EE.UU., ciudad, disponibilidad de tiempo,
    experiencia laboral, nivel de educación y email

Escenario: Candidato inicia postulación sin vacante puntual (estado vacío)
  Dado que hago clic en "Contáctanos" en el estado vacío de vacantes
  Entonces el chat pregunta primero "¿A qué vacante te gustaría postularte?"
    mostrando como opciones los títulos de las vacantes activas
    (o "Otra vacante" si no hay ninguna activa)
  Y luego continúa con las mismas preguntas de HU-06

Escenario: Tipos de respuesta por pregunta
  Dado que estoy respondiendo una pregunta del chat
  Entonces veo botones "Sí/No" si la pregunta es booleana
  Y veo botones de opciones si la pregunta es de elección
  Y veo un campo de texto libre en el resto de los casos
  Y no puedo enviar una respuesta de texto vacía o solo espacios
```

### Notas técnicas
- `src/components/floating-chat-widget.tsx` (`ChatMode = 'loan' | 'application'`).
- Disparador: `openFondiChat()` en `src/lib/chat-bridge.ts`, evento `fondi:open-chat`.
- Preguntas: `src/data/job-application.json` (`jobApplication.questions`).
- Simulación de escritura (~650ms) entre pregunta y pregunta.

---

## HU-07 — Resumen y envío de la postulación por WhatsApp

**Como** candidato que ya respondió todas las preguntas
**Quiero** revisar mis respuestas y confirmar el envío
**Para** asegurarme de que la información que mando es correcta

### Criterios de aceptación

```gherkin
Escenario: Candidato revisa y envía su postulación
  Dado que respondí la última pregunta del chat
  Entonces veo una pantalla de resumen con todas mis respuestas
  Y veo el widget de verificación Cloudflare Turnstile
  Y el botón "Enviar por WhatsApp" está deshabilitado hasta que Turnstile
    genere un token válido
  Cuando Turnstile valida y hago clic en "Enviar por WhatsApp"
  Entonces se abre en una pestaña nueva un enlace wa.me con un mensaje
    prellenado que incluye el título de la vacante y todas mis respuestas
```

### Notas técnicas
- Turnstile vía `VITE_TURNSTILE_SITE_KEY` (client-side, sin verificación server-side).
- No hay backend ni API: el envío es 100% vía deep link de WhatsApp.

---

## Riesgos / limitaciones conocidas (transversal)

- No hay verificación server-side de Turnstile: solo filtra bots simples.
- No hay persistencia de postulaciones fuera de WhatsApp (no hay base de datos ni API).
- Las 3 vacantes activas son el mismo rol duplicado por ciudad; si se necesitan roles distintos, el modelo de datos actual (`ADVISOR_ROLE` compartido) requiere ajuste.
