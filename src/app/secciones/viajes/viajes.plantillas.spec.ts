import { BORRADOR_VACIO } from './viajes.logica';
import { PLANTILLAS_VIAJE, PlantillaViaje, aplicarPlantilla } from './viajes.plantillas';

const PLAYA: PlantillaViaje = { icono: '🏖️', destino: 'Escapada a la playa', dias: 4 };

describe('aplicarPlantilla', () => {
  it('pone el icono y el destino de la plantilla', () => {
    const borrador = aplicarPlantilla(BORRADOR_VACIO, PLAYA);
    expect(borrador.icono).toBe('🏖️');
    expect(borrador.destino).toBe('Escapada a la playa');
  });

  it('sin salida no inventa fechas', () => {
    const borrador = aplicarPlantilla(BORRADOR_VACIO, PLAYA);
    expect(borrador.salida).toBe('');
    expect(borrador.vuelta).toBe('');
  });

  it('con salida propone la vuelta según los días de la plantilla', () => {
    const borrador = aplicarPlantilla({ ...BORRADOR_VACIO, salida: '2026-12-30' }, PLAYA);
    expect(borrador.vuelta).toBe('2027-01-02'); // 4 días: 30, 31, 1 y 2
  });

  it('no pisa una vuelta que ya estaba escrita', () => {
    const borrador = aplicarPlantilla({ ...BORRADOR_VACIO, salida: '2026-12-30', vuelta: '2026-12-31' }, PLAYA);
    expect(borrador.vuelta).toBe('2026-12-31');
  });

  it('todas las plantillas duran al menos un día', () => {
    expect(PLANTILLAS_VIAJE.every(p => p.dias >= 1)).toBe(true);
  });
});
