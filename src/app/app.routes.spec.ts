import { Location } from '@angular/common';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from './app.routes';
import { TituloPanel } from './nucleo/titulo';
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
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        { provide: TitleStrategy, useExisting: TituloPanel },
      ],
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

  it('la agenda muestra sus eventos al abrirla', async () => {
    await harness.navigateByUrl('/agenda', Agenda);
    const filas = harness.routeNativeElement?.querySelectorAll('.evento') ?? [];
    expect(filas.length).toBeGreaterThan(0);
  });

  it('pone el título de la sección en la pestaña y en la cabecera', async () => {
    await harness.navigateByUrl('/habitos', Habitos);
    expect(document.title).toBe('Hábitos · Panel de vida');
    expect(TestBed.inject(TituloPanel).seccion()).toBe('Hábitos');
  });

  it('en el inicio la pestaña solo dice Panel de vida', async () => {
    await harness.navigateByUrl('/', Inicio);
    expect(document.title).toBe('Panel de vida');
    expect(TestBed.inject(TituloPanel).seccion()).toBeNull();
  });

  it('una dirección que no existe vuelve al inicio', async () => {
    await harness.navigateByUrl('/no-existe', Inicio);
    expect(TestBed.inject(Location).path()).toBe('');
  });
});
