import { claveFecha } from '../../compartido/fechas';
import { Prioridad } from './prioridad.modelo';

// Se guardan por día, así cada mañana empiezan sin marcar.
export function clavePrioridades(fecha: Date): string {
  return `prioridades:${claveFecha(fecha)}`;
}

// Devuelve una lista nueva (no modifica la original) con el id añadido o quitado.
export function alternarHecha(hechas: string[], id: string, marcada: boolean): string[] {
  const sinId = hechas.filter(h => h !== id);
  return marcada ? [...sinId, id] : sinId;
}

// Cuántas de las prioridades que existen están marcadas. Así, una prioridad borrada
// que siguiera marcada no cuenta (no puede salir "3 de 2 hechas").
export function contarHechas(prioridades: Prioridad[], hechas: string[]): number {
  return prioridades.filter(p => hechas.includes(p.id)).length;
}

// ---------- Formulario de las prioridades ----------

// Son "las 3 prioridades del día": no se pueden tener más.
export const MAX_PRIORIDADES = 3;

// Lo que hay escrito en el formulario.
export interface BorradorPrioridad {
  texto: string;
}

export type ErroresPrioridad = Partial<Record<'texto' | 'limite', string>>;

export const BORRADOR_PRIORIDAD_VACIO: BorradorPrioridad = { texto: '' };

export function puedeAnadir(prioridades: Prioridad[]): boolean {
  return prioridades.length < MAX_PRIORIDADES;
}

// Qué falta o está mal. "id" es el de la prioridad que se edita ('' si es nueva).
// Si devuelve {}, la prioridad se puede guardar.
export function validarPrioridad(
  borrador: BorradorPrioridad,
  prioridades: Prioridad[],
  id: string,
): ErroresPrioridad {
  const errores: ErroresPrioridad = {};
  if (!borrador.texto.trim()) errores.texto = 'Escribe qué quieres hacer hoy.';
  const esNueva = !prioridades.some(p => p.id === id);
  if (esNueva && !puedeAnadir(prioridades)) {
    errores.limite = `Ya tienes tus ${MAX_PRIORIDADES} prioridades: edita o borra una para cambiarla.`;
  }
  return errores;
}

export function borradorAPrioridad(borrador: BorradorPrioridad, id: string): Prioridad {
  return { id, texto: borrador.texto.trim() };
}

export function prioridadABorrador(prioridad: Prioridad): BorradorPrioridad {
  return { texto: prioridad.texto };
}
