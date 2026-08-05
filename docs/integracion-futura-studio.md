# Integración futura con Invifty Studio

**Estado:** preparado en la web, **no implementado en Studio**.
**Última actualización:** 2026-08-04

> ## Alcance de este repositorio
>
> **Este repositorio contiene únicamente la página web pública de Invifty.**
>
> `invifty-studio` es un **proyecto independiente, en otro repositorio**, que no
> forma parte de este código y no se toca desde aquí. No hay ni debe haber
> ningún archivo suyo en este árbol.
>
> Lo que sí vive aquí es el **lado de la web** de la futura integración: el
> cliente HTTP, los tipos y los feature flags que la web necesitará el día que
> Studio publique sus endpoints. Nada más.
>
> Las secciones §2 a §5 son una **especificación dirigida al equipo de
> Studio**: describen lo que la web espera consumir, no trabajo pendiente en
> este repositorio.

> ⚠️ Ninguno de estos endpoints existe todavía. Nada en la web llama a Studio en
> producción: la integración está detrás de un feature flag apagado y el
> formulario usa WhatsApp.

---

## 1. Qué queda preparado en la web

| Pieza | Ruta | Estado |
|---|---|---|
| Contrato del lead | [`src/services/leads/types.ts`](../src/services/leads/types.ts) | ✅ Listo |
| Transporte HTTP a Studio | [`src/services/leads/studioTransport.ts`](../src/services/leads/studioTransport.ts) | ✅ Implementado, apagado |
| Transporte WhatsApp (actual) | [`src/services/leads/whatsappTransport.ts`](../src/services/leads/whatsappTransport.ts) | ✅ En uso |
| Selección de canal | [`src/services/leads/index.ts`](../src/services/leads/index.ts) | ✅ Listo |
| Feature flags | [`src/config/env.ts`](../src/config/env.ts) | ✅ Listo |

### Cómo se enciende

```bash
VITE_STUDIO_API_URL=https://studio.invifty.com
VITE_ENABLE_STUDIO_LEADS=true
```

`ENV.studioLeadsEnabled` sólo es `true` si **ambas** están puestas. Un flag encendido sin URL
no deja el formulario sin canal: sigue usando WhatsApp y avisa por consola en desarrollo.

### Comportamiento ante fallos

Si la API responde error, se agota el tiempo de espera o falla la red, `submitLead()` cae
automáticamente al transporte de WhatsApp. **Perder el lead sería peor que enviarlo por el
canal antiguo.** El modo real de envío viaja en la analítica como `lead_submission_mode`.

---

## 2. `POST /api/public/leads`

**Propósito:** recibir un lead comercial de la web pública.

### Petición

```http
POST /api/public/leads
Content-Type: application/json
Idempotency-Key: 18092693214:Boda / Matrimonio:2026-12-05
```

```json
{
  "name": "Sofía Rodríguez",
  "phone": "18092693214",
  "eventType": "Boda / Matrimonio",
  "eventDate": "2026-12-05",
  "planId": "popular",
  "demoId": "boda-camila-y-lucas",
  "message": "Queremos algo dorado",
  "language": "es",
  "source": "inquiry_form",
  "utm": { "source": "instagram", "medium": "bio", "campaign": "bodas2026" },
  "consent": true
}
```

### Validaciones exigidas en el servidor

| Campo | Regla |
|---|---|
| `name` | Obligatorio, 2–120 caracteres |
| `phone` | Obligatorio, sólo dígitos, 10–15. La web ya lo normaliza a E.164 sin `+` |
| `eventType` | Obligatorio, de una lista cerrada |
| `eventDate` | Opcional, `YYYY-MM-DD`, no anterior a hoy |
| `planId` | Opcional, debe existir en el catálogo |
| `demoId` | Opcional, debe existir en el catálogo de demos |
| `message` | Opcional, máximo 2000 caracteres, se escapa antes de mostrarse |
| `language` | `es` \| `en` |
| `consent` | **Debe ser `true`**. Rechazar con 422 si es `false` |

> La validación de cliente es una comodidad, no una defensa. Studio debe revalidarlo todo.

### Respuestas

```json
// 201 Created
{ "ok": true, "leadId": "lead_01H..." }

// 200 OK — duplicado detectado por Idempotency-Key
{ "ok": true, "leadId": "lead_01H...", "duplicate": true }

// 422 Unprocessable Entity
{ "ok": false, "errors": { "phone": "invalid", "consent": "required" } }

// 429 Too Many Requests
{ "ok": false, "error": "rate_limited", "retryAfter": 60 }
```

