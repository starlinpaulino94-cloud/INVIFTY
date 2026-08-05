# Catálogo de producto y decisiones comerciales

**Última actualización:** 2026-08-04
**Fuente única de verdad:** [`src/data/pricingData.ts`](../src/data/pricingData.ts)

---

## 1. Fuente única

`pricingData.ts` es el **único** sitio donde viven precios, capacidades, entregas, revisiones
y vigencias. Lo consumen:

| Consumidor | Qué usa |
|---|---|
| `PricingSection` | Tarjetas y tabla de comparación |
| `InquiryForm` | Opciones del desplegable «Plan de interés» |
| `services/leads/whatsappTransport` | Nombre y precio del plan en el mensaje de WhatsApp |
| `TrustSection` | Entrega más rápida y número máximo de revisiones |
| `FaqSection` | Respuestas sobre entregas y revisiones |
| `SeoLandingPage` | Menciones de planes en el contenido |

Una prueba automática ([`pricingData.test.ts`](../src/data/pricingData.test.ts)) verifica que
la tabla de comparación y las tarjetas **no se desincronicen**: si cambias el tiempo de
entrega de un plan y olvidas la tabla, el test falla.

> **Regla:** nunca escribas un precio ni un plazo a mano en un componente.

---

## 2. Planes vigentes

| Plan | id | USD | DOP | Entrega | Revisiones | Vigencia |
|---|---|---|---|---|---|---|
| Esencial | `esencial` | 25 | 1 200 | 3–5 días hábiles | 1 | 3 meses |
| Popular | `popular` | 49 | 2 500 | 3–5 días hábiles | 2 | 6 meses |
| Premium | `premium` | 79 | 4 000 | 3–5 días hábiles | 3 | 9 meses |
| A medida | `a-medida` | desde 129 | desde 6 500 | 5–7 días hábiles | 4 | 12 meses |

> Los **`id` son contratos**: viajan en la analítica (`plan_id`), en el mensaje de WhatsApp y
> en la selección guardada del visitante. Cambiar un `id` rompe el histórico de métricas.

### Diferenciación entre planes

- **Esencial → Popular:** RSVP, música, galería (15 fotos) e historia del evento.
- **Popular → Premium:** pases QR individuales, galería ilimitada, cronograma, mesa de
  regalos y recordatorios por WhatsApp.
- **Premium → A medida:** diseño 100 % desde cero, vídeo de portada, galería post-evento y
  soporte dedicado.

---

## 3. Decisiones comerciales ya tomadas

### 3.1 Entrega: 3–5 días hábiles (antes «48 horas»)

**Confirmada.** La web anunciaba «48 horas» y un «servicio urgente 24h». La versión vigente
promete 3–5 días hábiles (5–7 para A medida) y ha retirado la promesa de 24 h de los términos
y condiciones. Ver [`consolidacion-repositorio.md`](./consolidacion-repositorio.md).

Una prueba automática impide que vuelva a colarse «48 horas» en las traducciones.

### 3.2 Cuarto plan: «A medida», no «Luxury»

**Confirmada.** El plan se llama **A medida** / **Custom**, con `isCustom: true`, precio con
prefijo «Desde» y presentación en banda propia, separado de los tres planes comparables.

### 3.3 Testimonios retirados

**Confirmada.** Los testimonios que había (`Isabella & Carlos M.`, `Dra. Patricia Reyes`…)
**no eran clientes reales ni estaban autorizados**. Aunque llevaban una etiqueta de «Historia
Ilustrativa», seguían presentando personas con nombre, ciudad, fecha y 5 estrellas.

Se ha sustituido la sección por [`TrustSection`](../src/components/TrustSection.tsx), que sólo
afirma condiciones verificables derivadas del catálogo, y declara de forma explícita que
todavía no se publican reseñas de clientes.

**Para publicar testimonios reales en el futuro** hacen falta: el texto, el nombre tal como la
persona quiera aparecer, el tipo de evento y **permiso escrito de publicación**.

### 3.3.1 Espacio de reseñas (2026-08-05)

