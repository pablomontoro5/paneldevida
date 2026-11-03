import { Evento } from '../agenda/agenda.modelo';
import { Habito } from '../habitos/habito.modelo';
import { Objetivo } from '../objetivos/objetivo.modelo';
import { Viaje } from '../viajes/viaje.modelo';
import {
  eventoDestacado,
  eventosRestantes,
  fraseDelDia,
  habitosHechosHoy,
  mejorRacha,
  objetivosAlDia,
  proximoViaje,
} from './inicio.logica';

const hoy = new Date(2026, 10, 3, 18, 0); // 3 de noviembre de 2026 a las 18:00
const LAS_18 = 18 * 60;

const AGENDA: Evento[] = [
  { id: 'e1', inicio: '19:00', fin: '20:00', titulo: 'Gimnasio', lugar: '' },
  { id: 'e2', inicio: '08:30', fin: '10:30', titulo: 'Clase', lugar: 'Aula 2.4' },
  { id: 'e3', inicio: '16:30', fin: '18:30', titulo: 'Estudiar', lugar: 'Biblioteca' },
];

describe('eventosRestantes', () => {
  it('a las 18:00 quedan el que está en curso y el del gimnasio', () => {
    expect(eventosRestantes(AGENDA, LAS_18)).toBe(2);
  });

  it('a medianoche no queda ninguno', () => {
    expect(eventosRestantes(AGENDA, 23 * 60 + 59)).toBe(0);
  });
});

describe('eventoDestacado', () => {
  it('a las 18:00 destaca el que está en curso', () => {
    expect(eventoDestacado(AGENDA, LAS_18)).toMatchObject({ titulo: 'Estudiar', estado: 'actual' });
  });

  it('a las 18:45 destaca el siguiente', () => {
    expect(eventoDestacado(AGENDA, 18 * 60 + 45)).toMatchObject({ titulo: 'Gimnasio', estado: 'siguiente' });
  });

  it('si ya han pasado todos devuelve null', () => {
    expect(eventoDestacado(AGENDA, 21 * 60)).toBeNull();
  });
});

describe('fraseDelDia', () => {
  it('cuenta eventos y prioridades', () => {
    expect(fraseDelDia(2, 1)).toBe('Te quedan 2 eventos y 1 prioridad por hacer.');
  });

  it('usa el singular con un solo evento', () => {
    expect(fraseDelDia(1, 3)).toBe('Te queda 1 evento y 3 prioridades por hacer.');
  });

  it('sin prioridades pendientes', () => {
    expect(fraseDelDia(2, 0)).toBe('Te quedan 2 eventos y ya tienes las prioridades hechas.');
  });

  it('sin eventos pendientes', () => {
    expect(fraseDelDia(0, 2)).toBe('Ya no tienes más eventos hoy y te quedan 2 prioridades.');
  });

  it('sin nada pendiente', () => {
    expect(fraseDelDia(0, 0)).toBe('Por hoy lo tienes todo hecho. ¡Buen trabajo!');
  });
});

const LEER: Habito = { id: 'leer', icono: '📚', nombre: 'Leer', historialEjemplo: [] };
const AGUA: Habito = { id: 'agua', icono: '💧', nombre: 'Agua', historialEjemplo: [] };

describe('mejorRacha', () => {
  it('elige el hábito con más días seguidos', () => {
    const registro = { leer: ['2026-11-02', '2026-11-01'], agua: ['2026-11-03', '2026-11-02', '2026-11-01'] };
    expect(mejorRacha([LEER, AGUA], registro, hoy)).toEqual({ habito: AGUA, racha: 3 });
  });

  it('sin rachas devuelve null', () => {
    expect(mejorRacha([LEER, AGUA], {}, hoy)).toBeNull();
  });
});

describe('habitosHechosHoy', () => {
  it('cuenta solo los marcados hoy', () => {
    const registro = { leer: ['2026-11-02'], agua: ['2026-11-03'] };
    expect(habitosHechosHoy([LEER, AGUA], registro, hoy)).toBe(1);
  });
});

describe('objetivosAlDia', () => {
  const libros: Objetivo = { id: 'libros', icono: '📚', nombre: 'Libros', actual: 9, meta: 24, paso: 1 };
  const km: Objetivo = { id: 'km', icono: '🏃', nombre: 'Correr', actual: 300, meta: 300, paso: 5 };

  it('cuenta los que van al día y los conseguidos', () => {
    // Con un ritmo del 84 %, 9 de 24 va por detrás y 300 de 300 está conseguido.
    expect(objetivosAlDia([libros, km], {}, 0.84)).toBe(1);
  });

  it('usa el progreso guardado si lo hay', () => {
    expect(objetivosAlDia([libros, km], { libros: 22 }, 0.84)).toBe(2);
  });
});

describe('proximoViaje', () => {
  const navidad: Viaje = { id: 'navidad', icono: '🎄', destino: 'Casa', salida: '2026-12-19' };
  const puente: Viaje = { id: 'puente', icono: '🏔️', destino: 'Picos', salida: '2026-12-05', vuelta: '2026-12-08' };
  const pasado: Viaje = { id: 'pasado', icono: '🚆', destino: 'Toledo', salida: '2026-10-12' };

  it('devuelve el más cercano con los días que faltan', () => {
    expect(proximoViaje([navidad, pasado, puente], hoy)).toEqual({ viaje: puente, dias: 32, enCurso: false });
  });

  it('marca el que está en curso', () => {
    expect(proximoViaje([puente], new Date(2026, 11, 6))).toMatchObject({ enCurso: true });
  });

  it('sin viajes pendientes devuelve null', () => {
    expect(proximoViaje([pasado], hoy)).toBeNull();
  });
});
