import { Service, inject } from '@angular/core';
import { Almacen } from '../../nucleo/almacen';
import { Coleccion } from '../../nucleo/coleccion';
import { crearDatosDeEjemplo } from '../../datos';
import { Prioridad } from './prioridad.modelo';

// Las prioridades guardadas en localStorage (clave "prioridades"). Lo que se marca
// como hecho va aparte, una clave por día ("prioridades:AAAA-MM-DD"), así que no se pisan.
// Es un servicio para que la sección Prioridades y el Inicio compartan la misma lista.
@Service()
export class PrioridadesGuardadas extends Coleccion<Prioridad> {
  constructor() {
    super(inject(Almacen), 'prioridades', () => crearDatosDeEjemplo().prioridades);
  }
}
