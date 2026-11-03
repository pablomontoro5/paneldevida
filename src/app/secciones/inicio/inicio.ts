import { Component } from '@angular/core';

import { crearDatosDeEjemplo } from '../../datos';
import { Agenda } from '../agenda/agenda';
import { Prioridades } from '../prioridades/prioridades';
import { Habitos } from '../habitos/habitos';
import { Objetivos } from '../objetivos/objetivos';
import { Viajes } from '../viajes/viajes';

// La portada: todas las tarjetas juntas para verlo todo de un vistazo.
@Component({
  imports: [Agenda, Prioridades, Habitos, Objetivos, Viajes],
  selector: 'app-inicio',
  templateUrl: './inicio.html',
})
export class Inicio {
  protected readonly datos = crearDatosDeEjemplo();
}
