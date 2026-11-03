// El archivo .json de una copia de seguridad.
// Tiene el mismo formato que la versión vanilla para poder pasar los datos de una a otra.
export interface ArchivoCopia {
  app: 'panel-de-vida';
  version: 1;
  fecha: string; // cuándo se hizo, en ISO: "2026-11-03T09:15:00.000Z"
  datos: Record<string, unknown>; // cada clave guardada (sin el prefijo) con su valor
}