### Idempotencia

La web envía `Idempotency-Key: <phone>:<eventType>:<eventDate>`.
Studio debe guardar la clave 24 h y devolver el lead existente con `duplicate: true` en vez
de crear otro. Sin esto, un doble clic o un reintento de red genera pedidos duplicados.

### Rate limiting

Recomendado: **5 peticiones por IP cada 10 minutos** y **3 por número de teléfono al día**.
Responder 429 con `Retry-After`. La web ya cae a WhatsApp ante un 429.

### CORS

```http
Access-Control-Allow-Origin: https://invifty.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Idempotency-Key
Access-Control-Max-Age: 86400
```

Lista blanca explícita de orígenes. **No usar `*`**: el endpoint acepta escrituras.

### Autenticación

**Ninguna.** Es un endpoint público llamado desde el navegador. Cualquier clave que se
pusiera aquí sería visible para todo el mundo en el JavaScript. La protección son el rate
limiting, la validación y (opcionalmente) un captcha invisible.

### Campos prohibidos en la respuesta

Nunca devolver: datos de otros clientes, precios internos o de coste, ids de cliente,
estado de producción, notas internas, ni el listado de leads. La respuesta se limita a
confirmar la recepción.

---

## 3. `GET /api/public/catalog`

**Propósito:** servir planes y extras para que la web deje de tener el catálogo en código.

```json
{
  "plans": [
    {
      "id": "popular",
      "name": { "es": "Popular", "en": "Popular" },
      "priceUSD": 49,
      "priceDOP": 2500,
      "isPopular": true,
      "isCustom": false,
      "description": { "es": "...", "en": "..." },
      "features": [{ "es": "...", "en": "..." }],
      "deliveryTime": { "es": "3–5 días hábiles", "en": "3–5 business days" },
      "revisions": 2,
      "validityMonths": 6,
      "ctaText": { "es": "...", "en": "..." }
    }
  ],
  "extras": [],
  "comparison": []
}
```

- **Cacheable:** `Cache-Control: public, max-age=300, stale-while-revalidate=3600`.
- **Sólo lectura**, sin autenticación.
- **Campos prohibidos:** coste interno, margen, precio de proveedor, planes despublicados.
- La web debe **seguir funcionando si el endpoint falla**: `pricingData.ts` permanece como
  copia de respaldo. Un fallo del catálogo no puede dejar la página de precios en blanco.

---

## 4. `GET /api/public/demos`

**Propósito:** que las demos publicadas provengan de Studio.

```json
{
  "demos": [
    {
      "id": "boda-camila-y-lucas",
      "slug": "boda-camila-y-lucas",
      "title": "Camila & Lucas",
      "eventType": "boda",
      "style": "clasico-dorado",
      "coverImage": "https://cdn.invifty.com/demos/boda-camila.webp",
      "features": ["rsvp", "galeria", "mapa"],
      "minimumPlan": "popular",
      "demoUrl": "/muestra/boda-camila-y-lucas",
      "active": true
    }
  ]
}
```

- Devolver **sólo** demos con `active: true`.
- **Campos prohibidos:** cualquier dato de invitaciones reales de clientes. Las invitaciones
  privadas **no** son contenido público y no deben aparecer nunca en este endpoint.
- Mismo criterio de caché y de respaldo local que el catálogo.

---

## 5. RSVP de invitaciones reales y panel del anfitrión

> **Estado: especificado, nada implementado.** Ni aquí ni en Studio.

Los planes **ya prometen esta capacidad** en la web publicada:

- **Popular** — «Confirmación RSVP interactiva para invitados».
- **Premium** — «Control de acceso y **gestión personalizada de tus invitados**» y
  «Pase QR personal: cada invitado entra escaneando el suyo».

Es decir: el cliente que compra Premium espera un sitio donde ver quién ha confirmado. Ese
panel es lo que falta, y **no existe en ninguna parte todavía**.

### Dónde vive cada pieza

| Pieza | Dónde | Estado |
|---|---|---|
| Invitación **de muestra** (las 12 demos) | Este repositorio | ✅ Existe. Su RSVP abre WhatsApp y lo dice |
| Invitación **real** de un cliente | Studio la publica | ❌ No definido |
| Endpoint que recibe la confirmación | Studio | ❌ No existe |
| **Panel del anfitrión** | Studio | ❌ No existe |

