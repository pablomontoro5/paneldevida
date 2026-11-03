import { Signal, signal } from '@angular/core';
import { Almacen } from './almacen';
import { ConId, guardarEnLista, quitarDeLista } from '../compartido/lista';

// Una lista que se puede editar y que se guarda sola en localStorage.
// La primera vez que se abre el panel no hay nada guardado: se usan los datos de ejemplo
// y se guardan, así a partir de ahí todo sale de localStorage (y entra en la copia de seguridad).
export class Coleccion<T extends ConId> {
  private readonly lista = signal<T[]>([]);
  readonly elementos: Signal<T[]> = this.lista.asReadonly();

  constructor(
    private readonly almacen: Almacen,
    private readonly clave: string,
    ejemplo: () => T[],
  ) {
    const guardada = almacen.leer<T[] | null>(clave, null);
    if (Array.isArray(guardada)) {
      this.lista.set(guardada);
    } else {
      this.cambiar(ejemplo());
    }
  }

  // Crea o edita, según si el id ya existe.
  guardar(elemento: T): void {
    this.cambiar(guardarEnLista(this.lista(), elemento));
  }

  borrar(id: string): void {
    this.cambiar(quitarDeLista(this.lista(), id));
  }

  private cambiar(nueva: T[]): void {
    this.lista.set(nueva);
    this.almacen.guardar(this.clave, nueva);
  }
}
