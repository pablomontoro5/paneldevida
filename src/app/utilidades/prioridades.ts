import { claveFecha } from './fechas';

// Se guardan por día, así cada mañana empiezan sin marcar.
export function clavePrioridades(fecha: Date): string {
  return `prioridades:${claveFecha(fecha)}`;
}

// Devuelve una lista nueva (no modifica la original) con el id añadido o quitado.
export function alternarHecha(hechas: string[], id: string, marcada: boolean): string[] {
  const sinId = hechas.filter(h => h !== id);
  return marcada ? [...sinId, id] : sinId;
}