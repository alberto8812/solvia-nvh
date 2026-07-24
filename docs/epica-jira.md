# Épica: FONDI-LANDING — Landing page de captación de leads de Fondi vía WhatsApp

**Descripción:** Como negocio, Fondi necesita una landing page pública que explique el producto de préstamos, genere confianza (testimonios, videos, información de la empresa) y convierta visitantes en leads calificados a través de un flujo conversacional que desemboca en WhatsApp, sin formularios tradicionales ni simulador de tasas.

**Alcance:** Hero, barra de confianza, beneficios, selector de montos, pasos del proceso, servicios, quiénes somos, testimonios, videos, sección de contacto, widget de chat flotante global y SEO técnico (metadatos, robots.txt, sitemap.xml, JSON-LD).

**Fuera de alcance:** Simulador de tasas (`SimulatorSection` queda comentado en `App.tsx` hasta que existan condiciones de producto definidas). Corresponde a una épica futura.

---

## HU-01 — Conocer el producto al llegar a la landing

> **Como** visitante interesado en un préstamo, **quiero** entender qué ofrece Fondi apenas entro al sitio, **para** decidir rápido si aplica a mi necesidad.

```gherkin
Funcionalidad: Presentación del producto

  Escenario: El visitante llega a la página principal
    Dado que un visitante navega a la URL de la landing
    Cuando la página termina de cargar
    Entonces ve la sección hero con la propuesta de valor y un llamado a la acción
    Y ve la barra de confianza, los beneficios, los pasos del proceso y los servicios
    Y toda la navegación por anclas del navbar lleva a la sección correspondiente

  Escenario: El visitante navega desde un dispositivo móvil
    Dado que un visitante accede desde un teléfono
    Cuando recorre la página
    Entonces todas las secciones se muestran correctamente adaptadas al ancho de pantalla
```

## HU-02 — Seleccionar un monto e iniciar la conversación

> **Como** visitante que ya sabe cuánto necesita, **quiero** elegir un monto y comenzar el contacto de inmediato, **para** no perder tiempo con formularios.

```gherkin
Funcionalidad: Selector de montos conectado al chat

  Escenario: El visitante elige un monto predefinido
    Dado que el visitante está en la sección de selección de montos
    Cuando hace clic en una de las opciones de monto
    Entonces se abre el chat flotante reiniciado desde el paso inicial
    Y el monto elegido aparece como mensaje dentro de la conversación

  Escenario: El monto queda registrado en el resumen final
    Dado que el visitante abrió el chat desde un monto seleccionado
    Cuando completa todas las preguntas del chat
    Entonces el resumen final incluye el monto solicitado como línea destacada
```

## HU-03 — Completar la precalificación por chat y saltar a WhatsApp

> **Como** visitante interesado, **quiero** responder unas pocas preguntas guiadas, **para** que Fondi reciba mis datos por WhatsApp sin tener que escribir todo yo.

```gherkin
Funcionalidad: Chat flotante de precalificación

  Escenario: El visitante abre el chat flotante
    Dado que el visitante está en cualquier sección de la landing
    Cuando hace clic en el botón flotante de chat
    Entonces se abre el panel de chat con un saludo inicial
    Y el botón flotante es visible sobre fondos claros y oscuros

  Escenario: El visitante responde las preguntas una por una
    Dado que el chat está abierto
    Cuando el visitante responde cada pregunta (nombre, ciudad y estado, código postal, trabajo estable, ocupación)
    Entonces cada respuesta aparece como burbuja del usuario
    Y la pregunta sobre trabajo estable se responde con botones de opción

  Escenario: El visitante finaliza el chat
    Dado que el visitante respondió todas las preguntas
    Cuando confirma el resumen final
    Entonces se abre WhatsApp con un mensaje prellenado que incluye todas sus respuestas
    Y el mensaje se dirige al número oficial de Fondi
```

## HU-04 — Generar confianza con testimonios y videos

> **Como** visitante desconfiado de prestamistas online, **quiero** ver historias reales de clientes, **para** validar que Fondi es legítimo antes de dar mis datos.

```gherkin
Funcionalidad: Prueba social

  Escenario: El visitante revisa los testimonios
    Dado que el visitante llega a la sección de testimonios
    Cuando la recorre
    Entonces ve historias de clientes satisfechos con nombre y contexto

  Escenario: El visitante reproduce un video
    Dado que el visitante está en la sección de videos
    Cuando hace clic en un video
    Entonces el video se reproduce correctamente
```

## HU-05 — Contactar a Fondi desde la sección de contacto

> **Como** visitante que prefiere contacto directo, **quiero** ver los datos de contacto y un acceso al chat, **para** comunicarme por el canal que me quede cómodo.

```gherkin
Funcionalidad: Sección de contacto

  Escenario: El visitante consulta los datos de contacto
    Dado que el visitante llega a la sección de contacto
    Entonces ve el teléfono y el correo oficiales de Fondi
    Y no existe ningún formulario tradicional de contacto

  Escenario: El visitante inicia el chat desde contacto
    Dado que el visitante está en la sección de contacto
    Cuando hace clic en el llamado a la acción de chat
    Entonces se abre el mismo flujo conversacional del widget flotante
```

## HU-06 — Ser encontrado en buscadores (SEO técnico)

> **Como** negocio, **quiero** que la landing esté correctamente indexada, **para** captar tráfico orgánico.

```gherkin
Funcionalidad: SEO técnico

  Escenario: Un buscador rastrea el sitio
    Dado que un crawler solicita la landing
    Entonces encuentra robots.txt y sitemap.xml disponibles
    Y la página expone canonical, Open Graph, Twitter Cards y JSON-LD de tipo FinancialService

  Escenario: La página se comparte en redes sociales
    Dado que un usuario comparte la URL de la landing
    Cuando la red social genera la vista previa
    Entonces se muestran el título, la descripción y la imagen definidos en los metadatos
```
