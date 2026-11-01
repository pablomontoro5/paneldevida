// Lógica del panel: dibuja cada sección y responde a los clics.
(function () {
  "use strict";

  var formatoFecha = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  var formatoDiaLargo = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" });
  var formatoInicialDia = new Intl.DateTimeFormat("es-ES", { weekday: "narrow" });
  var formatoFechaCopia = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" });
  var formatoPorcentaje =new Intl.NumberFormat("es-ES", { style: "percent", maximumFractionDigits: 0 });

  // ---------- Utilidades ----------

  // Fecha local en formato AAAA-MM-DD (toISOString usaría UTC y podría dar el día anterior).
  function claveFecha(fecha) {
    var mes = String(fecha.getMonth() + 1).padStart(2, "0");
    var dia = String(fecha.getDate()).padStart(2, "0");
    return fecha.getFullYear() + "-" + mes + "-" + dia;
  }

  function haceDias(n) {
    var fecha = new Date();
    fecha.setDate(fecha.getDate() - n);
    return fecha;
  }

  function aMinutos(hora) {
    var partes = hora.split(":");
    return Number(partes[0]) * 60 + Number(partes[1]);
  }

  function mayusculaInicial(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  function crear(etiqueta, clase, texto) {
    var elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
  }

  // ---------- Tema claro / oscuro ----------

  function temaActual() {
    var elegido = document.documentElement.dataset.tema;
    if (elegido) return elegido;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro";
  }

  function pintarBotonTema() {
    var boton = document.getElementById("boton-tema");
    boton.textContent = temaActual() === "oscuro" ? "☀️ Modo claro" : "🌙 Modo oscuro";
  }

  function iniciarTema() {
    var guardado = Almacen.leer("tema", null);
    if (guardado) document.documentElement.dataset.tema = guardado;
    pintarBotonTema();

    document.getElementById("boton-tema").addEventListener("click", function () {
      var nuevo = temaActual() === "oscuro" ? "claro" : "oscuro";
      document.documentElement.dataset.tema = nuevo;
      Almacen.guardar("tema", nuevo);
      pintarBotonTema();
    });

    // Si no se ha elegido tema a mano, el texto del botón sigue al sistema.
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", pintarBotonTema);
  }

  // ---------- Saludo ----------

  function pintarSaludo() {
    var ahora = new Date();
    var hora = ahora.getHours();
    var saludo = "Buenas noches";
    if (hora >= 6 && hora < 14) saludo = "Buenos días";
    else if (hora >= 14 && hora < 21) saludo = "Buenas tardes";

    document.getElementById("saludo").textContent = saludo;
    document.getElementById("fecha").textContent = mayusculaInicial(formatoFecha.format(ahora));
  }

  // ---------- Agenda ----------

  function pintarAgenda() {
    var lista = document.getElementById("agenda");
    var ahora = new Date();
    var minutoActual = ahora.getHours() * 60 + ahora.getMinutes();
    var eventos = DATOS.agenda.slice().sort(function (a, b) {
      return aMinutos(a.inicio) - aMinutos(b.inicio);
    });
    var destacadoPuesto = false;

    lista.replaceChildren();

    if (eventos.length === 0) {
      lista.append(crear("li", "vacio", "No tienes nada en la agenda hoy."));
      return;
    }

    eventos.forEach(function (evento) {
      var elemento = crear("li", "evento");
      var estado = "";

      if (aMinutos(evento.fin) <= minutoActual) {
        elemento.classList.add("evento-pasado");
      } else if (aMinutos(evento.inicio) <= minutoActual) {
        elemento.classList.add("evento-actual");
        estado = "Ahora";
        destacadoPuesto = true;
      } else if (!destacadoPuesto) {
        elemento.classList.add("evento-siguiente");
        estado = "Siguiente";
        destacadoPuesto = true;
      }

      var cuerpo = crear("div", "evento-cuerpo");
      cuerpo.append(crear("span", "evento-titulo", evento.titulo));
      if (evento.lugar) cuerpo.append(crear("span", "evento-lugar", evento.lugar));

      elemento.append(crear("span", "evento-hora", evento.inicio + "–" + evento.fin), cuerpo);
      if (estado) elemento.append(crear("span", "etiqueta", estado));
      lista.append(elemento);
    });
  }

  // ---------- Prioridades ----------

  // Se guardan por día, así cada mañana empiezan sin marcar.
  function clavePrioridades() {
    return "prioridades:" + claveFecha(new Date());
  }

  function pintarContadorPrioridades() {
    var hechas = Almacen.leer(clavePrioridades(), []).length;
    document.getElementById("contador-prioridades").textContent =
      hechas + " de " + DATOS.prioridades.length + " hechas";
  }

  function pintarPrioridades() {
    var lista = document.getElementById("prioridades");
    var hechas = Almacen.leer(clavePrioridades(), []);

    lista.replaceChildren();

    DATOS.prioridades.forEach(function (prioridad, indice) {
      var elemento = crear("li", "prioridad");
      var etiqueta = crear("label", "prioridad-etiqueta");
      var casilla = document.createElement("input");

      casilla.type = "checkbox";
      casilla.checked = hechas.indexOf(prioridad.id) !== -1;
      elemento.classList.toggle("hecha", casilla.checked);

      casilla.addEventListener("change", function () {
        var clave = clavePrioridades();
        var actuales = Almacen.leer(clave, []).filter(function (id) { return id !== prioridad.id; });
        if (casilla.checked) actuales.push(prioridad.id);
        Almacen.guardar(clave, actuales);
        elemento.classList.toggle("hecha", casilla.checked);
        pintarContadorPrioridades();
      });

      etiqueta.append(
        casilla,
        crear("span", "prioridad-numero", String(indice + 1)),
        crear("span", "prioridad-texto", prioridad.texto)
      );
      elemento.append(etiqueta);
      lista.append(elemento);
    });

    pintarContadorPrioridades();
  }

  // ---------- Hábitos ----------

  // Registro: { idHabito: ["AAAA-MM-DD", ...] } con los días en que se cumplió.
  function leerHabitos() {
    var registro = Almacen.leer("habitos", null);

    // La primera vez se rellena con el historial de ejemplo.
    if (registro === null) {
      registro = {};
      DATOS.habitos.forEach(function (habito) {
        registro[habito.id] = habito.historialEjemplo.map(function (n) { return claveFecha(haceDias(n)); });
      });
      Almacen.guardar("habitos", registro);
    }

    DATOS.habitos.forEach(function (habito) {
      if (!registro[habito.id]) registro[habito.id] = [];
    });
    return registro;
  }

  // Días seguidos cumplidos. Si hoy aún no está marcado se cuenta desde ayer,
  // para que la racha no aparezca a 0 por la mañana.
  function calcularRacha(fechas) {
    var cumplidos = new Set(fechas);
    var desde = cumplidos.has(claveFecha(new Date())) ? 0 : 1;
    var racha = 0;
    while (cumplidos.has(claveFecha(haceDias(desde + racha)))) racha++;
    return racha;
  }

  function textoRacha(racha) {
    if (racha === 0) return "Sin racha";
    return racha === 1 ? "1 día seguido" : racha + " días seguidos";
  }

  function pintarHabitos(idConFoco) {
    var lista = document.getElementById("habitos");
    var registro = leerHabitos();
    var hoy = claveFecha(new Date());

    lista.replaceChildren();

    DATOS.habitos.forEach(function (habito) {
      var fechas = registro[habito.id];
      var hechoHoy = fechas.indexOf(hoy) !== -1;
      var racha = calcularRacha(fechas);
      var elemento = crear("li", "habito");

      // Nombre y racha
      var info = crear("div", "habito-info");
      info.append(crear("div", "habito-nombre", habito.icono + " " + habito.nombre));
      var lineaRacha = crear("div", "habito-racha");
      if (racha > 0) lineaRacha.append(crear("strong", "", "🔥 "));
      lineaRacha.append(textoRacha(racha));
      info.append(lineaRacha);

      // Últimos 7 días (de hace 6 días a hoy)
      var semana = crear("div", "semana");
      var cumplidosSemana = 0;
      for (var n = 6; n >= 0; n--) {
        var fecha = haceDias(n);
        var cumplido = fechas.indexOf(claveFecha(fecha)) !== -1;
        var dia = crear("span", "dia", formatoInicialDia.format(fecha));
        if (cumplido) {
          dia.classList.add("cumplido");
          cumplidosSemana++;
        }
        if (n === 0) dia.classList.add("hoy");
        dia.title = mayusculaInicial(formatoDiaLargo.format(fecha)) + (cumplido ? ": cumplido" : ": sin cumplir");
        dia.setAttribute("aria-hidden", "true");
        semana.append(dia);
      }
      semana.setAttribute("role", "img");
      semana.setAttribute("aria-label", "Últimos 7 días: " + cumplidosSemana + " cumplidos");

      // Botón para marcar hoy
      var boton = crear("button", "boton-habito", hechoHoy ? "✓ Hecho hoy" : "Marcar hoy");
      boton.type = "button";
      boton.dataset.habito = habito.id;
      boton.setAttribute("aria-pressed", String(hechoHoy));
      boton.setAttribute("aria-label", habito.nombre + ": hecho hoy");
      boton.addEventListener("click", function () {
        var actual = leerHabitos();
        var dias = actual[habito.id].filter(function (f) { return f !== hoy; });
        if (!hechoHoy) dias.push(hoy);
        actual[habito.id] = dias;
        Almacen.guardar("habitos", actual);
        pintarHabitos(habito.id);
      });

      elemento.append(info, semana, boton);
      lista.append(elemento);
    });

    // Al redibujar, el foco vuelve al botón pulsado (útil con teclado).
    if (idConFoco) {
      var botonPulsado = lista.querySelector('[data-habito="' + idConFoco + '"]');
      if (botonPulsado) botonPulsado.focus();
    }
  }

  // ---------- Objetivos del año ----------

  // Una cantidad de un objetivo, en euros o como número normal.
  // useGrouping "always" hace que 1284 salga como 1.284 (por defecto es-ES no agrupa números de 4 cifras).
  function formatoCantidad(objetivo, valor) {
    var decimales = Number.isInteger(valor) ? 0 : 2;
    var opciones = { minimumFractionDigits: decimales, maximumFractionDigits: decimales, useGrouping: "always" };
    if (objetivo.formato === "euros") {
      opciones.style = "currency";
      opciones.currency = "EUR";
    }
    return new Intl.NumberFormat("es-ES", opciones).format(valor);
  }

  function textoProgreso(objetivo, valor) {
    var texto = formatoCantidad(objetivo, valor) + " de " + formatoCantidad(objetivo, objetivo.meta);
    return objetivo.unidad ? texto + " " + objetivo.unidad : texto;
  }

  // Parte del año que ya ha pasado contando hoy, de 0 a 1 (el 1 de noviembre de 2026 son 305 de 365 días).
  // Math.round evita que los cambios de hora de verano descuadren la cuenta de días.
  function fraccionDelAnio(fecha) {
    var inicio = new Date(fecha.getFullYear(), 0, 1);
    var hoy = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    var diasDelAnio = Math.round((new Date(fecha.getFullYear() + 1, 0, 1) - inicio) / 86400000);
    var diaDelAnio = Math.round((hoy - inicio) / 86400000) + 1;
    return diaDelAnio / diasDelAnio;
  }

  // Se guardan por año, así el 1 de enero empiezan de nuevo sin perder los del año anterior.
  function claveObjetivos() {
    return "objetivos:" + new Date().getFullYear();
  }

  function cambiarObjetivo(objetivo, signo) {
    var clave = claveObjetivos();
    var progreso = Almacen.leer(clave, {});
    var valor = progreso[objetivo.id] !== undefined ? progreso[objetivo.id] : objetivo.actual;
    // Redondeo a 2 decimales para que pasos como 0,1 no acumulen errores de coma flotante.
    progreso[objetivo.id] = Math.max(0, Math.round((valor + signo * objetivo.paso) * 100) / 100);
    Almacen.guardar(clave, progreso);
  }

  function crearBotonObjetivo(objetivo, signo) {
    var simbolo = signo > 0 ? "+" : "−";
    var boton = crear("button", "boton-objetivo", simbolo);
    boton.type = "button";
    boton.dataset.objetivo = objetivo.id + (signo > 0 ? "+" : "-");
    boton.setAttribute("aria-label",
      (signo > 0 ? "Sumar " : "Restar ") + formatoCantidad(objetivo, objetivo.paso) + " a " + objetivo.nombre);
    boton.addEventListener("click", function () {
      cambiarObjetivo(objetivo, signo);
      pintarObjetivos(boton.dataset.objetivo);
    });
    return boton;
  }

  function pintarObjetivos(botonConFoco) {
    var lista = document.getElementById("objetivos");
    var progreso = Almacen.leer(claveObjetivos(), {});
    var ritmo = fraccionDelAnio(new Date());

    document.getElementById("titulo-objetivos").textContent = "Objetivos " + new Date().getFullYear();
    document.getElementById("progreso-anio").textContent = "Llevas el " + formatoPorcentaje.format(ritmo) + " del año";
    lista.replaceChildren();

    DATOS.objetivos.forEach(function (objetivo) {
      var valor = progreso[objetivo.id] !== undefined ? progreso[objetivo.id] : objetivo.actual;
      var fraccion = valor / objetivo.meta;
      var elemento = crear("li", "objetivo");

      // Comparado con lo que ya ha pasado del año: si llevas el 84 % del año, deberías ir por el 84 %.
      var estado = crear("span", "etiqueta");
      if (fraccion >= 1) {
        elemento.classList.add("conseguido");
        estado.classList.add("etiqueta-conseguido");
        estado.textContent = "¡Conseguido!";
      } else if (fraccion >= ritmo) {
        estado.classList.add("etiqueta-al-dia");
        estado.textContent = "Vas al día";
      } else {
        estado.classList.add("etiqueta-detras");
        estado.textContent = "Vas por detrás";
      }

      var datosDerecha = crear("div", "objetivo-estado");
      datosDerecha.append(estado, crear("span", "objetivo-porcentaje", formatoPorcentaje.format(fraccion)));

      var cabecera = crear("div", "objetivo-cabecera");
      cabecera.append(crear("span", "objetivo-nombre", objetivo.icono + " " + objetivo.nombre), datosDerecha);

      // La barra se queda llena aunque se pase de la meta.
      var barra = crear("div", "barra");
      barra.setAttribute("role", "progressbar");
      barra.setAttribute("aria-label", objetivo.nombre);
      barra.setAttribute("aria-valuemin", "0");
      barra.setAttribute("aria-valuemax", String(objetivo.meta));
      barra.setAttribute("aria-valuenow", String(valor));
      barra.setAttribute("aria-valuetext", textoProgreso(objetivo, valor));
      var relleno = crear("div", "barra-relleno");
      relleno.style.width = Math.min(fraccion, 1) * 100 + "%";
      var marca = crear("div", "barra-marca");
      marca.style.left = ritmo * 100 + "%";
      marca.title = "Donde deberías ir hoy: " + formatoPorcentaje.format(ritmo);
      barra.append(relleno, marca);

      var pie = crear("div", "objetivo-pie");
      var controles = crear("div", "objetivo-controles");
      var botonRestar = crearBotonObjetivo(objetivo, -1);
      botonRestar.disabled = valor <= 0;
      controles.append(botonRestar, crearBotonObjetivo(objetivo, 1));
      pie.append(crear("span", "objetivo-progreso", textoProgreso(objetivo, valor)), controles);

      elemento.append(cabecera, barra, pie);
      lista.append(elemento);
    });

    // Al redibujar, el foco vuelve al botón pulsado (útil con teclado).
    if (botonConFoco) {
      var boton = lista.querySelector('[data-objetivo="' + botonConFoco + '"]');
      if (boton && !boton.disabled) boton.focus();
    }
  }

  // ---------- Copia de seguridad ----------

  function mostrarMensajeCopia(texto, esError) {
    var mensaje = document.getElementById("mensaje-copia");
    mensaje.textContent = texto;
    mensaje.classList.toggle("error", Boolean(esError));
  }

  // Crea el archivo en el propio navegador y lo descarga: no se envía nada a internet.
  function descargarCopia() {
    var copia = Almacen.exportar();
    var archivo = new Blob([JSON.stringify(copia, null, 2)], { type: "application/json" });
    var enlace = document.createElement("a");

    enlace.href = URL.createObjectURL(archivo);
    enlace.download = "panel-de-vida-copia-" + claveFecha(new Date()) + ".json";
    document.body.append(enlace);
    enlace.click();
    enlace.remove();
    // Se libera un poco después para dar tiempo a que empiece la descarga.
    setTimeout(function () { URL.revokeObjectURL(enlace.href); }, 1000);

    Almacen.guardar("ultimaCopia", copia.fecha);
    mostrarMensajeCopia("Copia descargada: " + enlace.download);
  }

  // Lee el archivo elegido, comprueba que es una copia y, si se confirma, sustituye los datos.
  function restaurarCopia(archivo) {
    var lector = new FileReader();

    lector.onload = function () {
      var copia = null;
      try {
        copia = JSON.parse(lector.result);
      } catch (error) {
        // Un archivo que no es JSON se trata igual que una copia no válida.
      }

      if (!Almacen.esCopiaValida(copia)) {
        mostrarMensajeCopia("Este archivo no es una copia del panel de vida. No se ha cambiado nada.", true);
        return;
      }

      var fecha = formatoFechaCopia.format(new Date(copia.fecha));
      if (!window.confirm("Esto sustituirá lo que tienes ahora por la copia del " + fecha + ". ¿Continuar?")) {
        mostrarMensajeCopia("Restauración cancelada. No se ha cambiado nada.");
        return;
      }

      try {
        Almacen.importar(copia);
      } catch (error) {
        mostrarMensajeCopia("No se ha podido restaurar la copia. Tus datos siguen como estaban.", true);
        return;
      }
      // Recargar es lo más sencillo para que todo (tema incluido) se pinte con los datos nuevos.
      window.location.reload();
    };

    lector.onerror = function () {
      mostrarMensajeCopia("No se ha podido leer el archivo.", true);
    };

    lector.readAsText(archivo);
  }

  function iniciarCopia() {
    var selector = document.getElementById("archivo-copia");

    document.getElementById("boton-descargar").addEventListener("click", descargarCopia);
    document.getElementById("boton-restaurar").addEventListener("click", function () {
      selector.click();
    });
    selector.addEventListener("change", function () {
      if (selector.files.length > 0) restaurarCopia(selector.files[0]);
      // Se vacía para que elegir otra vez el mismo archivo vuelva a funcionar.
      selector.value = "";
    });
  }

  // ---------- Arranque ----------

  var diaPintado = claveFecha(new Date());

  iniciarTema();
  pintarSaludo();
  pintarAgenda();
  pintarPrioridades();
  pintarHabitos();
  pintarObjetivos();
  iniciarCopia();

  // Cada minuto se actualizan saludo y agenda; si cambia el día, todo.
  setInterval(function () {
    pintarSaludo();
    pintarAgenda();
    var hoy = claveFecha(new Date());
    if (hoy !== diaPintado) {
      diaPintado = hoy;
      pintarPrioridades();
      pintarHabitos();
      pintarObjetivos();
    }
  }, 60 * 1000);
})();
