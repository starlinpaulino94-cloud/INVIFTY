# Arquitectura de la web

**Última actualización:** 2026-08-04

---

## 0. Alcance: qué es y qué NO es este repositorio

**Este repositorio es el escaparate comercial de Invifty. Nada más.**

**Decisión confirmada (2026-08-04):** las invitaciones reales de clientes **se generan y
publican desde Invifty Studio**, que es un proyecto independiente en otro repositorio.

| Pieza | Dónde vive |
|---|---|
| Portada, planes, contenido SEO, formulario de captación | **Aquí** |
| Las 12 **muestras** de invitación (ficticias, públicas) | **Aquí** |
| Invitaciones **reales** de clientes | Studio |
| Panel del anfitrión para ver confirmaciones | Studio |
| Pedidos, pagos, producción y publicación | Studio |

### Qué implica para este código

1. **Las 12 demos son material de marketing, no plantillas de producción.** Viven aquí porque
   su trabajo es convencer a un visitante, no atender a los invitados de un evento real.
2. **Su RSVP seguirá abriendo WhatsApp.** No deben conectarse nunca al endpoint de
   confirmaciones de Studio: son públicas y con datos ficticios, y ensuciarían los datos de
   eventos reales. Ver [`integracion-futura-studio.md`](./integracion-futura-studio.md) §5.
3. **Aquí no se construirá un panel de administración.** Si algún día se enlaza el de Studio,
   sería sólo un enlace externo.
4. **La ausencia de backend deja de ser deuda técnica.** Es la arquitectura decidida: este
   sitio es estático a propósito, y lo único que sale de él son leads.

---

## 1. Forma general

SPA de React servida como estático desde Vercel. Sin servidor propio y sin backend: hoy la
web es 100 % cliente, y el único canal de salida de datos es un enlace a WhatsApp.

```text
Navegador
   │
   ├── index.html            metadatos base + JSON-LD + fuentes
   ├── index.js              App, contextos, secciones de la home
   └── chunks diferidos      cada demo, páginas legales, páginas SEO, VipPassModal
```

## 2. Enrutado

No hay React Router. `src/App.tsx` mantiene un mapa `ROUTES: Record<string, Component>` y
gestiona la History API a mano.

- `/` → home (secciones en una sola página)
- `/muestra/<slug>` → una de las 12 demos
- `/invitaciones-digitales[/<tema>]` → 6 páginas SEO
- `/privacidad`, `/terminos` → páginas legales
- cualquier otra → `NotFoundPage`

`vercel.json` y `public/_redirects` reescriben todo a `index.html` para que las URLs directas
funcionen.

**Detalle importante:** `<RoutedPage key={currentPath} …>`. Sin esa `key`, React reutiliza la
instancia al pasar de una demo a otra y se arrastra el estado de la anterior (formulario RSVP
a medio llenar, audio activo).

## 3. Capas

```text
componentes  ──▶  services/   ──▶  proveedor concreto
   │                  │
   │                  ├── analytics/  → GA4 (o el que se registre)
   │                  └── leads/      → WhatsApp | API de Studio
   │
   └──▶  data/        catálogos tipados (fuente única)
   └──▶  context/     idioma, selección de plan/demo
   └──▶  config/      marca + entorno validado
```

La regla que sostiene esto: **un componente nunca habla con un proveedor**. Llama a
`trackEvent(...)` o a `submitLead(...)` y no sabe qué hay detrás. Por eso cambiar de
herramienta de analítica, o pasar de WhatsApp a la API de Studio, no obliga a tocar la UI.

### 3.1 `config/`

`env.ts` es el único punto donde se lee `import.meta.env`. Valida los valores al arrancar
(formato del teléfono, formato del ID de GA4, coherencia del feature flag de Studio) y avisa
por consola **sólo en desarrollo**.

`studioLeadsEnabled` exige flag **y** URL: un flag mal puesto nunca deja el formulario sin
canal de envío.

### 3.2 `services/analytics/`

