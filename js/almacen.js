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

  return { leer: leer, guardar: guardar };
})();
