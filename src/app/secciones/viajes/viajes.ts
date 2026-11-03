import { Component, computed, input } from '@angular/core';
import { Viaje } from './viaje.modelo';
import { diasHastaViaje, estadoViaje, textoCuentaAtras, textoFechasViaje, viajesPendientes } from './viajes.logica';

@Component({
  imports: [],
  selector: 'app-viajes',
  styleUrl: './viajes.css',
  templateUrl: './viajes.html',
})
export class Viajes {
  readonly viajes = input.required<Viaje[]>();

  private readonly hoy = new Date();

  protected readonly filas = computed(() =>
    viajesPendientes(this.viajes(), this.hoy).map(v => {
      const dias = diasHastaViaje(v, this.hoy);
      const enCurso = estadoViaje(v, this.hoy) === 'en-curso';
      return {
        ...v,
        dias,
        enCurso,
        fechas: textoFechasViaje(v),
        cuentaAtras: textoCuentaAtras(dias),
      };
    }),
  );
}
