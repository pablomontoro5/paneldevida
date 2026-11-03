import { Objetivo } from './objetivo.modelo';
import { formatoCantidad } from '../../compartido/fechas';
export type ProgresoObjetivos = Record<string, number>;
export type EstadoObjetivo = 'conseguido' | 'al-dia' | 'detras';
const UN_DIA = 86_400_000; // milisegundos que tiene un día
const formatoPorciento = new Intl.NumberFormat('es-ES', { style: 'percent', maximumFractionDigits: 0 });
// 'objetivos:2026'
export function claveObjetivos(hoy: Date): string{
    return `objetivos:${hoy.getFullYear()}`;
}   
// de 0 a 1, contando hoy        
export function fraccionDelAnio(hoy: Date): number{
    const anio = hoy.getFullYear();
    const inicio = new Date(anio, 0, 1);
    const siguienteAnio = new Date(anio+1,0,1);
    const soloFecha = new Date(anio, hoy.getMonth(), hoy.getDate());
    const diasDelAnio = Math.round((siguienteAnio.getTime() - inicio.getTime()) / UN_DIA);
    const diaDeHoy = Math.round((soloFecha.getTime() - inicio.getTime()) / UN_DIA) + 1;
    return diaDeHoy/diasDelAnio;
}           
export function cambiarValor(valor: number, paso: number, signo: 1 | -1): number{
    return Math.max(0, Math.round((valor+signo*paso)*100)/100);
}
export function estadoObjetivo(fraccion: number, ritmo: number): EstadoObjetivo{
    if (fraccion >= 1) return 'conseguido';
    if (fraccion >= ritmo) return 'al-dia';
    return 'detras';
}
// "1.284 € de 1.500 €" o "9 de 24 libros".
export function textoProgreso(objetivo: Objetivo, valor: number): string {
  const esEuros = objetivo.formato === 'euros';
  const texto = `${formatoCantidad(valor, esEuros)} de ${formatoCantidad(objetivo.meta, esEuros)}`;
  return objetivo.unidad ? `${texto} ${objetivo.unidad}` : texto;
}

export function formatoPorcentaje(fraccion: number): string {
  return formatoPorciento.format(fraccion);
}

// Quita el progreso de un objetivo borrado (devuelve un objeto nuevo, no cambia el original).
export function quitarProgreso(progreso: ProgresoObjetivos, id: string): ProgresoObjetivos {
  const resto = { ...progreso };
  delete resto[id];
  return resto;
}

// ---------- Formulario de los objetivos ----------

export type TipoObjetivo = 'unidad' | 'euros';

// Lo que hay escrito en el formulario. Los números son null si el campo está vacío.
export interface BorradorObjetivo {
  icono: string;
  nombre: string;
  meta: number | null;
  paso: number | null;
  tipo: TipoObjetivo;
  unidad: string;
  llevas: number | null; // al crear, el valor de partida; al editar, lo que llevas este año
}

export type ErroresObjetivo = Partial<Record<'nombre' | 'meta' | 'paso' | 'unidad' | 'llevas', string>>;

export const BORRADOR_OBJETIVO_VACIO: BorradorObjetivo = {
  icono: '🎯',
  nombre: '',
  meta: null,
  paso: 1,
  tipo: 'unidad',
  unidad: '',
  llevas: 0,
};

// "n is number" le dice a TypeScript que, si devuelve true, n ya no es null.
function esPositivo(n: number | null): n is number {
  return n !== null && Number.isFinite(n) && n > 0;
}

// Qué falta o está mal. Si devuelve {}, el objetivo se puede guardar.
export function validarObjetivo(borrador: BorradorObjetivo): ErroresObjetivo {
  const errores: ErroresObjetivo = {};
  if (!borrador.nombre.trim()) errores.nombre = 'Escribe el nombre del objetivo.';
  if (!esPositivo(borrador.meta)) errores.meta = 'La meta tiene que ser mayor que 0.';
  if (!esPositivo(borrador.paso)) errores.paso = 'El paso tiene que ser mayor que 0.';
  if (borrador.tipo === 'unidad' && !borrador.unidad.trim()) {
    errores.unidad = 'Escribe la unidad (por ejemplo, libros o km) o elige euros.';
  }
  const llevas = borrador.llevas;
  const pasaDeLaMeta = esPositivo(borrador.meta) && llevas !== null && llevas > borrador.meta;
  if (llevas === null || !Number.isFinite(llevas) || llevas < 0 || pasaDeLaMeta) {
    errores.llevas = 'Tiene que estar entre 0 y la meta.';
  }
  return errores;
}

// Convierte el formulario (ya validado) en un objetivo. "llevas" se guarda como valor de partida.
export function borradorAObjetivo(borrador: BorradorObjetivo, id: string): Objetivo {
  const objetivo: Objetivo = {
    id,
    icono: borrador.icono || BORRADOR_OBJETIVO_VACIO.icono,
    nombre: borrador.nombre.trim(),
    actual: borrador.llevas ?? 0,
    meta: borrador.meta ?? 0,
    paso: borrador.paso ?? 0,
  };
  if (borrador.tipo === 'euros') objetivo.formato = 'euros';
  else objetivo.unidad = borrador.unidad.trim();
  return objetivo;
}

// "valor" es lo que llevas este año, que puede ser distinto del valor de partida.
export function objetivoABorrador(objetivo: Objetivo, valor: number): BorradorObjetivo {
  return {
    icono: objetivo.icono,
    nombre: objetivo.nombre,
    meta: objetivo.meta,
    paso: objetivo.paso,
    tipo: objetivo.formato === 'euros' ? 'euros' : 'unidad',
    unidad: objetivo.unidad ?? '',
    llevas: valor,
  };
}