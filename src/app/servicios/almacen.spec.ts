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
});