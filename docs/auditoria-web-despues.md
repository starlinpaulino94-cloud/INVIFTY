# Auditoría web — después de los cambios

**Fecha:** 2026-08-04
**Comparar con:** [`auditoria-web-antes.md`](./auditoria-web-antes.md)

---

## 1. Verificaciones ejecutadas

```bash
npm run lint   # tsc --noEmit → 0 errores
npm test       # 155 pruebas, 15 archivos → todas pasan
npm run build  # ✓ correcto
```

| Comprobación | Antes | Después |
|---|---|---|
| Errores de TypeScript | 0 *(engañoso, ver §2)* | **0 reales** |
| Modo `strict` de TS | ❌ desactivado | ✅ activado |
| Tipos de React instalados | ❌ **faltaban** | ✅ instalados |
| Pruebas automáticas | ❌ ninguna | ✅ **155** |
| CI | ❌ no existía | ✅ GitHub Actions |
| Build de producción | ✅ | ✅ |
| Secretos en el repositorio | ✅ ninguno | ✅ ninguno |
| Aplicaciones en el repositorio | ❌ **2 divergentes** | ✅ **1** |

---

## 2. El «0 errores» inicial era falso

`@types/react` y `@types/react-dom` **nunca estuvieron instalados**. Sin ellos y sin `strict`,
TypeScript trataba todo el JSX como `any` implícito y no comprobaba nada.

Al instalar los tipos y activar `strict` aparecieron **92 errores reales**:

| Tipo | Cantidad | Resolución |
|---|---|---|
| `TS6133` código muerto (imports, estado y funciones sin usar) | 87 | Eliminado |
| `TS2322` unión de tipos incumplida en el RSVP | 4 | Corregido |
| `TS2345` propiedad opcional sin comprobar | 1 | Corregido |

Hoy: **0 errores con `strict` activado**.

### Bugs reales encontrados

1. **El tipo del RSVP no coincidía con los datos.** `RsvpFormData.attendance` declaraba
   `"Confirmado" | "No podré asistir"`, pero los `<select>` de los demos emitían `"Declina"`
   en unos sitios y `"No podré asistir"` en otros. Funcionaba **por accidente**, porque el
   generador de mensajes sólo comprueba `=== "Confirmado"`. Se unificó a
   `"Confirmado" | "Declina"` y se eliminaron los dos `as any` que ocultaban el problema.

2. **`customPlan.badge` es opcional y se leía sin comprobar.** Si se quitaba el badge del plan
   a medida, la sección de precios reventaba.

3. **Cinco demos no daban ninguna respuesta al enviar el RSVP.** Llamaban a
   `setRsvpSubmitted(true)` pero nada leía ese estado: el visitante enviaba y no pasaba nada
   visible en la página.

4. **Dos demos tenían la música implementada pero sin control.** `AdultCumpleDemo` y
   `BridalShowerDemo` tenían `toggleMusic` completo y ningún botón que lo llamara: era
   imposible reproducir o detener el audio.

5. **Muro de deseos muerto en dos demos.** Estado y manejador completos, sin ninguna interfaz
   que los usara. Eliminado.

---

## 3. Repositorio

**Antes:** dos copias completas versionadas (69 archivos cada una), y la que Vercel desplegaba
—la raíz— era **la desactualizada**. Producción anunciaba «48 horas», «Urgente 24h» y el plan
«Luxury» mientras las correcciones vivían en una carpeta que el build ignoraba.

**Después:** una sola aplicación en la raíz. Detalle de lo migrado y lo descartado en
[`consolidacion-repositorio.md`](./consolidacion-repositorio.md).

Se añadió `.gitattributes` para que la mezcla CRLF/LF no vuelva a ocultar las diferencias
reales entre archivos.

---

## 4. Contenido y honestidad comercial

| Punto | Antes | Después |
|---|---|---|
| Promesa de entrega | «48 horas» + «Urgente 24h» | 3–5 días hábiles (5–7 a medida) |
| Cuarto plan | «Luxury», precio fijo | «A medida», precio «Desde» |
| Testimonios | 3 personas con nombre, ciudad, fecha y 5 ★ **inventadas** | Retirados; sustituidos por compromisos verificables |
| RSVP de las demos | Sin respuesta al enviar, o **«hemos registrado tu respuesta»** (falso) | Aviso explícito: «se abrió WhatsApp… los datos no se guardan» |
| Catálogo de demos | Filtrado por texto en español; sin filtro de aperturas | Categorías con id estable, 9 filtros incluido aperturas |
| Fuentes de datos de demos | **2** (catálogo + copia en DemoSelector) | **1** (`services/demos`) |
| Éxito del formulario | «¡Solicitud Enviada!» | «Se abrió WhatsApp… hasta entonces no la habremos recibido» |

