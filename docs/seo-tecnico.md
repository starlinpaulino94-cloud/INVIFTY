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

### Verificación en producción — **pendiente**

- Pasar las URLs por el depurador de Facebook.

---

## 10. Google Search Console

Aparecer en Google **no requiere Search Console**: el rastreador llega solo si el sitio es
accesible, y ya lo es. Search Console sirve para otra cosa —ver qué se ha indexado, con qué
búsquedas te encuentran y qué errores impiden indexar— y para acelerar el proceso enviando el
sitemap en vez de esperar a que Google lo descubra.

### Lo que ya está listo

| Requisito | Estado |
|---|---|
| `robots.txt` permite rastrear todo y anuncia el sitemap | ✅ |
| `sitemap.xml` con las 21 URLs, generado del mismo origen que las rutas | ✅ |
| Un `<title>`, descripción y canonical propios por ruta, en el HTML inicial | ✅ |
| JSON-LD `Organization`, `WebSite`, `Service`, `BreadcrumbList`, `FAQPage` | ✅ |
| Etiqueta de verificación, si se quiere usar ese método | ✅ configurable |

### Los pasos, en orden

1. Entrar en [search.google.com/search-console](https://search.google.com/search-console) con
   la cuenta de Google del negocio.
2. Añadir una propiedad. **Elige «Dominio»** si puedes tocar el DNS: cubre `invifty.com`,
   `www` y ambos protocolos de una vez. Si no, «Prefijo de URL» con la dirección exacta.
3. Verificar la propiedad:
   - **Por DNS** (propiedad de tipo Dominio): añadir el registro `TXT` que da Google donde
     tengas el dominio. No toca el código.
   - **Por etiqueta HTML** (propiedad de tipo Prefijo): copiar **sólo** el valor de `content=`
     y ponerlo en `VITE_GOOGLE_SITE_VERIFICATION` en Vercel. **Hay que volver a desplegar**:
     Vite incrusta las variables en el build, así que sin nuevo despliegue la etiqueta no
     existe. Se inserta en las 21 rutas.
4. En *Sitemaps*, enviar `sitemap.xml`.
5. En *Inspección de URLs*, pedir la indexación de la portada.

### Qué esperar

La indexación tarda de días a semanas; no es instantáneo y no se puede forzar. Que una URL
aparezca como «Detectada, actualmente sin indexar» es normal al principio.

> **Importante:** la propiedad debe coincidir con el dominio que realmente sirve el sitio. Hoy
> el canonical dice `invifty.com` y el sitio responde en `www.invifty.com`. Con una propiedad
> de tipo **Dominio** da igual; con una de tipo Prefijo, hay que registrar la que corresponda o
> los informes saldrán vacíos.

---

## 9. Tarjetas sociales por tipo de evento — resuelto

Las 21 rutas compartían `og-image.jpg`: una foto de boda sin logo ni texto. El **texto** de la
tarjeta sí era el correcto de cada ruta, pero la **imagen** era siempre la misma, así que
compartir la muestra corporativa o la del baby shower por WhatsApp enseñaba una novia. Como
WhatsApp es el canal de venta principal en RD, esa tarjeta es en la práctica el anuncio.

`npm run og:images` ([`scripts/generate-og-images.mjs`](../scripts/generate-og-images.mjs))
genera nueve JPEG de 1200×630 en `public/og/`: uno por tipo de evento más el general. Cada uno
lleva la firma **INVIFTY**, el tipo de evento y tres capacidades reales del producto, sobre la
foto oscurecida con un marco dorado.

| Ruta | Tarjeta |
|---|---|
| Portada, hub SEO, planners, legales | `og/default.jpg` |
| Las 12 muestras | `og/<categoría>.jpg`, según `category` del catálogo |
| Páginas SEO de bodas, 15 años, cumpleaños y corporativos | la de su tipo |

Dos decisiones que conviene no deshacer:

- **Las imágenes se versionan en el repositorio.** El `build` no las regenera, así que un
  despliegue nunca depende de que Unsplash responda.
- **El mapeo de páginas SEO a tarjeta es a mano**, no derivado del último segmento de la URL:
  la ruta usa el plural comercial (`/bodas`) y la categoría el singular (`boda`). Derivarlo
  fallaría en silencio y la página volvería a la tarjeta genérica.

Dos pruebas en [`seo.test.ts`](../src/services/seo/seo.test.ts) lo sostienen: que ninguna
muestra caiga en la tarjeta genérica y que **todos** los ficheros referidos existan en
`public/`. Sin la segunda, un renombrado dejaría a la ruta anunciando una imagen inexistente y
WhatsApp mostraría la tarjeta sin foto.

> `public/og-image.jpg` se conserva aunque ya no lo use ninguna ruta: los enlaces compartidos
> antes de este cambio siguen apuntando a él en las cachés de WhatsApp y Facebook.

### Prerenderizado de contenido — **no necesario por ahora**

Este trabajo resuelve los **metadatos**. El contenido de las páginas SEO sigue generándose en
cliente. Google lo indexa sin problema porque ejecuta JavaScript. Sólo haría falta prerenderizar
el contenido si se detectara que no se está indexando; en ese caso, la vía es un plugin de SSG
sobre el mismo Vite, no una migración de framework.
