import { Component, computed, inject, input, signal } from '@angular/core';
import { Almacen } from '../../servicios/almacen';
import { Habito } from '../../modelos/habito';
import { calcularRacha, claveFecha } from '../../utilidades/fechas';
import {
  RegistroHabitos,
  alternarDia,
  completarRegistro,
  textoRacha,
  ultimosSieteDias,
} from '../../utilidades/habitos';
@Component({
  imports: [],
  selector: 'app-habitos',
  styleUrl: './habitos.css',
  templateUrl: './habitos.html',
})
export class Habitos {
  readonly habitos = input.required<Habito[]>();

  private readonly almacen = inject(Almacen);
  private readonly hoy = new Date();

  private readonly guardado = signal(this.almacen.leer<RegistroHabitos | null>('habitos', null));
  private readonly registro = computed(() => completarRegistro(this.guardado(), this.habitos(), this.hoy));

  protected readonly textoRacha = textoRacha;
  protected readonly filas = computed(() => {
    const registro = this.registro();
    const claveHoy = claveFecha(this.hoy);
    return this.habitos().map(h => {
      const fechas = registro[h.id];
      const semana = ultimosSieteDias(fechas, this.hoy);
      return {
        ...h,
        racha: calcularRacha(fechas, this.hoy),
        hechoHoy: fechas.includes(claveHoy),
        semana,
        cumplidosSemana: semana.filter(d => d.cumplido).length,
      };
    });
  });

  protected marcarHoy(id: string): void {
    const actual = this.registro();
    const nuevo = { ...actual, [id]: alternarDia(actual[id], claveFecha(this.hoy)) };
    this.guardado.set(nuevo);
    this.almacen.guardar('habitos', nuevo);
  }
}
