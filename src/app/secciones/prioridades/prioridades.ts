import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { nuevoId } from '../../compartido/lista';
import { Almacen } from '../../nucleo/almacen';
import { Prioridad } from './prioridad.modelo';
import { PrioridadesGuardadas } from './prioridades.guardados';
import { PLANTILLAS_PRIORIDAD, PlantillaPrioridad, aplicarPlantilla } from './prioridades.plantillas';
import {
  BORRADOR_PRIORIDAD_VACIO,
  BorradorPrioridad,
  ErroresPrioridad,
  MAX_PRIORIDADES,
  alternarHecha,
  borradorAPrioridad,
  clavePrioridades,
  contarHechas,
  prioridadABorrador,
  puedeAnadir,
  validarPrioridad,
} from './prioridades.logica';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-prioridades',
  templateUrl: './prioridades.html',
  styleUrl: './prioridades.css',
})
export class Prioridades {
  private readonly guardadas = inject(PrioridadesGuardadas);
  protected readonly prioridades = this.guardadas.elementos;

  // ---------- Lo marcado hoy ----------
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

  // ---------- Formulario ----------
  protected readonly plantillas = PLANTILLAS_PRIORIDAD;
  protected readonly maximo = MAX_PRIORIDADES;
  protected readonly sePuedeAnadir = computed(() => puedeAnadir(this.prioridades()));

  // null = formulario cerrado; '' = prioridad nueva; otro texto = id de la que se edita.
  protected readonly editando = signal<string | null>(null);
  // Id de la prioridad que espera confirmación para borrarse.
  protected readonly borrando = signal<string | null>(null);
  protected readonly errores = signal<ErroresPrioridad>({});

  protected readonly formulario = new FormGroup({
    texto: new FormControl('', { nonNullable: true }),
  });

  private readonly campoTexto = viewChild<ElementRef<HTMLInputElement>>('campoTexto');

  protected abrirNuevo(): void {
    this.abrir('', BORRADOR_PRIORIDAD_VACIO);
  }

  protected editar(prioridad: Prioridad): void {
    this.abrir(prioridad.id, prioridadABorrador(prioridad));
  }

  protected usarPlantilla(plantilla: PlantillaPrioridad): void {
    this.formulario.setValue(aplicarPlantilla(this.formulario.getRawValue(), plantilla));
  }

  protected cancelar(): void {
    this.editando.set(null);
    this.errores.set({});
  }

  protected guardar(): void {
    const borrador = this.formulario.getRawValue();
    const id = this.editando() ?? '';
    const errores = validarPrioridad(borrador, this.prioridades(), id);
    this.errores.set(errores);
    if (Object.keys(errores).length > 0) return;

    this.guardadas.guardar(borradorAPrioridad(borrador, id || nuevoId('prioridad', this.prioridades())));
    this.cancelar();
  }

  // Al borrar una prioridad también se desmarca hoy; los días anteriores no se tocan.
  protected confirmarBorrado(id: string): void {
    this.guardadas.borrar(id);
    this.alternar(id, false);
    this.borrando.set(null);
    if (this.editando() === id) this.cancelar();
  }

  private abrir(id: string, borrador: BorradorPrioridad): void {
    this.formulario.setValue(borrador);
    this.errores.set({});
    this.borrando.set(null);
    this.editando.set(id);
    // Espera a que se pinte el formulario para llevar el foco (y la pantalla) al campo.
    setTimeout(() => {
      const campo = this.campoTexto()?.nativeElement;
      campo?.focus();
      campo?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
    });
  }
}
