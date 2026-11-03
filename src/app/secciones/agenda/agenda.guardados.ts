import { Service, inject } from '@angular/core';
import { Almacen } from '../../nucleo/almacen';
import { Coleccion } from '../../nucleo/coleccion';
import { crearDatosDeEjemplo } from '../../datos';
import { Evento } from './agenda.modelo';

// Los eventos de la agenda guardados en localStorage (clave "agenda"). Es un servicio
// para que la sección Agenda y el Inicio compartan la misma lista.
@Service()
export class AgendaGuardada extends Coleccion<Evento> {
  constructor() {
    super(inject(Almacen), 'agenda', () => crearDatosDeEjemplo().agenda);
  }
}
