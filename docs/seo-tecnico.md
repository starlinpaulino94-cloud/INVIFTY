# SEO técnico

**Última actualización:** 2026-08-04
**Servicio:** [`src/services/seo/`](../src/services/seo/)
**Prerenderizado:** [`scripts/prerender-plugin.mjs`](../scripts/prerender-plugin.mjs)

---

## 1. El fallo que se corrigió

`index.html` declaraba un canonical **fijo a la portada**:

```html
<link rel="canonical" href="https://invifty.com/" />
```

Como es un SPA, ese mismo HTML se servía en **todas** las rutas. El resultado:

- El `sitemap.xml` pedía a Google indexar **21 URLs**.
- Cada una de esas 21 URLs respondía «soy un duplicado de la portada».

Las dos señales se contradicen, y el canonical gana. En la práctica, **las 6 páginas
de contenido SEO y las 12 muestras no podían posicionar**: Google las visitaba y las
descartaba como duplicados.

Lo mismo pasaba con Open Graph: `og:title`, `og:description` y `og:url` eran siempre los de
la portada, así que **compartir cualquier demo por WhatsApp mostraba la tarjeta de la home**.

---

## 2. La solución, en dos capas

### Capa 1 — Metadatos en el cliente (navegación dentro de la app)

[`applyRouteSeo`](../src/services/seo/applyRouteSeo.ts) vuelca en el `<head>` el título,
la descripción, el canonical, Open Graph y Twitter Card de la ruta activa en cada cambio de
ruta o de idioma.

Cubre la navegación dentro de la aplicación y a los rastreadores que ejecutan JavaScript
(Google). **No cubre** a WhatsApp, Facebook ni Twitter, que leen el HTML inicial.

### Capa 2 — HTML por ruta en el build (primera carga)

El plugin `prerenderRouteMetadata` genera, después del build, **un `index.html` por ruta
indexable** con sus metadatos ya escritos en el HTML:

```text
dist/index.html
dist/invitaciones-digitales/index.html
dist/invitaciones-digitales/bodas/index.html
dist/muestra/boda-camila-y-lucas/index.html
… 21 en total
```

**Esto no es renderizado en servidor.** No se genera el contenido de la página, sólo sus
metadatos; el HTML sigue siendo la misma cáscara y React monta igual. Es el arreglo que cabe
dentro de Vite **sin cambiar de framework**, tal y como pedía el encargo.

#### Sin duplicar la lógica

El plugin importa `src/services/seo/routeSeo.ts` — **el mismo módulo que usa la aplicación en
tiempo de ejecución**. No hay una segunda copia de los títulos que pueda divergir.

Node no puede importar ese módulo directamente porque arrastra datos que importan imágenes,
así que el plugin lo compila al vuelo con esbuild, sustituyendo `import.meta.env` por los
valores reales del build y las imágenes por su ruta.

Si esa compilación fallara, el plugin **avisa y no rompe el build**: el sitio se quedaría sin
metadatos por ruta en la primera carga, pero seguiría funcionando.

---

## 3. Resultado verificado

| Comprobación | Resultado |
|---|---|
| Rutas con HTML propio | **21** |
| Canonicals únicos | **21 de 21** |
| Títulos únicos | **21 de 21** |
| Descripciones únicas | 21 de 21 |
| `og:url` correcto por ruta | ✅ |

Verificado además contra un servidor que resuelve el sistema de archivos antes que el
rewrite —que es como se comporta Vercel—: cada ruta devuelve su propio título y canonical, y
una ruta inexistente cae a la cáscara del SPA.

> ⚠️ **`vite preview` NO sirve estos archivos.** Su middleware aplica el fallback de SPA
> antes de mirar el sistema de archivos, así que devuelve siempre `index.html`. Es una
> limitación del servidor de vista previa, no del build. Para comprobarlo en local hace falta
> un servidor estático que resuelva ficheros primero.

---

## 4. Requisito de despliegue

`vercel.json` reescribe todo a `/index.html`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

