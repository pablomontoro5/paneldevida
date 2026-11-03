import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Inicio } from './inicio';
import { clavePrioridades } from '../prioridades/prioridades.logica';
import { claveObjetivos } from '../objetivos/objetivos.logica';
import { claveFecha } from '../../compartido/fechas';

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

describe('Inicio: resumen de objetivos', () => {
  it('cuenta los objetivos guardados con lo que llevas este año', async () => {
    localStorage.clear();
    const objetivo = (id: string) => ({ id, icono: '🎯', nombre: id, actual: 0, meta: 10, paso: 1, unidad: 'veces' });
    localStorage.setItem('panelDeVida:objetivos', JSON.stringify([objetivo('a'), objetivo('b')]));
    // "a" ya está conseguido este año; "b" sigue en 0, así que va por detrás cualquier día del año.
    localStorage.setItem(`panelDeVida:${claveObjetivos(new Date())}`, JSON.stringify({ a: 10 }));

    await TestBed.configureTestingModule({ imports: [Inicio], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('1 de 2 al día');
    localStorage.clear();
  });
});

describe('Inicio: resumen de hábitos', () => {
  it('cuenta los hábitos guardados y no los días de uno que se borró', async () => {
    localStorage.clear();
    const hoy = claveFecha(new Date());
    localStorage.setItem(
      'panelDeVida:habitos-lista',
      JSON.stringify([
        { id: 'a', icono: '🧘', nombre: 'Meditar', historialEjemplo: [] },
        { id: 'b', icono: '📚', nombre: 'Leer', historialEjemplo: [] },
      ]),
    );
    // La fecha de hoy se calcula igual que en el componente, así no depende del día.
    localStorage.setItem('panelDeVida:habitos', JSON.stringify({ a: [hoy], borrado: [hoy] }));

    await TestBed.configureTestingModule({ imports: [Inicio], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();

    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('1 de 2 hechos hoy');
    expect(texto).toContain('🧘 Meditar');
    localStorage.clear();
  });
});
