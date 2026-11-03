import  { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { crearDatosDeEjemplo } from './datos';
import { calcularRacha } from './utilidades/fechas';

import { historialAFechas } from './utilidades/fechas';
import { Cabecera } from './componentes/cabecera/cabecera';
import { Agenda } from './componentes/agenda/agenda';
import { Prioridades } from './componentes/prioridades/prioridades';
function textoRacha(racha: number): string {
  if (racha === 0) return 'Sin racha';
  return racha === 1 ? '1 día seguido' : `${racha} días seguidos`;
}
@Component({
  selector: 'app-root',
  imports: [RouterLink,Cabecera,Agenda,Prioridades],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
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