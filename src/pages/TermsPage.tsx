import LegalLayout from "./LegalLayout";
import { useLanguage } from "../context/LanguageContext";

interface PageProps {
  onBackToHome: () => void;
}

export default function TermsPage({ onBackToHome }: PageProps) {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <LegalLayout
      titleEs="Términos del Servicio"
      titleEn="Terms of Service"
      updatedEs="Última actualización: Julio 2026"
      updatedEn="Last updated: July 2026"
      onBackToHome={onBackToHome}
    >
      {isEs ? (
        <>
          <section>
            <h2>1. El servicio</h2>
            <p>
              Invifty diseña y publica invitaciones digitales en formato de página web para eventos
              sociales y corporativos. Cada invitación se entrega como un enlace web privado que el
              cliente puede compartir con sus invitados.
            </p>
          </section>

          <section>
            <h2>2. Contratación y pago</h2>
            <p>
              Los pedidos se coordinan por WhatsApp. Aceptamos transferencias bancarias en pesos
              dominicanos, tarjetas de crédito/débito y pagos internacionales vía Zelle o PayPal.
              El trabajo de diseño inicia una vez confirmado el pago y recibidos los datos del evento.
            </p>
          </section>

          <section>
            <h2>3. Plazos de entrega</h2>
            <p>
              El plazo estándar de entrega es de 48 horas laborales a partir de que recibimos los
              datos completos y las fotografías del evento. El servicio urgente de 24 horas está
              disponible con costo adicional y sujeto a disponibilidad.
            </p>
          </section>

          <section>
            <h2>4. Cambios y revisiones</h2>
            <p>
              Los cambios de hora, lugar, código de vestimenta y detalles menores son gratuitos antes
              y durante el día del evento. Los cambios de diseño mayores (nueva paleta, nueva
              estructura o rediseño completo) pueden conllevar un costo adicional que se cotiza antes
              de realizarse.
            </p>
          </section>

          <section>
            <h2>5. Vigencia de la invitación</h2>
            <p>
              Cada plan incluye un período de validez durante el cual la invitación permanece
              publicada (3, 6, 9 o 12 meses según el plan). Al vencer, la invitación se retira. El
              cliente puede solicitar extensiones con costo adicional.
            </p>
          </section>

          <section>
            <h2>6. Contenido del cliente</h2>
            <p>
              El cliente declara contar con los derechos de las fotografías, textos y música que nos
              envíe para su invitación, y es responsable de su contenido. Invifty se reserva el
              derecho de rechazar contenido ilegal u ofensivo.
            </p>
          </section>

          <section>
            <h2>7. Propiedad intelectual</h2>
            <p>
              Las plantillas, el código y los diseños base de Invifty son propiedad de Invifty. El
              cliente recibe el derecho de uso de su invitación durante la vigencia del plan
              contratado.
            </p>
          </section>

          <section>
            <h2>8. Cancelaciones y reembolsos</h2>
            <p>
              Si necesitas cancelar un pedido, escríbenos por WhatsApp lo antes posible. Las
              solicitudes se evalúan caso por caso según el avance del trabajo de diseño al momento
              de la cancelación.
            </p>
          </section>
        </>
      ) : (
        <>
          <section>
            <h2>1. The service</h2>
            <p>
              Invifty designs and publishes digital invitations as web pages for social and corporate
              events. Each invitation is delivered as a private web link the client can share with
              their guests.
            </p>
          </section>

          <section>
            <h2>2. Ordering and payment</h2>
            <p>
              Orders are coordinated via WhatsApp. We accept bank transfers in Dominican pesos,
              credit/debit cards, and international payments via Zelle or PayPal. Design work begins
              once payment is confirmed and the event details are received.
            </p>
          </section>

          <section>
            <h2>3. Delivery times</h2>
            <p>
              Standard delivery is 48 business hours from the moment we receive the complete event
              details and photos. The 24-hour rush service is available at an additional cost,
              subject to availability.
            </p>
          </section>

          <section>
            <h2>4. Changes and revisions</h2>
            <p>
              Updates to time, venue, dress code and minor details are free before and during the day
              of the event. Major design changes (new palette, new structure or full redesign) may
              carry an additional cost, quoted before the work is done.
            </p>
          </section>

          <section>
            <h2>5. Invitation validity</h2>
            <p>
              Each plan includes a validity period during which the invitation stays published (3, 6,
              9 or 12 months depending on the plan). When it expires, the invitation is taken down.
              Extensions are available at an additional cost.
            </p>
          </section>

          <section>
            <h2>6. Client content</h2>
            <p>
              The client confirms they hold the rights to the photos, texts and music they send us
              for their invitation, and is responsible for that content. Invifty reserves the right
              to decline illegal or offensive content.
            </p>
          </section>

          <section>
            <h2>7. Intellectual property</h2>
            <p>
              Invifty's templates, code and base designs are the property of Invifty. The client
              receives the right to use their invitation during the validity period of the purchased
              plan.
            </p>
          </section>

          <section>
            <h2>8. Cancellations and refunds</h2>
            <p>
              If you need to cancel an order, message us on WhatsApp as soon as possible. Requests
              are evaluated case by case based on how far the design work has progressed at the time
              of cancellation.
            </p>
          </section>
        </>
      )}
    </LegalLayout>
  );
}
