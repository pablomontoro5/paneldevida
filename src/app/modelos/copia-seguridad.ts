import { Evento } from './agenda';
import { Prioridad } from './prioridad';
import { Habito } from './habito';
import { Objetivo } from './objetivo';

// Todo lo que se guarda y se restaura de una copia de seguridad.
export interface CopiaSeguridad {
  agenda: Evento[];
  prioridades: Prioridad[];
  habitos: Habito[];
  objetivos: Objetivo[];
}