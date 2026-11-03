import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Cabecera } from './nucleo/cabecera/cabecera';

interface Enlace {
  ruta: string;
  nombre: string;
  icono: string;
}

const inicio: Enlace = { ruta: '/', nombre: 'Inicio', icono: '🏠' };
const agenda: Enlace = { ruta: '/agenda', nombre: 'Agenda', icono: '📅' };
const prioridades: Enlace = { ruta: '/prioridades', nombre: 'Prioridades', icono: '⭐' };
const habitos: Enlace = { ruta: '/habitos', nombre: 'Hábitos', icono: '🔥' };
const objetivos: Enlace = { ruta: '/objetivos', nombre: 'Objetivos', icono: '🎯' };
const viajes: Enlace = { ruta: '/viajes', nombre: 'Viajes', icono: '✈️' };
const tusDatos: Enlace = { ruta: '/datos', nombre: 'Tus datos', icono: '⚙️' };

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Cabecera],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  // Menú lateral del portátil, por grupos.
  protected readonly grupos = [
    { titulo: 'Hoy', enlaces: [inicio, agenda, prioridades, habitos] },
    { titulo: 'Planes', enlaces: [objetivos, viajes] },
    { titulo: 'Tú', enlaces: [tusDatos] },
  ];

  // Barra inferior del móvil: solo cinco para que quepan; «Tus datos» está en la cabecera.
  protected readonly barra = [inicio, agenda, habitos, objetivos, viajes];
}
