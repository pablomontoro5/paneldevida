import { calcularRacha, claveFecha } from '../../compartido/fechas';
import { Evento, EventoConEstado } from '../agenda/agenda.modelo';
import { marcarEventos } from '../agenda/agenda.logica';
import { Habito } from '../habitos/habito.modelo';
import { RegistroHabitos } from '../habitos/habitos.logica';
import { Objetivo } from '../objetivos/objetivo.modelo';
import { ProgresoObjetivos, estadoObjetivo } from '../objetivos/objetivos.logica';
import { Viaje } from '../viajes/viaje.modelo';
import { diasHastaViaje, estadoViaje, viajesPendientes } from '../viajes/viajes.logica';

// "1 evento" / "3 eventos".
function contar(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

// Los eventos que aún no han terminado.
export function eventosRestantes(eventos: Evento[], minutoActual: number): number {
  return marcarEventos(eventos, minutoActual).filter(e => e.estado !== 'pasado').length;
}

// La frase bajo el saludo: "Te quedan 2 eventos y 1 prioridad por hacer."
export function fraseDelDia(eventos: number, prioridadesPendientes: number): string {
  if (eventos === 0 && prioridadesPendientes === 0) return 'Por hoy lo tienes todo hecho. ¡Buen trabajo!';
  if (eventos === 0) {
    const queda = prioridadesPendientes === 1 ? 'queda' : 'quedan';
    return `Ya no tienes más eventos hoy y te ${queda} ${contar(prioridadesPendientes, 'prioridad', 'prioridades')}.`;
  }
  const verbo = eventos === 1 ? 'Te queda' : 'Te quedan';
  if (prioridadesPendientes === 0) return `${verbo} ${contar(eventos, 'evento', 'eventos')} y ya tienes las prioridades hechas.`;
  return `${verbo} ${contar(eventos, 'evento', 'eventos')} y ${contar(prioridadesPendientes, 'prioridad', 'prioridades')} por hacer.`;
}

// El evento que está en curso o, si no, el siguiente. null si ya no queda ninguno.
export function eventoDestacado(eventos: Evento[], minutoActual: number): EventoConEstado | null {
  return marcarEventos(eventos, minutoActual).find(e => e.estado === 'actual' || e.estado === 'siguiente') ?? null;
}

export interface MejorRacha {
  habito: Habito;
  racha: number;
}

// El hábito con la racha más larga. null si ninguno tiene racha.
export function mejorRacha(habitos: Habito[], registro: RegistroHabitos, hoy: Date): MejorRacha | null {
  let mejor: MejorRacha | null = null;
  for (const habito of habitos) {
    const racha = calcularRacha(registro[habito.id] ?? [], hoy);
    if (racha > 0 && (!mejor || racha > mejor.racha)) mejor = { habito, racha };
  }
  return mejor;
}

// Cuántos hábitos están marcados hoy.
export function habitosHechosHoy(habitos: Habito[], registro: RegistroHabitos, hoy: Date): number {
  const clave = claveFecha(hoy);
  return habitos.filter(h => (registro[h.id] ?? []).includes(clave)).length;
}

// Cuántos objetivos van al día o ya están conseguidos.
export function objetivosAlDia(objetivos: Objetivo[], progreso: ProgresoObjetivos, ritmo: number): number {
  return objetivos.filter(o => {
    const valor = progreso[o.id] ?? o.actual;
    return estadoObjetivo(valor / o.meta, ritmo) !== 'detras';
  }).length;
}

export interface ProximoViaje {
  viaje: Viaje;
  dias: number;
  enCurso: boolean;
}

// El viaje en curso o el más cercano. null si no hay ninguno pendiente.
export function proximoViaje(viajes: Viaje[], hoy: Date): ProximoViaje | null {
  const [viaje] = viajesPendientes(viajes, hoy);
  if (!viaje) return null;
  return { viaje, dias: diasHastaViaje(viaje, hoy), enCurso: estadoViaje(viaje, hoy) === 'en-curso' };
}
