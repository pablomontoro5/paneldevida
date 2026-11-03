import { BorradorPrioridad } from './prioridades.logica';

// Ideas para no empezar desde cero: al elegir una se rellena el formulario.
export interface PlantillaPrioridad {
  icono: string; // solo para el botón; la prioridad guarda el texto
  texto: string;
}

export const PLANTILLAS_PRIORIDAD: PlantillaPrioridad[] = [
  { icono: '📚', texto: 'Repasar apuntes' },
  { icono: '📝', texto: 'Entregar la práctica' },
  { icono: '📞', texto: 'Llamar a casa' },
  { icono: '🧹', texto: 'Ordenar la habitación' },
  { icono: '🏃', texto: 'Salir a correr' },
  { icono: '🛒', texto: 'Hacer la compra' },
];

// Pone el texto de la plantilla en el formulario.
export function aplicarPlantilla(borrador: BorradorPrioridad, plantilla: PlantillaPrioridad): BorradorPrioridad {
  return { ...borrador, texto: plantilla.texto };
}
