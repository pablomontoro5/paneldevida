import { BorradorHabito } from './habitos.logica';

// Iconos para elegir en el formulario.
export const ICONOS_HABITO = ['✅', '📚', '🏃', '💧', '💻', '🧘', '😴', '🗣️', '📵', '🥗', '🎸', '✍️'];

// Ideas para no empezar desde cero: al elegir una se rellena el formulario.
export const PLANTILLAS_HABITO: BorradorHabito[] = [
  { icono: '📚', nombre: 'Leer 20 minutos' },
  { icono: '🏃', nombre: 'Hacer ejercicio' },
  { icono: '💧', nombre: 'Beber 2 litros de agua' },
  { icono: '💻', nombre: 'Programar algo propio' },
  { icono: '🧘', nombre: 'Meditar 10 minutos' },
  { icono: '😴', nombre: 'Dormir 8 horas' },
  { icono: '🗣️', nombre: 'Practicar inglés' },
  { icono: '📵', nombre: 'Un rato sin móvil' },
];

export function aplicarPlantilla(borrador: BorradorHabito, plantilla: BorradorHabito): BorradorHabito {
  return { ...borrador, ...plantilla };
}
