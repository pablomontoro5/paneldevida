import { BorradorViaje, sumarDias } from './viajes.logica';

// Ideas para no empezar desde cero: al elegir una se rellena el formulario.
export interface PlantillaViaje {
  icono: string;
  destino: string;
  dias: number; // cuántos días suele durar; sirve para proponer la vuelta
}

export const PLANTILLAS_VIAJE: PlantillaViaje[] = [
  { icono: '🏖️', destino: 'Escapada a la playa', dias: 4 },
  { icono: '🏔️', destino: 'Ruta por la montaña', dias: 3 },
  { icono: '🎄', destino: 'Navidad en casa', dias: 15 },
  { icono: '🏙️', destino: 'Fin de semana en otra ciudad', dias: 3 },
  { icono: '👨‍👩‍👧', destino: 'Visitar a la familia', dias: 2 },
  { icono: '🎉', destino: 'Festival de música', dias: 3 },
];

// Iconos para elegir en el formulario.
export const ICONOS_VIAJE = ['✈️', '🏖️', '🏔️', '🎄', '🏙️', '🚆', '🚗', '🏕️', '🎉', '👨‍👩‍👧'];

// Pone el icono y el destino de la plantilla. Si ya hay salida, propone la vuelta;
// las fechas que ya estaban escritas no se tocan.
export function aplicarPlantilla(borrador: BorradorViaje, plantilla: PlantillaViaje): BorradorViaje {
  const vuelta =
    borrador.salida && !borrador.vuelta ? sumarDias(borrador.salida, plantilla.dias - 1) : borrador.vuelta;
  return { ...borrador, icono: plantilla.icono, destino: plantilla.destino, vuelta };
}
