# Auditoría web — línea base (antes de los cambios)

**Fecha:** 2026-08-04
**Commit de referencia:** `2244fd5` (Merge remote changes into main)
**Alcance:** repositorio `INVIFTY` únicamente. No se inspeccionó ni modificó `invifty-studio`.

Este documento registra **hallazgos verificados ejecutando el proyecto**, no suposiciones.
Todo lo que no pudo confirmarse se marca explícitamente como *no verificado*.

---

## 1. Hallazgo crítico: doble fuente de verdad, y la raíz estaba desactualizada

El repositorio contenía dos copias completas y **divergentes** de la aplicación:

```text
INVIFTY/                    <- 69 archivos versionados
├── src/  index.html  public/
└── INVIFTY-main/           <- 69 archivos versionados (copia anidada)
    └── src/  index.html  public/
```

Ambas copias estaban **versionadas en git** (69 archivos cada una), no era una carpeta ignorada.

### Cómo se originó

| Commit | Fecha | Qué hizo |
|---|---|---|
| `5936571` | 2026-08-03 15:52 | Última fusión de la línea remota de GitHub → produjo `src/` en la **raíz** |
| `3fb940e` | 2026-08-03 16:32 | «Primer commit del proyecto» → añadió la carpeta **anidada** `INVIFTY-main/` (copia local, probablemente descomprimida de un ZIP) |
| `2244fd5` | 2026-08-03 16:40 | «Merge remote changes into main» → fusionó la línea remota **dentro** de la rama local, dejando **las dos copias conviviendo** |

### Dirección real de la divergencia (contraintuitiva)

La premisa habitual sería que la raíz es la versión buena y la anidada es basura. **Los datos demuestran lo contrario:**
la copia anidada era la **más reciente y la más correcta**, y contenía una ronda de correcciones comerciales
que nunca llegó a la raíz.

De 51 archivos en `src/`, sólo **16 divergían realmente** (el resto sólo diferían en fin de línea CRLF vs LF).

| Tema | Raíz (lo que Vercel desplegaba) | Anidada (más reciente) |
|---|---|---|
| Promesa de entrega | «Tu invitación lista en **48 horas**» | «lista en **3 a 5 días hábiles**» |
| Entrega por plan | 24–48 h / 48 h / 48–72 h / 3–5 días | 3–5 días hábiles (todos) · 5–7 (A medida) |
| Cuarto plan | «**Luxury**», precio fijo | «**A medida**» / «Custom», `isCustom`, precio «Desde» |
| Términos y condiciones | Prometía «servicio urgente de **24 horas**» | Sin promesa de 24 h; entregas cortas «caso a caso» |
| FAQ | Mencionaba «Urgente 24h» | Coherente con 3–5 días |
| Testimonio | «entregó todo en menos de 48 horas» | «entregó todo impecable y a tiempo» |
| Tagline | «ESTUDIO DIGITAL DE EVENTOS» | «EXPERIENCIA DIGITAL DE EVENTOS» |
| Páginas SEO | No existían | 6 páginas (`SeoLandingPage` + `seoPages.ts`) + sitemap |
| Selector de demos | No existía | `DemoSelector.tsx` |
| «Cómo funciona» | 3 pasos | 4 pasos (añade revisión/aprobación) |
| Evento analítico | `inquiry_submit` | `submit_lead` (+ `lead_source`, `page_path`) |

**Riesgo confirmado:** `vercel.json` está en la raíz y no define `rootDirectory`; Vercel construye desde la raíz
del repositorio. Por tanto **producción estaba sirviendo las promesas antiguas** («48 horas», «Urgente 24h»,
plan «Luxury») mientras las correcciones vivían en una carpeta que el build ignoraba.

Ningún archivo existía **sólo** en la raíz salvo `assets/.aistudio/.gitignore` (artefacto de AI Studio, sin valor
funcional). Es decir, promover la copia anidada no destruía ninguna funcionalidad.

> Resolución aplicada en la Fase 1, con confirmación explícita del responsable del negocio:
> promover anidada → raíz y eliminar la carpeta duplicada. Ver §6.

---

## 2. Estado de la construcción (línea base, antes de consolidar)

Ejecutado sobre la copia de la **raíz** (la que se desplegaba):

```bash
npm ci     # added 89 packages in 54s — sin errores
npm run lint   # tsc --noEmit — exit 0, CERO errores de TypeScript
npm run build  # ✓ built in 27.48s — sin errores
```