Ya existe el mecanismo completo para recogerlas y publicarlas.

| Pieza | Dónde |
|---|---|
| Catálogo de reseñas publicadas | [`src/data/reviewsData.ts`](../src/data/reviewsData.ts) |
| Validación y mensaje de WhatsApp | [`src/services/reviews/`](../src/services/reviews/) |
| Sección y formulario | [`ReviewsSection.tsx`](../src/components/ReviewsSection.tsx) |

**Cómo funciona.** El cliente escribe su reseña en la web, marca la casilla de autorización y
pulsa enviar: se abre WhatsApp con el texto ya redactado, **incluida la frase de autorización**,
que queda así registrada en la conversación. No se guarda nada en la web —no hay backend— y la
interfaz lo dice: *«Tu reseña aún no está publicada»*.

**Cómo publicar una que te llegue:**

1. Comprueba en la conversación que la autorización está.
2. Añade la reseña a `CLIENT_REVIEWS` en `reviewsData.ts` (texto en los dos idiomas).
3. `npm test && npm run build`.

Al añadir la primera, la sección deja sola de mostrar el aviso de «todavía no hay reseñas»,
calcula la media y **emite el marcado `AggregateRating` para Google**. Ese marcado no existe
mientras el catálogo esté vacío, a propósito: `AggregateRating` sobre opiniones inventadas es
justo lo que Google penaliza.

> Una prueba automática exige que `CLIENT_REVIEWS` esté vacío mientras no haya reseñas reales.
> **Al añadir la primera hay que actualizar esa prueba** — la barrera es deliberada: obliga a
> pasar por una revisión consciente antes de publicar una opinión atribuida a una persona.

---

### 3.4 Dominio propio retirado de la oferta

**Confirmada.** El dominio web propio se ha eliminado por completo:

| Dónde estaba | Qué decía | Estado |
|---|---|---|
| Plan A medida | «Dominio web propio personalizado (ej: boda.com)» | ❌ Retirado |
| Tabla comparativa | Fila «Dominio web propio» (Extra / Extra / Extra / ✓) | ❌ Retirada |
| Extras de pago | «Dominio Web Propio» — RD$1 500 | ❌ Retirado |
| Página SEO para planners | Sección y una FAQ dedicada | ❌ Reescritas |

**Por qué importa:** era la promesa con más riesgo de conflicto. «Dominio web propio
personalizado» sin letra pequeña se lee como *incluido para siempre*, y nadie había definido
quién paga la renovación a partir del segundo año, cuánto dura el registro inicial ni qué
pasa si el cliente deja de pagarlo. Además se contradecía con el extra de RD$1 500.

Cada invitación se comparte con **su propio enlace privado de Invifty**, que es lo que la web
comunica ahora.

---

### 3.5 Datos del negocio confirmados (2026-08-05)

Tres respuestas del propietario que obligaron a corregir cosas ya publicadas.

#### No hay entidad legal declarada — **empresa matriz retirada**

El pie de página mostraba **«Un producto de Vitrexi Technologies»**. Esa empresa **no existe** y
no tiene relación con este proyecto. Se retiró de [`config/index.ts`](../src/config/index.ts)
y del pie.

No se ha inventado ningún sustituto. Las políticas describen a Invifty como un estudio de
diseño —lo que es— sin atribuirse una forma jurídica, un RNC ni una empresa matriz. Una prueba
automática impide que vuelva a aparecer un RNC o una matriz.

> Es el dato que un cliente comprueba antes de pagar **por adelantado y por transferencia**, que
> es como se cobra aquí. Constituir la entidad es una decisión del negocio, no del código, pero
> mientras no exista lo correcto es callar, no inventar.

#### Pago: sólo transferencia bancaria en DOP

La web anunciaba además **tarjetas de crédito/débito, Zelle y PayPal**. No están disponibles.
Estaba en cuatro sitios, todos corregidos:

| Dónde | Qué decía |
|---|---|
| Términos §2 | Transferencias + tarjetas + Zelle + PayPal |
| FAQ nº 5 | Lo mismo, con tres bancos concretos |
| Tabla de precios | «¿Pagas desde el exterior? También aceptamos USD, Zelle y PayPal» |
| Página SEO de precios | Lo mismo, dentro de una FAQ |

