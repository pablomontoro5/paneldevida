import  { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { crearDatosDeEjemplo } from './datos';

import { Cabecera } from './componentes/cabecera/cabecera';
import { Agenda } from './componentes/agenda/agenda';
import { Prioridades } from './componentes/prioridades/prioridades';

import { Habitos } from './componentes/habitos/habitos';
import { Objetivos } from './componentes/objetivos/objetivos';
@Component({
  selector: 'app-root',
  imports: [RouterLink,Cabecera,Agenda,Prioridades,Habitos,Objetivos],
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
    { id: 'datos', nombre: 'Tus datos' },
  ];
}