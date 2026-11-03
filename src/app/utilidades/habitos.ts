import { Habito } from '../modelos/habito';
import { claveFecha, haceDiasDesde, historialAFechas, mayusculaInicial } from './fechas';

export type RegistroHabitos = Record<string, string[]>;

export interface DiaSemana {
  clave: string;
  inicial: string;
  titulo: string;
  cumplido: boolean;
  esHoy: boolean;
}

const formatoInicial = new Intl.DateTimeFormat('es-ES', { weekday: 'narrow' }); 
const formatoLargo = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

// Sin nada guardado se usa el historial de ejemplo; un hábito nuevo empieza vacío.
export function completarRegistro(guardado: RegistroHabitos | null, habitos: Habito[], hoy: Date): RegistroHabitos {
  const registro: RegistroHabitos = { ...(guardado ?? {}) };
  for (const h of habitos) {
    registro[h.id] ??= guardado === null ? historialAFechas(h.historialEjemplo, hoy) : [];
  }
  return registro;
}
//Lista nueva con el día añadido o quitado.
export function alternarDia(fechas: string[], clave: string): string[] {
    return fechas.includes(clave) ? fechas.filter(f => f!== clave): [...fechas,clave];
}

// De hace 6 días a hoy.
export function ultimosSieteDias(fechas: string[], hoy: Date): DiaSemana[] {
  const dias: DiaSemana[] = [];
  for (let n = 6; n >= 0; n--) {
    const fecha = haceDiasDesde(n, hoy);
    const clave = claveFecha(fecha);
    const cumplido = fechas.includes(clave);
    dias.push({
      clave,
      inicial: formatoInicial.format(fecha),
      titulo: `${mayusculaInicial(formatoLargo.format(fecha))}: ${cumplido ? 'cumplido' : 'sin cumplir'}`,
      cumplido,
      esHoy: n === 0,
    });
  }
  return dias;
}

export function textoRacha(racha: number): string {
  if (racha === 0) return 'Sin racha';
  return racha === 1 ? '1 día seguido' : `${racha} días seguidos`;
}