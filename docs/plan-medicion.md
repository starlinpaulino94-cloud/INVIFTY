# Plan de medición

**Última actualización:** 2026-08-04

Define qué se mide en la web de Invifty, cuándo se dispara cada evento y para qué sirve.
La implementación vive en [`src/services/analytics/`](../src/services/analytics/).

---

## 1. Principios

1. **La capa es independiente del proveedor.** Los componentes llaman a `trackEvent(...)`.
   Quién recibe el evento se decide en `initAnalytics()`. Cambiar GA4 por otra herramienta
   sólo obliga a escribir un `AnalyticsProvider` nuevo.
2. **La lista de eventos es cerrada.** `AnalyticsEventName` es una unión de literales, así que
   un nombre con errata no compila.
3. **La lista de propiedades es cerrada.** `AnalyticsProps` no tiene campos para nombre,
   teléfono, mensaje ni fecha del evento: no se pueden enviar por descuido.
4. **Sin ID configurado no se rastrea nada.** Si `VITE_GA_MEASUREMENT_ID` está vacío, no se
   carga ningún script de terceros ni se instala ninguna cookie.

---

## 2. Datos que NUNCA se envían

| Dato | Por qué |
|---|---|
| Nombre del visitante | Dato personal |
| Teléfono / WhatsApp | Dato personal |
| Mensaje libre del formulario | Puede contener cualquier cosa |
| **Fecha exacta del evento** | Combinada con el tipo de evento y la ciudad, puede identificar a una persona |
| Texto del mensaje de WhatsApp | Va en la query string del enlace; el listener global sólo lee el texto visible del enlace |

El tipo `AnalyticsProps` sólo permite `event_type` (la **categoría**: boda, quinceañera…),
nunca la fecha.

---

## 3. Catálogo de eventos

| Evento | Cuándo se dispara | Propiedades | Para qué sirve |
|---|---|---|---|
| `page_view` | En cada cambio de ruta de la SPA | `page_path`, `language` | Volumen y rutas más visitadas |
| `view_hero` | El hero entra en pantalla | `page_path` | Denominador del embudo |
| `click_primary_cta` | Clic en el CTA principal | `placement`, `page_path` | Eficacia del CTA de entrada |
| `view_demo_list` | El catálogo de demos entra en pantalla | `page_path` | Interés en ver muestras |
| `filter_demo` | Clic en un filtro de tipo de evento | `filter_value` | Qué eventos busca la audiencia |
| `view_demo` | Se abre una demo | `demo_id`, `language`, `source_page` | Qué diseños atraen más |
| `click_demo_lead` | «Quiero una invitación como esta» | `demo_id`, `placement` | Demos que generan intención |
| `view_pricing` | La sección de planes entra en pantalla | `page_path` | Llegada a la decisión de compra |
| `expand_plan_comparison` | Se despliega la tabla comparativa | `page_path` | Necesidad de más detalle |
| `select_plan` | Clic en el CTA de un plan | `plan_id`, `placement` | **Métrica comercial principal** |
| `start_lead_form` | Primer foco en un campo del formulario | `placement`, `language` | Inicio de la captación |
| `lead_form_error` | La validación falla o el envío falla | `error_reason`, `placement` | Fricción del formulario |
| `submit_lead_form` | El formulario se envía correctamente | `plan_id`, `demo_id`, `event_type`, `language`, `lead_submission_mode` | **Conversión principal** |
| `open_whatsapp` | Clic en cualquier enlace `wa.me` | `link_text`, `placement` | Conversión por canal directo |
| `change_language` | Se cambia ES ⇄ EN | `language` | Peso real del público en inglés |
| `view_faq` | La sección de FAQ entra en pantalla | `page_path` | Dudas antes de comprar |
| `seo_internal_link` | Clic en un enlace interno de una página SEO | `placement`, `source_page` | Navegación entre páginas SEO |

### Propiedades comunes

`trackEvent` añade automáticamente a **todos** los eventos:

