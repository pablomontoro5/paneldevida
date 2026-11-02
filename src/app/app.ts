import  { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { crearDatosDeEjemplo } from './datos';
import { calcularRacha } from './utilidades/fechas';

import { historialAFechas } from './utilidades/fechas';

function textoRacha(racha: number): string {
  if (racha === 0) return 'Sin racha';
  return racha === 1 ? '1 día seguido' : `${racha} días seguidos`;
}
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
  protected readonly textoRacha = textoRacha;
  protected readonly calcularRacha = calcularRacha;
  protected readonly historialAFechas = historialAFechas;

  protected readonly secciones = [
    { id: 'agenda', nombre: 'Agenda' },
    { id: 'prioridades', nombre: 'Prioridades' },
    { id: 'habitos', nombre: 'Hábitos' },
    { id: 'objetivos', nombre: 'Objetivos' },
    { id: 'datos', nombre: 'Tus datos' },
  ];
}