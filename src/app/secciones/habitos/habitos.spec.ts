import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Habitos } from './habitos';
import { Habito } from './habito.modelo';
import { RegistroHabitos } from './habitos.logica';
import { claveFecha, haceDiasDesde } from '../../compartido/fechas';

const LEER: Habito = { id: 'leer', icono: '📚', nombre: 'Leer 20 minutos', historialEjemplo: [] };
const AGUA: Habito = { id: 'agua', icono: '💧', nombre: 'Beber 2 litros de agua', historialEjemplo: [] };
const DOS = [LEER, AGUA];

// Los días se calculan desde hoy, igual que en el componente, así las pruebas no dependen de la fecha.
const hace = (n: number) => claveFecha(haceDiasDesde(n, new Date()));

function leerGuardados(): Habito[] {
  return JSON.parse(localStorage.getItem('panelDeVida:habitos-lista') ?? 'null');
}

function leerRegistro(): RegistroHabitos | null {
  return JSON.parse(localStorage.getItem('panelDeVida:habitos') ?? 'null');
}

describe('Habitos', () => {
  let fixture: ComponentFixture<Habitos>;
  let el: HTMLElement;

  async function crear(guardados: Habito[] | null, registro: RegistroHabitos | null = null): Promise<void> {
    localStorage.clear();
    if (guardados) localStorage.setItem('panelDeVida:habitos-lista', JSON.stringify(guardados));
    if (registro) localStorage.setItem('panelDeVida:habitos', JSON.stringify(registro));
    await TestBed.configureTestingModule({ imports: [Habitos] }).compileComponents();
    fixture = TestBed.createComponent(Habitos);
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

  function campoNombre(): HTMLInputElement {
    return el.querySelector<HTMLInputElement>('#habito-nombre')!;
  }

  async function escribirNombre(valor: string): Promise<void> {
    const input = campoNombre();
    input.value = valor;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  afterEach(() => localStorage.clear());

  it('la primera vez muestra los hábitos de ejemplo y los guarda en su propia clave', async () => {
    await crear(null);
    expect(leerGuardados().map(h => h.id)).toEqual(['leer', 'ejercicio', 'agua', 'programar']);
    expect(el.querySelectorAll('.habito').length).toBe(4);
  });

  it('conserva el historial que ya había guardado (migración)', async () => {
    await crear(null, { leer: [hace(0), hace(1), hace(2)] });
    expect(el.textContent).toContain('3 días seguidos');
  });

  it('sin hábitos muestra el mensaje de lista vacía', async () => {
    await crear([]);
    expect(el.textContent).toContain('No tienes hábitos todavía.');
  });

  it('una plantilla rellena el formulario y el hábito nuevo empieza sin racha', async () => {
    await crear([], {});
    await pulsar('Añadir hábito');
    await pulsar('Meditar 10 minutos');
    expect(campoNombre().value).toBe('Meditar 10 minutos');
    await pulsar('Añadir hábito'); // el botón de enviar del formulario

    expect(leerGuardados()).toEqual([
      expect.objectContaining({ icono: '🧘', nombre: 'Meditar 10 minutos', historialEjemplo: [] }),
    ]);
    expect(el.textContent).toContain('Sin racha');
    expect(el.querySelector('form')).toBeNull();
  });

  it('no guarda un hábito con el nombre en blanco y lo explica', async () => {
    await crear([]);
    await pulsar('Añadir hábito');
    await escribirNombre('   ');
    await pulsar('Añadir hábito');

    expect(leerGuardados()).toEqual([]);
    expect(el.textContent).toContain('Escribe el nombre del hábito.');
  });

  it('al editar mantiene el id y la racha', async () => {
    await crear(DOS, { leer: [hace(0), hace(1)], agua: [] });
    await pulsar('Editar');
    expect(campoNombre().value).toBe('Leer 20 minutos');

    await escribirNombre('Leer 30 minutos');
    await pulsar('Guardar cambios');

    expect(leerGuardados()[0]).toEqual({ ...LEER, nombre: 'Leer 30 minutos' });
    expect(el.textContent).toContain('Leer 30 minutos');
    expect(el.textContent).toContain('2 días seguidos');
  });

  it('pide confirmación antes de borrar, avisa de la racha y borra su historial', async () => {
    await crear(DOS, { leer: [hace(0), hace(1)], agua: [hace(0)] });
    await pulsar('Borrar');
    expect(el.textContent).toContain('¿Borrar este hábito');
    expect(el.textContent).toContain('Perderás tu racha de 2 días seguidos');

    await pulsar('No');
    expect(leerGuardados()).toHaveLength(2);

    await pulsar('Borrar');
    await pulsar('Sí, borrar');
    expect(leerGuardados()).toEqual([AGUA]);
    expect(leerRegistro()).toEqual({ agua: [hace(0)] });
  });

  it('«Marcar hoy» guarda el día en el registro', async () => {
    await crear([LEER], {});
    await pulsar('Marcar hoy');
    expect(leerRegistro()).toEqual({ leer: [hace(0)] });
    expect(el.textContent).toContain('✓ Hecho hoy');
  });

  it('el botón de borrar va recalcado en rojo', async () => {
    await crear(DOS);
    expect(botones('Borrar')[0].classList).toContain('boton-borrar');
  });
});
