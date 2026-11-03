import { BORRADOR_HABITO_VACIO, validarHabito } from './habitos.logica';
import { ICONOS_HABITO, PLANTILLAS_HABITO, aplicarPlantilla } from './habitos.plantillas';

describe('aplicarPlantilla', () => {
  it('rellena el formulario con la plantilla', () => {
    expect(aplicarPlantilla(BORRADOR_HABITO_VACIO, PLANTILLAS_HABITO[0])).toEqual({
      icono: '📚',
      nombre: 'Leer 20 minutos',
    });
  });

  it('todas las plantillas son válidas, con un icono de la lista y sin repetirse', () => {
    for (const p of PLANTILLAS_HABITO) {
      expect(validarHabito(aplicarPlantilla(BORRADOR_HABITO_VACIO, p))).toEqual({});
      expect(ICONOS_HABITO).toContain(p.icono);
    }
    const nombres = PLANTILLAS_HABITO.map(p => p.nombre);
    expect(new Set(nombres).size).toBe(nombres.length);
  });

  it('el icono por defecto está en la lista', () => {
    expect(ICONOS_HABITO).toContain(BORRADOR_HABITO_VACIO.icono);
  });
});
