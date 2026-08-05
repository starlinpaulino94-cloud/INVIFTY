import { Localized } from "../types";
import { SEO_HUB_PATH } from "./seoPageIndex";

export { SEO_HUB_PATH };

/**
 * PÁGINAS SEO POR TIPO DE EVENTO
 * ==============================
 * Páginas de contenido indexables para captar búsquedas de
 * "invitaciones digitales", "invitaciones para bodas", "invitaciones 15 años",
 * "invitaciones corporativas" y "planificación de eventos" en República Dominicana.
 *
 * Cada página tiene texto único en HTML (no dentro de imágenes), título y
 * descripción propios, FAQ y enlaces internos. El componente SeoLandingPage
 * renderiza estas páginas y inyecta JSON-LD (BreadcrumbList + FAQPage).
 */

export interface SeoFaq {
  q: Localized;
  a: Localized;
}

export interface SeoPageData {
  path: string;
  seoTitle: Localized;
  seoDescription: Localized;
  eyebrow: Localized;
  h1: Localized;
  intro: Localized[];
  bullets: Localized[];
  sections: { heading: Localized; body: Localized }[];
  faqs: SeoFaq[];
  ctaTitle: Localized;
  ctaText: Localized;
  demoPath: string;
  demoLabel: Localized;
  related: string[];
}

