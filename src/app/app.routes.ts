import { Routes } from '@angular/router';

import { crearDatosDeEjemplo } from './datos';
import { Inicio } from './secciones/inicio/inicio';
import { Agenda } from './secciones/agenda/agenda';
import { Prioridades } from './secciones/prioridades/prioridades';
import { Habitos } from './secciones/habitos/habitos';
import { Objetivos } from './secciones/objetivos/objetivos';
import { Viajes } from './secciones/viajes/viajes';
import { TusDatos } from './secciones/tus-datos/tus-datos';

const datos = crearDatosDeEjemplo();

// Una ruta por sección. Con withComponentInputBinding(), cada clave de `data`
// llega al input del mismo nombre del componente (p. ej. `habitos` de Hábitos).
export const routes: Routes = [
  { path: '', component: Inicio },
  // Agenda, Prioridades y Viajes ya no usan `data`: leen y guardan su lista en
  // localStorage (AgendaGuardada, PrioridadesGuardadas y ViajesGuardados).
  { path: 'agenda', component: Agenda, title: 'Agenda' },
  { path: 'prioridades', component: Prioridades, title: 'Prioridades' },
  { path: 'habitos', component: Habitos, title: 'Hábitos', data: { habitos: datos.habitos } },
  {
    path: 'objetivos',
    component: Objetivos,
    title: 'Objetivos',
    data: { objetivos: datos.objetivos },
  },
  { path: 'viajes', component: Viajes, title: 'Viajes' },
  { path: 'datos', component: TusDatos, title: 'Tus datos' },
  // Cualquier dirección que no exista vuelve al inicio.
  { path: '**', redirectTo: '' },
];
