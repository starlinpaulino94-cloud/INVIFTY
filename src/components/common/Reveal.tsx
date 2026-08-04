import { ReactNode, useEffect, useRef, useState } from "react";

interface RevealProps {
  children: ReactNode;
  /** Retardo en ms, para escalonar elementos de una misma fila. */
  delay?: number;
  className?: string;
  /** Dirección desde la que entra el contenido. */
  from?: "bottom" | "left" | "right" | "none";
}

const OFFSETS: Record<NonNullable<RevealProps["from"]>, string> = {
  bottom: "translate-y-8",
  left: "-translate-x-8",
  right: "translate-x-8",
  none: "",
};

/**
 * Muestra su contenido con una entrada suave al entrar en pantalla.
 *
 * Dos cuidados deliberados:
 *
 * 1. **Nunca esconde contenido de forma permanente.** El estado inicial sólo es
 *    invisible si `IntersectionObserver` existe; si no, el contenido se
 *    renderiza visible desde el principio. Un efecto decorativo no puede dejar
 *    la invitación en blanco.
 * 2. **Respeta `prefers-reduced-motion`.** La regla global de `index.css` anula
 *    la transición, y como la visibilidad se controla con una clase (no con una
 *    animación), el contenido aparece igualmente, sólo que sin desplazamiento.
 */
export default function Reveal({ children, delay = 0, className = "", from = "bottom" }: RevealProps) {
  const supportsObserver = typeof IntersectionObserver !== "undefined";
  const [visible, setVisible] = useState(!supportsObserver);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!supportsObserver) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [supportsObserver]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${OFFSETS[from]}`
      } ${className}`}
    >
      {children}
    </div>
  );
}
