// Guarda y lee en el navegador (localStorage) lo que se marca en el panel.
// Los datos nunca salen del ordenador.
var Almacen = (function () {
  "use strict";

  var PREFIJO = "panelDeVida:";

  // Devuelve el valor guardado o "porDefecto" si no hay nada (o si el navegador bloquea el almacenamiento).
  function leer(clave, porDefecto) {
    try {
      var texto = localStorage.getItem(PREFIJO + clave);
      return texto === null ? porDefecto : JSON.parse(texto);
    } catch (error) {
      return porDefecto;
    }
  }

  function guardar(clave, valor) {
    try {
      localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
    } catch (error) {
      // Sin almacenamiento el panel sigue funcionando, solo que no recuerda lo marcado.
    }
  }

  // ---------- Copia de seguridad ----------

  var APP = "panel-de-vida";
  var VERSION = 1;
  // Claves que son de este navegador y no viajan en la copia (p. ej. cuándo se hizo la última copia).
  var CLAVES_LOCALES = ["ultimaCopia"];

  // Claves guardadas por el panel (sin el prefijo) que entran en la copia.
  function clavesDeDatos() {
    var claves = [];
    for (var i = 0; i < localStorage.length; i++) {
      var clave = localStorage.key(i);
      if (clave && clave.indexOf(PREFIJO) === 0) {
        clave = clave.slice(PREFIJO.length);
        if (CLAVES_LOCALES.indexOf(clave) === -1) claves.push(clave);
      }
    }
    return claves;
  }

  // Todo lo que guarda el panel, listo para descargar como archivo .json.
  function exportar() {
    var datos = {};
    try {
      clavesDeDatos().forEach(function (clave) {
        datos[clave] = JSON.parse(localStorage.getItem(PREFIJO + clave));
      });
    } catch (error) {
      // Si el almacenamiento está bloqueado, la copia sale vacía.
    }
    return { app: APP, version: VERSION, fecha: new Date().toISOString(), datos: datos };
  }

  // Comprueba que un objeto leído de un archivo tiene la forma de una copia del panel.
  function esCopiaValida(copia) {
    return copia !== null && typeof copia === "object" &&
      copia.app === APP && copia.version === VERSION &&
      typeof copia.fecha === "string" && !isNaN(Date.parse(copia.fecha)) &&
      copia.datos !== null && typeof copia.datos === "object" && !Array.isArray(copia.datos);
  }

  function reemplazarDatos(datos) {
    clavesDeDatos().forEach(function (clave) {
      localStorage.removeItem(PREFIJO + clave);
    });
    Object.keys(datos).forEach(function (clave) {
      if (CLAVES_LOCALES.indexOf(clave) === -1) {
        localStorage.setItem(PREFIJO + clave, JSON.stringify(datos[clave]));
      }
    });
  }

  // Sustituye todo lo guardado por el contenido de una copia válida.
  // Si algo falla a mitad (p. ej. no hay espacio), deja los datos como estaban y lanza el error.
  function importar(copia) {
    var anteriores = exportar().datos;
    try {
      reemplazarDatos(copia.datos);
    } catch (error) {
      reemplazarDatos(anteriores);
      throw error;
    }
  }

  return {
    leer: leer,
    guardar: guardar,
    exportar: exportar,
    esCopiaValida: esCopiaValida,
    importar: importar
  };
})();
