# Invifty — Web pública

Web comercial de **Invifty**, estudio de invitaciones digitales premium para bodas,
quinceañeros, cumpleaños, baby showers, bautizos, eventos corporativos y aperturas.

## Objetivo

La web tiene cuatro trabajos, en este orden:

1. Comunicar qué hace Invifty y para quién.
2. Enseñar invitaciones reales mediante **12 demos interactivas**.
3. Ayudar a elegir el plan adecuado.
4. Convertir visitas en leads medibles.

Invifty no vende «invitaciones bonitas»: vende **una experiencia digital del evento** donde
los invitados encuentran información, confirman asistencia, ven la ubicación, el cronograma
y los regalos desde un único enlace que se comparte por WhatsApp.

---

## Stack

- **React 19** + **TypeScript 5.8** en modo `strict`
- **Vite 6** (build y dev server)
- **Tailwind CSS 4** (plugin oficial de Vite)
- **lucide-react** (iconos)
- **Vitest** + **Testing Library** (pruebas)
- Despliegue en **Vercel**

Sin router externo: el enrutado es un mapa de rutas propio en `src/App.tsx` sobre la
History API. Sin librería de estado: `Context` basta para idioma y selección.

---

## Instalación

```bash
npm ci
npm run dev      # http://localhost:3000
```

Requiere Node.js 20 o superior.

---

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en el puerto 3000 |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build de producción |
| `npm run lint` | Comprobación de tipos (`tsc --noEmit`) |
| `npm test` | Pruebas con Vitest |
| `npm run test:watch` | Pruebas en modo vigilancia |
| `npm run optimize:images` | Optimiza imágenes con sharp |

---

## Variables de entorno

Copia `.env.example` a `.env.local`. **Todas son opcionales**: sin ningún `.env` la web
funciona con los valores por defecto de `src/config/env.ts`.

| Variable | Por defecto | Para qué |
|---|---|---|
| `VITE_SITE_URL` | `https://invifty.com` | Base de canonical y Open Graph |
| `VITE_WHATSAPP_NUMBER` | `18092693214` | Número de contacto, sólo dígitos |
| `VITE_GA_MEASUREMENT_ID` | *(vacío)* | GA4. Vacío = **sin analítica ni cookies** |
| `VITE_STUDIO_API_URL` | *(vacío)* | API pública de Studio (aún no existe) |
| `VITE_ENABLE_STUDIO_LEADS` | `false` | Feature flag de la integración con Studio |

> ⚠️ Todo lo que lleva el prefijo `VITE_` **es público**: queda incrustado en el JavaScript
> que descarga el visitante. Nunca pongas ahí una clave de API ni un secreto.

---

## Estructura

```text
src/
├── components/       Secciones de la página
│   └── common/       Componentes reutilizables entre demos
├── config/           Configuración de marca + lectura y validación de entorno
├── context/          Idioma (ES/EN) y selección de plan/demo
├── data/             Planes, FAQ, portafolio, páginas SEO  ← fuente única
├── demos/            Las 12 invitaciones de muestra (carga diferida)
├── pages/            Páginas legales
├── services/
│   ├── analytics/    Capa de analítica independiente del proveedor
│   ├── demos/        Catálogo de muestras (estático hoy, Studio mañana)
│   ├── leads/        Envío de leads (WhatsApp hoy, Studio mañana)
│   └── seo/          Metadatos por ruta (canonical, Open Graph)
├── test/             Configuración de las pruebas
└── utils/            Utilidades (WhatsApp, RSVP)
```

---

## Tareas frecuentes

### Añadir una demo

1. Crear `src/demos/MiDemo.tsx` (recibe `onBackToHome: () => void`).
2. Registrarla con `lazy()` en el mapa `ROUTES` de `src/App.tsx`, bajo `/muestra/<slug>`.
3. Añadir su ficha a `PORTFOLIO_ITEMS` con todos los campos (`category`, `style`,
   `minimumPlan`, `features`, `image`, `demoPath`).
4. Añadir la URL a `public/sitemap.xml` **sólo si debe indexarse**.
5. `npm test` — las pruebas verifican ruta registrada, coherencia del plan mínimo, RSVP
   honesto, CTA de retorno, marca de agua y música apagada al iniciar.

