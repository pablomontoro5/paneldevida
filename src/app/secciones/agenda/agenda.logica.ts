import { Evento, EstadoEvento, EventoConEstado } from './agenda.modelo';
import { aMinutos } from '../../compartido/fechas';

// Ordena por hora de inicio y marca cada evento. Solo uno lleva "Ahora" o "Siguiente".
export function marcarEventos(eventos: Evento[], minutoActual: number): EventoConEstado[] {
  let destacadoPuesto = false;
  return [...eventos]
    .sort((a, b) => aMinutos(a.inicio) - aMinutos(b.inicio))
    .map((evento) => {
      let estado: EstadoEvento = 'futuro';
      if (aMinutos(evento.fin) <= minutoActual) {
        estado = 'pasado';
      } else if (aMinutos(evento.inicio) <= minutoActual) {
        estado = 'actual';
        destacadoPuesto = true;
      } else if (!destacadoPuesto) {
        estado = 'siguiente';
        destacadoPuesto = true;
      }
      return { ...evento, estado };
    });
}

// ---------- Formulario de la agenda ----------

// Lo que hay escrito en el formulario. Todo es texto: "" significa "vacío".
export interface BorradorEvento {
  titulo: string;
  lugar: string;
  inicio: string; // "HH:MM", como lo da <input type="time">
  fin: string;
}

export type ErroresEvento = Partial<Record<'titulo' | 'inicio' | 'fin', string>>;

export const BORRADOR_EVENTO_VACIO: BorradorEvento = { titulo: '', lugar: '', inicio: '', fin: '' };

// Si no se escribe la hora de fin, el evento dura una hora.
export const DURACION_POR_DEFECTO = 60;

// Qué falta o está mal. Si devuelve {}, el evento se puede guardar.
export function validarEvento(borrador: BorradorEvento): ErroresEvento {
  const errores: ErroresEvento = {};
  if (!borrador.titulo.trim()) errores.titulo = 'Escribe qué tienes.';
  if (!borrador.inicio) errores.inicio = 'Elige la hora de inicio.';
  // "HH:MM" se compara bien como texto, igual que las fechas "AAAA-MM-DD".
  if (borrador.inicio && borrador.fin && borrador.fin < borrador.inicio) {
    errores.fin = 'El fin no puede ser antes que el inicio.';
  }
  return errores;
}

// "HH:MM" más unos minutos, sin pasar de las 23:59 (la agenda es solo de hoy).
export function sumarMinutos(hora: string, minutos: number): string {
  const total = Math.min(aMinutos(hora) + minutos, 23 * 60 + 59);
  const h = String(Math.floor(total / 60)).padStart(2, '0');
  const m = String(total % 60).padStart(2, '0');
  return `${h}:${m}`;
}

export function borradorAEvento(borrador: BorradorEvento, id: string): Evento {
  return {
    id,
    titulo: borrador.titulo.trim(),
    lugar: borrador.lugar.trim(),
    inicio: borrador.inicio,
    fin: borrador.fin || sumarMinutos(borrador.inicio, DURACION_POR_DEFECTO),
  };
}

export function eventoABorrador(evento: Evento): BorradorEvento {
  return { titulo: evento.titulo, lugar: evento.lugar, inicio: evento.inicio, fin: evento.fin };
}