- `types.ts` — uniones cerradas de eventos y propiedades. La lista de propiedades **no tiene
  campos para datos personales**, así que no se pueden enviar por descuido.
- `index.ts` — despacha a los proveedores, añade `page_path` y UTM automáticamente, y
  gestiona la deduplicación de eventos de impresión.
- `ga4Provider.ts` — implementación de GA4. Si no hay ID, no carga nada.
- `utm.ts` — captura los UTM de la URL y los conserva en `sessionStorage` durante la sesión.

### 3.3 `services/leads/`

- `types.ts` — `LeadPayload`, el contrato que consumen los dos canales.
- `validation.ts` — normalización de teléfono a E.164 y validación. Devuelve **identificadores**
  de error, no textos: el componente decide el idioma y la analítica registra el identificador.
- `whatsappTransport.ts` — redacta el mensaje y **devuelve** la URL; no abre ventanas (eso debe
  ocurrir dentro del gesto del usuario, en el componente).
- `studioTransport.ts` — implementado y **apagado**. Con `Idempotency-Key` y timeout.
- `index.ts` — elige canal y **cae a WhatsApp si la API falla**.

### 3.4 `context/`

- `LanguageContext` — ES/EN, persistido en `localStorage`, sincroniza `<html lang>`.
- `SelectionContext` — plan y demo elegidos, en `sessionStorage`. Sobrevive a cambios de ruta,
  al cambio de idioma y a una recarga, porque el recorrido real es «ver demo → mirar planes →
  bajar al formulario».

### 3.5 `data/`

Catálogos tipados: planes, FAQ, portafolio, páginas SEO. **Fuente única**: ningún componente
escribe un precio o un plazo a mano. Una prueba automática vigila que las tarjetas de precio y
la tabla comparativa no se contradigan.

---

## 4. Internacionalización

Diccionario plano `Record<Language, Record<string, string>>` en `LanguageContext`, más el
patrón `Localized { es, en }` en los catálogos, resuelto con el helper `lx()`.

Una prueba verifica que ambos idiomas tengan exactamente las mismas claves: una clave sin
traducir aparecería en pantalla como su identificador.

---

## 5. Metadatos por ruta — resuelto

`App.tsx` actualiza el `<head>` **después** del montaje, lo que sirve para Google (ejecuta
JavaScript) pero **no** para los generadores de vista previa de WhatsApp, Facebook y Twitter,
que leen el HTML inicial.

Se resolvió con un plugin de build que genera **un `index.html` por ruta indexable** con sus
metadatos ya escritos. No es renderizado en servidor: sólo se sustituyen las etiquetas del
`<head>`; el HTML sigue siendo la misma cáscara y React monta igual. Sin cambiar de framework.

**Verificado en producción el 2026-08-04:**

```
/                              canonical: https://invifty.com/
/muestra/boda-camila-y-lucas   canonical: https://invifty.com/muestra/boda-camila-y-lucas
/invitaciones-digitales/bodas  canonical: https://invifty.com/invitaciones-digitales/bodas
```

Las 21 rutas sirven título, descripción, canonical y Open Graph propios. Compartir una demo
por WhatsApp muestra su tarjeta, no la de la portada.

Detalle en [`seo-tecnico.md`](./seo-tecnico.md).

---

## 6. Decisiones deliberadas

| Decisión | Motivo |
|---|---|
| Sin React Router | 20 rutas estáticas; el mapa propio pesa menos que la librería |
| Sin gestor de estado | Dos contextos pequeños bastan |
| Catálogo en código, no remoto | No hay backend; `data/` es la fuente única y sirve de respaldo cuando llegue Studio |
| WhatsApp como canal principal | Es como compra realmente el público objetivo en RD |
| `sessionStorage`, no `localStorage`, para selección y UTM | Es contexto de una visita, no seguimiento persistente |
| Transporte de leads que devuelve la URL en vez de abrirla | Abrir ventanas fuera del gesto del usuario lo bloquea el navegador; además hace el servicio testeable |
