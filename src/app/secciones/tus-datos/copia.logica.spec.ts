import { diasDesde, esCopiaValida, estadoCopia, nombreArchivoCopia } from './copia.logica';

const COPIA_BUENA = {
  app: 'panel-de-vida',
  version: 1,
  fecha: '2026-11-03T09:00:00.000Z',
  datos: { tema: 'oscuro' },
};

describe('esCopiaValida', () => {
  it('acepta una copia correcta', () => {
    expect(esCopiaValida(COPIA_BUENA)).toBe(true);
  });

  it('rechaza otra versión', () => {
    expect(esCopiaValida({ ...COPIA_BUENA, version: 2 })).toBe(false);
  });

  it('rechaza null y textos', () => {
    expect(esCopiaValida(null)).toBe(false);
    expect(esCopiaValida('hola')).toBe(false);
  });

  it('rechaza una fecha que no es fecha', () => {
    expect(esCopiaValida({ ...COPIA_BUENA, fecha: 'ayer' })).toBe(false);
  });

  it('rechaza datos que son un array', () => {
    expect(esCopiaValida({ ...COPIA_BUENA, datos: [] })).toBe(false);
  });
});

describe('diasDesde', () => {
  it('el mismo día a distinta hora son 0 días', () => {
    expect(diasDesde(new Date(2026, 10, 3, 8, 0), new Date(2026, 10, 3, 23, 0))).toBe(0);
  });

  it('cuenta bien aunque en medio haya cambio de hora (25 de octubre)', () => {
    expect(diasDesde(new Date(2026, 9, 24), new Date(2026, 10, 3))).toBe(10);
  });
});

describe('estadoCopia', () => {
  const hoy = new Date(2026, 10, 3);

  it('avisa si no hay ninguna copia', () => {
    expect(estadoCopia(null, hoy).aviso).toBe(true);
  });

  it('con 7 días no avisa todavía', () => {
    const ultima = new Date(2026, 9, 27).toISOString();
    expect(estadoCopia(ultima, hoy)).toEqual({
      texto: 'Última copia: 27 de octubre de 2026.',
      aviso: false,
    });
  });

  it('con 8 días avisa', () => {
    const ultima = new Date(2026, 9, 26).toISOString();
    expect(estadoCopia(ultima, hoy).aviso).toBe(true);
  });
});

describe('nombreArchivoCopia', () => {
  it('lleva la fecha del día', () => {
    expect(nombreArchivoCopia(hoy())).toBe('panel-de-vida-copia-2026-11-03.json');
  });
});

function hoy(): Date {
  return new Date(2026, 10, 3);
}