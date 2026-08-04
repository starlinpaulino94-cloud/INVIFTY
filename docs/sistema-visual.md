# Sistema visual

**Última actualización:** 2026-08-04
**Fuente única:** el bloque `@theme` de [`src/index.css`](../src/index.css)

---

## 1. Tokens

Antes, `#D4AF37` aparecía **220 veces sólo en `components/` y `pages/`** (478 en todo `src/`).
Cambiar el dorado de marca exigía una búsqueda y reemplazo global, con riesgo de dejar restos.

Ahora los valores viven en `@theme` y Tailwind genera una utilidad por token: definir
`--color-gold` habilita `text-gold`, `bg-gold`, `border-gold`, `from-gold`, `bg-gold/10`…

### Color

| Token | Valor | Uso |
|---|---|---|
| `gold` | `#D4AF37` | Acciones, estados activos y detalles destacados |
| `gold-hover` | `#F2D06B` | Estado hover del dorado |
| `gold-deep` | `#A37E2C` | Extremo oscuro de los degradados dorados |
| `surface-sunken` | `#0A0A0A` | Tarjetas y bloques hundidos |
| `surface` | `#0F0F0F` | Fondo base de página |
| `surface-card` | `#121212` | Tarjetas del catálogo |
| `surface-raised` | `#151515` | Secciones elevadas, campos de formulario |
| `surface-hover` | `#1A1A1A` | Estado hover de superficies |
| `ink` / `ink-soft` / `ink-muted` | blancos y grises | Texto |
| `whatsapp` | `#25D366` | Verde oficial del canal de contacto |

> **El dorado señala, no decora.** Se reserva para lo accionable o lo destacado. Usarlo como
> fondo extenso destruye la jerarquía: si todo brilla, nada destaca.

### Radios, sombras y transiciones

| Token | Valor |
|---|---|
| `--radius-card` | `1rem` |
| `--radius-pill` | `9999px` |
| `--shadow-gold` | `0 20px 50px -10px rgb(212 175 55 / 0.25)` |
| `--shadow-card` | `0 25px 60px -15px rgb(0 0 0 / 0.9)` |
| `--default-transition-duration` | `300ms` |

### Utilidades propias

| Clase | Qué hace |
|---|---|
| `.touch-target` | `min-height` y `min-width` de 44 px (WCAG 2.2, objetivo táctil) |
| `.font-serif-display` | Cinzel — **sólo demos**, carga bajo demanda |
| `.font-cormorant` | Cormorant Garamond — **sólo demos** |
| `.font-script` | Alex Brush — **sólo demos** |

Además, `section[id]` lleva `scroll-margin-top: 6rem` para que la cabecera fija no tape el
titular al navegar por anclas.

---

## 2. Las demos NO usan los tokens — a propósito

`src/demos/` conserva ~880 valores hexadecimales propios y **debe seguir así**. Cada demo
vende un diseño distinto (celestial azul y plata, neón magenta y cian, editorial marfil…):
unificar sus colores destruiría justo el producto que se está mostrando.

La regla queda fijada en una prueba: [`designTokens.test.ts`](../src/test/designTokens.test.ts)
verifica que el sitio comercial no tenga hexadecimales de marca sueltos **y** que las demos
sí conserven los suyos.

---

## 3. Contraste

Se midieron los ratios reales de blanco con transparencia sobre las tres superficies oscuras
del sitio:

| Opacidad | `surface-sunken` | `surface` | `surface-raised` | ¿Cumple 4.5:1? |
|---|---|---|---|---|
| `/30` | 2.61 | 2.65 | 2.69 | ❌ |
| `/35` | 3.15 | 3.19 | 3.23 | ❌ |
| `/40` | 3.77 | 3.81 | 3.85 | ❌ |
| `/45` | 4.48 | 4.53 | 4.50 | ❌ (al límite) |
| `/50` | 5.37 | 5.34 | 5.29 | ✅ |
| **`/60`** | **7.30** | **7.24** | **7.07** | ✅ con margen |

**36 usos** de `text-white/30`, `/35`, `/40` y `/45` incumplían el mínimo para texto normal.
Todos se subieron a `text-white/60`.

### Excepciones revisadas a mano

Dos elementos conservan `text-white/40` porque su umbral es **3:1**, no 4.5:1:

- **Número de paso** en «Cómo funciona» — texto grande (30 px). 3.85:1 ✅
- **Icono «no incluido»** de la tabla comparativa — gráfico con significado (WCAG 1.4.11).
  3.85:1 ✅. Además lleva texto `sr-only` con «No incluido», así que la información no
  depende sólo del color.

