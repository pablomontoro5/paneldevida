import { Service } from '@angular/core';

const PREFIJO = 'panelDeVida:';
@Service()
export class Almacen {
  //Devuelve el valor guardado o "porDefecto" si no hay nada
  // si el JSON está roto o si el navegador bloquea el almacenamiento.

  leer<T>(clave: string, porDefecto: T): T {
    try {
      const texto = localStorage.getItem(PREFIJO + clave);
      return texto === null ? porDefecto : (JSON.parse(texto) as T);
    } catch {
      return porDefecto;
    }
  }

  //Guarda el valor en el almacenamiento local
  guardar<T>(clave: string, valor: T): void {
    try {
      const texto = JSON.stringify(valor);
      localStorage.setItem(PREFIJO + clave, texto);
    } catch {
      //Si falla no hacemos nada
    }
  }
}
