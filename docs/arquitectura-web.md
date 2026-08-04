# Arquitectura de la web

**Última actualización:** 2026-08-04

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

## 5. Limitación conocida: metadatos sólo en cliente

`App.tsx` actualiza `document.title` y la meta descripción **después** del montaje. Funciona
para Google (ejecuta JavaScript), pero **no** para los generadores de vista previa de
WhatsApp, Facebook y Twitter, que leen el HTML inicial y no ejecutan scripts.

**Consecuencia real:** compartir por WhatsApp el enlace de una demo o de una página SEO
muestra la tarjeta de la home, no la suya.

Dentro de Vite no tiene solución completa. Las salidas posibles, en orden de coste:

1. **Prerenderizado en el build** (`vite-plugin-ssg` o similar): genera un HTML por ruta con
   sus metadatos. Resuelve el problema sin cambiar de framework. **Opción recomendada.**
2. **Migración a Next.js**: resuelve además el SEO de contenido dinámico, pero es un cambio
   de framework completo.

No se ha hecho ninguna de las dos en este trabajo: quedaba fuera del alcance acordado.

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
