import { Evento } from './secciones/agenda/agenda.modelo';
import { Prioridad } from './secciones/prioridades/prioridad.modelo';
import { Habito } from './secciones/habitos/habito.modelo';
import { Objetivo } from './secciones/objetivos/objetivo.modelo';

// Todo lo que se guarda y se restaura de una copia de seguridad.
export interface CopiaSeguridad {
  agenda: Evento[];
  prioridades: Prioridad[];
  habitos: Habito[];
  objetivos: Objetivo[];
}