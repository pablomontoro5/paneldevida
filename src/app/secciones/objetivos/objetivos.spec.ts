import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Objetivos } from './objetivos';
import { Objetivo } from './objetivo.modelo';
import { ProgresoObjetivos, claveObjetivos } from './objetivos.logica';

const LIBROS: Objetivo = { id: 'libros', icono: '📚', nombre: 'Leer 24 libros', actual: 9, meta: 24, paso: 1, unidad: 'libros' };
const AHORRO: Objetivo = { id: 'ahorro', icono: '💶', nombre: 'Ahorrar 1.500 €', actual: 1000, meta: 1500, paso: 50, formato: 'euros' };
const DOS = [LIBROS, AHORRO];

// La clave del año se calcula igual que en el componente, así las pruebas no dependen de la fecha.
const claveAnio = () => `panelDeVida:${claveObjetivos(new Date())}`;

function leerGuardados(): Objetivo[] {
  return JSON.parse(localStorage.getItem('panelDeVida:objetivos') ?? 'null');
}

function leerProgreso(): ProgresoObjetivos {
  return JSON.parse(localStorage.getItem(claveAnio()) ?? '{}');
}

describe('Objetivos', () => {
  let fixture: ComponentFixture<Objetivos>;
  let el: HTMLElement;

  async function crear(guardados: Objetivo[] | null, progreso: ProgresoObjetivos = {}): Promise<void> {
    localStorage.clear();
    if (guardados) localStorage.setItem('panelDeVida:objetivos', JSON.stringify(guardados));
    localStorage.setItem(claveAnio(), JSON.stringify(progreso));
    await TestBed.configureTestingModule({ imports: [Objetivos] }).compileComponents();
    fixture = TestBed.createComponent(Objetivos);
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

  function campo(id: string): HTMLInputElement {
    return el.querySelector<HTMLInputElement>(`#objetivo-${id}`)!;
  }

  async function escribir(id: string, valor: string): Promise<void> {
    const input = campo(id);
    input.value = valor;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  afterEach(() => localStorage.clear());

  it('la primera vez muestra los datos de ejemplo y los guarda', async () => {
    await crear(null);
    expect(leerGuardados().length).toBe(4);
    expect(el.querySelectorAll('.objetivo').length).toBe(4);
  });

  it('sin objetivos muestra el mensaje de lista vacía', async () => {
    await crear([]);
    expect(el.textContent).toContain('No tienes objetivos todavía.');
  });

  it('una plantilla rellena el formulario y se puede añadir el objetivo', async () => {
    await crear([]);
    await pulsar('Añadir objetivo');
    await pulsar('Correr 300 km');
    expect(campo('nombre').value).toBe('Correr 300 km');
    expect(campo('unidad').value).toBe('km');
    await pulsar('Añadir objetivo'); // el botón de enviar del formulario

    expect(leerGuardados()).toEqual([
      expect.objectContaining({ nombre: 'Correr 300 km', actual: 0, meta: 300, paso: 5, unidad: 'km' }),
    ]);
    expect(el.querySelector('form')).toBeNull();
  });

  it('con euros no pide la unidad', async () => {
    await crear([]);
    await pulsar('Añadir objetivo');
    await pulsar('Ahorrar 1.500 €');
    expect(el.querySelector('#objetivo-unidad')).toBeNull();
    await pulsar('Añadir objetivo');
    expect(leerGuardados()[0]).toEqual(expect.objectContaining({ formato: 'euros', meta: 1500 }));
  });

  it('no guarda un objetivo con errores y los explica', async () => {
    await crear([]);
    await pulsar('Añadir objetivo');
    await escribir('nombre', '   ');
    await pulsar('Añadir objetivo');

    expect(leerGuardados()).toEqual([]);
    expect(el.textContent).toContain('Escribe el nombre del objetivo.');
    expect(el.textContent).toContain('La meta tiene que ser mayor que 0.');
    expect(el.textContent).toContain('Escribe la unidad');
  });

  it('no deja que lo que llevas pase de la meta', async () => {
    await crear([]);
    await pulsar('Añadir objetivo');
    await pulsar('Leer 24 libros');
    await escribir('llevas', '30');
    await pulsar('Añadir objetivo');

    expect(leerGuardados()).toEqual([]);
    expect(el.textContent).toContain('Tiene que estar entre 0 y la meta.');
  });

  it('al editar muestra lo que llevas este año y lo guarda sin cambiar el id', async () => {
    await crear(DOS, { libros: 12 });
    await pulsar('Editar');
    expect(campo('llevas').value).toBe('12');

    await escribir('nombre', 'Leer 30 libros');
    await escribir('meta', '30');
    await escribir('llevas', '15');
    await pulsar('Guardar cambios');

    expect(leerGuardados()[0]).toEqual({ ...LIBROS, nombre: 'Leer 30 libros', meta: 30 });
    expect(leerProgreso()).toEqual({ libros: 15 });
    expect(el.textContent).toContain('15 de 30 libros');
  });

  it('pide confirmación antes de borrar y quita lo que llevabas este año', async () => {
    await crear(DOS, { libros: 12, ahorro: 1200 });
    await pulsar('Borrar');
    expect(el.textContent).toContain('¿Borrar este objetivo');

    await pulsar('No');
    expect(leerGuardados()).toHaveLength(2);

    await pulsar('Borrar');
    await pulsar('Sí, borrar');
    expect(leerGuardados()).toEqual([AHORRO]);
    expect(leerProgreso()).toEqual({ ahorro: 1200 });
  });

  it('el botón «+» guarda lo que llevas en la clave del año', async () => {
    await crear(DOS);
    el.querySelector<HTMLButtonElement>('[aria-label="Sumar 1 a Leer 24 libros"]')!.click();
    await fixture.whenStable();
    expect(leerProgreso()).toEqual({ libros: 10 });
    expect(el.textContent).toContain('10 de 24 libros');
  });

  it('el botón de borrar va recalcado en rojo', async () => {
    await crear(DOS);
    expect(botones('Borrar')[0].classList).toContain('boton-borrar');
  });
});
