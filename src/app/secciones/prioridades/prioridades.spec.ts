import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Prioridades } from './prioridades';
import { Prioridad } from './prioridad.modelo';
import { clavePrioridades } from './prioridades.logica';

const DOS: Prioridad[] = [
  { id: 'a', texto: 'Repasar apuntes' },
  { id: 'b', texto: 'Llamar a casa' },
];
const TRES: Prioridad[] = [...DOS, { id: 'c', texto: 'Hacer la compra' }];

// La clave del día se calcula igual que en el componente, así las pruebas no dependen de la fecha.
const claveHoy = () => `panelDeVida:${clavePrioridades(new Date())}`;

function leerGuardadas(): Prioridad[] {
  return JSON.parse(localStorage.getItem('panelDeVida:prioridades') ?? 'null');
}

function leerHechas(): string[] {
  return JSON.parse(localStorage.getItem(claveHoy()) ?? '[]');
}

describe('Prioridades', () => {
  let fixture: ComponentFixture<Prioridades>;
  let el: HTMLElement;

  async function crear(guardadas: Prioridad[] | null, hechas: string[] = []): Promise<void> {
    localStorage.clear();
    if (guardadas) localStorage.setItem('panelDeVida:prioridades', JSON.stringify(guardadas));
    localStorage.setItem(claveHoy(), JSON.stringify(hechas));
    await TestBed.configureTestingModule({ imports: [Prioridades] }).compileComponents();
    fixture = TestBed.createComponent(Prioridades);
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  function botones(texto: string): HTMLButtonElement[] {
    return [...el.querySelectorAll('button')].filter(b => b.textContent?.includes(texto));
  }

  async function pulsar(texto: string, posicion = 0): Promise<void> {
    const boton = botones(texto)[posicion];
    if (!boton) throw new Error(`No hay un botón «${texto}»`);
    boton.click();
    await fixture.whenStable();
  }

  async function escribir(valor: string): Promise<void> {
    const input = el.querySelector<HTMLInputElement>('#prioridad-texto')!;
    input.value = valor;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  afterEach(() => localStorage.clear());

  it('la primera vez muestra los datos de ejemplo y los guarda', async () => {
    await crear(null);
    expect(leerGuardadas().length).toBe(3);
    expect(el.querySelectorAll('.prioridad').length).toBe(3);
  });

  it('sin prioridades muestra el mensaje de lista vacía', async () => {
    await crear([]);
    expect(el.textContent).toContain('No tienes prioridades para hoy.');
    expect(el.textContent).toContain('0 de 0 hechas');
  });

  it('una plantilla rellena el formulario y se puede añadir la prioridad', async () => {
    await crear([]);
    await pulsar('Añadir prioridad');
    await pulsar('Llamar a casa');
    expect(el.querySelector<HTMLInputElement>('#prioridad-texto')!.value).toBe('Llamar a casa');
    await pulsar('Añadir prioridad'); // el botón de enviar del formulario

    expect(leerGuardadas()).toEqual([expect.objectContaining({ texto: 'Llamar a casa' })]);
    expect(el.querySelector('form')).toBeNull();
  });

  it('no guarda una prioridad vacía o solo con espacios', async () => {
    await crear([]);
    await pulsar('Añadir prioridad');
    await escribir('   ');
    await pulsar('Añadir prioridad');

    expect(leerGuardadas()).toEqual([]);
    expect(el.textContent).toContain('Escribe qué quieres hacer hoy.');
  });

  it('con 3 prioridades no deja añadir más y lo explica', async () => {
    await crear(TRES);
    expect(botones('Añadir prioridad')).toHaveLength(0);
    expect(el.textContent).toContain('Ya tienes tus 3 prioridades');
  });

  it('edita una prioridad sin cambiar su id ni lo marcado', async () => {
    await crear(DOS, ['b']);
    await pulsar('Editar', 1);
    expect(el.querySelector<HTMLInputElement>('#prioridad-texto')!.value).toBe('Llamar a casa');

    await escribir('Llamar a la abuela');
    await pulsar('Guardar cambios');

    expect(leerGuardadas()).toEqual([DOS[0], { id: 'b', texto: 'Llamar a la abuela' }]);
    expect(leerHechas()).toEqual(['b']);
  });

  it('pide confirmación antes de borrar y desmarca la borrada', async () => {
    await crear(DOS, ['a', 'b']);
    await pulsar('Borrar');
    expect(el.textContent).toContain('¿Borrar esta prioridad?');

    await pulsar('No');
    expect(leerGuardadas()).toHaveLength(2);

    await pulsar('Borrar');
    await pulsar('Sí, borrar');
    expect(leerGuardadas()).toEqual([DOS[1]]);
    expect(leerHechas()).toEqual(['b']);
    expect(el.textContent).toContain('1 de 1 hechas');
  });

  it('marcar una prioridad la guarda en lo hecho hoy', async () => {
    await crear(DOS);
    const casilla = el.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    casilla.click();
    await fixture.whenStable();
    expect(leerHechas()).toEqual(['a']);
    expect(el.textContent).toContain('1 de 2 hechas');
  });

  it('el botón de borrar va recalcado en rojo', async () => {
    await crear(DOS);
    expect(botones('Borrar')[0].classList).toContain('boton-borrar');
  });
});