> ⚠️ **Las demos de este repositorio no deben conectarse nunca a este endpoint.** Son
> muestras públicas con datos ficticios; enviar confirmaciones reales desde ellas ensuciaría
> los datos de eventos de clientes. Su RSVP seguirá abriendo WhatsApp.

### `POST /api/public/events/{eventId}/rsvp`

**Propósito:** registrar la confirmación de un invitado en una invitación real.

```json
{
  "guestToken": "gst_01H...",
  "fullName": "Familia Bermúdez",
  "attendance": "Confirmado",
  "guestCount": 3,
  "menuPreference": "Opción vegetariana",
  "dietaryNotes": "Sin mariscos",
  "songRequest": "Bachata Rosa",
  "message": "¡Ahí estaremos!"
}
```

`attendance` usa los valores canónicos del tipo `RsvpAttendance` de este repositorio:
`"Confirmado" | "Declina"`. Conviene que Studio use los mismos para no traducir estados.

**Validaciones exigidas:**

| Campo | Regla |
|---|---|
| `eventId` | Debe existir y estar publicado |
| `guestToken` | Opcional. Si el evento es de lista cerrada, **obligatorio** y de un solo uso por invitado |
| `fullName` | Obligatorio, 2–120 caracteres |
| `attendance` | `Confirmado` \| `Declina` |
| `guestCount` | Entero ≥ 1 y **≤ los pases asignados** a ese invitado |
| `message` | Máximo 500 caracteres, se escapa antes de mostrarse en el panel |

**Idempotencia:** clave `eventId:guestToken`. Un invitado que confirma dos veces
**actualiza** su respuesta, no crea una segunda. Es el caso más frecuente: la gente cambia de
opinión sobre el número de acompañantes.

**Rate limiting:** por `eventId` y por IP. Una invitación de boda puede recibir cientos de
confirmaciones legítimas en una hora tras enviarse, así que el límite debe ser generoso —
sugerido: 300/hora por evento— o el propio éxito del envío parecerá un ataque.

**Campos prohibidos en la respuesta:** la lista de invitados, sus datos o cualquier
estadística del evento. El invitado sólo debe recibir la confirmación de su propia respuesta.

### Panel del anfitrión

Es **área privada**, no contenido público. Requisitos mínimos:

- **Autenticación del anfitrión.** Cada evento pertenece a un cliente; nadie más ve sus
  invitados. Un enlace no adivinable no es autenticación suficiente para datos personales.
- **Lista de invitados** con estado, acompañantes, menú y notas.
- **Totales**: confirmados, declinados y pendientes; suma real de asistentes.
- **Exportar a CSV** — es lo primero que pide quien organiza el salón.
- **Escaneo de QR en puerta** (Premium): marcar llegada y evitar el paso doble.
- **Retención y borrado.** Son datos personales de terceros que no aceptaron nada con
  Invifty: define cuánto se guardan tras el evento y cómo se eliminan.

### Lo que faltará en esta web

Nada, mientras el panel viva en Studio. Si algún día se decidiera enlazarlo desde aquí,
bastaría con un enlace externo — **nunca replicar el panel en el sitio público**.

---

## 6. Lo que falta implementar en `invifty-studio`

- [ ] `POST /api/public/leads` con validación, idempotencia y rate limiting
- [ ] `GET /api/public/catalog`
- [ ] `GET /api/public/demos`
- [ ] `POST /api/public/events/{eventId}/rsvp` con idempotencia por invitado
- [ ] **Panel del anfitrión**: autenticación, lista de invitados, totales y export CSV
- [ ] Escaneo de QR en puerta para los planes Premium y A medida
- [ ] Política de retención y borrado de los datos de invitados
- [ ] Lista blanca de CORS para `https://invifty.com`
- [ ] Almacenamiento de leads con el consentimiento y su fecha
- [ ] Notificación al equipo cuando entra un lead (hoy lo hace WhatsApp por sí solo)
- [ ] Política de retención y borrado de datos de leads

## 7. Lo que faltará en la web cuando Studio esté listo

- [ ] Adaptador que convierta la respuesta de `/catalog` al tipo `PricingPlan`
- [ ] Adaptador que convierta `/demos` al tipo `PublicDemo`
- [ ] Estados de carga y error para el catálogo remoto
- [ ] Pruebas del camino API, incluida la caída a WhatsApp

> **No se ha modificado `invifty-studio` en este trabajo.**