En Vercel, **`rewrites` se aplica después de comprobar el sistema de archivos**, así que
`/muestra/boda-camila-y-lucas` encuentra `muestra/boda-camila-y-lucas/index.html` y lo sirve;
el rewrite sólo actúa en rutas que no existen. Es el comportamiento que necesita este
esquema.

> **Pendiente de confirmar en producción.** Esto se ha verificado emulando ese orden en local,
> pero no se ha desplegado. Tras el primer despliegue, comprobar con:
>
> ```bash
> curl -s https://invifty.com/muestra/boda-camila-y-lucas | grep canonical
> ```
>
> Si devolviera el canonical de la portada, el rewrite estaría ganando al sistema de archivos
> y habría que sustituirlo por reglas que excluyan las rutas ya generadas.

---

## 5. Sitemap: una sola fuente

`public/sitemap.xml` **se eliminó**. El sitemap ahora se genera en el build a partir de
`getIndexableRoutes()`, la misma lista de la que salen los HTML por ruta.

Antes era un archivo escrito a mano: añadir una demo obligaba a acordarse de actualizarlo, y
nada avisaba si se olvidaba. Ahora es imposible que anuncie una URL inexistente o que se
olvide una nueva.

| Prioridad | Rutas |
|---|---|
| 1.0 | Portada |
| 0.9 | Páginas de contenido SEO y legales |
| 0.8 | Muestras de invitación |

---

## 6. Privacidad de la indexación (§10.4)

`robots.txt` permite indexar todo el sitio, y es correcto: **todo lo que hay aquí es
contenido comercial**. Las 12 muestras son ficticias y están hechas para enseñarse.

**Las invitaciones reales de clientes no están en este sitio ni en este repositorio.** Se
publican desde Invifty Studio, que es un proyecto aparte. Ningún dato de un evento real llega
a este build, así que no hay nada privado que excluir.

---

## 7. Estado de los metadatos (§10.1)

| Elemento | Estado |
|---|---|
| `title` por ruta | ✅ 21 únicos |
| `description` por ruta | ✅ 21 únicas |
| `canonical` por ruta | ✅ corregido |
| Open Graph completo | ✅ title, description, url, image, type, locale |
| Twitter Card | ✅ `summary_large_image` |
| `theme-color` | ✅ |
| Iconos | ✅ favicon 32 + apple-touch-icon |
| `lang` | ✅ `es-DO` / `en-US`, sincronizado con el idioma activo |
| URLs absolutas | ✅ verificado por prueba |
| JSON-LD | ✅ `Organization`, `WebSite`, `Service` en la portada; `BreadcrumbList` + `FAQPage` en las páginas SEO |
| `noindex` en rutas desconocidas | ✅ y se retira al salir del 404 |

---

## 8. Lo que sigue pendiente

### Imagen social por demo — **no hecho**

Las 21 rutas comparten `og-image.jpg`. La tarjeta que se ve al compartir tiene ya el **texto**
correcto de cada demo, pero la **imagen** es siempre la genérica.

Para resolverlo habría que generar un JPEG de 1200×630 por muestra (se puede con `sharp`, que
ya es dependencia, a partir de las portadas). No se hizo en esta fase: las portadas actuales
son cuatro SVG y tres fotos verticales de 896×1200, así que recortarlas a 1200×630 sin criterio
de diseño daría malos resultados. Es una tarea de diseño tanto como de código.

### Verificación en producción — **pendiente**

- Confirmar que Vercel sirve los HTML por ruta (§4).
- Pasar las URLs por el depurador de Facebook y por Google Search Console.
- Enviar el sitemap en Search Console.

### Prerenderizado de contenido — **no necesario por ahora**

Este trabajo resuelve los **metadatos**. El contenido de las páginas SEO sigue generándose en
cliente. Google lo indexa sin problema porque ejecuta JavaScript. Sólo haría falta prerenderizar
el contenido si se detectara que no se está indexando; en ese caso, la vía es un plugin de SSG
sobre el mismo Vite, no una migración de framework.
