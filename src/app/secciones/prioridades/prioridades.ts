import { Component, computed, inject, signal } from '@angular/core';
import { Almacen } from '../../nucleo/almacen';
import { PrioridadesGuardadas } from './prioridades.guardados';
import { alternarHecha, clavePrioridades, contarHechas } from './prioridades.logica';

@Component({
  selector: 'app-prioridades',
  templateUrl: './prioridades.html',
  styleUrl: './prioridades.css',
})
export class Prioridades {
  private readonly guardadas = inject(PrioridadesGuardadas);
  protected readonly prioridades = this.guardadas.elementos;

  private readonly almacen = inject(Almacen);
  private readonly clave = clavePrioridades(new Date());

  protected readonly hechas = signal(this.almacen.leer<string[]>(this.clave, []));
  protected readonly contador = computed(
    () => `${contarHechas(this.prioridades(), this.hechas())} de ${this.prioridades().length} hechas`,
  );

  protected alternar(id: string, marcada: boolean): void {
    this.hechas.update(actuales => alternarHecha(actuales, id, marcada));
    this.almacen.guardar(this.clave, this.hechas());
  }
}