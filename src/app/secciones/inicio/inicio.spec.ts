import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Inicio } from './inicio';
import { clavePrioridades } from '../prioridades/prioridades.logica';

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

describe('Inicio: resumen de prioridades', () => {
  it('cuenta las prioridades guardadas y no lo marcado de una que se borró', async () => {
    localStorage.clear();
    localStorage.setItem(
      'panelDeVida:prioridades',
      JSON.stringify([{ id: 'a', texto: 'Uno' }, { id: 'b', texto: 'Dos' }]),
    );
    // La clave del día se calcula igual que en el componente, así no depende de la fecha.
    localStorage.setItem(`panelDeVida:${clavePrioridades(new Date())}`, JSON.stringify(['a', 'borrada']));

    await TestBed.configureTestingModule({ imports: [Inicio], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('1 de 2 hechas');
    localStorage.clear();
  });
});
