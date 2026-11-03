import { ArchivoCopia } from '../../nucleo/archivo-copia.modelo';
import { claveFecha, diasDesde } from '../../compartido/fechas';

// Si la última copia es más antigua que esto, se avisa.
export const DIAS_AVISO_COPIA = 7;

export const formatoFechaCopia = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

// Comprueba que algo leído de un archivo tiene la forma de una copia del panel.
export function esCopiaValida(copia: unknown): copia is ArchivoCopia {
  if (copia === null || typeof copia !== 'object') return false;

  const { app, version, fecha, datos } = copia as Record<string, unknown>;
  return (
    app === 'panel-de-vida' &&
    version === 1 &&
    typeof fecha === 'string' &&
    !isNaN(Date.parse(fecha)) &&
    datos !== null &&
    typeof datos === 'object' &&
    !Array.isArray(datos)
  );
}

export interface EstadoCopia {
  texto: string;
  aviso: boolean; // true = se pinta destacado
}

// Lo que se muestra bajo los botones según cuándo fue la última copia.
export function estadoCopia(ultima: string | null, hoy: Date): EstadoCopia {
  if (ultima === null) {
    return { texto: '⚠️ Todavía no has descargado ninguna copia.', aviso: true };
  }

  const fecha = new Date(ultima);
  const dias = diasDesde(fecha, hoy);
  const textoFecha = formatoFechaCopia.format(fecha);

  if (dias > DIAS_AVISO_COPIA) {
    return { texto: `⚠️ Hace ${dias} días de tu última copia (${textoFecha}).`, aviso: true };
  }
  return { texto: `Última copia: ${textoFecha}.`, aviso: false };
}

export function nombreArchivoCopia(hoy: Date): string {
  return `panel-de-vida-copia-${claveFecha(hoy)}.json`;
}