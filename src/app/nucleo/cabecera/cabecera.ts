import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Almacen } from '../almacen';
import { TituloPanel } from '../titulo';

type Tema = 'claro' | 'oscuro';

@Component({
  selector: 'app-cabecera',
  imports: [RouterLink],
  templateUrl: './cabecera.html',
  styleUrl: './cabecera.css',
})

export class Cabecera {
  private readonly almacen = inject(Almacen);
  protected readonly seccion = inject(TituloPanel).seccion;

  private readonly sistemaOscuro = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  protected readonly elegido = signal(this.almacen.leer<Tema | null>('tema', null));
  protected readonly tema = computed(() => this.elegido() ?? (this.sistemaOscuro ? 'oscuro' : 'claro'));
  protected readonly textoBoton = computed(() =>
    this.tema() === 'oscuro' ? '☀️ Modo claro' : '🌙 Modo oscuro');

  constructor() {
    effect(() => {
      const t = this.elegido();
      if (t) {
        document.documentElement.dataset['tema'] = t;
        this.almacen.guardar('tema', t);
      }
    });
  }

  protected cambiarTema(): void {
    this.elegido.set(this.tema() === 'oscuro' ? 'claro' : 'oscuro');
  }
}
