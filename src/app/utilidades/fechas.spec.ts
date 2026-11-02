import { mismoDia } from './fechas';

import { aMinutos, calcularRacha, claveFecha, haceDias } from './fechas';

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
    const ayer = claveFecha(haceDias(1));
    const hoyTexto = claveFecha(hoy);
    expect(calcularRacha([hoyTexto, ayer], hoy)).toBe(2);
  });
});


describe('mismoDia', () => {
  it('devuelve true si es el mismo día aunque cambie la hora', () => {
    const a = new Date(2026, 10, 2, 9, 0);
    const b = new Date(2026, 10, 2, 22, 0);
    expect(mismoDia(a, b)).toBe(true);
  });
});