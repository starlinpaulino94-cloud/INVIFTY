# Catálogo de demos

**Última actualización:** 2026-08-04
**Servicio:** [`src/services/demos/`](../src/services/demos/)
**Datos:** [`src/data/portfolioData.ts`](../src/data/portfolioData.ts)

---

## 1. Arquitectura

```text
portfolioData.ts        formato del archivo estático (PortfolioItem)
        │
        ▼
staticSource.ts         adaptador: PortfolioItem → PublicDemo
        │
        ▼
services/demos/index.ts getPublicDemos() · filterDemos() · countByCategory()
        │
        ▼
PortfolioSection · DemoSelector · App.tsx
```

Los componentes **sólo conocen `PublicDemo`**. El único punto que entiende el formato del
archivo estático es `staticSource.ts`.

Cuando Studio publique `GET /api/public/demos`, basta con escribir otro `DemoSource` que
devuelva `PublicDemo[]` y registrarlo con `setDemoSource()`. Ningún componente cambia. Está
probado: una prueba sustituye el origen por uno falso y comprueba que el catálogo responde.

### El contrato

```ts
interface PublicDemo {
  id: string;
  slug: string;
  title: string;
  category: DemoCategory;        // id estable, neutral al idioma
  eventTypeLabel: Localized;     // etiqueta visible
  style: Localized;              // estilo visual y paleta
  subtitle: string;
  coverImage: string;
  features: Localized[];
  minimumPlan?: string;          // id de PRICING_PLANS
  demoUrl: string;
  active: boolean;               // las inactivas no se listan
}
```

---

## 2. Categorías

Ids **estables y neutrales al idioma**. Viajan en la analítica como `category`, así que
cambiarlos rompe la continuidad del histórico.

| Id | Etiqueta ES | Demos |
|---|---|---|
| `boda` | Bodas | 2 |
| `quinceanera` | 15 Años & Quinceañeras | 2 |
| `cumpleanos` | Cumpleaños | 2 |
| `baby-shower` | Baby Shower | 1 |
| `bautizo` | Bautizos & Comuniones | 1 |
| `bridal-shower` | Despedidas de Soltera | 1 |
| `corporativo` | Eventos Corporativos | 2 |
| `apertura` | Aperturas & Lanzamientos | 1 |
| `otro` | Otros Eventos | 0 |

### Por qué importa

El filtrado anterior comparaba **texto en español**:

```ts
matchFn: (item) => item.eventType.toLowerCase().includes("boda")
```

Eso ataba el filtro a la copia visible: renombrar una etiqueta lo rompía en silencio, y las
aperturas quedaban absorbidas dentro de «corporativo» sin filtro propio. Ahora se compara el
id, y **aperturas tiene su propia categoría**.

---

## 3. Plan mínimo por demo

Cada muestra declara desde qué plan se reproduce lo que enseña. **No es una cifra inventada**:
se derivó de las capacidades visibles en cada demo, contrastadas con `pricingData.ts`.

| Capacidad que enseña la muestra | Plan mínimo |
|---|---|
| Pases QR, cronograma o mesa de regalos | `premium` |
| RSVP, música o galería | `popular` |
| Sólo información base | `esencial` |

Tres pruebas lo mantienen honesto:

1. El `minimumPlan` declarado **existe** en el catálogo de planes.
2. Una demo que enseña **QR o cronograma** no puede ofrecerse desde un plan inferior a
   Premium. Prometer pases QR con el plan Popular sería vender algo que ese plan no incluye.
3. Ninguna demo con RSVP se ofrece desde Esencial (el RSVP empieza en Popular).

Reparto actual: **5 muestras desde Premium**, 7 desde Popular.

> ⏳ **Decisión pendiente:** estos planes mínimos los derivé del contenido de cada demo. Si
> comercialmente prefieres presentar alguna muestra desde otro plan, se cambia en
> `portfolioData.ts` y las pruebas avisarán si la nueva combinación es incoherente.

---

## 4. Una sola fuente para las muestras

`DemoSelector` (los 4 destacados de la home) mantenía **su propia copia** de títulos,
capacidades, imágenes y rutas: una segunda fuente de verdad que podía divergir del catálogo
sin que nada avisara.

Ahora sólo declara **qué destacar**, por id:

```ts
const FEATURED_DEMO_IDS = [
  "muestra-boda-editorial",
  "muestra-quince-celestial",
  "muestra-neon-party",
  "muestra-summit-aurora",
] as const;
```

El contenido sale del catálogo. Si un id deja de existir, la tarjeta desaparece en vez de
romper la home, y una prueba avisa de que el id es inválido — cosa que ya ocurrió durante la
implementación.

