import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Almacen } from '../../nucleo/almacen';
import { nuevoId } from '../../compartido/lista';
import { formatoCantidad } from '../../compartido/fechas';
import { Objetivo } from './objetivo.modelo';
import { ObjetivosGuardados } from './objetivos.guardados';
import { ICONOS_OBJETIVO, PLANTILLAS_OBJETIVO, PlantillaObjetivo, aplicarPlantilla } from './objetivos.plantillas';
import {
  BORRADOR_OBJETIVO_VACIO,
  BorradorObjetivo,
  ErroresObjetivo,
  EstadoObjetivo,
  ProgresoObjetivos,
  TipoObjetivo,
  borradorAObjetivo,
  cambiarValor,
  claveObjetivos,
  estadoObjetivo,
  formatoPorcentaje,
  fraccionDelAnio,
  objetivoABorrador,
  quitarProgreso,
  textoProgreso,
  validarObjetivo,
} from './objetivos.logica';

const TEXTO_ESTADO: Record<EstadoObjetivo, string> = {
  conseguido: '¡Conseguido!',
  'al-dia': 'Vas al día',
  detras: 'Vas por detrás',
};

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-objetivos',
  styleUrl: './objetivos.css',
  templateUrl: './objetivos.html',
})
export class Objetivos {
  private readonly guardados = inject(ObjetivosGuardados);
  protected readonly objetivos = this.guardados.elementos;

  // ---------- Lo que llevas este año ----------
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

  // Lo que llevas de un objetivo este año (si aún no has tocado nada, su valor de partida).
  private valorDe(o: Objetivo): number {
    return this.progreso()[o.id] ?? o.actual;
  }

  private guardarProgreso(nuevo: ProgresoObjetivos): void {
    this.progreso.set(nuevo);
    this.almacen.guardar(this.clave, nuevo);
  }

  protected cambiar(o: Objetivo, signo: 1 | -1): void {
    this.guardarProgreso({ ...this.progreso(), [o.id]: cambiarValor(this.valorDe(o), o.paso, signo) });
  }

  // ---------- Formulario ----------
  protected readonly plantillas = PLANTILLAS_OBJETIVO;
  protected readonly iconos = ICONOS_OBJETIVO;

  // null = formulario cerrado; '' = objetivo nuevo; otro texto = id del que se edita.
  protected readonly editando = signal<string | null>(null);
  // Id del objetivo que espera confirmación para borrarse.
  protected readonly borrando = signal<string | null>(null);
  protected readonly errores = signal<ErroresObjetivo>({});

  // Los campos de número valen null mientras están vacíos.
  protected readonly formulario = new FormGroup({
    icono: new FormControl(BORRADOR_OBJETIVO_VACIO.icono, { nonNullable: true }),
    nombre: new FormControl('', { nonNullable: true }),
    meta: new FormControl<number | null>(null),
    paso: new FormControl<number | null>(null),
    tipo: new FormControl<TipoObjetivo>('unidad', { nonNullable: true }),
    unidad: new FormControl('', { nonNullable: true }),
    llevas: new FormControl<number | null>(null),
  });

  private readonly campoNombre = viewChild<ElementRef<HTMLInputElement>>('campoNombre');

  protected abrirNuevo(): void {
    this.abrir('', BORRADOR_OBJETIVO_VACIO);
  }

  protected editar(o: Objetivo): void {
    this.abrir(o.id, objetivoABorrador(o, this.valorDe(o)));
  }

  protected usarPlantilla(plantilla: PlantillaObjetivo): void {
    this.formulario.setValue(aplicarPlantilla(this.formulario.getRawValue(), plantilla));
  }

  protected cancelar(): void {
    this.editando.set(null);
    this.errores.set({});
  }

  protected guardar(): void {
    const borrador = this.formulario.getRawValue();
    const errores = validarObjetivo(borrador);
    this.errores.set(errores);
    if (Object.keys(errores).length > 0) return;

    const id = this.editando();
    const anterior = this.objetivos().find(o => o.id === id);
    if (anterior) {
      // Al editar, el valor de partida no cambia: lo que has escrito en «Llevas ahora»
      // pasa a ser lo que llevas este año.
      this.guardados.guardar({ ...borradorAObjetivo(borrador, anterior.id), actual: anterior.actual });
      this.guardarProgreso({ ...this.progreso(), [anterior.id]: borrador.llevas ?? 0 });
    } else {
      this.guardados.guardar(borradorAObjetivo(borrador, nuevoId('objetivo', this.objetivos())));
    }
    this.cancelar();
  }

  // Al borrar un objetivo también se borra lo que llevabas este año; los años anteriores no se tocan.
  protected confirmarBorrado(id: string): void {
    this.guardados.borrar(id);
    this.guardarProgreso(quitarProgreso(this.progreso(), id));
    this.borrando.set(null);
    if (this.editando() === id) this.cancelar();
  }

  private abrir(id: string, borrador: BorradorObjetivo): void {
    this.formulario.setValue(borrador);
    this.errores.set({});
    this.borrando.set(null);
    this.editando.set(id);
    // Espera a que se pinte el formulario para llevar el foco (y la pantalla) al nombre.
    setTimeout(() => {
      const campo = this.campoNombre()?.nativeElement;
      campo?.focus();
      campo?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
    });
  }
}
