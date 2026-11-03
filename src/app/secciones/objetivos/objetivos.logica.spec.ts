import { Objetivo } from './objetivo.modelo';
import {
  BorradorObjetivo,
  borradorAObjetivo,
  cambiarValor,
  claveObjetivos,
  estadoObjetivo,
  fraccionDelAnio,
  objetivoABorrador,
  quitarProgreso,
  textoProgreso,
  validarObjetivo,
} from './objetivos.logica';

describe('claveObjetivos', () => {
  it('lleva el año, así cada año empieza de cero', () => {
    expect(claveObjetivos(new Date(2026, 10, 4))).toBe('objetivos:2026');
  });
});

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

describe('quitarProgreso', () => {
  it('quita solo el objetivo borrado y no modifica el original', () => {
    const progreso = { libros: 9, ahorro: 1284 };
    expect(quitarProgreso(progreso, 'libros')).toEqual({ ahorro: 1284 });
    expect(progreso).toEqual({ libros: 9, ahorro: 1284 });
  });
});

describe('validarObjetivo', () => {
  const bien: BorradorObjetivo = {
    icono: '📚', nombre: 'Leer 24 libros', meta: 24, paso: 1, tipo: 'unidad', unidad: 'libros', llevas: 0,
  };

  it('un objetivo bien rellenado no tiene errores', () => {
    expect(validarObjetivo(bien)).toEqual({});
  });

  it('el nombre es obligatorio (no vale solo con espacios)', () => {
    expect(validarObjetivo({ ...bien, nombre: '' }).nombre).toBe('Escribe el nombre del objetivo.');
    expect(validarObjetivo({ ...bien, nombre: '   ' }).nombre).toBeDefined();
  });

  it('la meta y el paso tienen que ser mayores que 0', () => {
    expect(validarObjetivo({ ...bien, meta: 0 }).meta).toBeDefined();
    expect(validarObjetivo({ ...bien, meta: null }).meta).toBeDefined();
    expect(validarObjetivo({ ...bien, paso: -1 }).paso).toBeDefined();
    expect(validarObjetivo({ ...bien, paso: null }).paso).toBeDefined();
  });

  it('lo que llevas tiene que estar entre 0 y la meta', () => {
    expect(validarObjetivo({ ...bien, llevas: 24 })).toEqual({});
    expect(validarObjetivo({ ...bien, llevas: 25 }).llevas).toBeDefined();
    expect(validarObjetivo({ ...bien, llevas: -1 }).llevas).toBeDefined();
    expect(validarObjetivo({ ...bien, llevas: null }).llevas).toBeDefined();
  });

  it('pide la unidad, salvo si son euros', () => {
    expect(validarObjetivo({ ...bien, unidad: ' ' }).unidad).toBeDefined();
    expect(validarObjetivo({ ...bien, unidad: '', tipo: 'euros' })).toEqual({});
  });
});

describe('borradorAObjetivo y objetivoABorrador', () => {
  it('con euros guarda el formato y no la unidad', () => {
    const borrador: BorradorObjetivo = {
      icono: '💶', nombre: ' Ahorrar 1.500 € ', meta: 1500, paso: 50, tipo: 'euros', unidad: 'x', llevas: 100,
    };
    expect(borradorAObjetivo(borrador, 'o1')).toEqual({
      id: 'o1', icono: '💶', nombre: 'Ahorrar 1.500 €', actual: 100, meta: 1500, paso: 50, formato: 'euros',
    });
  });

  it('ida y vuelta: un objetivo se convierte en borrador y vuelve igual', () => {
    const objetivo: Objetivo = {
      id: 'libros', icono: '📚', nombre: 'Leer 24 libros', actual: 9, meta: 24, paso: 1, unidad: 'libros',
    };
    expect(borradorAObjetivo(objetivoABorrador(objetivo, 9), 'libros')).toEqual(objetivo);
  });

  it('al editar, el formulario muestra lo que llevas este año', () => {
    const objetivo: Objetivo = { id: 'a', icono: '🎯', nombre: 'A', actual: 0, meta: 10, paso: 1, unidad: 'veces' };
    expect(objetivoABorrador(objetivo, 7).llevas).toBe(7);
  });
});

describe('textoProgreso', () => {
  it('los euros salen en formato español', () => {
    const ahorro: Objetivo = { id: 'a', icono: '💶', nombre: 'Ahorro', actual: 0, meta: 1500, paso: 50, formato: 'euros' };
    // Intl separa el número y el € con un espacio especial: lo cambiamos por uno normal para comparar.
    expect(textoProgreso(ahorro, 1234.5).replace(/\s/g, ' ')).toBe('1.234,50 € de 1.500 €');
  });
});