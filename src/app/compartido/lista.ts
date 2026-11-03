// Utilidades para listas de cosas con "id" (viajes, hábitos, objetivos...).
// No cambian la lista que reciben: devuelven una nueva, como necesitan los signals.

export interface ConId {
  id: string;
}

// Si ya hay un elemento con ese id lo sustituye (editar); si no, lo añade al final (crear).
export function guardarEnLista<T extends ConId>(lista: T[], elemento: T): T[] {
  const existe = lista.some(e => e.id === elemento.id);
  return existe ? lista.map(e => (e.id === elemento.id ? elemento : e)) : [...lista, elemento];
}

export function quitarDeLista<T extends ConId>(lista: T[], id: string): T[] {
  return lista.filter(e => e.id !== id);
}

// Un id nuevo que no esté ya en la lista, p. ej. "viaje-mh2k3x".
// "semilla" es un número distinto en cada llamada (por defecto, la hora); las pruebas pasan uno fijo.
export function nuevoId(prefijo: string, lista: ConId[], semilla: number = Date.now()): string {
  const usados = new Set(lista.map(e => e.id));
  let n = semilla;
  while (usados.has(`${prefijo}-${n.toString(36)}`)) n++;
  return `${prefijo}-${n.toString(36)}`;
}
