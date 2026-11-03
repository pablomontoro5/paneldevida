import { marcarEventos } from './agenda';

const ev = (inicio: string, fin: string) => ({ inicio, fin, titulo: inicio, lugar: '' });

describe('marcarEventos', () => {
  it('ordena por hora de inicio', () => {
    const r = marcarEventos([ev('12:00', '13:00'), ev('09:00', '10:00')], 0);
    expect(r.map((e) => e.inicio)).toEqual(['09:00', '12:00']);
  });

  it('marca el evento en curso como actual y los anteriores como pasados', () => {
    // Minuto 600 = las 10:00, dentro del evento de 09:30 a 11:00
    const r = marcarEventos([ev('08:00', '09:00'), ev('09:30', '11:00'), ev('12:00', '13:00')], 600);
    expect(r.map((e) => e.estado)).toEqual(['pasado', 'actual', 'futuro']);
  });

  it('si no hay nada en curso, marca el siguiente', () => {
    // Las 10:00, entre un evento que ya acabó y dos que no han empezado
    const r = marcarEventos([ev('08:00', '09:00'), ev('11:00', '12:00'), ev('13:00', '14:00')], 600);
    expect(r.map((e) => e.estado)).toEqual(['pasado', 'siguiente', 'futuro']);
  });
});