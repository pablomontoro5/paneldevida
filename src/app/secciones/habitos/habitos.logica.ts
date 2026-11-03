import { Habito } from './habito.modelo';
import { claveFecha, haceDiasDesde, historialAFechas, mayusculaInicial } from '../../compartido/fechas';

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

// ---------- Formulario de los hábitos ----------

// Lo que hay escrito en el formulario.
export interface BorradorHabito {
  icono: string;
  nombre: string;
}

export type ErroresHabito = Partial<Record<'nombre', string>>;

export const BORRADOR_HABITO_VACIO: BorradorHabito = { icono: '✅', nombre: '' };

// Qué falta o está mal. Si devuelve {}, el hábito se puede guardar.
export function validarHabito(borrador: BorradorHabito): ErroresHabito {
  const errores: ErroresHabito = {};
  if (!borrador.nombre.trim()) errores.nombre = 'Escribe el nombre del hábito.';
  return errores;
}

// Convierte el formulario (ya validado) en un hábito. Un hábito nuevo no trae historial de ejemplo:
// empieza sin racha. Al editar se mantiene el id, así que su historial sigue ahí.
export function borradorAHabito(borrador: BorradorHabito, id: string): Habito {
  return {
    id,
    icono: borrador.icono || BORRADOR_HABITO_VACIO.icono,
    nombre: borrador.nombre.trim(),
    historialEjemplo: [],
  };
}

export function habitoABorrador(habito: Habito): BorradorHabito {
  return { icono: habito.icono, nombre: habito.nombre };
}

// Registro nuevo sin los días de ese hábito (al borrarlo).
export function quitarRegistro(registro: RegistroHabitos, id: string): RegistroHabitos {
  const { [id]: _borrado, ...resto } = registro;
  return resto;
}
