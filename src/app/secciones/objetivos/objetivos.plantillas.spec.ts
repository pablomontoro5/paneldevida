import { BORRADOR_OBJETIVO_VACIO, validarObjetivo } from './objetivos.logica';
import { ICONOS_OBJETIVO, PLANTILLAS_OBJETIVO, aplicarPlantilla } from './objetivos.plantillas';

describe('aplicarPlantilla', () => {
  it('rellena el formulario con la plantilla de ahorro en euros', () => {
    const ahorro = PLANTILLAS_OBJETIVO.find(p => p.tipo === 'euros')!;
    expect(aplicarPlantilla(BORRADOR_OBJETIVO_VACIO, ahorro)).toEqual({
      icono: '💶',
      nombre: 'Ahorrar 1.500 €',
      meta: 1500,
      paso: 50,
      tipo: 'euros',
      unidad: '',
      llevas: 0,
    });
  });

  it('no toca lo que llevas', () => {
    const libros = PLANTILLAS_OBJETIVO[0];
    expect(aplicarPlantilla({ ...BORRADOR_OBJETIVO_VACIO, llevas: 3 }, libros).llevas).toBe(3);
  });

  it('todas las plantillas son válidas, con un icono de la lista y sin repetirse', () => {
    for (const p of PLANTILLAS_OBJETIVO) {
      expect(validarObjetivo(aplicarPlantilla(BORRADOR_OBJETIVO_VACIO, p))).toEqual({});
      expect(ICONOS_OBJETIVO).toContain(p.icono);
    }
    const nombres = PLANTILLAS_OBJETIVO.map(p => p.nombre);
    expect(new Set(nombres).size).toBe(nombres.length);
  });
});
