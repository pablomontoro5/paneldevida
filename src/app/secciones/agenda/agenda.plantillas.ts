import { BorradorEvento, sumarMinutos } from './agenda.logica';

// Ideas para no empezar desde cero: al elegir una se rellena el formulario.
export interface PlantillaEvento {
  icono: string; // solo para el botón; el evento guarda el título
  titulo: string;
  lugar: string;
  minutos: number; // cuánto suele durar; sirve para proponer la hora de fin
}

export const PLANTILLAS_EVENTO: PlantillaEvento[] = [
  { icono: '📚', titulo: 'Estudiar', lugar: 'Biblioteca', minutos: 120 },
  { icono: '🎓', titulo: 'Clase', lugar: '', minutos: 120 },
  { icono: '💻', titulo: 'Prácticas', lugar: 'Laboratorio', minutos: 120 },
  { icono: '🏋️', titulo: 'Gimnasio', lugar: '', minutos: 60 },
  { icono: '🍽️', titulo: 'Comida con el grupo', lugar: 'Cafetería', minutos: 60 },
  { icono: '📞', titulo: 'Llamar a casa', lugar: '', minutos: 30 },
];

// Pone el título de la plantilla. El lugar solo si estaba vacío, y si ya hay
// hora de inicio propone la de fin; lo que ya estaba escrito no se toca.
export function aplicarPlantilla(borrador: BorradorEvento, plantilla: PlantillaEvento): BorradorEvento {
  const fin = borrador.inicio && !borrador.fin ? sumarMinutos(borrador.inicio, plantilla.minutos) : borrador.fin;
  return { ...borrador, titulo: plantilla.titulo, lugar: borrador.lugar || plantilla.lugar, fin };
}