El separador `|` del selector de idioma se marcó con `aria-hidden`: es decorativo y no
necesita cumplir contraste.

Los umbrales quedan comprobados en `designTokens.test.ts`, que **recalcula los ratios**
en cada ejecución en vez de fiarse de valores anotados.

---

## 4. Navegación

Correcciones aplicadas al navbar:

| Problema | Corrección |
|---|---|
| El menú móvil no se cerraba con Escape | Manejador de `keydown` mientras está abierto |
| El foco se perdía al cerrar el menú | Se devuelve al botón que lo abrió |
| El botón no comunicaba si el menú estaba abierto | `aria-expanded` |
| El botón no estaba asociado al cajón | `aria-controls="menu-movil"` + `id` en el cajón |
| El cajón no tenía nombre accesible | `role="navigation"` + `aria-label` |
| El idioma activo se indicaba sólo con color | `aria-pressed` en los seis botones de idioma |
| Área táctil del hamburguesa ~40 px | `.touch-target` (44 px) |
| Listener de scroll bloqueante | `{ passive: true }` |
| Las anclas quedaban tapadas por la cabecera | `scroll-margin-top: 6rem` |

Ya funcionaba correctamente: el bloqueo del scroll de fondo y el cierre al navegar.

Verificado en [`Navbar.test.tsx`](../src/components/Navbar.test.tsx) (7 pruebas).

---

## 5. Estructura de secciones

Orden actual de la home:

1. Hero
2. Demos destacadas (`DemoSelector`)
3. Cómo funciona (`HowItWorks`)
4. Catálogo de invitaciones (`PortfolioSection`)
5. Capacidades (`BenefitsSection`)
6. Planes y comparación (`PricingSection`)
7. Compromisos (`TrustSection`)
8. Preguntas frecuentes (`FaqSection`)
9. Formulario (`InquiryForm`)
10. Pie

**No se reordenó.** La estructura ya coincide en lo esencial con el recorrido comercial
recomendado, y mover secciones altera el embudo de conversión sin forma de validar el
resultado sin datos. Ver §7.

### Por qué hay dos secciones de demos

No son redundantes:

- **`DemoSelector`** — 4 muestras curadas por tipo de evento, con carteles SVG propios y
  capacidades destacadas. Su función es *orientar* («¿cuál es la mía?»).
- **`PortfolioSection`** — las 12 demos con filtros por tipo de evento y fotografías. Su
  función es *explorar*.

Sí compartían un riesgo real: `DemoSelector` mantiene sus rutas en una lista propia, así que
podían quedar apuntando a demos inexistentes. Lo cubre
[`rutas.test.ts`](../src/test/rutas.test.ts), que verifica que **toda** ruta de demo —del
selector, del catálogo, de las páginas SEO y del sitemap— exista y esté registrada en `App.tsx`.

---

## 6. Reglas para mantenerlo

1. **Ningún hexadecimal de marca nuevo** en `src/components/` o `src/pages/`. Si hace falta un
   color, se añade como token en `@theme`. La prueba lo bloquea.
2. **El dorado señala.** Acciones, estados y acentos. Nunca fondos extensos.
3. **Texto sobre fondo oscuro: `text-white/60` como mínimo.** Por debajo sólo si es texto
   grande (≥24 px) o decorativo con `aria-hidden`.
4. **Todo control táctil: 44 px.** Usa `.touch-target`.
5. Las demos van por libre: no les impongas los tokens.

---

## 7. Pendiente de la Fase 2

Estos puntos del encargo **no se hicieron**, y conviene decirlo:

- **Sección «Qué resuelve Invifty»** — el recorrido recomendado la sitúa justo después del
  hero. Hoy ese trabajo lo hacen repartidos el subtítulo del hero y `BenefitsSection`
  (posición 5). Crear la sección es una decisión de contenido comercial.
- **Reordenar las secciones** — ver §5. Requiere criterio de negocio o datos de conversión.
- **Copy del hero** — se revisó contra el encargo y **no** cae en la frase genérica que se
  quería evitar: el subtítulo explica el producto de forma concreta («ubicación, cuenta
  regresiva, confirmación de asistencia y todos los detalles en un solo enlace») y los dos CTA
  tienen la jerarquía pedida. Se dejó intacto: reescribir la voz de marca sin el criterio del
  responsable sería excederse.
- **Verificación en navegador** — contraste calculado matemáticamente, pero no comprobado con
  una herramienta sobre la página renderizada; tampoco el recorrido completo con teclado ni la
  ausencia de scroll horizontal a 320 px.
