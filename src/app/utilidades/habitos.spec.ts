import { alternarDia, ultimosSieteDias, completarRegistro, textoRacha } from './habitos';
import { Habito } from '../modelos/habito';

describe('alternarDia', () => {
  it('añade el día si no estaba', () => {
    expect(alternarDia(['2026-11-02'], '2026-11-03')).toEqual(['2026-11-02', '2026-11-03']);
  });

  it('quita el día si ya estaba', () => {
    expect(alternarDia(['2026-11-02', '2026-11-03'], '2026-11-03')).toEqual(['2026-11-02']);
  });

  it('no modifica la lista original', () => {
    const original = ['2026-11-02'];
    alternarDia(original, '2026-11-03');
    expect(original).toEqual(['2026-11-02']);
  });
});

describe('ultimosSieteDias', () => {
  const hoy = new Date(2026, 10, 3); // 10 = noviembre

  it('devuelve los últimos 7 días, de hace 6 días a hoy', () => {
    const claves = ultimosSieteDias([], hoy).map(d => d.clave);
    expect(claves).toEqual([
      '2026-10-28',
      '2026-10-29',
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
      '2026-11-02',
      '2026-11-03',
    ]);
  });

  it('solo el último día es hoy', () => {
    const dias = ultimosSieteDias([], hoy);
    expect(dias.filter(d => d.esHoy).map(d => d.clave)).toEqual(['2026-11-03']);
  });

  it('marca como cumplidos los días que están en la lista', () => {
    const dias = ultimosSieteDias(['2026-11-01', '2026-11-03'], hoy);
    const cumplidos = dias.filter(d => d.cumplido).map(d => d.clave);
    expect(cumplidos).toEqual(['2026-11-01', '2026-11-03']);
  });
});

describe('completarRegistro', () => {
  const hoy = new Date(2026, 10, 3);
  const habitos: Habito[] = [{ id: 'h1', icono: '💧', nombre: 'Agua', historialEjemplo: [0, 1] }];

  it('sin nada guardado usa el historial de ejemplo', () => {
    expect(completarRegistro(null, habitos, hoy)).toEqual({ h1: ['2026-11-03', '2026-11-02'] });
  });

  it('con algo guardado, un hábito que falta empieza vacío', () => {
    expect(completarRegistro({}, habitos, hoy)).toEqual({ h1: [] });
  });
});

describe('textoRacha', () => {
  it('sin días dice "Sin racha"', () => {
    expect(textoRacha(0)).toBe('Sin racha');
  });

  it('con 1 día usa el singular', () => {
    expect(textoRacha(1)).toBe('1 día seguido');
  });

  it('con varios días usa el plural', () => {
    expect(textoRacha(5)).toBe('5 días seguidos');
  });
});
