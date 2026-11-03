import { Injectable, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

export const NOMBRE_APP = 'Panel de vida';

// El router llama a updateTitle() en cada navegación con el `title` de la ruta.
// Pone el título de la pestaña ("Hábitos · Panel de vida") y guarda el de la
// sección para que la cabecera lo muestre. En el inicio no hay título: null.
@Injectable({ providedIn: 'root' })
export class TituloPanel extends TitleStrategy {
  private readonly title = inject(Title);
  readonly seccion = signal<string | null>(null);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const titulo = this.buildTitle(snapshot) ?? null;
    this.seccion.set(titulo);
    this.title.setTitle(titulo ? `${titulo} · ${NOMBRE_APP}` : NOMBRE_APP);
  }
}