| Métrica | Valor |
|---|---|
| Errores de TypeScript | **0** |
| Estado del build | **correcto** |
| Bundle principal `index.js` | **323.63 kB** (gzip **98.20 kB**) |
| CSS | 77.10 kB (gzip 12.90 kB) |
| Chunks totales | 33 |
| Demos con carga diferida | 12 de 12 ✔ |
| Páginas legales diferidas | 2 de 2 ✔ |

**Positivo confirmado:** el code splitting ya funciona bien. Cada demo y cada página legal es un chunk
independiente cargado con `React.lazy`. Los iconos de `lucide-react` también se dividen por icono.

### Imágenes en el bundle

| Archivo | Tamaño |
|---|---|
| `wedding_couple_demo.webp` | 138.92 kB |
| `invifty_hero_bg.webp` | 119.17 kB |
| `quince_valeria_demo.webp` | 118.43 kB |
| `gala_corporate_demo.webp` | 90.89 kB |

Ya están en **WebP** — no hay imágenes enormes sin optimizar. Existen scripts
(`scripts/optimize-images.mjs`, `scripts/localize-images.mjs`) que soportan este flujo.

---

## 3. Configuración, entorno y secretos

| Punto | Estado |
|---|---|
| `.gitignore` | Existe y es correcto (`node_modules/`, `dist/`, `.env*` con excepción `!.env.example`) |
| `.env.example` | **No existe** |
| Uso de variables de entorno | **Ninguno.** La app no lee `import.meta.env` en ningún punto |
| Secretos en el repositorio | **Ninguno encontrado** ✔ |
| Número de WhatsApp | Centralizado en `src/config.ts` (`WHATSAPP_NUMBER = "18092693214"`) ✔ |
| ID de analítica | `GA_MEASUREMENT_ID = ""` **hardcodeado y vacío** en `src/utils/analytics.ts` |
| URL de Studio | No existe configuración alguna |

**Consecuencia verificada:** con `GA_MEASUREMENT_ID` vacío, `initAnalytics()` retorna de inmediato y
`trackEvent()` no envía nada. **Hoy no se está midiendo absolutamente ninguna conversión.** Todos los
eventos descritos en el código son código muerto en producción.

`vercel.json` sólo contiene el rewrite SPA. Correcto para React sin router de servidor.

---

## 4. SEO y metadatos (estado de la raíz, antes de consolidar)

| Elemento | Estado |
|---|---|
| `<title>` | Presente |
| `<meta description>` | Presente |
| Canonical | Presente (`https://invifty.com/`) — **sólo la home** |
| Open Graph | Completo (title, description, image 1200×630, locale, alternate) ✔ |
| Twitter Card | `summary_large_image` completo ✔ |
| `theme-color` | Presente ✔ |
| Iconos | favicon 32 + apple-touch-icon ✔ |
| `lang` | `es` en la raíz (la anidada ya usaba `es-DO`, más preciso) |
| JSON-LD | `Organization` (raíz) — la anidada añadía `WebSite` y `Service` con ofertas |
| `robots.txt` | Correcto: `Allow: /` + referencia a sitemap ✔ |
| `sitemap.xml` | Válido, pero en la raíz **no incluía las 6 páginas SEO** |
| `public/_redirects` | `/* /index.html 200` — correcto para SPA ✔ |

**Limitación estructural confirmada:** los metadatos por ruta se actualizan **sólo en cliente** (`App.tsx`
manipula `document.title` y la descripción tras el montaje). Los rastreadores que no ejecutan JavaScript y,
sobre todo, **los generadores de vista previa de WhatsApp, Facebook y Twitter, leen el HTML inicial** —
que es idéntico para todas las rutas. En la práctica: **toda demo o página SEO compartida por WhatsApp
muestra la tarjeta de la home**, no la suya. Esto no se puede resolver dentro de Vite sin prerenderizado.

---

## 5. Analítica actual

`src/utils/analytics.ts` implementa una capa mínima sobre `gtag` de GA4. Eventos declarados:

`whatsapp_click`, `view_demo`, `select_demo_style`, `view_pricing`, `select_plan`, `begin_brief`,
`submit_lead` (tras la consolidación; antes `inquiry_submit`).

Problemas confirmados:

1. **Está desactivada** (ID vacío) — no se mide nada.
2. **Acoplada a GA4.** `trackEvent` llama a `window.gtag` directamente; cambiar de proveedor obliga a tocar todos los llamadores.
3. **Cobertura parcial del embudo.** No existen `page_view` por ruta SPA, `view_demo_list`, `filter_demo`, `click_demo_lead`, `expand_plan_comparison`, `start_lead_form`, `lead_form_error`, `change_language`, `view_faq`.
4. **Sin UTM.** No se capturan ni propagan parámetros de campaña.
5. El listener global de `wa.me` envía `link_text` — texto visible del enlace. No es dato personal, pero conviene acotarlo.

