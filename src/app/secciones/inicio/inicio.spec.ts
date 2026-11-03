import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Inicio } from './inicio';

describe('Inicio', () => {
  let fixture: ComponentFixture<Inicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inicio],
    }).compileComponents();

    fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();
  });

  it('muestra una tarjeta por cada sección del día', () => {
    const el = fixture.nativeElement as HTMLElement;
    for (const etiqueta of ['app-agenda', 'app-prioridades', 'app-habitos', 'app-objetivos', 'app-viajes']) {
      expect(el.querySelector(etiqueta)).toBeTruthy();
    }
  });
});
