# Detección de país del visitante para adaptar dialectos y copy

Este documento explica cómo hacer que `fondi-landing` sepa en qué país está el visitante, con el objetivo de adaptar el dialecto (voseo AR, tuteo MX, "vosotros" ES, etc.) y otros datos regionales (moneda, teléfono/WhatsApp). Es una guía de estrategia + paso a paso — el código de acá es de referencia para implementar cuando se decida avanzar, todavía no está aplicado en el repo.

## 0. Restricción de partida: por qué esto no es trivial acá

`fondi-landing` es una SPA estática (Vite + React 19 + TS), hosteada en **S3 + CloudFront** (ver `docs/deploy-aws-godaddy.md`), sin ningún backend en el camino de entrega de la página. La única pieza server-side del proyecto es una Lambda separada para el formulario de contacto (`docs/formulario-email-whatsapp.md`), que no interviene cuando el visitante pide la página.

Eso descarta la opción más cómoda: hosts como **Cloudflare** o **Vercel** inyectan automáticamente un header de país en cada request (`cf-ipcountry`, `x-vercel-ip-country`) sin que el frontend haga nada. **CloudFront plano no lo hace** — hay que agregar infraestructura extra para tenerlo (ver sección 4).

Hoy además todo el copy está hardcodeado en voseo argentino ("Elegí tu monto", "Necesitás") en `src/data/*.json`, con un número de WhatsApp/teléfono de EE.UU. y montos en USD — no existe ninguna capa de dialecto, se arma desde cero.

## 1. Comparación de estrategias

| Estrategia | Precisión | Costo de infra | Contras |
|---|---|---|---|
| **Geo-IP client-side** (recomendada) | País real, por IP | Ninguno — solo frontend | Depende de un servicio externo (rate limits), puede fallar detrás de VPN/proxy |
| **CloudFront Function** (header geo) | País real, por IP, en el edge | Alto — hay que tocar la distribución CloudFront | Requiere crear y asociar una función, más superficie de infra para mantener |
| **`navigator.language`** | Preferencia de idioma del navegador, no país real | Ninguno | Impreciso: muchos usuarios de LatAm tienen el navegador en "es" genérico, no distingue AR de MX o ES |

**Se recomienda arrancar con geo-IP client-side**: no toca la infraestructura de AWS existente, es la opción más rápida de poner en marcha en un proyecto que se despliega a mano (sin CI/CD), y el fallback ante fallas es simplemente quedarse con el dialecto actual (AR).

## 2. Paso a paso: geo-IP client-side

### 2.1 Función de detección con caché y fallback

`src/lib/detectCountry.ts`:

```ts
const CACHE_KEY = 'fondi_country'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24h
const DEFAULT_COUNTRY = 'AR'
const LOOKUP_TIMEOUT_MS = 2500

interface CachedCountry {
  country: string
  ts: number
}

function readCache(): string | null {
  const raw = localStorage.getItem(CACHE_KEY)
  if (!raw) return null

  const cached: CachedCountry = JSON.parse(raw)
  const isExpired = Date.now() - cached.ts > CACHE_TTL_MS
  return isExpired ? null : cached.country
}

function writeCache(country: string) {
  const cached: CachedCountry = { country, ts: Date.now() }
  localStorage.setItem(CACHE_KEY, JSON.stringify(cached))
}

export async function detectCountry(): Promise<string> {
  const cached = readCache()
  if (cached) return cached

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS)

  try {
    const res = await fetch('https://ipwho.is/', { signal: controller.signal })
    const data = await res.json()
    const country = data.country_code as string | undefined

    if (!country) return DEFAULT_COUNTRY

    writeCache(country)
    return country
  } catch {
    return DEFAULT_COUNTRY
  } finally {
    clearTimeout(timeout)
  }
}
```

`ipwho.is` se eligió porque no requiere API key ni registro. Alternativa equivalente: `https://ipapi.co/json/` (campo `country_code` también).

El `try/catch` cubre error de red, bloqueo por adblocker/VPN, o timeout por el `AbortController` — en todos los casos cae a `DEFAULT_COUNTRY` sin romper la página ni bloquear el render.

### 2.2 Hook de consumo

`src/hooks/useCountry.ts`:

```ts
import { useEffect, useState } from 'react'
import { detectCountry } from '@/lib/detectCountry'
import { dialects, defaultDialect } from '@/data/dialects'

export function useCountry() {
  const [country, setCountry] = useState<string | null>(null)

  useEffect(() => {
    detectCountry().then(setCountry)
  }, [])

  const dialect = country ? (dialects[country] ?? defaultDialect) : defaultDialect

  return { country, dialect, loading: country === null }
}
```

Se llama una sola vez al montar (idealmente desde `src/App.tsx`, no desde cada sección) para no disparar el lookup más de una vez por sesión.

### 2.3 Mapa de dialectos

`src/data/dialects.ts` — acotado a las variantes que hoy hacen falta, no a una matriz completa de LatAm:

```ts
export interface Dialect {
  currencyLocale: string
  cta: {
    chooseAmount: string
    youNeed: string
  }
}

export const defaultDialect: Dialect = {
  currencyLocale: 'es-AR',
  cta: {
    chooseAmount: 'Elegí tu monto',
    youNeed: 'Necesitás',
  },
}

export const dialects: Record<string, Dialect> = {
  AR: defaultDialect,
  MX: {
    currencyLocale: 'es-MX',
    cta: {
      chooseAmount: 'Elige tu monto',
      youNeed: 'Necesitas',
    },
  },
}
```

Arrancar con `AR` (default actual) + `MX` alcanza para validar el mecanismo end-to-end. Sumar más países es agregar una entrada al mapa, no tocar la lógica de detección.

### 2.4 Integración de ejemplo

Sobre los dos puntos hardcodeados que ya existen hoy en el repo:

- **Copy del Hero / selector de monto** (`hero.json`, `amount-selector-section.tsx`): reemplazar los strings fijos ("Elegí tu monto", "Necesitás") por `dialect.cta.chooseAmount` / `dialect.cta.youNeed` desde `useCountry()`.
- **Formato de moneda** en `amount-selector-section.tsx`, que hoy usa:

  ```ts
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  ```

  pasa a usar el locale del dialecto detectado, sin tocar el monto (el producto sigue siendo en USD):

  ```ts
  new Intl.NumberFormat(dialect.currencyLocale, { style: 'currency', currency: 'USD' })
  ```

## 3. Explícitamente fuera de alcance

- **Restructurar los ~10 archivos de `src/data/*.json`** a variantes completas por país (ej. `hero.ar.json`, `hero.mx.json`). No se justifica hasta confirmar que el negocio necesita más que un puñado de strings variables — el mapa de dialectos de la sección 2.3 alcanza para eso.
- **Cambiar el número de WhatsApp/teléfono según el país** — hoy es un único número de EE.UU. (`src/data/contact.json`, `src/data/simulator.json`). Es una decisión de negocio (¿se atiende igual desde ese número a un usuario de México?), no técnica.
- **CloudFront Function para inyectar header geo en el edge** (ver comparación en la sección 1). Es la opción más precisa a futuro, pero implica tocar la distribución de CloudFront existente — se deja como mejora posterior si el volumen de tráfico justifica dejar de depender de una API externa.

## 4. Nota sobre la alternativa de CloudFront Function

Si en el futuro se prioriza precisión sobre simplicidad (por ejemplo, si `ipwho.is` empieza a rate-limitear por volumen de tráfico), la alternativa es una **CloudFront Function** asociada como *viewer request* a la distribución existente, que inyecte un header (ej. `cloudfront-viewer-country`, que CloudFront ya expone automáticamente si se habilita "Add Viewer Country Header" en la configuración del comportamiento de caché — sin necesidad de escribir una función custom). Esto elimina la dependencia del fetch externo y la latencia asociada, a costa de requerir un cambio en la distribución CloudFront documentada en `docs/deploy-aws-godaddy.md`.

## 5. Checklist de verificación (para cuando se implemente)

- [ ] La API de geo-IP se llama **una sola vez por sesión**, no en cada render (confirmar en DevTools → Network).
- [ ] Bloquear el dominio de la API en DevTools y confirmar que el sitio sigue funcionando con el dialecto default (AR), sin errores en consola ni bloqueo del render.
- [ ] Recargar la página dentro del TTL de 24h y confirmar que **no** se repite el llamado a la API (usa la caché de `localStorage`).
- [ ] Forzar temporalmente el valor devuelto por `detectCountry()` a cada país soportado y confirmar visualmente que cambian el copy del CTA y el formato de moneda.
