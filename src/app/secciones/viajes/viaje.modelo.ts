// Un viaje. Las fechas van como texto "AAAA-MM-DD".
// Si no hay "vuelta", el viaje dura un solo día.
export interface Viaje {
  id: string;
  icono: string;
  destino: string;
  salida: string;
  vuelta?: string; // ? = no obligatorio
}
