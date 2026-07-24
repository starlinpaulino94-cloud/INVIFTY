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
                que nos envíes por WhatsApp se usan exclusivamente para diseñar y publicar tu
                invitación, y se tratan con confidencialidad.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Servicios de terceros</h2>
            <p>
              La comunicación con nuestro equipo se realiza a través de WhatsApp (Meta Platforms) e
              Instagram, que tienen sus propias políticas de privacidad. Las fuentes tipográficas del
              sitio se cargan desde Google Fonts. Si en el futuro activamos herramientas de medición
              de visitas, actualizaremos esta política para reflejarlo.
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
                you send us via WhatsApp are used exclusively to design and publish your invitation,
                and are treated confidentially.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Third-party services</h2>
            <p>
              Communication with our team happens through WhatsApp (Meta Platforms) and Instagram,
              which have their own privacy policies. The site's fonts are loaded from Google Fonts.
              If we enable visit-measurement tools in the future, we will update this policy to
              reflect it.
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
