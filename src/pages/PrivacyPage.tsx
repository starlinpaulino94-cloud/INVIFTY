import LegalLayout from "./LegalLayout";
import { useLanguage } from "../context/LanguageContext";

interface PageProps {
  onBackToHome: () => void;
}

export default function PrivacyPage({ onBackToHome }: PageProps) {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <LegalLayout
      titleEs="Política de Privacidad"
      titleEn="Privacy Policy"
      updatedEs="Última actualización: Julio 2026"
      updatedEn="Last updated: July 2026"
      onBackToHome={onBackToHome}
    >
      {isEs ? (
        <>
          <section>
            <h2>1. Quiénes somos</h2>
            <p>
              Invifty es un estudio de diseño de invitaciones digitales para bodas, 15 años,
              cumpleaños y eventos corporativos. Puedes contactarnos en hola@invifty.com
              o por WhatsApp al +1 (809) 269-3214.
            </p>
          </section>

          <section>
            <h2>2. Qué datos recopilamos</h2>
            <ul>
              <li>
                <strong>Formulario de cotización:</strong> el nombre, teléfono y datos del evento que
                escribes en nuestro formulario NO se almacenan en servidores de Invifty. Se usan
                únicamente para redactar el mensaje de WhatsApp que tú mismo decides enviar.
              </li>
              <li>
                <strong>Preferencia de idioma:</strong> guardamos tu idioma elegido (español o inglés)
                en el almacenamiento local de tu navegador. No es una cookie de rastreo y puedes
                borrarla en cualquier momento desde la configuración de tu navegador.
              </li>
              <li>
                <strong>Datos de tu evento:</strong> si contratas una invitación, los datos y fotos
                que nos envíes —por WhatsApp o a través del formulario privado que te enviamos por
                enlace— se usan exclusivamente para diseñar y publicar tu invitación, y se tratan
                con confidencialidad.
              </li>
              <li>
                <strong>Dictado por voz:</strong> el formulario de tu evento incluye un botón de
                micrófono opcional para que puedas responder hablando en lugar de escribir. Si lo
                usas, tu navegador pedirá permiso para el micrófono y la transcripción la realiza
                el servicio de voz de tu propio navegador (Google en Chrome, Apple en Safari),
                sujeto a las políticas de privacidad de esos proveedores. Invifty no graba, no
                recibe y no almacena tu audio: únicamente guardamos el texto resultante que queda
                escrito en el formulario, y puedes editarlo o borrarlo antes de enviarlo. Usar el
                dictado es siempre voluntario: puedes escribir con el teclado.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Servicios de terceros</h2>
            <p>
              La comunicación con nuestro equipo se realiza a través de WhatsApp (Meta Platforms) e
              Instagram, que tienen sus propias políticas de privacidad. Las fuentes tipográficas del
              sitio se cargan desde Google Fonts.
            </p>
            <p>
              Para saber cuántas personas visitan el sitio medimos datos agregados: página
              visitada, procedencia del enlace, país, tipo de dispositivo y navegador.{" "}
              <strong>No instalamos cookies, no te identificamos y no te seguimos entre sitios
              web</strong>, por eso no verás aquí ningún aviso de cookies. Tampoco usamos
              herramientas publicitarias de seguimiento.
            </p>
          </section>

          <section>
            <h2>4. Conservación y eliminación</h2>
            <p>
              Las invitaciones publicadas permanecen activas durante el período de validez del plan
              contratado. Puedes solicitar la eliminación anticipada de tu invitación, de tus fotos o
              de cualquier dato que nos hayas compartido escribiéndonos a hola@invifty.com.
            </p>
          </section>

          <section>
            <h2>5. Tus derechos</h2>
            <p>
              Puedes solicitar acceso, corrección o eliminación de tus datos personales en cualquier
              momento. Respondemos todas las solicitudes en un plazo máximo de 30 días.
            </p>
          </section>
        </>
      ) : (
        <>
          <section>
            <h2>1. Who we are</h2>
            <p>
              Invifty is a digital invitation design studio for weddings, quinceañeras, birthdays and
              corporate events. You can reach us at hola@invifty.com or on WhatsApp at
              +1 (809) 269-3214.
            </p>
          </section>

          <section>
            <h2>2. What data we collect</h2>
            <ul>
              <li>
                <strong>Quote form:</strong> the name, phone number and event details you type into
                our form are NOT stored on Invifty servers. They are used solely to compose the
                WhatsApp message that you choose to send.
              </li>
              <li>
                <strong>Language preference:</strong> we save your chosen language (Spanish or
                English) in your browser's local storage. It is not a tracking cookie and you can
                clear it anytime from your browser settings.
              </li>
              <li>
                <strong>Your event data:</strong> if you order an invitation, the details and photos
                you send us —via WhatsApp or through the private form we send you by link— are used
                exclusively to design and publish your invitation, and are treated confidentially.
              </li>
              <li>
                <strong>Voice dictation:</strong> your event form includes an optional microphone
                button so you can answer by speaking instead of typing. If you use it, your browser
                will ask for microphone permission and the transcription is performed by your own
                browser&rsquo;s speech service (Google on Chrome, Apple on Safari), subject to those
                providers&rsquo; privacy policies. Invifty does not record, receive or store your
                audio: we only keep the resulting text that appears in the form, and you can edit or
                delete it before submitting. Dictation is always optional — you can type instead.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Third-party services</h2>
            <p>
              Communication with our team happens through WhatsApp (Meta Platforms) and Instagram,
              which have their own privacy policies. The site&rsquo;s fonts are loaded from Google Fonts.
            </p>
            <p>
              To know how many people visit the site we measure aggregate data: page visited,
              referrer, country, device type and browser.{" "}
              <strong>We set no cookies, do not identify you and do not track you across
              websites</strong>, which is why you will not see a cookie banner here. We do not use
              advertising tracking tools either.
            </p>
          </section>

          <section>
            <h2>4. Retention and deletion</h2>
            <p>
              Published invitations remain active for the validity period of the plan you purchased.
              You can request early removal of your invitation, your photos, or any data you shared
              with us by writing to hola@invifty.com.
            </p>
          </section>

          <section>
            <h2>5. Your rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal data at any
              time. We respond to all requests within 30 days.
            </p>
          </section>
        </>
      )}
    </LegalLayout>
  );
}
