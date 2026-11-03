import { BORRADOR_EVENTO_VACIO } from './agenda.logica';
import { PLANTILLAS_EVENTO, aplicarPlantilla } from './agenda.plantillas';

const gimnasio = PLANTILLAS_EVENTO.find(p => p.titulo === 'Gimnasio')!;
const estudiar = PLANTILLAS_EVENTO.find(p => p.titulo === 'Estudiar')!;

describe('aplicarPlantilla', () => {
  it('pone el título y el lugar de la plantilla', () => {
    const r = aplicarPlantilla(BORRADOR_EVENTO_VACIO, estudiar);
    expect(r.titulo).toBe('Estudiar');
    expect(r.lugar).toBe('Biblioteca');
  });

  it('con hora de inicio propone la de fin según lo que suele durar', () => {
    const r = aplicarPlantilla({ ...BORRADOR_EVENTO_VACIO, inicio: '18:00' }, gimnasio);
    expect(r.fin).toBe('19:00');
  });

  it('no toca el lugar ni el fin que ya estaban escritos', () => {
    const r = aplicarPlantilla({ titulo: '', lugar: 'Casa', inicio: '18:00', fin: '18:30' }, estudiar);
    expect(r).toEqual({ titulo: 'Estudiar', lugar: 'Casa', inicio: '18:00', fin: '18:30' });
  });

  it('todas las plantillas tienen título y una duración positiva', () => {
    for (const p of PLANTILLAS_EVENTO) {
      expect(p.titulo.trim()).not.toBe('');
      expect(p.minutos).toBeGreaterThan(0);
    }
  });
});
