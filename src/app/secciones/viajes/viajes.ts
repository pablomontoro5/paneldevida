import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { nuevoId } from '../../compartido/lista';
import { Viaje } from './viaje.modelo';
import { ViajesGuardados } from './viajes.guardados';
import { ICONOS_VIAJE, PLANTILLAS_VIAJE, PlantillaViaje, aplicarPlantilla } from './viajes.plantillas';
import {
  BORRADOR_VACIO,
  BorradorViaje,
  ErroresViaje,
  borradorAViaje,
  diasHastaViaje,
  estadoViaje,
  textoCuentaAtras,
  textoFechasViaje,
  validarViaje,
  viajeABorrador,
  viajesPendientes,
} from './viajes.logica';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-viajes',
  styleUrl: './viajes.css',
  templateUrl: './viajes.html',
})
export class Viajes {
  private readonly guardados = inject(ViajesGuardados);
  private readonly hoy = new Date();

  protected readonly filas = computed(() =>
    viajesPendientes(this.guardados.elementos(), this.hoy).map(v => {
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

  // ---------- Formulario ----------
  protected readonly plantillas = PLANTILLAS_VIAJE;
  protected readonly iconos = ICONOS_VIAJE;

  // null = formulario cerrado; '' = viaje nuevo; otro texto = id del viaje que se edita.
  protected readonly editando = signal<string | null>(null);
  // Id del viaje que espera confirmación para borrarse.
  protected readonly borrando = signal<string | null>(null);
  protected readonly errores = signal<ErroresViaje>({});

  protected readonly formulario = new FormGroup({
    icono: new FormControl(BORRADOR_VACIO.icono, { nonNullable: true }),
    destino: new FormControl('', { nonNullable: true }),
    salida: new FormControl('', { nonNullable: true }),
    vuelta: new FormControl('', { nonNullable: true }),
  });

  private readonly campoDestino = viewChild<ElementRef<HTMLInputElement>>('campoDestino');

  protected abrirNuevo(): void {
    this.abrir('', BORRADOR_VACIO);
  }

  protected editar(viaje: Viaje): void {
    this.abrir(viaje.id, viajeABorrador(viaje));
  }

  protected usarPlantilla(plantilla: PlantillaViaje): void {
    this.formulario.setValue(aplicarPlantilla(this.formulario.getRawValue(), plantilla));
  }

  protected cancelar(): void {
    this.editando.set(null);
    this.errores.set({});
  }

  protected guardar(): void {
    const borrador = this.formulario.getRawValue();
    const errores = validarViaje(borrador);
    this.errores.set(errores);
    if (Object.keys(errores).length > 0) return;

    const id = this.editando() || nuevoId('viaje', this.guardados.elementos());
    this.guardados.guardar(borradorAViaje(borrador, id));
    this.cancelar();
  }

  protected confirmarBorrado(id: string): void {
    this.guardados.borrar(id);
    this.borrando.set(null);
    if (this.editando() === id) this.cancelar();
  }

  private abrir(id: string, borrador: BorradorViaje): void {
    this.formulario.setValue(borrador);
    this.errores.set({});
    this.borrando.set(null);
    this.editando.set(id);
    // Espera a que se pinte el formulario para llevar el foco (y la pantalla) al primer campo.
    setTimeout(() => {
      const campo = this.campoDestino()?.nativeElement;
      campo?.focus();
      campo?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
    });
  }
}
