# Panel de vida

## Qué es el proyecto

Un panel de vida personal: una sola página que abro por la mañana para ver de un vistazo cómo voy en todo:

- **Agenda del día**: lo que tengo hoy.
- **3 prioridades**: las tres cosas más importantes del día.
- **Hábitos con rachas**: marcar cada hábito y ver cuántos días seguidos llevo.
- **Objetivos del año**: progreso de cada objetivo.
- **Cuenta atrás de viajes**: días que faltan para cada viaje.

## Para quién es

Para mí, estudiante de Ingeniería Informática. Cada vez que hagas un cambio, explícamelo en **una frase** sencilla: qué has cambiado y por qué.

## Cómo está hecho

- **HTML, CSS y JavaScript normales** (vanilla). Sin instalar nada, sin compilar, sin `npm`.
- Se abre con **doble clic en `index.html`** (funciona desde `file://`, así que nada de módulos ES ni `fetch` a archivos locales; los scripts se cargan con `<script src="...">` normales).
- Estructura:
  - `index.html` — la página del panel.
  - `css/estilos.css` — todo el diseño, con **modo claro y oscuro**.
  - `js/datos.js` — los **datos de ejemplo** (agenda, prioridades, hábitos, objetivos, viajes).
  - `js/almacen.js` — guarda y lee en el navegador (**`localStorage`**) lo que marco en el panel.

## Reglas

1. **Antes de un cambio grande, primero el plan** y espera a que diga que sí.
2. **Un cambio cada vez.** Cuando funcione, se guarda con un **commit de Git con mensaje en español**.
3. **Nada de librerías, frameworks ni servidores** salvo que lo pida expresamente.
4. **Todo en español de España**: textos, nombres en la interfaz y mensajes. Fechas en formato español (p. ej. `1 de noviembre de 2026`, `01/11/2026`) y euros en formato español (p. ej. `1.234,50 €`). Usar `Intl` con `es-ES`.
5. **Tiene que verse bien en el portátil y en el móvil** (diseño adaptable).
6. **Mis datos no salen del ordenador**: nada de enviar datos a servicios externos, analíticas ni peticiones a internet.

## Ideas para más adelante

- Conectar **Google Calendar** para la agenda del día.
- **Resumen semanal automático** cada domingo.
