import { Component, computed, inject, signal } from '@angular/core';
import { Almacen } from '../../servicios/almacen';
import {
  esCopiaValida,
  estadoCopia,
  formatoFechaCopia,
  nombreArchivoCopia,
} from '../../utilidades/copia';

interface Mensaje {
  texto: string;
  esError: boolean;
}

@Component({
  imports: [],
  selector: 'app-tus-datos',
  styleUrl: './tus-datos.css',
  templateUrl: './tus-datos.html',
})
export class TusDatos {
  private readonly almacen = inject(Almacen);
  private readonly ultima = signal(this.almacen.leer<string | null>('ultimaCopia', null));

  protected readonly estado = computed(() => estadoCopia(this.ultima(), new Date()));
  protected readonly mensaje = signal<Mensaje | null>(null);

  // Crea el archivo en el propio navegador y lo descarga: no se envía nada a internet.
  protected descargar(): void {
    const copia = this.almacen.exportar();
    const archivo = new Blob([JSON.stringify(copia, null, 2)], { type: 'application/json' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(archivo);
    enlace.download = nombreArchivoCopia(new Date());
    enlace.click();
    // Se libera un poco después para dar tiempo a que empiece la descarga.
    setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);

    this.almacen.guardar('ultimaCopia', copia.fecha);
    this.ultima.set(copia.fecha);
    this.mensaje.set({ texto: `Copia descargada: ${enlace.download}`, esError: false });
  }

  // Se ejecuta al elegir un archivo: comprueba que es una copia y, si se confirma, la restaura.
  protected async alElegirArchivo(evento: Event): Promise<void> {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = ''; // para que se pueda volver a elegir el mismo archivo
    if (!archivo) return;

    let copia: unknown = null;
    try {
      copia = JSON.parse(await archivo.text());
    } catch {
      // Un archivo que no es JSON se trata igual que una copia no válida.
    }

    if (!esCopiaValida(copia)) {
      this.mensaje.set({
        texto: 'Este archivo no es una copia del panel de vida. No se ha cambiado nada.',
        esError: true,
      });
      return;
    }

    const fecha = formatoFechaCopia.format(new Date(copia.fecha));
    if (!confirm(`Esto sustituirá lo que tienes ahora por la copia del ${fecha}. ¿Continuar?`)) {
      this.mensaje.set({ texto: 'Restauración cancelada. No se ha cambiado nada.', esError: false });
      return;
    }

    try {
      this.almacen.importar(copia);
    } catch {
      this.mensaje.set({
        texto: 'No se ha podido restaurar la copia. Tus datos siguen como estaban.',
        esError: true,
      });
      return;
    }
    // Recargar es lo más sencillo para que todos los componentes lean los datos nuevos.
    location.reload();
  }
}