# Consolidación del repositorio — registro de migración

**Fecha:** 2026-08-04
**Decisión:** confirmada explícitamente por el responsable del negocio antes de ejecutarse.

## Decisión tomada

Se promovió la copia anidada `INVIFTY-main/` a la **raíz** del repositorio, y se eliminó la carpeta duplicada.

Esto es la **dirección contraria** a la suposición inicial. La evidencia que la justifica está en
[`auditoria-web-antes.md`](./auditoria-web-antes.md) §1: la carpeta anidada era la copia **más reciente**
y contenía una ronda de correcciones comerciales que nunca llegó a la raíz, mientras que Vercel construye
desde la raíz — es decir, **producción servía contenido obsoleto**.

## Método de verificación previo al borrado

1. Se compararon los dos árboles ignorando los fines de línea (`diff -rq --strip-trailing-cr`).
   De 51 archivos en `src/`, sólo **16 divergían realmente**; el resto sólo diferían en CRLF vs LF.
2. Se buscaron archivos existentes **sólo en la raíz** que se perderían al promover la copia anidada.
   Resultado: **ninguno con valor funcional** (ver «Descartado» más abajo).
3. Se comprobó que ninguna configuración de despliegue apuntara a la carpeta anidada:
   `vercel.json` no define `rootDirectory` y no hay ninguna referencia a `INVIFTY-main` en
   ningún `.json`, `.ts`, `.tsx`, `.html`, `.mjs`, `.yml` fuera de la propia carpeta.
4. Se copió la copia anidada sobre la raíz y se verificó que ambos árboles quedaran idénticos.
5. Se ejecutaron `npm run lint` y `npm run build` **antes** de borrar nada. Ambos correctos.
6. Sólo entonces se eliminó `INVIFTY-main/`.

## Migrado a la raíz

### Correcciones comerciales (el motivo principal de la consolidación)

| Elemento | Antes en la raíz | Ahora |
|---|---|---|
| Promesa global de entrega | «lista en 48 horas» | «lista en 3 a 5 días hábiles» |
| Entrega, plan Esencial | 24–48 horas | 3–5 días hábiles |
| Entrega, plan Popular | 48 horas | 3–5 días hábiles |
| Entrega, plan Premium | 48–72 horas | 3–5 días hábiles |
| Cuarto plan | «Luxury», precio fijo | «A medida» / «Custom», `isCustom: true`, precio «Desde» |
| Entrega, cuarto plan | 3–5 días hábiles | 5–7 días hábiles |
| Términos y condiciones | Prometía «servicio urgente de 24 horas» | Promesa retirada; entregas cortas «caso a caso por WhatsApp» |
| FAQ de entrega | Mencionaba «Urgente 24h» | Coherente con 3–5 días hábiles |
| FAQ de revisiones | «Luxury 4» | «A medida 4» |
| Testimonio | «en menos de 48 horas» | «impecable y a tiempo» |
| Tagline de marca | «ESTUDIO DIGITAL DE EVENTOS» | «EXPERIENCIA DIGITAL DE EVENTOS» |
| Subtítulo del hero | «En menos de 48 horas laborales» | «En 3 a 5 días hábiles» |

> Estas correcciones eliminan promesas que el negocio no sostenía. Su publicación era el riesgo
> comercial más urgente detectado en la auditoría.

### Funciones nuevas

| Archivo | Qué aporta |
|---|---|
| `src/data/seoPages.ts` | 6 páginas SEO con contenido único y extenso (hub, bodas, quinceañeras, cumpleaños, corporativos, planners) |
| `src/components/SeoLandingPage.tsx` | Renderiza esas páginas e inyecta JSON-LD (`BreadcrumbList` + `FAQPage`) |
| `src/components/DemoSelector.tsx` | Selector de demos en la home |

### Mejoras estructurales

| Archivo | Cambio |
|---|---|
| `index.html` | `lang="es"` → `lang="es-DO"`; JSON-LD ampliado con `WebSite` y `Service` (con las 4 ofertas y precios en DOP); descripciones más específicas |
| `public/sitemap.xml` | +6 URLs de las páginas SEO |
| `src/App.tsx` | Registro de rutas SEO; `key={currentPath}` en `RoutedPage` (corrige el estado residual al navegar entre rutas); metadatos por página SEO |
| `src/components/Footer.tsx` | Bloque de enlaces internos SEO por tipo de evento |
| `src/components/HowItWorks.tsx` | 3 → 4 pasos (añade «Revisa y aprueba tu diseño», que refleja las rondas de revisión reales) |
| `src/components/PricingSection.tsx` | Rejilla de 3 planes comparables + banda separada para «A medida»; precio con prefijo «Desde» |
| `src/components/InquiryForm.tsx` | Prefijo «Desde» en el plan a medida; evento `submit_lead` con `lead_source` y `page_path` |
| `src/components/HeroSection.tsx` | El CTA apunta a la sección `demos` en lugar de `portafolio` |
| `src/types.ts` | Campo `isCustom?: boolean` en `PricingPlan` |
| `src/data/pricingData.ts` | Filas nuevas en la comparación: «Invitados» (ilimitados en todos) y «Soporte» |
| `src/utils/analytics.ts` | `inquiry_submit` → `submit_lead` |

## Descartado

| Elemento | Motivo |
|---|---|
| `assets/.aistudio/.gitignore` | Único archivo que existía sólo en la raíz. Artefacto de Google AI Studio, sin valor funcional. Se conserva en el historial de git. |
| `INVIFTY-main/node_modules/` | Dependencias instaladas; se reinstalan con `npm ci`. Nunca estuvo versionado. |
| `INVIFTY-main/dist/` | Salida de build; se regenera. Nunca estuvo versionado. |
| `INVIFTY-main/package-lock.json` | El de la raíz es equivalente (mismas dependencias y versiones). Se conserva el de la raíz. |
| Diferencias de fin de línea CRLF/LF | Ruido, no contenido. Se añade `.gitattributes` para evitar que vuelva a aparecer. |

## Verificación posterior

```bash
npm run lint   # tsc --noEmit — exit 0, cero errores
npm run build  # ✓ correcto
```

El bundle principal creció de **323.63 kB → 365.45 kB** (gzip 98.20 → 109.34 kB). El aumento corresponde
al contenido de las 6 páginas SEO y al `DemoSelector`. `seoPages.ts` se importa de forma directa desde
`App.tsx` y `Footer.tsx`, por lo que su contenido entra en el bundle inicial aunque la página que lo
renderiza sí sea diferida. Queda anotado como tarea de rendimiento.

## Estado final

Existe **una sola aplicación oficial, en la raíz del repositorio**. Vercel debe construir desde la raíz
(sin `rootDirectory`), tal como ya está configurado.
