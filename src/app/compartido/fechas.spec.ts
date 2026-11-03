import { aMinutos, calcularRacha, claveFecha, diasDesde, mismoDia, saludoSegunHora } from './fechas';
describe('claveFecha', () => {
  it('devuelve AAAA-MM-DD con ceros', () => {
    const fecha = new Date(2026, 10, 2); // 2 de noviembre de 2026
    expect(claveFecha(fecha)).toBe('2026-11-02');
  });
});

describe('aMinutos', () => {
  it('convierte "08:30" en 510', () => {
    expect(aMinutos('08:30')).toBe(510);
  });
});

describe('calcularRacha', () => {
  it('cuenta los días seguidos hasta hoy', () => {
    const hoy = new Date(2026, 10, 2);
    const ayer = '2026-11-01';
    const hoyTexto = claveFecha(hoy);
    expect(calcularRacha([hoyTexto, ayer], hoy)).toBe(2);
  });
  it('si hoy no está marcado cuenta desde ayer', () => {
    const hoy = new Date(2026, 10, 2); // 2 de noviembre de 2026
    expect(calcularRacha(['2026-11-01', '2026-10-31'], hoy)).toBe(2);
  });
});


describe('mismoDia', () => {
  it('devuelve true si es el mismo día aunque cambie la hora', () => {
    const a = new Date(2026, 10, 2, 9, 0);
    const b = new Date(2026, 10, 2, 22, 0);
    expect(mismoDia(a, b)).toBe(true);
  });
});

describe('saludoSegunHora', () => {
  it('de 6 a 13 dice «Buenos días»', () => {
    expect(saludoSegunHora(6)).toBe('Buenos días');
    expect(saludoSegunHora(13)).toBe('Buenos días');
  });

  it('de 14 a 20 dice «Buenas tardes»', () => {
    expect(saludoSegunHora(14)).toBe('Buenas tardes');
    expect(saludoSegunHora(20)).toBe('Buenas tardes');
  });

  it('de 21 a 5 dice «Buenas noches»', () => {
    expect(saludoSegunHora(21)).toBe('Buenas noches');
    expect(saludoSegunHora(0)).toBe('Buenas noches');
    expect(saludoSegunHora(5)).toBe('Buenas noches');
  });
});
describe('diasDesde', () => {
  it('el mismo día a distinta hora son 0 días', () => {
    expect(diasDesde(new Date(2026, 10, 3, 8, 0), new Date(2026, 10, 3, 23, 0))).toBe(0);
  });

  it('cuenta bien aunque en medio haya cambio de hora (25 de octubre)', () => {
    expect(diasDesde(new Date(2026, 9, 24), new Date(2026, 10, 3))).toBe(10);
  });

  it('da un número negativo si la fecha es futura', () => {
    expect(diasDesde(new Date(2026, 11, 20), new Date(2026, 10, 3))).toBe(-47);
  });
});
