import { Viaje } from './viaje.modelo';
import { claveFecha, diasDesde } from '../../compartido/fechas';

export type EstadoViaje = 'falta' | 'en-curso' | 'pasado';

const formatoFechaViaje = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

// "2026-12-20" → fecha local. new Date('2026-12-20') la tomaría en UTC
// y en España podría salir el día anterior.
export function aFecha(texto: string): Date {
  const [anio, mes, dia] = texto.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

// Días que faltan para salir: 0 si es hoy, negativo si ya salió.
export function diasHastaViaje(viaje: Viaje, hoy: Date): number {
  return diasDesde(hoy, aFecha(viaje.salida));
}

export function estadoViaje(viaje: Viaje, hoy: Date): EstadoViaje {
  if (diasHastaViaje(viaje, hoy) > 0) return 'falta';
  const vuelta = aFecha(viaje.vuelta ?? viaje.salida);
  return diasDesde(hoy, vuelta) >= 0 ? 'en-curso' : 'pasado';
}

// "¡Es hoy!", "Mañana" o "Faltan 47 días".
export function textoCuentaAtras(dias: number): string {
  if (dias <= 0) return '¡Es hoy!';
  if (dias === 1) return 'Mañana';
  return `Faltan ${dias} días`;
}

// "20 de diciembre de 2026" o "20 de diciembre de 2026 – 6 de enero de 2027".
export function textoFechasViaje(viaje: Viaje): string {
  const salida = formatoFechaViaje.format(aFecha(viaje.salida));
  if (!viaje.vuelta || viaje.vuelta === viaje.salida) return salida;
  return `${salida} – ${formatoFechaViaje.format(aFecha(viaje.vuelta))}`;
}

// Quita los viajes que ya han terminado y ordena el resto por fecha de salida.
export function viajesPendientes(viajes: Viaje[], hoy: Date): Viaje[] {
  return viajes
    .filter(v => estadoViaje(v, hoy) !== 'pasado')
    .sort((a, b) => a.salida.localeCompare(b.salida)); // "AAAA-MM-DD" se ordena bien como texto
}

// ---------- Formulario de viajes ----------

// Lo que hay escrito en el formulario. Todo es texto: "" significa "vacío".
export interface BorradorViaje {
  icono: string;
  destino: string;
  salida: string; // "AAAA-MM-DD", como lo da <input type="date">
  vuelta: string;
}

export type ErroresViaje = Partial<Record<'destino' | 'salida' | 'vuelta', string>>;

export const BORRADOR_VACIO: BorradorViaje = { icono: '✈️', destino: '', salida: '', vuelta: '' };

// Qué falta o está mal. Si devuelve {}, el viaje se puede guardar.
export function validarViaje(borrador: BorradorViaje): ErroresViaje {
  const errores: ErroresViaje = {};
  if (!borrador.destino.trim()) errores.destino = 'Escribe a dónde vas.';
  if (!borrador.salida) errores.salida = 'Elige el día de salida.';
  if (borrador.salida && borrador.vuelta && borrador.vuelta < borrador.salida) {
    errores.vuelta = 'La vuelta no puede ser antes de la salida.';
  }
  return errores;
}

export function borradorAViaje(borrador: BorradorViaje, id: string): Viaje {
  const viaje: Viaje = {
    id,
    icono: borrador.icono || BORRADOR_VACIO.icono,
    destino: borrador.destino.trim(),
    salida: borrador.salida,
  };
  // La vuelta solo se guarda si es otro día; si no, el viaje dura un día.
  if (borrador.vuelta && borrador.vuelta !== borrador.salida) viaje.vuelta = borrador.vuelta;
  return viaje;
}

export function viajeABorrador(viaje: Viaje): BorradorViaje {
  return { icono: viaje.icono, destino: viaje.destino, salida: viaje.salida, vuelta: viaje.vuelta ?? '' };
}

// La fecha "dias" días después, también como "AAAA-MM-DD".
export function sumarDias(texto: string, dias: number): string {
  const fecha = aFecha(texto);
  fecha.setDate(fecha.getDate() + dias);
  return claveFecha(fecha);
}
