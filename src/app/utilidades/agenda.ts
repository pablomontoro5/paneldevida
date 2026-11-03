import { Evento, EstadoEvento, EventoConEstado } from '../modelos/agenda';
import { aMinutos } from './fechas';

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