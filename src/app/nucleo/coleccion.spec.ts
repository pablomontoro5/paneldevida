import { TestBed } from '@angular/core/testing';
import { Almacen } from './almacen';
import { Coleccion } from './coleccion';

interface Cosa {
  id: string;
  nombre: string;
}

const EJEMPLO: Cosa[] = [{ id: 'a', nombre: 'Ejemplo' }];

describe('Coleccion', () => {
  let almacen: Almacen;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    almacen = TestBed.inject(Almacen);
  });

  it('la primera vez usa los datos de ejemplo y los guarda', () => {
    const coleccion = new Coleccion(almacen, 'cosas', () => EJEMPLO);
    expect(coleccion.elementos()).toEqual(EJEMPLO);
    expect(almacen.leer('cosas', null)).toEqual(EJEMPLO);
  });

  it('si ya hay algo guardado no lo pisa con el ejemplo', () => {
    almacen.guardar('cosas', []);
    const coleccion = new Coleccion(almacen, 'cosas', () => EJEMPLO);
    expect(coleccion.elementos()).toEqual([]);
  });

  it('si lo guardado no es una lista, vuelve al ejemplo', () => {
    almacen.guardar('cosas', { roto: true });
    const coleccion = new Coleccion(almacen, 'cosas', () => EJEMPLO);
    expect(coleccion.elementos()).toEqual(EJEMPLO);
  });

  it('guardar y borrar cambian la lista y localStorage', () => {
    const coleccion = new Coleccion(almacen, 'cosas', () => EJEMPLO);
    const nueva = { id: 'b', nombre: 'Nueva' };

    coleccion.guardar(nueva);
    expect(almacen.leer('cosas', null)).toEqual([...EJEMPLO, nueva]);

    coleccion.borrar('a');
    expect(coleccion.elementos()).toEqual([nueva]);
    expect(almacen.leer('cosas', null)).toEqual([nueva]);
  });
});
