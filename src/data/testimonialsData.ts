import { Testimonial } from "../types";

/**
 * TESTIMONIOS DE CLIENTES DE INVIFTY
 * ===================================
 * NOTA DE DESARROLLO: Estos testimonios son ilustrativos para la fase de lanzamiento
 * y se muestran en el sitio etiquetados como "Historia Ilustrativa".
 * Cuando tengas testimonios reales de parejas y clientes, edita este archivo
 * y cambia isProvisionalNotice a false para que se muestren como "Cliente Invifty".
 */

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Isabella & Carlos M.",
    eventType: { es: "Boda Luxury", en: "Luxury Wedding" },
    location: "Miami, FL",
    comment: {
      es: "A nuestros invitados les fascinó la invitación. La confirmación por WhatsApp nos ahorró días enteros organizando las mesas. El equipo de Invifty entregó todo impecable en menos de 48 horas.",
      en: "Our guests were fascinated by the invitation. The WhatsApp RSVP saved us entire days of seating planning. The Invifty team delivered everything flawlessly in under 48 hours."
    },
    rating: 5,
    date: "Junio 2026",
    isProvisionalNotice: true
  },
  {
    id: "2",
    name: "Dra. Patricia Reyes",
    eventType: { es: "15 Años de su hija Paola", en: "Her daughter Paola's Quinceañera" },
    location: "Madrid, España",
    comment: {
      es: "La calidad visual supera por mucho cualquier PDF o tarjeta tradicional. La música de fondo y el mapa interactivo le dieron el toque sofisticado que queríamos para los 15 de mi hija.",
      en: "The visual quality far exceeds any PDF or traditional card. The background music and interactive map gave my daughter's quinceañera the sophisticated touch we wanted."
    },
    rating: 5,
    date: "Mayo 2026",
    isProvisionalNotice: true
  },
  {
    id: "3",
    name: "Lic. Roberto Almanzar",
    eventType: { es: "Cena de Gala Empresarial", en: "Corporate Gala Dinner" },
    location: "Ciudad de México",
    comment: {
      es: "Usamos el plan Premium para nuestra gala corporativa anual de 350 personas. El registro de invitados funcionó perfecto y dio una imagen de altísimo profesionalismo a nuestra empresa.",
      en: "We used the Premium plan for our 350-guest annual corporate gala. Guest registration worked perfectly and projected an image of the highest professionalism for our company."
    },
    rating: 5,
    date: "Abril 2026",
    isProvisionalNotice: true
  }
];
