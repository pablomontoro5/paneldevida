import { Service, inject } from '@angular/core';
import { Almacen } from '../../nucleo/almacen';
import { Coleccion } from '../../nucleo/coleccion';
import { crearDatosDeEjemplo } from '../../datos';
import { Habito } from './habito.modelo';

// Los hábitos guardados en localStorage (clave "habitos-lista"). Los días que has cumplido
// cada uno van aparte, en "habitos" ({ id: ['AAAA-MM-DD', …] }), como hasta ahora: por eso
// los hábitos de ejemplo conservan su historial y sus rachas.
// Es un servicio para que la sección Hábitos y el Inicio compartan la misma lista.
@Service()
export class HabitosGuardados extends Coleccion<Habito> {
  constructor() {
    super(inject(Almacen), 'habitos-lista', () => crearDatosDeEjemplo().habitos);
  }
}
