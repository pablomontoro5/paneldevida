import {
  BORRADOR_HABITO_VACIO,
  alternarDia,
  borradorAHabito,
  completarRegistro,
  habitoABorrador,
  quitarRegistro,
  textoRacha,
  ultimosSieteDias,
  validarHabito,
} from './habitos.logica';
import { Habito } from './habito.modelo';

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

describe('validarHabito', () => {
  it('pide el nombre si está vacío', () => {
    expect(validarHabito({ icono: '📚', nombre: '' })).toEqual({ nombre: 'Escribe el nombre del hábito.' });
  });

  it('un nombre con solo espacios cuenta como vacío', () => {
    expect(validarHabito({ icono: '📚', nombre: '   ' }).nombre).toBeDefined();
  });

  it('con nombre no hay errores', () => {
    expect(validarHabito({ icono: '📚', nombre: 'Leer' })).toEqual({});
  });
});

describe('borradorAHabito', () => {
  it('quita los espacios del nombre y empieza sin historial', () => {
    expect(borradorAHabito({ icono: '🧘', nombre: '  Meditar  ' }, 'habito-1')).toEqual({
      id: 'habito-1',
      icono: '🧘',
      nombre: 'Meditar',
      historialEjemplo: [],
    });
  });

  it('sin icono pone el de por defecto', () => {
    expect(borradorAHabito({ icono: '', nombre: 'Meditar' }, 'h').icono).toBe(BORRADOR_HABITO_VACIO.icono);
  });

  it('ida y vuelta con habitoABorrador', () => {
    const habito = borradorAHabito({ icono: '💧', nombre: 'Agua' }, 'agua');
    expect(habitoABorrador(habito)).toEqual({ icono: '💧', nombre: 'Agua' });
  });
});

describe('quitarRegistro', () => {
  it('quita solo los días de ese hábito', () => {
    const registro = { leer: ['2026-11-03'], agua: ['2026-11-02'] };
    expect(quitarRegistro(registro, 'leer')).toEqual({ agua: ['2026-11-02'] });
  });

  it('no modifica el registro original', () => {
    const registro = { leer: ['2026-11-03'] };
    quitarRegistro(registro, 'leer');
    expect(registro).toEqual({ leer: ['2026-11-03'] });
  });

  it('si el hábito no estaba, deja el registro igual', () => {
    expect(quitarRegistro({ agua: [] }, 'leer')).toEqual({ agua: [] });
  });
});
