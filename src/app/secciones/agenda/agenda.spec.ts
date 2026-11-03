import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Agenda } from './agenda';
import { Evento } from './agenda.modelo';

// Las pruebas solo miran lo que se guarda y los textos, no si un evento es "Ahora" o
// "Siguiente", así no dependen de la hora a la que se ejecutan.
const GUARDADOS: Evento[] = [
  { id: 'e1', titulo: 'Clase de Redes', lugar: 'Aula 1.2', inicio: '09:00', fin: '11:00' },
];

function leerGuardados(): Evento[] {
  return JSON.parse(localStorage.getItem('panelDeVida:agenda') ?? 'null');
}

describe('Agenda', () => {
  let fixture: ComponentFixture<Agenda>;
  let el: HTMLElement;

  async function crear(guardados: Evento[] | null): Promise<void> {
    localStorage.clear();
    if (guardados) localStorage.setItem('panelDeVida:agenda', JSON.stringify(guardados));
    await TestBed.configureTestingModule({ imports: [Agenda] }).compileComponents();
    fixture = TestBed.createComponent(Agenda);
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
    expect(el.querySelectorAll('.evento').length).toBe(leerGuardados().length);
  });

  it('sin eventos muestra el mensaje de lista vacía', async () => {
    await crear([]);
    expect(el.textContent).toContain('No tienes nada en la agenda hoy.');
  });

  it('una plantilla rellena el formulario y se puede añadir el evento', async () => {
    await crear([]);
    await pulsar('Añadir evento');
    await escribir('evento-inicio', '18:00');
    await pulsar('Gimnasio');
    await pulsar('Añadir evento'); // el botón de enviar del formulario

    expect(leerGuardados()).toEqual([
      expect.objectContaining({ titulo: 'Gimnasio', lugar: '', inicio: '18:00', fin: '19:00' }),
    ]);
    expect(el.textContent).toContain('Gimnasio');
    expect(el.querySelector('form')).toBeNull();
  });

  it('no guarda si falta el título o el fin es antes que el inicio', async () => {
    await crear([]);
    await pulsar('Añadir evento');
    await escribir('evento-inicio', '12:00');
    await escribir('evento-fin', '11:00');
    await pulsar('Añadir evento');

    expect(leerGuardados()).toEqual([]);
    expect(el.textContent).toContain('Escribe qué tienes.');
    expect(el.textContent).toContain('El fin no puede ser antes que el inicio.');
  });

  it('edita un evento sin cambiar su id', async () => {
    await crear(GUARDADOS);
    await pulsar('Editar');
    expect(el.querySelector<HTMLInputElement>('#evento-titulo')!.value).toBe('Clase de Redes');

    await escribir('evento-lugar', 'Laboratorio L3');
    await pulsar('Guardar cambios');

    expect(leerGuardados()).toEqual([{ ...GUARDADOS[0], lugar: 'Laboratorio L3' }]);
  });

  it('pide confirmación antes de borrar', async () => {
    await crear(GUARDADOS);
    await pulsar('Borrar');
    expect(el.textContent).toContain('¿Borrar este evento?');

    await pulsar('No');
    expect(leerGuardados()).toHaveLength(1);

    await pulsar('Borrar');
    await pulsar('Sí, borrar');
    expect(leerGuardados()).toEqual([]);
    expect(el.textContent).toContain('No tienes nada en la agenda hoy.');
  });

  it('el botón de borrar va recalcado en rojo', async () => {
    await crear(GUARDADOS);
    expect(boton('Borrar').classList).toContain('boton-borrar');
  });
});
