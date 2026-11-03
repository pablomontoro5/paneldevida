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
// llega al input del mismo nombre del componente (p. ej. `eventos` de Agenda).
export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'agenda', component: Agenda, title: 'Agenda', data: { eventos: datos.agenda } },
  {
    path: 'prioridades',
    component: Prioridades,
    title: 'Prioridades',
    data: { prioridades: datos.prioridades },
  },
  { path: 'habitos', component: Habitos, title: 'Hábitos', data: { habitos: datos.habitos } },
  {
    path: 'objetivos',
    component: Objetivos,
    title: 'Objetivos',
    data: { objetivos: datos.objetivos },
  },
  { path: 'viajes', component: Viajes, title: 'Viajes', data: { viajes: datos.viajes } },
  { path: 'datos', component: TusDatos, title: 'Tus datos' },
  // Cualquier dirección que no exista vuelve al inicio.
  { path: '**', redirectTo: '' },
];
