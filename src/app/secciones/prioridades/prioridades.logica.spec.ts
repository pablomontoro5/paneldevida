import {
  MAX_PRIORIDADES,
  alternarHecha,
  borradorAPrioridad,
  clavePrioridades,
  contarHechas,
  prioridadABorrador,
  puedeAnadir,
  validarPrioridad,
} from './prioridades.logica';

describe('clavePrioridades', () => {
  it('incluye la fecha en formato AAAA-MM-DD', () => {
    const fecha = new Date(2026, 10, 3); // los meses empiezan en 0, así que 10 = noviembre
    expect(clavePrioridades(fecha)).toBe('prioridades:2026-11-03');
  });
});

describe('alternarHecha', () => {
  it('al marcar, añade el id', () => {
    expect(alternarHecha(['p1'], 'p2', true)).toEqual(['p1', 'p2']);
  });

  it('al desmarcar, quita el id', () => {
    expect(alternarHecha(['p1', 'p2'], 'p1', false)).toEqual(['p2']);
  });

  it('no duplica un id que ya estaba marcado', () => {
    expect(alternarHecha(['p1'], 'p1', true)).toEqual(['p1']);
  });

  it('no modifica la lista original', () => {
    const original = ['p1'];
    alternarHecha(original, 'p2', true);
    expect(original).toEqual(['p1']);
  });
});

const p = (id: string) => ({ id, texto: id });

describe('contarHechas', () => {
  it('cuenta las prioridades marcadas', () => {
    expect(contarHechas([p('p1'), p('p2')], ['p2'])).toBe(1);
  });

  it('no cuenta lo marcado de una prioridad que ya no existe', () => {
    expect(contarHechas([p('p1')], ['p1', 'borrada'])).toBe(1);
  });
});

describe('puedeAnadir', () => {
  it(`deja añadir hasta tener ${MAX_PRIORIDADES}`, () => {
    expect(puedeAnadir([p('p1'), p('p2')])).toBe(true);
    expect(puedeAnadir([p('p1'), p('p2'), p('p3')])).toBe(false);
  });
});

describe('validarPrioridad', () => {
  const bien = { texto: 'Llamar a casa' };

  it('una prioridad con texto no tiene errores', () => {
    expect(validarPrioridad(bien, [], '')).toEqual({});
  });

  it('el texto es obligatorio (no vale solo con espacios)', () => {
    expect(validarPrioridad({ texto: '' }, [], '').texto).toBe('Escribe qué quieres hacer hoy.');
    expect(validarPrioridad({ texto: '   ' }, [], '').texto).toBeDefined();
  });

  it('no deja añadir una cuarta', () => {
    const tres = [p('p1'), p('p2'), p('p3')];
    expect(validarPrioridad(bien, tres, '').limite).toBeDefined();
  });

  it('con 3 sí deja editar una de ellas', () => {
    const tres = [p('p1'), p('p2'), p('p3')];
    expect(validarPrioridad(bien, tres, 'p2')).toEqual({});
  });
});

describe('borradorAPrioridad y prioridadABorrador', () => {
  it('quita los espacios de sobra y guarda el id', () => {
    expect(borradorAPrioridad({ texto: '  Repasar apuntes ' }, 'p9')).toEqual({ id: 'p9', texto: 'Repasar apuntes' });
  });

  it('ida y vuelta: una prioridad se convierte en borrador y vuelve igual', () => {
    const prioridad = { id: 'p1', texto: 'Llamar a casa' };
    expect(borradorAPrioridad(prioridadABorrador(prioridad), 'p1')).toEqual(prioridad);
  });
});
