import { Component, computed, inject, input, signal } from '@angular/core';
import { Almacen } from '../../servicios/almacen';
import { Objetivo } from '../../modelos/objetivo';
import { formatoCantidad } from '../../utilidades/fechas';
import {
  EstadoObjetivo,
  ProgresoObjetivos,
  cambiarValor,
  claveObjetivos,
  estadoObjetivo,
  formatoPorcentaje,
  fraccionDelAnio,
  textoProgreso,
} from '../../utilidades/objetivos';

const TEXTO_ESTADO: Record<EstadoObjetivo, string> = {
  conseguido: '¡Conseguido!',
  'al-dia': 'Vas al día',
  detras: 'Vas por detrás',
};

@Component({
  imports: [],
  selector: 'app-objetivos',
  styleUrl: './objetivos.css',
  templateUrl: './objetivos.html',
})
export class Objetivos {
  readonly objetivos = input.required<Objetivo[]>();

  private readonly almacen = inject(Almacen);
  private readonly hoy = new Date();
  private readonly clave = claveObjetivos(this.hoy);
  private readonly progreso = signal(this.almacen.leer<ProgresoObjetivos>(this.clave, {}));

  protected readonly anio = this.hoy.getFullYear();
  protected readonly ritmo = fraccionDelAnio(this.hoy);
  protected readonly textoRitmo = formatoPorcentaje(this.ritmo);

  protected readonly filas = computed(() => {
    const progreso = this.progreso();
    return this.objetivos().map(o => {
      const valor = progreso[o.id] ?? o.actual;
      const fraccion = valor / o.meta;
      const estado = estadoObjetivo(fraccion, this.ritmo);
      const paso = formatoCantidad(o.paso, o.formato === 'euros');
      return {
        ...o,
        valor,
        estado,
        textoEstado: TEXTO_ESTADO[estado],
        texto: textoProgreso(o, valor),
        porcentaje: formatoPorcentaje(fraccion),
        anchoBarra: Math.min(fraccion, 1) * 100, // la barra no pasa del 100 %
        etiquetaSumar: `Sumar ${paso} a ${o.nombre}`,
        etiquetaRestar: `Restar ${paso} a ${o.nombre}`,
      };
    });
  });

  protected cambiar(o: Objetivo, signo: 1 | -1): void {
    const actual = this.progreso();
    const valor = actual[o.id] ?? o.actual;
    const nuevo = { ...actual, [o.id]: cambiarValor(valor, o.paso, signo) };
    this.progreso.set(nuevo);
    this.almacen.guardar(this.clave, nuevo);
  }
}