El cambio de los testimonios es el más relevante en riesgo legal: presentaban personas
inventadas con valoración, ciudad y fecha. La etiqueta de 9 px «Historia Ilustrativa» no
compensaba la atribución. Ver [`catalogo-producto.md`](./catalogo-producto.md) §3.3.

Una prueba automática impide que «48 horas» vuelva a colarse en las traducciones.

---

## 5. Analítica

**Antes:** acoplada a GA4, con el ID vacío escrito en el código, cobertura parcial del embudo,
sin UTM y **sin medir absolutamente nada**.

**Después:** capa independiente del proveedor en `src/services/analytics/`.

- Lista **cerrada** de eventos: un nombre con errata no compila.
- Lista **cerrada** de propiedades **sin campos para datos personales**: no se puede enviar el
  nombre, el teléfono, el mensaje ni la fecha exacta del evento aunque se quiera.
- Deduplicación de eventos de impresión y reinicio al cambiar de ruta.
- Captura y propagación automática de UTM durante la sesión.
- `send_page_view: false` para que las vistas de la SPA no se dupliquen.

**13 de 17 eventos instrumentados.** Los 4 restantes (`view_hero`, `click_primary_cta`,
`view_demo_list`, `click_demo_lead`) están definidos y listos, pendientes de la llamada en su
componente. Detalle en [`plan-medicion.md`](./plan-medicion.md).

> ⚠️ La analítica **sigue sin medir nada en producción** hasta que se ponga un
> `VITE_GA_MEASUREMENT_ID` real en Vercel. Es una acción pendiente del negocio, no de código.

---

## 6. Captación de leads

**Antes:** el formulario construía una URL de WhatsApp a mano, sin consentimiento, sin estados
de carga ni error, sin protección contra doble envío, y decía «¡Solicitud Enviada!» aunque no
existiera ningún destinatario que la hubiera recibido.

**Después:** servicio desacoplado en `src/services/leads/`.

- Contrato `LeadPayload` común a los dos canales.
- Transporte de WhatsApp (actual) y transporte a Studio (implementado, **apagado**).
- Caída automática a WhatsApp si la API falla.
- Casilla de **consentimiento obligatoria**.
- Estados de carga, éxito y error; el botón se bloquea durante el envío.
- Validación accesible: `aria-invalid`, `aria-describedby`, resumen con foco y `role="alert"`.
- Normalización de teléfono a E.164 (acepta `809-269-3214`, `(809) 269 3214`, `+1 809…`).
- El plan y la demo elegidos se conservan y viajan al formulario y al mensaje de WhatsApp.

---

## 7. Rendimiento

| Recurso | Antes (raíz obsoleta) | Después |
|---|---|---|
| `index.js` | 323.6 kB / 98.2 kB gzip | **349.6 kB / 105.2 kB gzip** |
| CSS | 77.1 kB / 12.9 kB gzip | 78.9 kB / 13.1 kB gzip |
| Imagen de la tarjeta del hero | 135.7 kB | **78.2 kB** |
| Familias tipográficas bloqueantes | **6** | **2** |
| Preload del recurso LCP | ❌ no | ✅ sí |
| Carga inicial de la home | ~712 kB | **618.3 kB** |

El bundle inicial es sólo **26 kB mayor que la raíz original pese a incluir 6 páginas SEO, el
selector de demos y las capas de analítica y captación** que antes no existían. La
optimización recortó 26.8 kB de JavaScript, 57.5 kB de imagen crítica y 4 familias
tipográficas del camino bloqueante.

Detalle completo en [`presupuesto-rendimiento.md`](./presupuesto-rendimiento.md) §3–§4.

**No se ha medido LCP, INP ni CLS**: exige Lighthouse contra el sitio desplegado y no se ha
desplegado nada. Los bytes sí están medidos.

---

## 8. Sistema visual

