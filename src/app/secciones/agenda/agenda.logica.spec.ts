import { borradorAEvento, eventoABorrador, marcarEventos, sumarMinutos, validarEvento } from './agenda.logica';

const ev = (inicio: string, fin: string) => ({ id: inicio, inicio, fin, titulo: inicio, lugar: '' });

describe('marcarEventos', () => {
  it('ordena por hora de inicio', () => {
    const r = marcarEventos([ev('12:00', '13:00'), ev('09:00', '10:00')], 0);
    expect(r.map((e) => e.inicio)).toEqual(['09:00', '12:00']);
  });

  it('marca el evento en curso como actual y los anteriores como pasados', () => {
    // Minuto 600 = las 10:00, dentro del evento de 09:30 a 11:00
    const r = marcarEventos([ev('08:00', '09:00'), ev('09:30', '11:00'), ev('12:00', '13:00')], 600);
    expect(r.map((e) => e.estado)).toEqual(['pasado', 'actual', 'futuro']);
  });

  it('si no hay nada en curso, marca el siguiente', () => {
    // Las 10:00, entre un evento que ya acabó y dos que no han empezado
    const r = marcarEventos([ev('08:00', '09:00'), ev('11:00', '12:00'), ev('13:00', '14:00')], 600);
    expect(r.map((e) => e.estado)).toEqual(['pasado', 'siguiente', 'futuro']);
  });
});

describe('validarEvento', () => {
  const bien = { titulo: 'Clase', lugar: '', inicio: '09:00', fin: '10:00' };

  it('un evento completo no tiene errores', () => {
    expect(validarEvento(bien)).toEqual({});
  });

  it('el título es obligatorio (no vale solo con espacios)', () => {
    expect(validarEvento({ ...bien, titulo: '   ' }).titulo).toBeDefined();
  });

  it('la hora de inicio es obligatoria', () => {
    expect(validarEvento({ ...bien, inicio: '' }).inicio).toBeDefined();
  });

  it('el fin no puede ser antes que el inicio', () => {
    expect(validarEvento({ ...bien, fin: '08:59' }).fin).toBe('El fin no puede ser antes que el inicio.');
  });

  it('el fin puede ser a la misma hora o quedar vacío', () => {
    expect(validarEvento({ ...bien, fin: '09:00' })).toEqual({});
    expect(validarEvento({ ...bien, fin: '' })).toEqual({});
  });
});

describe('sumarMinutos', () => {
  it('suma pasando de hora', () => {
    expect(sumarMinutos('09:45', 30)).toBe('10:15');
  });

  it('no pasa de las 23:59', () => {
    expect(sumarMinutos('23:30', 60)).toBe('23:59');
  });
});

describe('borradorAEvento y eventoABorrador', () => {
  it('quita los espacios de sobra y guarda el id', () => {
    const evento = borradorAEvento({ titulo: ' Clase ', lugar: ' Aula 1 ', inicio: '09:00', fin: '10:00' }, 'e1');
    expect(evento).toEqual({ id: 'e1', titulo: 'Clase', lugar: 'Aula 1', inicio: '09:00', fin: '10:00' });
  });

  it('sin hora de fin, el evento dura una hora', () => {
    expect(borradorAEvento({ titulo: 'Clase', lugar: '', inicio: '09:30', fin: '' }, 'e1').fin).toBe('10:30');
  });

  it('ida y vuelta: un evento se convierte en borrador y vuelve igual', () => {
    const evento = { id: 'e1', titulo: 'Clase', lugar: 'Aula 1', inicio: '09:00', fin: '10:00' };
    expect(borradorAEvento(eventoABorrador(evento), 'e1')).toEqual(evento);
  });
});