export const SEO_PAGES: SeoPageData[] = [
  {
    path: SEO_HUB_PATH,
    seoTitle: {
      es: "Invitaciones Digitales en República Dominicana | Invifty",
      en: "Digital Invitations in the Dominican Republic | Invifty",
    },
    seoDescription: {
      es: "Invitaciones digitales premium para bodas, 15 años, cumpleaños y eventos corporativos en República Dominicana. RSVP, ubicación, música y pases QR en un solo enlace elegante.",
      en: "Premium digital invitations for weddings, quinceañeras, birthdays and corporate events in the Dominican Republic. RSVP, venue, music and QR passes in one elegant link.",
    },
    eyebrow: { es: "Guía · Invitaciones digitales", en: "Guide · Digital invitations" },
    h1: {
      es: "Invitaciones digitales premium para tu evento en República Dominicana",
      en: "Premium digital invitations for your event in the Dominican Republic",
    },
    intro: [
      {
        es: "Una invitación digital de Invifty es mucho más que una tarjeta: es una página web privada y elegante donde tus invitados encuentran toda la información de tu evento —fecha, lugar, confirmación de asistencia, música, galería y más— en un solo enlace que se comparte por WhatsApp en segundos.",
        en: "An Invifty digital invitation is much more than a card: it is a private, elegant web page where your guests find all your event information —date, venue, RSVP, music, gallery and more— in a single link shared by WhatsApp in seconds.",
      },
      {
        es: "Sin imprenta, sin correo y sin llamadas para confirmar. Si algo cambia, actualizas una vez y todos tus invitados ven la novedad al instante, incluso el mismo día del evento.",
        en: "No printing, no mailing and no phone calls to chase RSVPs. If anything changes, you update once and every guest sees it instantly — even on the day of the event.",
      },
    ],
    bullets: [
      { es: "Un enlace para todo: invitación, mapa, RSVP, agenda y regalos", en: "One link for everything: invitation, map, RSVP, schedule and gifts" },
      { es: "Confirmaciones organizadas por WhatsApp, sin perseguir invitados", en: "RSVPs organized via WhatsApp, without chasing guests" },
      { es: "Diseño premium adaptado al estilo de tu celebración", en: "Premium design tailored to your celebration's style" },
      { es: "Funciona en cualquier teléfono, sin descargar aplicaciones", en: "Works on any phone, no app downloads" },
    ],
    sections: [
      {
        heading: { es: "¿Qué es una invitación digital?", en: "What is a digital invitation?" },
        body: {
          es: "Es una página web privada que se abre al instante en cualquier celular o computadora. Reemplaza la tarjeta impresa y el seguimiento manual: reúne el diseño, la información, la ubicación con Google Maps y Waze, el calendario, el RSVP, los invitados, los códigos QR y los recordatorios en una sola experiencia.",
          en: "It is a private web page that opens instantly on any phone or computer. It replaces the printed card and manual follow-up: it brings together the design, information, venue with Google Maps and Waze, calendar, RSVP, guests, QR codes and reminders in one experience.",
        },
      },
      {
        heading: { es: "¿Por qué elegir una invitación digital?", en: "Why choose a digital invitation?" },
        body: {
          es: "Porque ahorra tiempo, reduce errores y se ve impecable. No dependes de tiempos de imprenta, no se pierde ningún dato y cualquier cambio de última hora llega a todos los invitados al momento. Además, es una experiencia más cercana a la forma en que hoy se comparte todo: por mensaje.",
          en: "Because it saves time, reduces errors and looks impeccable. You don't depend on printing schedules, no data gets lost, and any last-minute change reaches every guest immediately. It also feels closer to how things are shared today: by message.",
        },
      },
      {
        heading: { es: "¿Qué incluye cada invitación Invifty?", en: "What does every Invifty invitation include?" },
        body: {
          es: "Dependiendo del plan: cuenta regresiva en vivo, ubicación con Google Maps y Waze, guía de vestimenta, confirmación de asistencia, música con reproductor, galería de fotos, historia del evento, itinerario, pases QR, mesa de regalos, recordatorios por WhatsApp y opción de guardar el evento en el calendario del teléfono.",
          en: "Depending on the plan: live countdown, venue with Google Maps and Waze, dress code guide, RSVP, music player, photo gallery, event story, itinerary, QR passes, gift registry, WhatsApp reminders and a save-to-calendar option.",
        },
      },
    ],
    faqs: [
      {
        q: { es: "¿Cuánto cuesta una invitación digital en República Dominicana?", en: "How much does a digital invitation cost in the Dominican Republic?" },
        a: {
          es: "Los planes van desde RD$1,200 (Esencial) hasta RD$6,500 (A medida), en pago único, sin costos ocultos ni cobro por invitado. Aceptamos transferencia bancaria en DOP, tarjeta de crédito o débito, y pagos internacionales vía Zelle o PayPal.",
          en: "Plans range from RD$1,200 (Essential) to RD$6,500 (Custom), one-time payment, no hidden costs and no per-guest fees. We accept DOP bank transfers, credit/debit cards and international payments via Zelle or PayPal.",
        },
      },
      {
        q: { es: "¿Cuánto tarda en estar lista mi invitación?", en: "How long does it take to get my invitation ready?" },
        a: {
          es: "El tiempo estándar es de 3 a 5 días hábiles una vez que nos envías los datos y fotografías de tu evento. El plan A medida, por ser un diseño 100% desde cero, toma de 5 a 7 días hábiles.",
          en: "Standard delivery is 3 to 5 business days after you send your event details and photos. The Custom plan, being a fully bespoke design, takes 5 to 7 business days.",
        },
      },
      {
        q: { es: "¿Cómo reciben los invitados la invitación?", en: "How do guests receive the invitation?" },
        a: {
          es: "Recibes un enlace web privado y elegante que puedes reenviar por WhatsApp, correo o redes sociales. Se abre al instante en cualquier celular o computadora, sin necesidad de descargar ninguna aplicación.",
          en: "You get a private, elegant web link you can forward via WhatsApp, email or social media. It opens instantly on any phone or computer with no app download needed.",
        },
      },
    ],
    ctaTitle: { es: "¿Lista para ver tu invitación?", en: "Ready to see your invitation?" },
    ctaText: { es: "Solicitar invitación por WhatsApp", en: "Request an invitation on WhatsApp" },
    demoPath: "/muestra/boda-editorial-elena-gabriel",
    demoLabel: { es: "Ver muestra de boda", en: "View wedding sample" },
    related: [
      "/invitaciones-digitales/bodas",
      "/invitaciones-digitales/quinceaneras",
      "/invitaciones-digitales/cumpleanos",
      "/invitaciones-digitales/corporativos",
      "/invitaciones-digitales/para-planners",
    ],
  },
  {
    path: "/invitaciones-digitales/bodas",
    seoTitle: {
      es: "Invitaciones Digitales para Bodas | Invifty",
      en: "Wedding Digital Invitations | Invifty",
    },
    seoDescription: {
      es: "Invitaciones de boda digitales y elegantes: RSVP por invitado, ceremonia y recepción con mapas, mesa de regalos e historia de la pareja en un solo enlace. Para bodas en República Dominicana.",
      en: "Elegant digital wedding invitations: per-guest RSVP, ceremony and reception maps, gift registry and couple's story in one link. For weddings in the Dominican Republic.",
    },
    eyebrow: { es: "Invitaciones digitales para bodas", en: "Wedding digital invitations" },
    h1: {
      es: "Invitaciones de boda digitales: elegancia en un solo enlace",
      en: "Digital wedding invitations: elegance in a single link",
    },
    intro: [
      {
        es: "El diseño, la ubicación, la confirmación y el itinerario de tu boda reunidos en un enlace privado y elegante que tus invitados abren en segundos desde su teléfono.",
        en: "Your wedding's design, venue, RSVP and itinerary gathered in a private, elegant link your guests open in seconds from their phone.",
      },
      {
        es: "Desde la ceremonia hasta la hora loca: cada invitado encuentra el dress code, los mapas, la mesa de regalos y su confirmación sin hacer una sola pregunta.",
        en: "From the ceremony to the after-party: every guest finds the dress code, maps, gift registry and their RSVP without asking a single question.",
      },
    ],
    bullets: [
      { es: "Confirmación RSVP individual por invitado o grupo", en: "Individual RSVP per guest or group" },
      { es: "Ceremonia y recepción con enlaces a Google Maps y Waze", en: "Ceremony and reception with Google Maps and Waze links" },
      { es: "Mesa de regalos con datos bancarios y copia en un clic", en: "Gift registry with bank details and one-click copy" },
      { es: "Historia de la pareja, itinerario y agradecimientos", en: "Couple's story, itinerary and thank-you notes" },
    ],
    sections: [
      {
        heading: { es: "Qué debe incluir la invitación de una boda", en: "What a wedding invitation should include" },
        body: {
          es: "Además de nombres, fecha y lugar, una buena invitación resuelve el itinerario completo: ceremonia, recepción, dress code, mesa de regalos, música, galería e historia de la pareja. Con Invifty todo eso vive en un mismo enlace y se actualiza al instante si cambia algo.",
          en: "Beyond names, date and venue, a good invitation solves the full itinerary: ceremony, reception, dress code, gift registry, music, gallery and the couple's story. With Invifty all of it lives in one link and updates instantly if anything changes.",
        },
      },
      {
        heading: { es: "Confirmaciones y gestión de invitados", en: "RSVPs and guest management" },
        body: {
          es: "Tus invitados confirman desde la propia invitación y recibes las respuestas organizadas por WhatsApp. En los planes Premium y A medida, cada invitado recibe un pase QR personal para control en la entrada, ideal para bodas grandes o con recepción privada.",
          en: "Your guests confirm right from the invitation and you receive organized responses on WhatsApp. On Premium and Custom plans, each guest gets a personal QR pass for door check-in, ideal for large weddings or private receptions.",
        },
      },
      {
        heading: { es: "Bodas de destino y múltiples sedes", en: "Destination weddings and multiple venues" },
        body: {
          es: "Si la ceremonia, la recepción y el after-party son en lugares distintos, modelamos cada sede con su propia dirección y mapa. También podemos incluir recomendaciones de transporte, estacionamiento y alojamiento para invitados que viajan.",
          en: "When the ceremony, reception and after-party are at different venues, we model each location with its own address and map. We can also include transport, parking and lodging recommendations for traveling guests.",
        },
      },
    ],
    faqs: [
      {
        q: { es: "¿Puedo hacer cambios después de enviar la invitación?", en: "Can I make changes after sending the invitation?" },
        a: {
          es: "Sí. Los cambios de hora, lugar, dress code y detalles menores son gratuitos antes y durante el día del evento. Al ser un enlace, el cambio se refleja para todos los invitados al instante.",
          en: "Yes. Changes to time, venue, dress code and minor details are free before and during the event. Because it is a link, the change reflects for every guest instantly.",
        },
      },
      {
        q: { es: "¿La música de la invitación suena sola?", en: "Does the invitation music play automatically?" },
        a: {
          es: "No. La música se inicia solo cuando el invitado pulsa el control visible de reproducción, para respetar la experiencia de cada persona y evitar bloqueos del navegador.",
          en: "No. Music starts only when the guest taps the visible play control, respecting each person's experience and avoiding browser blocks.",
        },
      },
      {
        q: { es: "¿Cuántos invitados pueden confirmar asistencia?", en: "How many guests can RSVP?" },
        a: {
          es: "Los invitados son ilimitados en todos los planes y no se cobra por invitado. Elige el plan según las funciones que necesites, no según el tamaño de tu lista.",
          en: "Guests are unlimited on all plans with no per-guest charge. Choose your plan based on the features you need, not the size of your list.",
        },
      },
    ],
    ctaTitle: { es: "¿Planeando tu boda?", en: "Planning your wedding?" },
    ctaText: { es: "Cotizar invitación de boda", en: "Get a wedding invitation quote" },
    demoPath: "/muestra/boda-camila-y-lucas",
    demoLabel: { es: "Ver boda de gala", en: "View gala wedding" },
    related: [SEO_HUB_PATH, "/invitaciones-digitales/quinceaneras", "/invitaciones-digitales/para-planners"],
  },
  {
    path: "/invitaciones-digitales/quinceaneras",
    seoTitle: {
      es: "Invitaciones Digitales para 15 Años y Quinceañeras | Invifty",
      en: "Digital Invitations for Quinceañeras | Invifty",
    },
    seoDescription: {
      es: "Invitaciones para 15 años y quinceañeras que impresionan: paletas celestiales y rose gold, itinerario, dress code, muro de felicitaciones y música en un enlace. Hechas en República Dominicana.",
      en: "Quinceañera invitations that impress: celestial and rose gold palettes, itinerary, dress code, well-wishes wall and music in one link. Made in the Dominican Republic.",
    },
    eyebrow: { es: "Invitaciones digitales para 15 años", en: "Quinceañera digital invitations" },
    h1: {
      es: "Invitaciones para 15 años que impresionan a tus invitados",
      en: "Quinceañera invitations that impress your guests",
    },
    intro: [
      {
        es: "Un quinceañero es un evento que se comparte por redes y por mensajes. La invitación digital acompaña ese momento con una experiencia visual a la altura: paleta, música, cuenta regresiva y toda la información de la noche en un solo enlace.",
        en: "A quinceañera is an event shared through social media and messages. The digital invitation matches that moment with a visual experience worthy of it: palette, music, countdown and all the night's information in one link.",
      },
      {
        es: "Cada invitada encuentra el dress code, el itinerario de la noche y cómo confirmar su asistencia, sin preguntar nada.",
        en: "Every guest finds the dress code, the night's itinerary and how to RSVP without asking anything.",
      },
    ],
    bullets: [
      { es: "Paletas celestial, rose gold, editorial o neón según su estilo", en: "Celestial, rose gold, editorial or neon palettes to match her style" },
      { es: "Cuenta regresiva en vivo y botón para guardar la fecha en el calendario", en: "Live countdown and save-the-date calendar button" },
      { es: "Dress code con paleta de colores sugerida", en: "Dress code with a suggested color palette" },
      { es: "Muro de felicitaciones y firma de invitados", en: "Well-wishes wall and guest signatures" },
    ],
    sections: [
      {
        heading: { es: "Un diseño que se siente tan especial como la noche", en: "A design that feels as special as the night" },
        body: {
          es: "Trabajamos el estilo con la familia: desde un cielo estrellado en azul noche y plata hasta un look editorial clásico en marfil y oro. La invitación es la primera impresión de la fiesta y está diseñada para compartirse.",
          en: "We craft the style with the family: from a starry midnight-blue and silver sky to a classic ivory-and-gold editorial look. The invitation is the first impression of the party and is made to be shared.",
        },
      },
      {
        heading: { es: "Todo lo que la noche necesita, organizado", en: "Everything the night needs, organized" },
        body: {
          es: "Itinerario paso a paso (recepción, entrada, vals, cena y baile), ubicación del salón con mapa, dress code y confirmación de asistencia. Si algo cambia, lo actualizamos y todos lo ven al instante.",
          en: "Step-by-step itinerary (reception, entrance, waltz, dinner and dance), ballroom location with map, dress code and RSVP. If anything changes, we update it and everyone sees it instantly.",
        },
      },
    ],
    faqs: [
      {
        q: { es: "¿Puedo personalizar colores y música?", en: "Can I customize colors and music?" },
        a: {
          es: "Sí. Elegimos la paleta y la música con la familia, y en los planes Premium y A medida se incluyen galería ampliada, itinerario, regalos y recordatorios por WhatsApp.",
          en: "Yes. We choose the palette and music with the family, and Premium and Custom plans include an expanded gallery, itinerary, gifts and WhatsApp reminders.",
        },
      },
      {
        q: { es: "¿Cuántas fotos puedo incluir?", en: "How many photos can I include?" },
        a: {
          es: "El plan Popular incluye hasta 15 fotografías de alta calidad; Premium y A medida incluyen galería ilimitada y, en A medida, galería post-evento para que los invitados descarguen las fotos del día.",
          en: "The Popular plan includes up to 15 high-quality photos; Premium and Custom include an unlimited gallery, and Custom adds a post-event gallery so guests can download the day's photos.",
        },
      },
      {
        q: { es: "¿Cuánto tarda una invitación de 15 años?", en: "How long does a quinceañera invitation take?" },
        a: {
          es: "Entre 3 y 5 días hábiles una vez recibimos los datos y las fotos. El plan A medida toma de 5 a 7 días hábiles por ser un diseño 100% desde cero.",
          en: "Between 3 and 5 business days once we receive your details and photos. The Custom plan takes 5 to 7 business days as it is a fully bespoke design.",
        },
      },
    ],
    ctaTitle: { es: "¿Preparando su gran noche?", en: "Planning her big night?" },
    ctaText: { es: "Cotizar invitación de 15 años", en: "Get a quinceañera invitation quote" },
    demoPath: "/muestra/quince-celestial-amara",
    demoLabel: { es: "Ver 15 años celestial", en: "View celestial quinceañera" },
    related: [SEO_HUB_PATH, "/invitaciones-digitales/bodas", "/invitaciones-digitales/cumpleanos"],
  },
  {
    path: "/invitaciones-digitales/cumpleanos",
    seoTitle: {
      es: "Invitaciones Digitales para Cumpleaños | Invifty",
      en: "Birthday Digital Invitations | Invifty",
    },
    seoDescription: {
      es: "Invitaciones de cumpleaños digitales para todas las edades: 30, 40, 50, 60 y más. Cuenta regresiva, RSVP, dress code y música en un enlace elegante. En República Dominicana.",
      en: "Digital birthday invitations for every age: 30, 40, 50, 60 and beyond. Countdown, RSVP, dress code and music in an elegant link. In the Dominican Republic.",
    },
    eyebrow: { es: "Invitaciones digitales para cumpleaños", en: "Birthday digital invitations" },
    h1: {
      es: "Invitaciones de cumpleaños digitales para todas las edades",
      en: "Digital birthday invitations for every age",
    },
    intro: [
      {
        es: "De los 15 a los 50, cada cumpleaños tiene su propia energía. Diseñamos la invitación digital para que acompañe la celebración: temática, música, cuenta regresiva y todos los detalles de la fiesta en un enlace que se comparte por mensaje.",
        en: "From 15 to 50 and beyond, every birthday has its own energy. We design the digital invitation to match the celebration: theme, music, countdown and all the party details in a link shared by message.",
      },
      {
        es: "Confirmaciones, line-up de la noche y dress code llegan a cada invitado sin llamadas ni reenvíos de imágenes.",
        en: "RSVPs, the night's line-up and dress code reach every guest without phone calls or forwarded images.",
      },
    ],
    bullets: [
      { es: "Estilos neón, editorial, tropical o minimal según el festejado", en: "Neon, editorial, tropical or minimal styles to match the host" },
      { es: "Cuenta regresiva animada hasta el gran día", en: "Animated countdown to the big day" },
      { es: "Line-up de la noche: open bar, DJ, karaoke y más", en: "Night line-up: open bar, DJ, karaoke and more" },
      { es: "Confirmación de asistencia en un toque por WhatsApp", en: "One-tap WhatsApp attendance confirmation" },
    ],
    sections: [
      {
        heading: { es: "Un estilo para cada festejado", en: "A style for every host" },
        body: {
          es: "Para una fiesta de 40 con luces neón, un cumpleaños infantil con ilustraciones suaves o una cena elegante de 60, adaptamos paleta, tipografía y animaciones. La invitación deja claro el tono de la noche desde el primer vistazo.",
          en: "For a 40th with neon lights, a kids' birthday with soft illustrations or an elegant 60th dinner, we adapt the palette, typography and animations. The invitation sets the tone of the night from the first glance.",
        },
      },
      {
        heading: { es: "Que nadie se pierda la fiesta", en: "So no one misses the party" },
        body: {
          es: "Ubicación con Google Maps y Waze, dress code, instrucciones de estacionamiento y confirmación de asistencia. En los planes Premium y A medida se añaden itinerario, regalos y recordatorios por WhatsApp.",
          en: "Venue with Google Maps and Waze, dress code, parking instructions and RSVP. Premium and Custom plans add an itinerary, gifts and WhatsApp reminders.",
        },
      },
    ],
    faqs: [
      {
        q: { es: "¿Sirven para cumpleaños infantiles?", en: "Do they work for kids' birthdays?" },
        a: {
          es: "Sí. Adaptamos el diseño a los padres y al festejado con estilos ilustrados y paletas suaves, manteniendo la misma facilidad para confirmar y compartir.",
          en: "Yes. We adapt the design for the parents and the child with illustrated styles and soft palettes, keeping the same ease of RSVP and sharing.",
        },
      },
      {
        q: { es: "¿Puedo incluir la ubicación del salón y estacionamiento?", en: "Can I include the venue and parking info?" },
        a: {
          es: "Sí. Cada sede lleva su dirección visible con enlace directo a Google Maps y Waze, y podemos añadir instrucciones de estacionamiento o valet.",
          en: "Yes. Every venue shows its address with direct Google Maps and Waze links, and we can add parking or valet instructions.",
        },
      },
      {
        q: { es: "¿Cuánto tiempo está disponible la invitación?", en: "How long is the invitation available?" },
        a: {
          es: "Entre 3 y 12 meses según el plan. Es ideal mantenerla activa después de la fiesta para compartir la galería de fotos con los invitados.",
          en: "Between 3 and 12 months depending on the plan. It is ideal to keep it active after the party to share the photo gallery with guests.",
        },
      },
    ],
    ctaTitle: { es: "¿Celebrando un cumpleaños?", en: "Celebrating a birthday?" },
    ctaText: { es: "Cotizar invitación de cumpleaños", en: "Get a birthday invitation quote" },
    demoPath: "/muestra/neon-party-marcos-40",
    demoLabel: { es: "Ver cumpleaños neón", en: "View neon birthday" },
    related: [SEO_HUB_PATH, "/invitaciones-digitales/quinceaneras", "/invitaciones-digitales/bodas"],
  },
  {
    path: "/invitaciones-digitales/corporativos",
    seoTitle: {
      es: "Invitaciones Digitales Corporativas y para Galas | Invifty",
      en: "Corporate Digital Invitations and Galas | Invifty",
    },
    seoDescription: {
      es: "Invitaciones digitales para eventos corporativos: galas, lanzamientos y conferencias con agenda, pase QR de acceso y registro de asistentes. Imagen profesional para tu empresa.",
      en: "Digital invitations for corporate events: galas, launches and conferences with agenda, QR access passes and attendee registration. Professional image for your company.",
    },
    eyebrow: { es: "Invitaciones digitales corporativas", en: "Corporate digital invitations" },
    h1: {
      es: "Invitaciones digitales para eventos corporativos y galas",
      en: "Digital invitations for corporate events and galas",
    },
    intro: [
      {
        es: "Para una gala anual, un lanzamiento de marca o una conferencia, la invitación es parte de la imagen de tu empresa. Con Invifty envías una experiencia sobria y profesional con agenda, registro y control de acceso en un solo enlace.",
        en: "For an annual gala, a brand launch or a conference, the invitation is part of your company's image. With Invifty you send a sober, professional experience with agenda, registration and access control in a single link.",
      },
      {
        es: "Confirmaciones organizadas, QR por invitado y actualizaciones de agenda al instante: menos correos, menos llamadas, menos logística manual.",
        en: "Organized RSVPs, per-guest QR codes and instant agenda updates: fewer emails, fewer calls, less manual logistics.",
      },
    ],
    bullets: [
      { es: "Agenda cronológica y ponentes destacados", en: "Chronological agenda and featured speakers" },
      { es: "Pase QR personal para acreditación en puerta", en: "Personal QR pass for door accreditation" },
      { es: "Registro de asistentes y confirmaciones por WhatsApp", en: "Attendee registration and RSVPs via WhatsApp" },
      { es: "Estética corporativa con los colores de tu marca", en: "Corporate aesthetic with your brand colors" },
    ],
    sections: [
      {
        heading: { es: "De la invitación al día del evento", en: "From invitation to the event day" },
        body: {
          es: "La invitación incluye la agenda del día, los ponentes o anfitriones, la ubicación con mapa, el dress code y el registro de asistencia. En los planes Premium y A medida, cada invitado recibe un código QR individual para control de acceso, ideal para eventos con lista cerrada.",
          en: "The invitation includes the day's agenda, speakers or hosts, venue with map, dress code and attendance registration. On Premium and Custom plans, each guest receives an individual QR code for access control, ideal for events with a closed guest list.",
        },
      },
      {
        heading: { es: "Imagen de marca consistente", en: "Consistent brand image" },
        body: {
          es: "Adaptamos la invitación a la identidad visual de tu empresa: colores, tipografía y tono. Si lo necesitas, también gestionamos el registro de asistentes y los recordatorios para que la asistencia real se acerque a la esperada.",
          en: "We adapt the invitation to your company's visual identity: colors, typography and tone. If needed, we also manage attendee registration and reminders so actual attendance matches expectations.",
        },
      },
    ],
    faqs: [
      {
        q: { es: "¿Cómo funciona el pase QR para los invitados?", en: "How does the QR pass work for guests?" },
        a: {
          es: "Cada invitado confirmado recibe su propio código QR que se escanea en la entrada. Es parte de los planes Premium y A medida.",
          en: "Each confirmed guest receives their own QR code to be scanned at the door. It is part of the Premium and Custom plans.",
        },
      },
      {
        q: { es: "¿Puedo usar los colores y logo de mi empresa?", en: "Can I use my company's colors and logo?" },
        a: {
          es: "Sí. En todos los planes corporativos adaptamos la estética a tu marca; en el plan A medida el diseño se crea desde cero alrededor de tu identidad.",
          en: "Yes. On all corporate plans we adapt the aesthetic to your brand; the Custom plan creates the design from scratch around your identity.",
        },
      },
      {
        q: { es: "¿Cómo recibo el registro de los asistentes?", en: "How do I receive the attendee registration?" },
        a: {
          es: "Cada confirmación llega organizada a tu WhatsApp o correo en tiempo real, con nombre, acompañantes y cualquier dato que solicites al confirmar.",
          en: "Each confirmation arrives organized to your WhatsApp or email in real time, with name, companions and any data you request at confirmation.",
        },
      },
    ],
    ctaTitle: { es: "¿Organizando un evento de empresa?", en: "Organizing a corporate event?" },
    ctaText: { es: "Cotizar invitación corporativa", en: "Get a corporate invitation quote" },
    demoPath: "/muestra/summit-aurora-vitrexi",
    demoLabel: { es: "Ver evento corporativo", en: "View corporate event" },
    related: [SEO_HUB_PATH, "/invitaciones-digitales/para-planners", "/invitaciones-digitales/bodas"],
  },
  {
    path: "/invitaciones-digitales/para-planners",
    seoTitle: {
      es: "Invitaciones Digitales para Event Planners y Organizadores | Invifty",
      en: "Digital Invitations for Event Planners | Invifty",
    },
    seoDescription: {
      es: "Para planners y organizadores de eventos: publica invitaciones digitales para tus clientes en 3 a 5 días, con revisiones, QR por evento y soporte. Planificación de eventos más ágil.",
      en: "For event planners: publish digital invitations for your clients in 3 to 5 days, with revisions, per-event QR and support. Faster event planning.",
    },
    eyebrow: { es: "Para planners y organizadores", en: "For planners and organizers" },
    h1: {
      es: "Para planners: publica invitaciones para tus clientes más rápido",
      en: "For planners: publish invitations for your clients faster",
    },
    intro: [
      {
        es: "Si manejas varios clientes y varios eventos a la vez, el tiempo es tu recurso más valioso. Invifty convierte la invitación en un paso más del proceso: nos envías los datos, revisas la propuesta y la publicamos con tu control de versiones.",
        en: "If you manage several clients and events at once, time is your most valuable resource. Invifty turns the invitation into just another step: you send us the data, review the draft and we publish it under your version control.",
      },
      {
        es: "Revisiones estructuradas, entrega en días y un mismo canal (WhatsApp) para coordinar todo: pensado para la operación diaria de un planner.",
        en: "Structured revisions, delivery in days and a single channel (WhatsApp) to coordinate everything: designed for a planner's daily workflow.",
      },
    ],
    bullets: [
      { es: "Entrega en 3 a 5 días hábiles para planificar con margen", en: "Delivery in 3 to 5 business days so you plan ahead" },
      { es: "Rondas de revisión incluidas para ajustar cada detalle", en: "Included revision rounds to fine-tune every detail" },
      { es: "QR, RSVP y registro por evento para clientes corporativos", en: "QR, RSVP and registration per event for corporate clients" },
      { es: "Coordinación rápida por WhatsApp, un solo canal", en: "Fast coordination via WhatsApp, a single channel" },
    ],
    sections: [
      {
        heading: { es: "Un proceso que respeta tu agenda", en: "A process that respects your schedule" },
        body: {
          es: "Elige plan, envía los datos del evento y recibe la propuesta con las rondas de revisión de tu plan (de 1 a 4 según el paquete). Agrupa tus comentarios y los aplicamos juntos, sin idas y venidas por mensaje.",
          en: "Choose a plan, send the event details and receive the draft with your plan's revision rounds (1 to 4 depending on the package). Group your feedback and we apply it together, without message back-and-forth.",
        },
      },
      {
        heading: { es: "Para clientes corporativos y bodas premium", en: "For corporate clients and premium weddings" },
        body: {
          es: "El plan A medida crea un diseño único por cliente —ideal para clientes premium que esperan exclusividad— con video de portada y galería post-evento. Tú presentas, nosotros producimos.",
          en: "The Custom plan creates a unique design per client —ideal for premium clients expecting exclusivity— with a cover video and post-event gallery. You present, we produce.",
        },
      },
    ],
    faqs: [
      {
        q: { es: "¿Puedo gestionar invitaciones de varios clientes a la vez?", en: "Can I manage invitations for several clients at once?" },
        a: {
          es: "Sí. Coordinamos cada evento por separado por WhatsApp y cada invitación se publica con su propio enlace privado y su QR cuando aplica.",
          en: "Yes. We coordinate each event separately on WhatsApp and each invitation is published with its own private link and QR when applicable.",
        },
      },
      {
        q: { es: "¿Cómo funcionan las revisiones?", en: "How do revisions work?" },
        a: {
          es: "Cada plan incluye entre 1 y 4 rondas de revisión. En cada ronda agrupas todos tus comentarios y los aplicamos de una vez. Los cambios de datos del evento (hora, lugar, dress code) son siempre gratuitos.",
          en: "Each plan includes between 1 and 4 revision rounds. In each round you group all your comments and we apply them at once. Event-detail changes (time, venue, dress code) are always free.",
        },
      },
      {
        q: { es: "¿Cómo se comparte la invitación con los invitados?", en: "How is the invitation shared with guests?" },
        a: {
          es: "Cada evento recibe su propio enlace privado de Invifty, listo para reenviar por WhatsApp. Se abre al instante en cualquier teléfono, sin descargar aplicaciones.",
          en: "Each event gets its own private Invifty link, ready to forward on WhatsApp. It opens instantly on any phone, with no app downloads.",
        },
      },
    ],
    ctaTitle: { es: "¿Eres planner u organizador?", en: "Are you a planner or organizer?" },
    ctaText: { es: "Hablar con el equipo Invifty", en: "Talk to the Invifty team" },
    demoPath: "/muestra/gala-anual-vitrexi",
    demoLabel: { es: "Ver gala corporativa", en: "View corporate gala" },
    related: [SEO_HUB_PATH, "/invitaciones-digitales/corporativos", "/invitaciones-digitales/bodas"],
  },
];
