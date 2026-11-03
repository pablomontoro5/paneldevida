import { Component, computed, effect, inject, signal } from '@angular/core';
import { Almacen } from '../almacen';
import { mayusculaInicial, saludoSegunHora } from '../../compartido/fechas';

type Tema = 'claro' | 'oscuro';
const formatoFecha = new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' });

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.html',
  styleUrl: './cabecera.css',
})

export class Cabecera {
  private readonly almacen = inject(Almacen);
  private readonly ahora = new Date();
  protected readonly saludo = saludoSegunHora(this.ahora.getHours());
  protected readonly fecha = mayusculaInicial(formatoFecha.format(this.ahora));

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
