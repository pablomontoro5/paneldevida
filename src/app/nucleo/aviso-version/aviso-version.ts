import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';

/**
 * Avisa cuando hay una versión nueva del panel.
 * El service worker sirve la versión guardada en caché; cuando descarga una nueva,
 * no la usa hasta recargar. Sin este aviso, el iPhone seguiría con la vieja.
 */
@Component({
  selector: 'app-aviso-version',
  templateUrl: './aviso-version.html',
  styleUrl: './aviso-version.css',
})
export class AvisoVersion {
  private readonly sw = inject(SwUpdate);
  protected readonly hayVersionNueva = signal(false);

  constructor() {
    if (!this.sw.isEnabled) return; // con `ng serve` no hay service worker

    const destruir = inject(DestroyRef);
    this.sw.versionUpdates.pipe(takeUntilDestroyed(destruir)).subscribe((evento) => {
      if (evento.type === 'VERSION_READY') this.hayVersionNueva.set(true);
    });

    // Si la caché se ha quedado rota (p. ej. el navegador borró parte), solo arregla recargar.
    this.sw.unrecoverable.pipe(takeUntilDestroyed(destruir)).subscribe(() => this.recargar());
  }

  protected recargar(): void {
    document.location.reload();
  }

  protected cerrar(): void {
    this.hayVersionNueva.set(false);
  }
}
