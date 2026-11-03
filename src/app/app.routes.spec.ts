import { Location } from '@angular/common';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from './app.routes';
import { Inicio } from './secciones/inicio/inicio';
import { Agenda } from './secciones/agenda/agenda';
import { Prioridades } from './secciones/prioridades/prioridades';
import { Habitos } from './secciones/habitos/habitos';
import { Objetivos } from './secciones/objetivos/objetivos';
import { Viajes } from './secciones/viajes/viajes';
import { TusDatos } from './secciones/tus-datos/tus-datos';

describe('Rutas del panel', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())],
    });
    harness = await RouterTestingHarness.create();
  });

  // navigateByUrl(url, Componente) falla si la ruta abre otro componente.
  const secciones: [string, Type<unknown>][] = [
    ['/', Inicio],
    ['/agenda', Agenda],
    ['/prioridades', Prioridades],
    ['/habitos', Habitos],
    ['/objetivos', Objetivos],
    ['/viajes', Viajes],
    ['/datos', TusDatos],
  ];

  for (const [url, componente] of secciones) {
    it(`${url} abre ${componente.name}`, async () => {
      const instancia = await harness.navigateByUrl(url, componente);
      expect(instancia).toBeInstanceOf(componente);
    });
  }

  it('los datos de ejemplo llegan a la sección', async () => {
    await harness.navigateByUrl('/viajes', Viajes);
    const filas = harness.routeNativeElement?.querySelectorAll('.viaje') ?? [];
    expect(filas.length).toBeGreaterThan(0);
  });

  it('una dirección que no existe vuelve al inicio', async () => {
    await harness.navigateByUrl('/no-existe', Inicio);
    expect(TestBed.inject(Location).path()).toBe('');
  });
});