Detalle en [`docs/catalogo-demos.md`](docs/catalogo-demos.md).

### Modificar un plan

Ver [`docs/catalogo-producto.md`](docs/catalogo-producto.md) §5. En resumen: edita
`src/data/pricingData.ts` y ejecuta `npm test` — hay una prueba que detecta si las tarjetas
y la tabla comparativa se contradicen.

### Cambiar el número de WhatsApp

Sólo en `VITE_WHATSAPP_NUMBER` (o, como respaldo, en `src/config/env.ts`). Está centralizado:
ningún componente lo escribe a mano.

### Configurar la analítica

Pon un ID de GA4 en `VITE_GA_MEASUREMENT_ID`. Sin él no se carga ningún script de terceros.
El catálogo de eventos está en [`docs/plan-medicion.md`](docs/plan-medicion.md).

---

## Pruebas

```bash
npm test
```

155 pruebas que cubren: coherencia del catálogo de planes, normalización de teléfonos,
construcción del `LeadPayload`, mensajes de WhatsApp, caída a WhatsApp si falla la API,
deduplicación de eventos analíticos, captura de UTM, completitud de las traducciones, el
flujo completo del formulario (validación, accesibilidad, doble envío, contexto conservado),
los tokens visuales y el contraste, la accesibilidad del navbar por teclado, y la integridad
de todas las rutas de demos y del sitemap, y el render de las muestras destacadas
(secciones presentes, menú sin enlaces rotos, música apagada al iniciar y campos del RSVP
que llegan al mensaje de WhatsApp).

---

## Despliegue

**Vercel debe construir desde la RAÍZ del repositorio.** No configures `Root Directory`.

| Ajuste | Valor |
|---|---|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm ci` |

`vercel.json` sólo contiene el rewrite de SPA (`/(.*) → /index.html`), necesario porque el
enrutado es de cliente. **Vercel aplica ese rewrite después de comprobar el sistema de
archivos**, así que los 21 HTML por ruta que genera el build se sirven correctamente y el
rewrite sólo actúa en rutas inexistentes. Ver [`docs/seo-tecnico.md`](docs/seo-tecnico.md) §4.

El `sitemap.xml` se genera en el build; no lo edites a mano.

> El repositorio contenía una copia anidada `INVIFTY-main/` con una versión **más reciente**
> que la raíz que Vercel desplegaba. Se consolidó y se eliminó. El detalle está en
> [`docs/consolidacion-repositorio.md`](docs/consolidacion-repositorio.md).

---

## Documentación

| Documento | Contenido |
|---|---|
| [`docs/auditoria-web-antes.md`](docs/auditoria-web-antes.md) | Estado inicial verificado |
| [`docs/auditoria-web-despues.md`](docs/auditoria-web-despues.md) | Estado tras los cambios |
| [`docs/consolidacion-repositorio.md`](docs/consolidacion-repositorio.md) | Qué se migró y qué se descartó |
| [`docs/catalogo-producto.md`](docs/catalogo-producto.md) | Planes y **decisiones comerciales pendientes** |
| [`docs/sistema-visual.md`](docs/sistema-visual.md) | Tokens, contraste y reglas de UI |
| [`docs/catalogo-demos.md`](docs/catalogo-demos.md) | Servicio de demos, categorías y honestidad del RSVP |
| [`docs/seo-tecnico.md`](docs/seo-tecnico.md) | Metadatos por ruta, prerenderizado y sitemap |
| [`docs/plan-medicion.md`](docs/plan-medicion.md) | Eventos de analítica y privacidad |
| [`docs/presupuesto-rendimiento.md`](docs/presupuesto-rendimiento.md) | Límites de bundle y deuda de rendimiento |
| [`docs/integracion-futura-studio.md`](docs/integracion-futura-studio.md) | Endpoints que Studio debe exponer |

---

## Proyecto relacionado

**`invifty-studio`** es el sistema interno (pedidos, clientes, producción, publicación). Vive
en otro repositorio y **no se modifica desde aquí**. La web está preparada para conectarse
con él mediante feature flags; hoy esa integración está apagada.
