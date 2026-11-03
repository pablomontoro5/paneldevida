import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { Evento } from '../../modelos/agenda';
import { marcarEventos } from '../../utilidades/agenda';

function minutoDelDia(fecha: Date): number {
  return fecha.getHours() * 60 + fecha.getMinutes();
}

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda {
  readonly eventos = input.required<Evento[]>();

  private readonly minutoActual = signal(minutoDelDia(new Date()));
  protected readonly lista = computed(() => marcarEventos(this.eventos(), this.minutoActual()));

  constructor() {
    const id = setInterval(() => this.minutoActual.set(minutoDelDia(new Date())), 60_000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}