Prometer una forma de pago que no existe rompe la venta **exactamente en el momento de cobrar**,
que es el peor momento posible. Una prueba automática vigila las cuatro menciones.

> Zelle sigue apareciendo en `BodaDemo` y `CumpleDemo`: ahí es la **mesa de regalos de los novios
> ficticios**, no un medio de pago de Invifty. Es correcto y debe quedarse.

#### Plazo de respuesta a solicitudes de datos: 30 días — **confirmado**

Lo que ya decía la política de privacidad §5 se mantiene tal cual.

---

## 4. Decisiones comerciales PENDIENTES

> Estas requieren tu confirmación. No se han implementado.

### 4.1 ⏳ ¿RSVP básico en el plan Esencial?

**Estado actual:** el RSVP empieza en **Popular**. Esencial no lo incluye.

**Decisión tomada en este trabajo:** *no cambiar por ahora*. El RSVP es la diferencia
principal que justifica el salto de RD$1 200 a RD$2 500.

**Si se decide moverlo a Esencial**, hay que reforzar Popular con otra ventaja clara, o el
plan pierde su razón de ser. Requiere además que Studio pueda atender RSVP en todos los
pedidos.

### 4.2 ⏳ Condiciones exactas del plan «A medida»

El plan promete diseño a medida y vídeo de portada, pero **no hay condiciones escritas**
para varios puntos. Están sin definir y no se han inventado:

| Punto | Estado |
|---|---|
| Qué incluye exactamente «diseño 100 % personalizado» (nº de propuestas iniciales) | ❓ Sin definir |
| Duración máxima del vídeo de portada | ❓ Sin definir |
| ~~Dominio propio~~ | ✅ **Retirado de la oferta** (ver §3.4) |
| Alcance del «soporte dedicado» (horario, tiempo de respuesta) | ❓ Sin definir |
| Qué pasa al vencer la vigencia de 12 meses (¿se apaga el enlace? ¿se puede renovar?) | ❓ Sin definir |

> El riesgo del dominio —«incluido para siempre» sin letra pequeña— quedó eliminado al
> retirar la oferta. Ver §3.4.

**Recomendación:** definir estos cuatro puntos y añadirlos como campos del plan en
`pricingData.ts`, para que se muestren en la tarjeta y en los términos.

### 4.3 ⚠️ Qué ocurre al vencer la vigencia — respondido, pero escondido

**Los términos ya lo responden.** [`TermsPage`](../src/pages/TermsPage.tsx) §5 dice: al vencer,
la invitación **se retira**, y el cliente puede pedir una extensión con costo adicional.

El problema no es que falte la decisión, sino **dónde está**: en los términos, que casi nadie
lee, y no en las tarjetas de precio ni en las preguntas frecuentes, que es donde el cliente lo
busca. Los invitados guardan ese enlace; que deje de funcionar sin aviso previo sigue siendo
una fuente segura de reclamaciones.

**Lo que falta por decidir:** a qué precio es la extensión, y si se avisa antes de retirar la
invitación (y con cuánta antelación). Con eso, la condición puede subir a la tarjeta del plan y
a la FAQ.

### 4.4 ~~Extra «Dominio Web Propio» vs. dominio incluido en A medida~~ — resuelto

La contradicción desapareció al retirar el dominio de la oferta. Ver §3.4.

---

## 5. Cómo modificar un plan

1. Editar el objeto en `PRICING_PLANS` dentro de `src/data/pricingData.ts`.
2. Si cambia la entrega o las revisiones, actualizar la fila correspondiente de
   `PLAN_COMPARISON` en el mismo archivo.
3. Ejecutar `npm test`: la prueba de coherencia avisa si las tarjetas y la tabla se
   contradicen.
4. Revisar si `faqData.ts` o los términos mencionan el dato modificado.
5. `npm run lint && npm run build`.

**No cambies un `id`** salvo que aceptes perder la continuidad de las métricas.
