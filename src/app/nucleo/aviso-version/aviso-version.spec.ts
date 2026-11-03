import { TestBed } from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';
import { AvisoVersion } from './aviso-version';

// Un SwUpdate falso: nosotros decidimos qué eventos «llegan» del service worker.
function crear(activo: boolean) {
  const versiones = new Subject<VersionEvent>();
  const swFalso = { isEnabled: activo, versionUpdates: versiones, unrecoverable: new Subject() };

  TestBed.configureTestingModule({
    imports: [AvisoVersion],
    providers: [{ provide: SwUpdate, useValue: swFalso }],
  });
  const fixture = TestBed.createComponent(AvisoVersion);
  fixture.detectChanges();
  const html = fixture.nativeElement as HTMLElement;
  return { fixture, html, versiones };
}

const versionLista: VersionEvent = {
  type: 'VERSION_READY',
  currentVersion: { hash: 'vieja' },
  latestVersion: { hash: 'nueva' },
};

describe('AvisoVersion', () => {
  it('no muestra nada si no hay versión nueva', () => {
    const { html } = crear(true);
    expect(html.querySelector('.aviso')).toBeNull();
  });

  it('avisa cuando la versión nueva está lista', () => {
    const { fixture, html, versiones } = crear(true);
    versiones.next(versionLista);
    fixture.detectChanges();
    expect(html.querySelector('.aviso')?.textContent).toContain('Hay una versión nueva');
  });

  it('no avisa mientras la versión nueva solo se está descargando', () => {
    const { fixture, html, versiones } = crear(true);
    versiones.next({ type: 'VERSION_DETECTED', version: { hash: 'nueva' } });
    fixture.detectChanges();
    expect(html.querySelector('.aviso')).toBeNull();
  });

  it('«Ahora no» cierra el aviso', () => {
    const { fixture, html, versiones } = crear(true);
    versiones.next(versionLista);
    fixture.detectChanges();
    const botones = html.querySelectorAll('button');
    (botones[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(html.querySelector('.aviso')).toBeNull();
  });

  it('sin service worker no escucha nada', () => {
    const { fixture, html, versiones } = crear(false);
    versiones.next(versionLista);
    fixture.detectChanges();
    expect(html.querySelector('.aviso')).toBeNull();
  });
});
