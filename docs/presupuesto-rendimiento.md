# Presupuesto de rendimiento

**Última actualización:** 2026-08-04

---

## 1. Objetivos de Core Web Vitals

| Métrica | Objetivo | Estado |
|---|---|---|
| LCP | ≤ 2.5 s | **No medido** — requiere Lighthouse sobre el sitio desplegado |
| INP | ≤ 200 ms | **No medido** |
| CLS | ≤ 0.1 | **No medido**, pero el riesgo estructural está descartado (ver §4) |

> Estas métricas **no se han medido**: exigen ejecutar Lighthouse contra el sitio ya
> desplegado, y no se ha desplegado nada. Lo que sí se ha medido son los bytes. Ver §6.

---

## 2. Presupuesto de bundle

| Recurso | Límite | Actual | Estado |
|---|---|---|---|
| JS inicial (`index.js`) | ≤ 400 kB sin comprimir | **349.6 kB** | ✅ |
| JS inicial comprimido | ≤ 120 kB gzip | **105.2 kB** | ✅ 88 % del límite |
| CSS | ≤ 100 kB / 20 kB gzip | 78.9 kB / 13.1 kB | ✅ |
| Chunk de una demo | ≤ 50 kB | máx. 41.9 kB (`BodaDemo`) | ✅ |
| Imagen individual | ≤ 200 kB | máx. 138.9 kB | ✅ |
| Familias tipográficas bloqueantes | ≤ 2 | **2** | ✅ |
| Carga inicial de la home | ≤ 700 kB sin comprimir | **618.3 kB** | ✅ |

---

## 3. Resultados de la optimización

### Bundle JavaScript inicial

| Momento | `index.js` | gzip |
|---|---|---|
| Raíz original (obsoleta, sin páginas SEO) | 323.6 kB | 98.2 kB |
| Tras consolidar (con páginas SEO) | 365.5 kB | 109.3 kB |
| Tras servicios, formulario y limpieza | 376.4 kB | 113.8 kB |
| **Tras optimizar el rendimiento** | **349.6 kB** | **105.2 kB** |

**−26.8 kB sin comprimir, −8.6 kB gzip (−7.5 %)** respecto al paso anterior. El bundle actual
es sólo 26 kB mayor que la raíz original **pese a incluir 6 páginas SEO, el selector de demos
y las capas de analítica y captación de leads que antes no existían**.

### Carga inicial completa de la home

| Recurso | Antes | Después |
|---|---|---|
| `index.js` | 376.4 kB | 349.6 kB |
| CSS | 78.7 kB | 78.9 kB |
| Imagen del hero (fondo) | 116.4 kB | 116.4 kB |
| Imagen de la tarjeta del hero | 135.7 kB | **78.2 kB** |
| Familias tipográficas bloqueantes | **6** | **2** |
| **Total sin comprimir** | ~712 kB | **618.3 kB** |

---

## 4. Qué se hizo

### 4.1 ✅ Las páginas SEO salieron del bundle inicial — *el mayor ahorro*

`seoPages.ts` pesa ~36 kB de texto. Lo importaban `App.tsx` (para registrar rutas y
metadatos) y `Footer.tsx` (para los enlaces internos), así que **todo el contenido de las 6
páginas viajaba en la primera carga** aunque el componente que lo renderiza sí fuera diferido.

Se dividió en dos:

- [`seoPageIndex.ts`](../src/data/seoPageIndex.ts) — ruta, título, descripción y etiqueta de
  navegación. Es lo único que necesitan la home y el pie.
- [`seoPages.ts`](../src/data/seoPages.ts) — el cuerpo completo, importado **sólo** por
  `SeoLandingPage`, que es un chunk aparte.

**Resultado:** el chunk `SeoLandingPage` pasó de 8.1 kB a 38.1 kB (absorbió el contenido) y el
bundle inicial bajó 26.8 kB.

El precio de la división es que el título y la descripción viven en dos archivos. Una prueba
([`seoPages.test.ts`](../src/data/seoPages.test.ts)) verifica que no se desincronicen.

### 4.2 ✅ Seis familias tipográficas → dos

`index.html` cargaba Alex Brush, Cinzel, Cormorant Garamond, Montserrat, Playfair Display y
Plus Jakarta Sans en una única petición **que bloquea el renderizado de todas las páginas**.

La auditoría del código reveló que:

- **Cinzel, Cormorant Garamond y Alex Brush se usan sólo en 4 demos** (`BodaDemo`,
  `CorporateDemo`, `EditorialBodaDemo`, `QuinceCelestialDemo`). Nunca en la home.
- **Plus Jakarta Sans no se usaba nunca.** Sólo figuraba como respaldo detrás de Montserrat
  en `--font-sans`: si Montserrat carga, Jakarta no llega a mostrarse jamás. Se descargaba
  para nada.

Ahora:

- `index.html` carga **sólo Montserrat y Playfair Display**, las dos familias de la home.
- Las tres familias de demo se piden bajo demanda desde
  [`demoFonts.ts`](../src/utils/demoFonts.ts) mediante el hook
  [`useDemoFonts()`](../src/hooks/useDemoFonts.ts), al montarse la demo. El `preconnect` a
  Google Fonts sigue en el HTML, así que la conexión ya está abierta.
