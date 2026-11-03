import { Routes } from '@angular/router';

import { Inicio } from './secciones/inicio/inicio';
import { Agenda } from './secciones/agenda/agenda';
import { Prioridades } from './secciones/prioridades/prioridades';
import { Habitos } from './secciones/habitos/habitos';
import { Objetivos } from './secciones/objetivos/objetivos';
import { Viajes } from './secciones/viajes/viajes';
import { TusDatos } from './secciones/tus-datos/tus-datos';

// Una ruta por sección.
export const routes: Routes = [
  { path: '', component: Inicio },
  // Ninguna sección recibe ya `data`: cada una lee y guarda su lista en localStorage
  // (AgendaGuardada, PrioridadesGuardadas, HabitosGuardados, ObjetivosGuardados y ViajesGuardados).
  { path: 'agenda', component: Agenda, title: 'Agenda' },
  { path: 'prioridades', component: Prioridades, title: 'Prioridades' },
  { path: 'habitos', component: Habitos, title: 'Hábitos' },
  { path: 'objetivos', component: Objetivos, title: 'Objetivos' },
  { path: 'viajes', component: Viajes, title: 'Viajes' },
  { path: 'datos', component: TusDatos, title: 'Tus datos' },
  // Cualquier dirección que no exista vuelve al inicio.
  { path: '**', redirectTo: '' },
];
