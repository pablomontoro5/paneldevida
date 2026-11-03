import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideServiceWorker } from '@angular/service-worker';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideServiceWorker('ngsw-worker.js', { enabled: false })],
    }).compileComponents();
  });

  it('crea la aplicación', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('muestra la cabecera y el hueco de las rutas', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-cabecera')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('el menú lateral tiene un enlace por sección', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const enlaces = [...(fixture.nativeElement as HTMLElement).querySelectorAll('.menu-lateral a')];
    expect(enlaces.map(a => a.getAttribute('href'))).toEqual([
      '/', '/agenda', '/prioridades', '/habitos', '/objetivos', '/viajes', '/datos',
    ]);
  });

  it('la barra del móvil tiene cinco enlaces', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const enlaces = (fixture.nativeElement as HTMLElement).querySelectorAll('.barra-movil a');
    expect(enlaces.length).toBe(5);
  });
});
