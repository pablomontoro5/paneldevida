import { TestBed } from '@angular/core/testing';
import { Almacen } from './almacen';

describe('Almacen', () => {
  let almacen: Almacen;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    almacen = TestBed.inject(Almacen);
  });

  it('se crea', () => {
    expect(almacen).toBeTruthy();
  });

  it('devuelve el valor por defecto si no hay nada guardado', () => {
    expect(almacen.leer('tema', 'claro')).toBe('claro');
  });

  it('lee lo mismo que se ha guardado', () => {
    almacen.guardar('prioridades', ['p1', 'p3']);
    expect(almacen.leer<string[]>('prioridades', [])).toEqual(['p1', 'p3']);
  });

  it('guarda con el prefijo panelDeVida:', () => {
    almacen.guardar('tema', 'oscuro');
    expect(localStorage.getItem('panelDeVida:tema')).toBe('"oscuro"');
  });

  it('devuelve el valor por defecto si el JSON está roto', () => {
    localStorage.setItem('panelDeVida:x', '{roto');
    expect(almacen.leer('x', 42)).toBe(42);
  });
    it('exporta lo guardado, sin ultimaCopia ni claves de otras webs', () => {
    almacen.guardar('tema', 'oscuro');
    almacen.guardar('ultimaCopia', '2026-11-01T10:00:00.000Z');
    localStorage.setItem('otraWeb', 'x');

    const copia = almacen.exportar(new Date(2026, 10, 3));

    expect(copia.app).toBe('panel-de-vida');
    expect(copia.version).toBe(1);
    expect(copia.datos).toEqual({ tema: 'oscuro' });
  });

  it('al importar sustituye todo lo que había', () => {
    almacen.guardar('tema', 'claro');
    almacen.guardar('habitos', { leer: ['2026-11-02'] });

    almacen.importar({
      app: 'panel-de-vida',
      version: 1,
      fecha: '2026-11-03T09:00:00.000Z',
      datos: { tema: 'oscuro' },
    });

    expect(almacen.leer('tema', null)).toBe('oscuro');
    expect(almacen.leer('habitos', null)).toBeNull();
  });

  it('si la importación falla a mitad, deja los datos como estaban', () => {
    almacen.guardar('tema', 'claro');

    const copiaRota = {
      app: 'panel-de-vida' as const,
      version: 1 as const,
      fecha: '2026-11-03T09:00:00.000Z',
      datos: { tema: 'oscuro', roto: 10n },
    };

    expect(() => almacen.importar(copiaRota)).toThrow();
    expect(almacen.leer('tema', null)).toBe('claro');
  });

  it('al importar no pisa ultimaCopia', () => {
    almacen.guardar('ultimaCopia', '2026-11-01T10:00:00.000Z');
    const copiaAux = {
      app:'panel-de-vida' as const,
      version: 1 as const,
      fecha:'2026-11-03T09:00:00.000Z',
      datos:{ ultimaCopia: '2026-11-02T10:00:00.000Z' },
    };
    almacen.importar(copiaAux);
    expect(almacen.leer('ultimaCopia', null)).toBe('2026-11-01T10:00:00.000Z');
  });
});
