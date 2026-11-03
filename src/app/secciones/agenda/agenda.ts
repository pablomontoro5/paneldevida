import { Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { nuevoId } from '../../compartido/lista';
import { Evento } from './agenda.modelo';
import { AgendaGuardada } from './agenda.guardados';
import { PLANTILLAS_EVENTO, PlantillaEvento, aplicarPlantilla } from './agenda.plantillas';
import {
  BORRADOR_EVENTO_VACIO,
  BorradorEvento,
  ErroresEvento,
  borradorAEvento,
  eventoABorrador,
  marcarEventos,
  validarEvento,
} from './agenda.logica';

function minutoDelDia(fecha: Date): number {
  return fecha.getHours() * 60 + fecha.getMinutes();
}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-agenda',
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda {
  private readonly guardada = inject(AgendaGuardada);

  private readonly minutoActual = signal(minutoDelDia(new Date()));
  protected readonly lista = computed(() => marcarEventos(this.guardada.elementos(), this.minutoActual()));

  // ---------- Formulario ----------
  protected readonly plantillas = PLANTILLAS_EVENTO;

  // null = formulario cerrado; '' = evento nuevo; otro texto = id del evento que se edita.
  protected readonly editando = signal<string | null>(null);
  // Id del evento que espera confirmación para borrarse.
  protected readonly borrando = signal<string | null>(null);
  protected readonly errores = signal<ErroresEvento>({});

  protected readonly formulario = new FormGroup({
    titulo: new FormControl('', { nonNullable: true }),
    lugar: new FormControl('', { nonNullable: true }),
    inicio: new FormControl('', { nonNullable: true }),
    fin: new FormControl('', { nonNullable: true }),
  });

  private readonly campoTitulo = viewChild<ElementRef<HTMLInputElement>>('campoTitulo');

  constructor() {
    const id = setInterval(() => this.minutoActual.set(minutoDelDia(new Date())), 60_000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }

  protected abrirNuevo(): void {
    this.abrir('', BORRADOR_EVENTO_VACIO);
  }

  protected editar(evento: Evento): void {
    this.abrir(evento.id, eventoABorrador(evento));
  }

  protected usarPlantilla(plantilla: PlantillaEvento): void {
    this.formulario.setValue(aplicarPlantilla(this.formulario.getRawValue(), plantilla));
  }

  protected cancelar(): void {
    this.editando.set(null);
    this.errores.set({});
  }

  protected guardar(): void {
    const borrador = this.formulario.getRawValue();
    const errores = validarEvento(borrador);
    this.errores.set(errores);
    if (Object.keys(errores).length > 0) return;

    const id = this.editando() || nuevoId('evento', this.guardada.elementos());
    this.guardada.guardar(borradorAEvento(borrador, id));
    this.cancelar();
  }

  protected confirmarBorrado(id: string): void {
    this.guardada.borrar(id);
    this.borrando.set(null);
    if (this.editando() === id) this.cancelar();
  }

  private abrir(id: string, borrador: BorradorEvento): void {
    this.formulario.setValue(borrador);
    this.errores.set({});
    this.borrando.set(null);
    this.editando.set(id);
    // Espera a que se pinte el formulario para llevar el foco (y la pantalla) al primer campo.
    setTimeout(() => {
      const campo = this.campoTitulo()?.nativeElement;
      campo?.focus();
      campo?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
    });
  }
}