---

## 6. Rutas y contenido

- **12 demos** interactivas, todas con carga diferida.
- **2 páginas legales** (Privacidad, Términos).
- **6 páginas SEO** (tras consolidar): hub + bodas + quinceañeras + cumpleaños + corporativos + planners.
- **1 página 404**.
- **4 planes**: Esencial (RD$1,200), Popular (RD$2,500), Premium (RD$4,000), A medida (desde RD$6,500).

### RSVP por plan (verificado en `src/data/pricingData.ts`)

El RSVP **no** está incluido en Esencial. Aparece por primera vez en Popular
(«Confirmación RSVP interactiva para invitados»). Es la diferencia principal que justifica el salto
RD$1,200 → RD$2,500.

---

## 7. Riesgo de contenido: testimonios no verificados

`src/data/testimonialsData.ts` contiene testimonios atribuidos a personas con nombre y evento.

**Confirmado con el responsable del negocio: son de ejemplo, no son testimonios reales verificados
ni cuentan con autorización de publicación.**

Publicar testimonios inventados como si fueran reales es un riesgo legal y reputacional, y contradice
la regla de no inventar prueba social. Queda registrado como **decisión pendiente bloqueante** antes de
cualquier publicación: retirarlos, sustituirlos por prueba social verificable, o reemplazarlos por
testimonios reales con permiso por escrito.

---

## 8. Deuda técnica y calidad

| Punto | Estado verificado |
|---|---|
| Errores de TypeScript | 0 ✔ |
| `any` en el código | Ninguno encontrado ✔ |
| Modo estricto de TS | **`strict` NO está activado** en `tsconfig.json` |
| Linter real (ESLint) | **No existe.** `npm run lint` sólo ejecuta `tsc --noEmit` |
| Formateador (Prettier) | No existe |
| Pruebas | **Ninguna.** No hay framework de test ni script `test` |
| CI (GitHub Actions) | **No existe** `.github/workflows/` |
| Carpeta `docs/` | **No existía** |
| `README.md` | **No existe** |
| Fin de línea | Mezcla CRLF (raíz) y LF (anidada); no hay `.gitattributes` |

### Tokens visuales

No existe una capa de tokens. Los valores de marca se repiten literalmente por todo el código:

- `#D4AF37` (dorado) — repetido en decenas de componentes
- `#0F1412`, `#0F0F0F`, `#FAF8F5`, `#E8E6E1` — repetidos como literales Tailwind arbitrarios

Cambiar el dorado de marca hoy exige una búsqueda y reemplazo global.

### Fuentes

`index.html` carga **5 familias** de Google Fonts con múltiples pesos e itálicas en una sola petición
bloqueante: Alex Brush, Cinzel, Cormorant Garamond, Montserrat, Playfair Display, Plus Jakarta Sans
(en realidad 6). Lleva `display=swap` ✔ y `preconnect` ✔, pero es un coste importante para el LCP.

---

## 9. Puntos NO verificados en esta fase

Para no presentar suposiciones como hallazgos, estos puntos quedan **pendientes de medición real**:

- Métricas Core Web Vitals (LCP, INP, CLS) — requieren Lighthouse sobre el sitio desplegado.
- Contraste real de color — requiere análisis automatizado por par de colores.
- Errores de consola en tiempo de ejecución — requieren navegador; el build no los revela.
- Scroll horizontal a 320 px — requiere inspección en navegador.
- Navegación por teclado completa — requiere prueba manual.
- Enlaces rotos — no se ejecutó rastreador.
- Dependencias sin uso — no se ejecutó `depcheck`.

---

## 10. Resumen ejecutivo

**Lo que está bien:** TypeScript limpio, build correcto, code splitting real de 12 demos, imágenes ya en
WebP, WhatsApp centralizado, sin secretos, Open Graph y robots correctos.

**Lo que era grave:**

1. Doble fuente de verdad con la **raíz desactualizada**, publicando promesas comerciales incorrectas.
2. **Analítica completamente inactiva** — cero medición del embudo.
3. **Testimonios no verificados** publicados como reales.
4. Metadatos por ruta sólo en cliente → **vistas previas de WhatsApp incorrectas** en demos y páginas SEO.
5. Sin `strict` de TypeScript, sin ESLint, sin pruebas, sin CI, sin documentación.
6. Sin tokens visuales — el color de marca está repetido como literal por todo el código.