**Antes:** sin tokens. `#D4AF37` repetido 220 veces sólo en `components/` y `pages/`; cambiar
el dorado de marca exigía búsqueda y reemplazo global.

**Después:** tokens en `@theme` (`src/index.css`). 319 literales sustituidos por utilidades de
token; quedan 30 valores puntuales (degradados y cromados de la maqueta de teléfono). Las
demos conservan sus paletas a propósito. Detalle en
[`sistema-visual.md`](./sistema-visual.md).

El CSS creció de 78.9 a 82.9 kB (+0.46 kB gzip) por las variables de tema. Es el precio de la
centralización y cabe de sobra en el presupuesto.

---

## 9. SEO técnico

**Antes:** `index.html` declaraba canonical **fijo a la portada** y ese HTML se servía en
todas las rutas. El sitemap pedía indexar 21 URLs y cada una respondía «soy un duplicado de la
home»: las 6 páginas SEO y las 12 muestras **no podían posicionar**. Open Graph tenía el mismo
problema, así que compartir cualquier demo por WhatsApp mostraba la tarjeta de la portada.

**Después:** metadatos por ruta en dos capas — en cliente para la navegación, y **21 HTML
generados en el build** con canonical, Open Graph y Twitter Card propios, para que los
rastreadores y las vistas previas los vean en la primera carga. Sin cambiar de framework.

El `sitemap.xml` pasó de archivo escrito a mano a generarse de la misma lista de rutas, así
que ya no puede desincronizarse. Detalle en [`seo-tecnico.md`](./seo-tecnico.md).

Pendiente: imagen social propia por demo (hoy todas comparten `og-image.jpg`) y confirmar en
producción que Vercel sirve los HTML por ruta.

---

## 10. Accesibilidad

Mejoras concretas y verificables:

- Control de música de las demos con `aria-pressed`, `aria-label` y área táctil de 44×44 px.
- Errores del formulario asociados a su campo con `aria-describedby`, y resumen con foco.
- Anillos de foco visibles (`focus-visible:ring`) en los controles nuevos.
- Altura mínima de 48 px en los campos y botones del formulario.
- Aviso de RSVP con `role="status"` y `aria-live="polite"`.
- Iconos decorativos marcados con `aria-hidden`.
- **36 textos que incumplían el contraste 4.5:1** subidos a `text-white/60` (7.1–7.3:1). Los
  ratios se calcularon, no se estimaron: `text-white/40` daba 3.8:1 sobre los fondos del sitio.
- Navbar: cierre con Escape, devolución del foco, `aria-expanded`, `aria-controls`, nombre
  accesible del cajón, `aria-pressed` en el selector de idioma y área táctil de 44 px.
- `scroll-margin-top` en las secciones para que la cabecera fija no tape los titulares al
  navegar por anclas.

`prefers-reduced-motion` **ya estaba implementado** en `src/index.css` (líneas 51–63): anula
animaciones, transiciones y desplazamiento suave. Se había listado como pendiente por error.

**No verificado** (requiere navegador): contraste real de todos los pares de color,
navegación completa con teclado y ausencia de scroll horizontal a 320 px. `text-white/35` y
`text-white/40` sobre fondos casi negros son los principales sospechosos de no llegar a 4.5:1.

---

## 9. Lo que sigue pendiente

### Bloqueante para publicar

1. **Definir las condiciones del plan «A medida»** (dominio, vídeo, soporte, renovación).
   Ver [`catalogo-producto.md`](./catalogo-producto.md) §4.2.
2. **Definir qué ocurre al vencer la vigencia** de cada plan.

### Importante

3. Configurar `VITE_GA_MEASUREMENT_ID` — sin él no se mide nada.
4. Medir Core Web Vitals con Lighthouse y verificar accesibilidad en navegador.
5. Instrumentar los 4 eventos restantes.
6. ~~Resolver la deuda de rendimiento §4.1 y §4.2~~ — **hecho**. Ver
   [`presupuesto-rendimiento.md`](./presupuesto-rendimiento.md) §4.

### Mejoras futuras

7. Prerenderizado para que las vistas previas de WhatsApp de demos y páginas SEO sean
   correctas (hoy todas muestran la tarjeta de la home).
8. ESLint y Prettier (hoy `lint` sólo comprueba tipos).
9. Adaptadores para el catálogo y las demos remotos cuando Studio publique sus endpoints.
