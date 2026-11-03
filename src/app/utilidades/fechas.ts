export function mismoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Fechalocal en formato AAAA-MM-DD, (toISOString() devuelve en UTC y podría usar el día anterior)

export function claveFecha(fecha: Date): string {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
}

// Devuelve la fecha de hace n días

export function haceDias(n: number): Date {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - n);
    return fecha;
}

// Convierte "HH:MM" a minutos desde las 00:00.
export function aMinutos(hora: string): number {
  const [h, m] = hora.split(':');
  return Number(h) * 60 + Number(m);
}

// Pone la primera letra en mayúscula ("lunes" → "Lunes").
export function mayusculaInicial(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Días seguidos cumplidos. Si hoy aún no está marcado se cuenta desde ayer,
// para que la racha no aparezca a 0 por la mañana.
export function calcularRacha(fechas: string[], hoy: Date = new Date()): number {
  const cumplidos = new Set(fechas);
  const desde = cumplidos.has(claveFecha(hoy)) ? 0 : 1;
  let racha = 0;
  while (cumplidos.has(claveFecha(haceDias(desde + racha)))) racha++;
  return racha;
}
// Una cantidad, en euros o como número normal.
// useGrouping "always" hace que 1284 salga como 1.284.
export function formatoCantidad(valor: number, esEuros: boolean = false): string {
  const decimales = Number.isInteger(valor) ? 0 : 2;
  const base: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
    useGrouping: true,
  };

  const opciones: Intl.NumberFormatOptions = esEuros
    ? { ...base, style: 'currency', currency: 'EUR' }
    : base;

  return new Intl.NumberFormat('es-ES', opciones).format(valor);
}
export function historialAFechas(historial: number[], hoy: Date = new Date()): string[] {
  return historial.map(n => claveFecha(haceDiasDesde(n, hoy)));
}

export function saludoSegunHora(hora: number): string{
  if(hora >=6 && hora < 14){
    return 'Buenos días';
  }else if(hora >=14 && hora < 21){
    return 'Buenas tardes';
  }
  return 'Buenas noches';
}

function haceDiasDesde(n: number, hoy: Date): Date {
  const fecha = new Date(hoy);
  fecha.setDate(fecha.getDate() - n);
  return fecha;
}