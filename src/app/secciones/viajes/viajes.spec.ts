import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Viajes } from './viajes';
import { Viaje } from './viaje.modelo';

// Fechas muy lejanas para que las pruebas no dependan del día en que se ejecutan.
const GUARDADOS: Viaje[] = [
  { id: 'v1', icono: '🏖️', destino: 'Verano en Cádiz', salida: '2099-07-15', vuelta: '2099-07-30' },
];

function leerGuardados(): Viaje[] {
  return JSON.parse(localStorage.getItem('panelDeVida:viajes') ?? 'null');
}

describe('Viajes', () => {
  let fixture: ComponentFixture<Viajes>;
  let el: HTMLElement;

  async function crear(guardados: Viaje[] | null): Promise<void> {
    localStorage.clear();
    if (guardados) localStorage.setItem('panelDeVida:viajes', JSON.stringify(guardados));
    await TestBed.configureTestingModule({ imports: [Viajes] }).compileComponents();
    fixture = TestBed.createComponent(Viajes);
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  function boton(texto: string): HTMLButtonElement {
    const encontrado = [...el.querySelectorAll('button')].find(b => b.textContent?.includes(texto));
    if (!encontrado) throw new Error(`No hay un botón «${texto}»`);
    return encontrado;
  }

  async function pulsar(texto: string): Promise<void> {
    boton(texto).click();
    await fixture.whenStable();
  }

  async function escribir(id: string, valor: string): Promise<void> {
    const input = el.querySelector<HTMLInputElement>(`#${id}`)!;
    input.value = valor;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  it('la primera vez muestra los datos de ejemplo y los guarda', async () => {
    await crear(null);
    expect(leerGuardados().length).toBeGreaterThan(0);
  });

  it('sin viajes muestra el mensaje de lista vacía', async () => {
    await crear([]);
    expect(el.textContent).toContain('No tienes viajes a la vista.');
  });

  it('una plantilla rellena el formulario y se puede añadir el viaje', async () => {
    await crear([]);
    await pulsar('Añadir viaje');
    await pulsar('Ruta por la montaña');
    await escribir('viaje-salida', '2099-05-01');
    await pulsar('Añadir viaje'); // el botón de enviar del formulario

    const guardados = leerGuardados();
    expect(guardados).toHaveLength(1);
    expect(guardados[0]).toMatchObject({ icono: '🏔️', destino: 'Ruta por la montaña', salida: '2099-05-01' });
    expect(el.textContent).toContain('Ruta por la montaña');
    expect(el.querySelector('form')).toBeNull();
  });

  it('no guarda si falta el destino y explica por qué', async () => {
    await crear([]);
    await pulsar('Añadir viaje');
    await escribir('viaje-salida', '2099-05-01');
    await pulsar('Añadir viaje');

    expect(leerGuardados()).toEqual([]);
    expect(el.textContent).toContain('Escribe a dónde vas.');
  });

  it('edita un viaje sin cambiar su id', async () => {
    await crear(GUARDADOS);
    await pulsar('Editar');
    expect(el.querySelector<HTMLInputElement>('#viaje-destino')!.value).toBe('Verano en Cádiz');

    await escribir('viaje-destino', 'Verano en Huelva');
    await pulsar('Guardar cambios');

    expect(leerGuardados()).toEqual([{ ...GUARDADOS[0], destino: 'Verano en Huelva' }]);
  });

  it('pide confirmación antes de borrar', async () => {
    await crear(GUARDADOS);
    await pulsar('Borrar');
    expect(el.textContent).toContain('¿Borrar este viaje?');

    await pulsar('No');
    expect(leerGuardados()).toHaveLength(1);

    await pulsar('Borrar');
    await pulsar('Sí, borrar');
    expect(leerGuardados()).toEqual([]);
    expect(el.textContent).toContain('No tienes viajes a la vista.');
  });
});
