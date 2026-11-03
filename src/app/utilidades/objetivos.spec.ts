import { cambiarValor, claveObjetivos, estadoObjetivo, fraccionDelAnio } from './objetivos';

describe('fraccionDelAnio', () => {
  it('el 1 de noviembre de 2026 es el día 305 de 365', () => {
    expect(fraccionDelAnio(new Date(2026, 10, 1))).toBe(305 / 365);
  });
});

describe('cambiarValor', () => {
  it('suma 0,1 y 0,2 sin errores de decimales', () => {
    expect(cambiarValor(0.1, 0.2, 1)).toBe(0.3);
  });
});

describe('estadoObjetivo', () => {
  it('un objetivo con fracción 1.0 es conseguido', () => {
    expect(estadoObjetivo(1.0, 0.8)).toBe('conseguido');
  });

  it('un objetivo con fracción 0.9 y ritmo 0.8 es al-día', () => {
    expect(estadoObjetivo(0.9, 0.8)).toBe('al-dia');
  });

  it('un objetivo con fracción 0.7 y ritmo 0.8 es detrás', () => {
    expect(estadoObjetivo(0.7, 0.8)).toBe('detras');
  });
});