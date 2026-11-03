import { BORRADOR_PRIORIDAD_VACIO } from './prioridades.logica';
import { PLANTILLAS_PRIORIDAD, aplicarPlantilla } from './prioridades.plantillas';

describe('aplicarPlantilla', () => {
  it('pone el texto de la plantilla', () => {
    const llamar = PLANTILLAS_PRIORIDAD.find(p => p.texto === 'Llamar a casa')!;
    expect(aplicarPlantilla(BORRADOR_PRIORIDAD_VACIO, llamar)).toEqual({ texto: 'Llamar a casa' });
  });

  it('sustituye lo que ya estaba escrito', () => {
    const repasar = PLANTILLAS_PRIORIDAD[0];
    expect(aplicarPlantilla({ texto: 'Otra cosa' }, repasar).texto).toBe(repasar.texto);
  });

  it('todas las plantillas tienen icono y texto, sin repetirse', () => {
    for (const p of PLANTILLAS_PRIORIDAD) {
      expect(p.icono.trim()).not.toBe('');
      expect(p.texto.trim()).not.toBe('');
    }
    const textos = PLANTILLAS_PRIORIDAD.map(p => p.texto);
    expect(new Set(textos).size).toBe(textos.length);
  });
});
