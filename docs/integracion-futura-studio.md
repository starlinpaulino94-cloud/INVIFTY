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
> Las secciones §2, §3 y §4 son una **especificación dirigida al equipo de
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

## 5. Lo que falta implementar en `invifty-studio`

- [ ] `POST /api/public/leads` con validación, idempotencia y rate limiting
- [ ] `GET /api/public/catalog`
- [ ] `GET /api/public/demos`
- [ ] Lista blanca de CORS para `https://invifty.com`
- [ ] Almacenamiento de leads con el consentimiento y su fecha
- [ ] Notificación al equipo cuando entra un lead (hoy lo hace WhatsApp por sí solo)
- [ ] Política de retención y borrado de datos de leads

## 6. Lo que faltará en la web cuando Studio esté listo

- [ ] Adaptador que convierta la respuesta de `/catalog` al tipo `PricingPlan`
- [ ] Adaptador que convierta `/demos` al tipo `PublicDemo`
- [ ] Estados de carga y error para el catálogo remoto
- [ ] Pruebas del camino API, incluida la caída a WhatsApp

> **No se ha modificado `invifty-studio` en este trabajo.**