---

## 5. Honestidad del RSVP

Las demos **no tienen backend**. Su formulario únicamente abre WhatsApp con el mensaje
redactado. Tres muestras afirmaban lo contrario:

| Demo | Decía | Ahora |
|---|---|---|
| `CumpleDemo` | «**Hemos registrado tu respuesta** y te contactaremos…» | «Se abrió WhatsApp. Tu confirmación quedó redactada… Es una muestra: los datos no se guardan en ningún sistema.» |
| `CorporateDemo` | «¡Registro Confirmado! **Hemos procesado sus datos**…» | Igual, adaptado al tono corporativo |
| `BodaDemo` | «¡Asistencia Confirmada! **Se ha enviado** tu confirmación…» | «Se abrió WhatsApp… envía el mensaje para completarla» |

`EditorialBodaDemo` ya lo hacía bien y sirvió de modelo.

[`honestidadDemos.test.ts`](../src/test/honestidadDemos.test.ts) impide la regresión: busca
frases como «hemos registrado», «hemos procesado» o «datos guardados» en **el texto visible**
de las 12 demos, y exige que toda demo con RSVP explique que sólo se abre WhatsApp.

---

## 6. Estado de las 12 demos (§6.4)

| Requisito | Estado |
|---|---|
| CTA de retorno a la web | ✅ 12/12 |
| Marca de agua «quiero una invitación así» | ✅ 12/12 |
| Música apagada al iniciar | ✅ 12/12 (verificado por prueba) |
| RSVP honesto | ✅ 12/12 |
| Control de audio accesible | ✅ donde hay audio |
| Imágenes optimizadas | ✅ WebP; galerías con `loading="lazy"` |
| Etiqueta visible de demostración | ✅ barra superior en todas |
| **Metadatos propios por demo** | ⚠️ sólo en cliente — ver abajo |
| **Open Graph por demo** | ✅ resuelto con prerenderizado |

### Open Graph por demo — resuelto

Antes, `App.tsx` actualizaba el `<head>` **después** del montaje: Google lo interpretaba, pero
los generadores de vista previa de WhatsApp, Facebook y Twitter leen el HTML inicial y no
ejecutan JavaScript, así que compartir una demo enseñaba la tarjeta de la portada.

Un plugin de build genera un `index.html` por ruta con sus metadatos ya escritos, y cada
muestra usa además la tarjeta de su tipo de evento. Ver
[`seo-tecnico.md`](./seo-tecnico.md) §9.

---

## 6.5 Auditoría visual de las fotografías (2026-08-05)

Las 44 imágenes remotas se abrieron **una a una**. Cinco no tenían ninguna relación con su
invitación, y estaban publicadas:

| Dónde | Qué se veía | Sustituida por |
|---|---|---|
| `BautizoDemo` — **portada** | Un bote en una laguna turquesa | Arco floral con velo |
| `BautizoDemo` — galería | Un cartel de **«SALE 50 %»** | Mesa larga con flores |
| `BabyShowerDemo` — galería | Un **estetoscopio** sobre un escritorio | Mesa con flores |
| `BabyShowerDemo` — galería | Una **pagoda japonesa** con cerezos | Sillas decoradas |
| Catálogo — tarjeta del bautizo | Una mujer con una caja naranja | Arco floral con velo |

**La lección, que es lo que importa:** comprobar que una URL responde `HTTP 200` **no verifica
nada**. Unsplash devuelve 200 con la foto que sea; las 44 respondían correctamente mientras
mostraban un estetoscopio en un baby shower. Un enlace vivo no es una imagen correcta.

> Las sustitutas salen del mismo conjunto ya verificado, así que hay algo de repetición entre
> muestras. La solución real es fotografía propia o de banco elegida con criterio: estas
> muestras son el argumento de venta y hoy dependen de fotos genéricas de Unsplash.

---

## 7. Cómo añadir una demo

1. Crear `src/demos/MiDemo.tsx` (recibe `onBackToHome: () => void`).
2. Registrarla con `lazy()` en el mapa `ROUTES` de `src/App.tsx`, bajo `/muestra/<slug>`.
3. Añadir su ficha a `PORTFOLIO_ITEMS` con **todos** los campos: `category`, `style`,
   `minimumPlan`, `features`, `image`, `demoPath`.
4. Si debe indexarse, añadir la URL a `public/sitemap.xml`.
5. `npm test` — las pruebas comprueban que la ruta existe, que el plan mínimo es coherente
   con lo que enseña, que el RSVP es honesto, que hay CTA de retorno y marca de agua, y que
   la música arranca apagada.
