import  { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { crearDatosDeEjemplo } from './datos';

@Component({
  selector: 'app-root',
  imports: [DatePipe,RouterLink],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Pablo Javier Montoro Bermúdez');
  protected readonly hoy = new Date();
  protected readonly datos = signal(crearDatosDeEjemplo());

  protected readonly secciones = [
    { id: 'agenda', nombre: 'Agenda' },
    { id: 'prioridades', nombre: 'Prioridades' },
    { id: 'habitos', nombre: 'Hábitos' },
    { id: 'objetivos', nombre: 'Objetivos' },
    { id: 'datos', nombre: 'Tus datos' },
  ];
}