import  { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { crearDatosDeEjemplo } from './datos';

import { Cabecera } from './nucleo/cabecera/cabecera';
import { Agenda } from './secciones/agenda/agenda';
import { Prioridades } from './secciones/prioridades/prioridades';

import { Habitos } from './secciones/habitos/habitos';
import { Objetivos } from './secciones/objetivos/objetivos';
import { Viajes } from './secciones/viajes/viajes';
import { TusDatos } from './secciones/tus-datos/tus-datos';
@Component({
  selector: 'app-root',
  imports: [RouterLink,Cabecera,Agenda,Prioridades,Habitos,Objetivos,Viajes,TusDatos],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly datos = signal(crearDatosDeEjemplo());

  protected readonly secciones = [
    { id: 'agenda', nombre: 'Agenda' },
    { id: 'prioridades', nombre: 'Prioridades' },
    { id: 'habitos', nombre: 'Hábitos' },
    { id: 'objetivos', nombre: 'Objetivos' },
    { id: 'viajes', nombre: 'Viajes' },
    { id: 'datos', nombre: 'Tus datos' },
  ];
}