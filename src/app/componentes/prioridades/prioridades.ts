import { Component, computed, inject, input, signal } from '@angular/core';
import { Prioridad } from '../../modelos/prioridad';
import { Almacen } from '../../servicios/almacen';
import { alternarHecha, clavePrioridades } from '../../utilidades/prioridades';

@Component({
  selector: 'app-prioridades',
  templateUrl: './prioridades.html',
  styleUrl: './prioridades.css',
})
export class Prioridades {
  readonly prioridades = input.required<Prioridad[]>();

  private readonly almacen = inject(Almacen);
  private readonly clave = clavePrioridades(new Date());

  protected readonly hechas = signal(this.almacen.leer<string[]>(this.clave, []));
  protected readonly contador = computed(
    () => `${this.hechas().length} de ${this.prioridades().length} hechas`,
  );

  protected alternar(id: string, marcada: boolean): void {
    this.hechas.update(actuales => alternarHecha(actuales, id, marcada));
    this.almacen.guardar(this.clave, this.hechas());
  }
}