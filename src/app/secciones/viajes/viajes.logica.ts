import { Viaje } from './viaje.modelo';
import { diasDesde } from '../../compartido/fechas';

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
