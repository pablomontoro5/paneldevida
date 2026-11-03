import { Service, inject } from '@angular/core';
import { Almacen } from '../../nucleo/almacen';
import { Coleccion } from '../../nucleo/coleccion';
import { crearDatosDeEjemplo } from '../../datos';
import { Objetivo } from './objetivo.modelo';

// Los objetivos guardados en localStorage (clave "objetivos", sin año). Lo que llevas
// va aparte, una clave por año ("objetivos:AAAA"), así que no se pisan y cada año empieza de nuevo.
// Es un servicio para que la sección Objetivos y el Inicio compartan la misma lista.
@Service()
export class ObjetivosGuardados extends Coleccion<Objetivo> {
  constructor() {
    super(inject(Almacen), 'objetivos', () => crearDatosDeEjemplo().objetivos);
  }
}