- `page_path` — ruta actual (el componente puede sobrescribirla).
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` — si la sesión
  llegó con parámetros de campaña.

---

## 4. Cómo se evitan los duplicados

Tres mecanismos:

1. **`trackEventOnce(event, props, key)`** — para eventos de impresión disparados por
   `IntersectionObserver` (`view_pricing`, `view_hero`, `view_faq`, `view_demo_list`).
   Sin esta guarda, desplazarse arriba y abajo multiplicaría el evento y haría inservible
   el embudo. La `key` distingue instancias: `view_demo:boda` y `view_demo:quince` cuentan
   por separado.

2. **`resetOnceGuards()`** — se llama en cada cambio de ruta. En una página nueva,
   `view_pricing` vuelve a ser legítimo.

3. **`send_page_view: false` en la configuración de GA4** — las vistas de página de la SPA
   se registran a mano en cada cambio de ruta. Sin esta opción, GA4 contaría además su
   propia vista inicial y la primera página aparecería duplicada.

Para el formulario, `start_lead_form` usa una `ref` que se marca en el primer foco, de modo
que moverse entre campos no lo repite.

---

## 5. Embudo comercial

```text
page_view
   └─ view_hero
        └─ click_primary_cta  /  view_demo_list
             └─ view_demo ──────────┐
                  └─ click_demo_lead │
             └─ view_pricing         │
                  └─ select_plan ────┤
                       └─ start_lead_form
                            ├─ lead_form_error   (fricción)
                            └─ submit_lead_form  (CONVERSIÓN)
                                 └─ open_whatsapp
```

`lead_submission_mode` distingue si el lead salió por `whatsapp` (hoy) o por `api` (cuando
Studio esté conectado). Es la métrica que permitirá comparar los dos canales durante la
transición.

---

## 6. Qué mide hoy la web

**Decisión (2026-08-06): Vercel Web Analytics mide sin cookies y GA4 se activa sólo con consentimiento.**

Vercel Web Analytics permanece activo sin cookies. Google Analytics 4 usa la propiedad
`G-41L6G60R5C`, pero su script no se descarga hasta que el visitante acepta la analítica.
La elección se guarda localmente y puede cambiarse desde el botón “Cookies”.

### Lo que sí da, y lo que no

| | Estado |
|---|---|
| Visitas, páginas más vistas, país, dispositivo | ✅ plan gratuito |
| **Referente y parámetros UTM** — de qué anuncio o publicación vino cada visita | ✅ plan gratuito |
| Eventos del embudo (`select_plan`, `open_whatsapp`, `submit_lead_form`…) | ⚠️ **requieren plan Pro** |

Los eventos se envían igualmente; en el plan gratuito Vercel los descarta en silencio. Mientras
tanto, **la fuente de verdad de las conversiones sigue siendo el propio WhatsApp**: cada lead
llega ahí con el plan y la muestra que le interesaban escritos en el mensaje.

### Activación

1. En Vercel: Project → **Analytics** → *Enable Web Analytics*.
2. Volver a desplegar.

Si no se activa en el panel, el script no existe y no se mide nada. No rompe la web.
Para apagarlo del todo: `VITE_ENABLE_VERCEL_ANALYTICS=false`.

### Si algún día se quiere GA4 además

`ga4Provider` sigue implementado y se registra siempre; se activa solo en cuanto
`VITE_GA_MEASUREMENT_ID` tenga un ID válido. Los dos proveedores conviven sin tocar ningún
componente — para eso existe la capa. Eso sí: **GA4 sí instala cookies**, así que activarlo
obliga a revisar la política de privacidad y a plantearse el banner de consentimiento.

Conversiones a marcar en GA4 si se llega a activar: `submit_lead_form`, `select_plan` y
`open_whatsapp`.

---

## 7. Pendiente

- No hay eventos de scroll ni de tiempo en página; se han dejado fuera a propósito por ruido.

### Estado de instrumentación

| Evento | ¿Instrumentado? | Dónde |
|---|---|---|
| `page_view` | ✅ | `App.tsx` |
| `view_pricing` | ✅ | `PricingSection.tsx` |
| `expand_plan_comparison` | ✅ | `PricingSection.tsx` |
| `select_plan` | ✅ | `PricingSection.tsx` |
| `view_demo` | ✅ | `App.tsx` |
| `filter_demo` | ✅ | `PortfolioSection.tsx`, `DemoSelector.tsx` |
| `start_lead_form` | ✅ | `InquiryForm.tsx` |
| `lead_form_error` | ✅ | `InquiryForm.tsx` |
| `submit_lead_form` | ✅ | `InquiryForm.tsx` |
| `open_whatsapp` | ✅ | Listener global en `services/analytics` |
| `change_language` | ✅ | `LanguageContext.tsx` |
| `view_faq` | ✅ | `FaqSection.tsx` |
| `seo_internal_link` | ✅ | `SeoLandingPage.tsx` |
| `view_hero` | ⛔ **pendiente** | Falta en `HeroSection.tsx` |
| `click_primary_cta` | ⛔ **pendiente** | Falta en `HeroSection.tsx` / `Navbar.tsx` |
| `view_demo_list` | ⛔ **pendiente** | Falta en `PortfolioSection.tsx` |
| `click_demo_lead` | ⛔ **pendiente** | Falta en las tarjetas de demo y en la marca de agua |

Los cuatro pendientes están definidos en `AnalyticsEventName` y listos para usarse; sólo
falta añadir la llamada en el componente correspondiente.
