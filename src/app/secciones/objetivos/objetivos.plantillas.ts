import { BorradorObjetivo, TipoObjetivo } from './objetivos.logica';

// Iconos para elegir en el formulario.
export const ICONOS_OBJETIVO = ['🎯', '📚', '💶', '🏃', '🎓', '🏊', '🎸', '💪', '🧘', '🌍'];

// Ideas para no empezar desde cero: al elegir una se rellena el formulario.
export interface PlantillaObjetivo {
  icono: string;
  nombre: string;
  meta: number;
  paso: number;
  tipo: TipoObjetivo;
  unidad: string; // '' si son euros
}

export const PLANTILLAS_OBJETIVO: PlantillaObjetivo[] = [
  { icono: '📚', nombre: 'Leer 24 libros', meta: 24, paso: 1, tipo: 'unidad', unidad: 'libros' },
  { icono: '💶', nombre: 'Ahorrar 1.500 €', meta: 1500, paso: 50, tipo: 'euros', unidad: '' },
  { icono: '🏃', nombre: 'Correr 300 km', meta: 300, paso: 5, tipo: 'unidad', unidad: 'km' },
  { icono: '🎓', nombre: 'Aprobar 10 asignaturas', meta: 10, paso: 1, tipo: 'unidad', unidad: 'asignaturas' },
  { icono: '🏊', nombre: 'Nadar 50 km', meta: 50, paso: 1, tipo: 'unidad', unidad: 'km' },
  { icono: '🎸', nombre: 'Practicar 100 horas de guitarra', meta: 100, paso: 1, tipo: 'unidad', unidad: 'horas' },
];

// Rellena el formulario con la plantilla; lo que llevas no se toca.
export function aplicarPlantilla(borrador: BorradorObjetivo, plantilla: PlantillaObjetivo): BorradorObjetivo {
  return { ...borrador, ...plantilla };
}
