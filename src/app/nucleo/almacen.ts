import { Service } from '@angular/core';
import { ArchivoCopia } from './archivo-copia.modelo';

const PREFIJO = 'panelDeVida:';
// Claves que son de este navegador y no viajan en la copia (p. ej. cuándo se hizo la última).
const CLAVES_LOCALES = ['ultimaCopia'];

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

  // Todo lo que guarda el panel, listo para descargar como archivo .json.
  exportar(fecha: Date = new Date()): ArchivoCopia {
    const datos: Record<string, unknown> = {};
    try {
      for (const clave of this.clavesDeDatos()) {
        datos[clave] = JSON.parse(localStorage.getItem(PREFIJO + clave) ?? 'null');
      }
    } catch {
      // Si el almacenamiento está bloqueado, la copia sale vacía.
    }
    return { app: 'panel-de-vida', version: 1, fecha: fecha.toISOString(), datos };
  }

  // Sustituye todo lo guardado por el contenido de la copia.
  // Si algo falla a mitad (p. ej. no hay espacio), deja los datos como estaban y lanza el error.
  importar(copia: ArchivoCopia): void {
    const anteriores = this.exportar().datos;
    try {
      this.reemplazarDatos(copia.datos);
    } catch (error) {
      this.reemplazarDatos(anteriores);
      throw error;
    }
  }

  // Claves guardadas por el panel (sin el prefijo) que entran en la copia.
  private clavesDeDatos(): string[] {
    const claves: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      if (clave?.startsWith(PREFIJO)) {
        const sinPrefijo = clave.slice(PREFIJO.length);
        if (!CLAVES_LOCALES.includes(sinPrefijo)) claves.push(sinPrefijo);
      }
    }
    return claves;
  }

  private reemplazarDatos(datos: Record<string, unknown>): void {
    for (const clave of this.clavesDeDatos()) {
      localStorage.removeItem(PREFIJO + clave);
    }
    for (const [clave, valor] of Object.entries(datos)) {
      if (!CLAVES_LOCALES.includes(clave)) {
        localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
      }
    }
  }
}