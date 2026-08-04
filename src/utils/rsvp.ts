import { RsvpAttendance } from "../types";

/**
 * Convierte el valor de un `<select>` (siempre `string`) en un valor de
 * asistencia válido.
 *
 * Existe para eliminar los `as any` que había repartidos por los demos: el
 * valor de un `<select>` no está tipado, y forzarlo con `any` desactivaba
 * cualquier comprobación. Si llegara un valor inesperado se trata como
 * "Declina", que es la opción conservadora (nunca cuenta a alguien como
 * confirmado por error).
 */
export function parseAttendance(value: string): RsvpAttendance {
  return value === "Confirmado" ? "Confirmado" : "Declina";
}
