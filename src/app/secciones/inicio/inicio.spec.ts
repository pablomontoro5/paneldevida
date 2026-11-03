import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Inicio } from './inicio';

describe('Inicio', () => {
  let fixture: ComponentFixture<Inicio>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inicio],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();
    el = fixture.nativeElement as HTMLElement;
  });

  it('da la bienvenida con un saludo según la hora', () => {
    expect(el.querySelector('h1')?.textContent).toMatch(/Buenos días|Buenas tardes|Buenas noches/);
  });

  it('tiene una tarjeta de resumen que enlaza a cada sección', () => {
    const enlaces = [...el.querySelectorAll('.resumen a')].map(a => a.getAttribute('href'));
    expect(enlaces).toEqual(['/agenda', '/prioridades', '/habitos', '/objetivos', '/viajes']);
  });
});
