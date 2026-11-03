import { guardarEnLista, nuevoId, quitarDeLista } from './lista';

const A = { id: 'a', nombre: 'Uno' };
const B = { id: 'b', nombre: 'Dos' };

describe('guardarEnLista', () => {
  it('añade al final si el id es nuevo', () => {
    expect(guardarEnLista([A], B)).toEqual([A, B]);
  });

  it('sustituye en su sitio si el id ya existe', () => {
    const editado = { id: 'a', nombre: 'Uno cambiado' };
    expect(guardarEnLista([A, B], editado)).toEqual([editado, B]);
  });

  it('no cambia la lista original', () => {
    const lista = [A];
    guardarEnLista(lista, B);
    expect(lista).toEqual([A]);
  });
});

describe('quitarDeLista', () => {
  it('quita el elemento con ese id', () => {
    expect(quitarDeLista([A, B], 'a')).toEqual([B]);
  });

  it('si el id no está, devuelve los mismos elementos', () => {
    expect(quitarDeLista([A, B], 'z')).toEqual([A, B]);
  });
});

describe('nuevoId', () => {
  it('usa el prefijo y la semilla en base 36', () => {
    expect(nuevoId('viaje', [], 35)).toBe('viaje-z');
  });

  it('no repite un id que ya está en la lista', () => {
    expect(nuevoId('viaje', [{ id: 'viaje-z' }], 35)).toBe('viaje-10');
  });
});
