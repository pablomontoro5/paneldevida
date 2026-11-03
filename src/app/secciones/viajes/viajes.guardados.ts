import { Service, inject } from '@angular/core';
import { Almacen } from '../../nucleo/almacen';
import { Coleccion } from '../../nucleo/coleccion';
import { crearDatosDeEjemplo } from '../../datos';
import { Viaje } from './viaje.modelo';

// Los viajes guardados en localStorage (clave "viajes"). Es un servicio para que
// la sección Viajes y el Inicio compartan la misma lista.
@Service()
export class ViajesGuardados extends Coleccion<Viaje> {
  constructor() {
    super(inject(Almacen), 'viajes', () => crearDatosDeEjemplo().viajes);
  }
}