- Plus Jakarta Sans se eliminó por completo.

Una prueba ([`demoFonts.test.ts`](../src/utils/demoFonts.test.ts)) impide la regresión en las
dos direcciones: una demo que use esas clases sin llamar al hook, o un componente de la home
que las use (donde nunca se cargarían).

### 4.3 ✅ Preload de la imagen LCP

La imagen del hero no podía precargarse a mano porque Vite le añade un hash en cada build.
Se añadió un plugin en [`vite.config.ts`](../vite.config.ts) que localiza el recurso emitido e
inyecta la etiqueta con su nombre definitivo:

```html
<link rel="preload" as="image" href="/assets/invifty_hero_bg-I_TQXL3q.webp"
      type="image/webp" fetchpriority="high">
```

Se precarga **sólo esa imagen**: precargar de más compite por ancho de banda con el propio
recurso LCP y empeora justo lo que se quiere mejorar.

### 4.4 ✅ Imagen de la tarjeta del hero reducida

`wedding_couple_demo.webp` (896×1200, 135.7 kB) se mostraba en la maqueta de teléfono del
hero, que mide **280–300 px de ancho**. Se generó `wedding_couple_card.webp` a 640 px
(78.2 kB), suficiente para pantallas retina.

La imagen completa sigue usándose en `BodaDemo`, donde sí se muestra a pantalla completa, y
ahora sólo se descarga al abrir esa demo.

**Ahorro: 57.5 kB en la ruta crítica**, en una imagen que se carga de forma inmediata y
competía con el recurso LCP.

### 4.5 ✅ Galerías de demos con carga diferida

Las galerías de `BodaDemo` y `CumpleDemo` cargaban todas sus fotos de inmediato pese a estar
muy por debajo del pliegue. Se les añadió `loading="lazy"` y `decoding="async"`.

---

## 5. Correcciones a la auditoría anterior

Dos puntos que este documento daba por problemáticos **resultaron estar ya resueltos**. Se
corrigen aquí para no dejar constancia de un riesgo que no existe:

### 5.1 CLS por imágenes sin dimensiones — riesgo **descartado**

La versión anterior señalaba «riesgo de CLS: sin dimensiones declaradas el contenido salta».
Al revisar cada `<img>` una por una, **todas están dentro de contenedores con altura fija en
CSS** (`h-56`, `h-52 sm:h-56`, `h-64 sm:h-72`) o en `absolute inset-0`. El navegador reserva
el espacio antes de que la imagen cargue, así que no hay desplazamiento.

Se añadieron `width`/`height` a las dos imágenes del hero de todos modos, porque no cuesta
nada y ayuda al navegador a calcular la relación de aspecto, pero **no era la corrección de un
fallo**.

### 5.2 `prefers-reduced-motion` — ya estaba implementado

La versión anterior lo listaba como «sin verificar». Está resuelto en
[`src/index.css`](../src/index.css) líneas 51–63: con la preferencia activada se anulan
animaciones, transiciones y el desplazamiento suave en todo el sitio.

---

## 6. Lo que sigue sin medir

Los bytes están medidos; **el tiempo no**. Falta ejecutar contra el sitio desplegado:

```bash
npm run build
npm run preview
npx lighthouse http://localhost:4173 --view --preset=desktop
npx lighthouse http://localhost:4173 --view   # móvil
```

Y comprobar en navegador:

- Ausencia de scroll horizontal a **320 px**.
- Navegación completa con teclado (Tab / Shift+Tab / Escape).
- Consola sin errores al recorrer las 12 demos.
- Contraste real de los pares con más riesgo: `text-white/35` y `text-white/40` sobre
  fondos casi negros.
- Que la fuente de las demos no produzca un salto de texto perceptible al cargarse bajo
  demanda (usa `display=swap`, así que habrá un breve FOUT: es el intercambio deliberado a
  cambio de no bloquear la home).

---

## 7. Deuda de rendimiento restante

| Punto | Impacto | Nota |
|---|---|---|
| `index.js` sigue en 349.6 kB | Medio | Gran parte es React 19 + React DOM (~140 kB). El código propio ronda los 200 kB |
| `quince_valeria_demo.webp` (118 kB) y `gala_corporate_demo.webp` (91 kB) | Bajo | Se muestran en tarjetas con `loading="lazy"`; no están en la ruta crítica |
| Sin AVIF | Bajo | WebP ya da buena compresión; AVIF ahorraría ~20 % más a cambio de complejidad |
| Sin `srcset` responsive | Bajo | Las imágenes ya están dimensionadas para su uso |

---

## 8. Reglas para no romper el presupuesto

1. Antes de añadir una dependencia, comprobar cuánto suma al bundle inicial.
2. Toda ruta o modal nuevo entra con `React.lazy`.
3. **Nada de contenido extenso importado desde `App.tsx` o `Footer.tsx`**: acaba en el bundle
   inicial. Si hace falta, separar índice ligero y cuerpo, como en §4.1.
4. **Ninguna fuente nueva en `index.html`.** Si una demo necesita otra familia, va por
   `demoFonts.ts`.
5. Toda imagen nueva: WebP, dimensionada para su uso real, y `loading="lazy"` si está bajo el
   primer viewport.
6. Si `index.js` supera los **120 kB gzip**, resolver antes de seguir añadiendo.
