import { Viaje } from './viaje.modelo';
import {
  aFecha,
  diasHastaViaje,
  estadoViaje,
  textoCuentaAtras,
  textoFechasViaje,
  viajesPendientes,
  BORRADOR_VACIO,
  BorradorViaje,
  borradorAViaje,
  sumarDias,
  validarViaje,
  viajeABorrador,
} from './viajes.logica';

const hoy = new Date(2026, 10, 3, 9, 30); // 3 de noviembre de 2026 por la mañana

const NAVIDAD: Viaje = { id: 'navidad', icono: '🎄', destino: 'Casa', salida: '2026-12-20', vuelta: '2027-01-06' };
const PUENTE: Viaje = { id: 'puente', icono: '🏔️', destino: 'Picos de Europa', salida: '2026-11-01', vuelta: '2026-11-04' };
const EXCURSION: Viaje = { id: 'excursion', icono: '🚆', destino: 'Toledo', salida: '2026-10-12' };

describe('aFecha', () => {
  it('crea la fecha en hora local, sin desfase de un día', () => {
    expect(aFecha('2026-12-20')).toEqual(new Date(2026, 11, 20));
  });
});

describe('diasHastaViaje', () => {
  it('del 3 de noviembre al 20 de diciembre faltan 47 días', () => {
    expect(diasHastaViaje(NAVIDAD, hoy)).toBe(47);
  });

  it('el mismo día de salida da 0 aunque sea tarde', () => {
    expect(diasHastaViaje(NAVIDAD, new Date(2026, 11, 20, 23, 0))).toBe(0);
  });
});

describe('estadoViaje', () => {
  it('un viaje futuro está pendiente', () => {
    expect(estadoViaje(NAVIDAD, hoy)).toBe('falta');
  });

  it('entre la salida y la vuelta está en curso', () => {
    expect(estadoViaje(PUENTE, hoy)).toBe('en-curso');
  });

  it('el día de la vuelta sigue en curso', () => {
    expect(estadoViaje(PUENTE, new Date(2026, 10, 4))).toBe('en-curso');
  });

  it('después de la vuelta ya ha pasado', () => {
    expect(estadoViaje(PUENTE, new Date(2026, 10, 5))).toBe('pasado');
  });

  it('un viaje de un día sin vuelta pasa al día siguiente', () => {
    expect(estadoViaje(EXCURSION, new Date(2026, 9, 12))).toBe('en-curso');
    expect(estadoViaje(EXCURSION, new Date(2026, 9, 13))).toBe('pasado');
  });
});

describe('textoCuentaAtras', () => {
  it('0 días es hoy', () => {
    expect(textoCuentaAtras(0)).toBe('¡Es hoy!');
  });

  it('1 día es mañana', () => {
    expect(textoCuentaAtras(1)).toBe('Mañana');
  });

  it('más días se cuentan', () => {
    expect(textoCuentaAtras(47)).toBe('Faltan 47 días');
  });
});

describe('textoFechasViaje', () => {
  it('muestra la salida y la vuelta en español', () => {
    expect(textoFechasViaje(NAVIDAD)).toBe('20 de diciembre de 2026 – 6 de enero de 2027');
  });

  it('sin vuelta muestra solo un día', () => {
    expect(textoFechasViaje(EXCURSION)).toBe('12 de octubre de 2026');
  });
});

describe('viajesPendientes', () => {
  it('quita los pasados y ordena por fecha de salida', () => {
    const ids = viajesPendientes([NAVIDAD, EXCURSION, PUENTE], hoy).map(v => v.id);
    expect(ids).toEqual(['puente', 'navidad']);
  });
});

describe('validarViaje', () => {
  const bueno: BorradorViaje = { icono: '🏖️', destino: 'Cádiz', salida: '2027-07-15', vuelta: '2027-07-30' };

  it('un viaje completo no tiene errores', () => {
    expect(validarViaje(bueno)).toEqual({});
  });

  it('sin vuelta también vale (viaje de un día)', () => {
    expect(validarViaje({ ...bueno, vuelta: '' })).toEqual({});
  });

  it('pide destino aunque solo haya espacios', () => {
    expect(validarViaje({ ...bueno, destino: '   ' }).destino).toBe('Escribe a dónde vas.');
  });

  it('pide la salida', () => {
    expect(validarViaje({ ...bueno, salida: '' }).salida).toBe('Elige el día de salida.');
  });

  it('la vuelta no puede ser antes de la salida', () => {
    expect(validarViaje({ ...bueno, vuelta: '2027-07-14' }).vuelta).toBe('La vuelta no puede ser antes de la salida.');
  });
});

describe('borradorAViaje y viajeABorrador', () => {
  it('quita espacios del destino y guarda el id', () => {
    const viaje = borradorAViaje({ icono: '🏖️', destino: '  Cádiz ', salida: '2027-07-15', vuelta: '2027-07-30' }, 'v1');
    expect(viaje).toEqual({ id: 'v1', icono: '🏖️', destino: 'Cádiz', salida: '2027-07-15', vuelta: '2027-07-30' });
  });

  it('sin vuelta, o con la vuelta el mismo día, no guarda vuelta', () => {
    expect(borradorAViaje({ ...BORRADOR_VACIO, destino: 'Toledo', salida: '2026-12-01' }, 'v2').vuelta).toBeUndefined();
    expect(
      borradorAViaje({ ...BORRADOR_VACIO, destino: 'Toledo', salida: '2026-12-01', vuelta: '2026-12-01' }, 'v2').vuelta,
    ).toBeUndefined();
  });

  it('ida y vuelta devuelven el mismo viaje', () => {
    expect(borradorAViaje(viajeABorrador(NAVIDAD), NAVIDAD.id)).toEqual(NAVIDAD);
  });
});

describe('sumarDias', () => {
  it('cambia de año sin problemas', () => {
    expect(sumarDias('2026-12-30', 3)).toBe('2027-01-02');
  });
});
