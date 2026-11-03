// Un hueco de la agenda de hoy. Las horas son "HH:MM" porque solo se comparan.
export interface Evento {
  id: string;
  inicio: string;
  fin: string;
  titulo: string;
  lugar: string;
}

export type EstadoEvento = 'pasado' | 'actual' | 'siguiente' | 'futuro';

export interface EventoConEstado extends Evento {
  estado: EstadoEvento;
}
