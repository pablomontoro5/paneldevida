import {alternarHecha, clavePrioridades} from './prioridades.logica';
describe('clavePrioridades', () => {
    it('incluye la fecha en formato AAAA-MM-DD', () => {
        const fecha = new Date(2026, 10, 3); // los meses empiezan en 0, así que 10 = noviembre
        expect(clavePrioridades(fecha)).toBe('prioridades:2026-11-03');
    });
});

describe('alternarHecha', () => {
  it('al marcar, añade el id', () => {
    const resultado = alternarHecha(['p1'], 'p2', true);
    expect(resultado).toEqual(['p1', 'p2']);
  });

  it('al desmarcar, quita el id', () => {
    const resultado = alternarHecha(['p1', 'p2'], 'p1', false);
    expect(resultado).toEqual(['p2']);
  });

  it('no duplica un id que ya estaba marcado', () => {
    const resultado = alternarHecha(['p1'], 'p1', true);
    expect(resultado).toEqual(['p1']);
  });

  it('no modifica la lista original', () => {
    const original = ['p1'];
    alternarHecha(original, 'p2', true);
    expect(original).toEqual(['p1']);
  });
});