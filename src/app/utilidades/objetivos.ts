import { Objetivo } from '../modelos/objetivo';
import { formatoCantidad } from './fechas';
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