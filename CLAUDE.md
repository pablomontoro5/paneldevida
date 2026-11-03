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
2. **Un cambio cada vez, en su propia rama.** Nunca se trabaja ni se fusiona directamente en `main`:
   - Se crea una rama desde `main` con nombre en español: `funcionalidad/...`, `arreglo/...`, `diseño/...` o `documentacion/...`.
   - Cuando funcione, se guarda con **commits de Git con mensaje en español**.
   - Se sube la rama a GitHub y se abre un **pull request** hacia `main` con una descripción en español (qué cambia y cómo se ha probado).
   - **El PR lo fusiono yo.** Después se actualiza `main` en local con `git pull`.
3. **Nada de librerías, frameworks ni servidores** salvo que lo pida expresamente.
4. **Todo en español de España**: textos, nombres en la interfaz y mensajes. Fechas en formato español (p. ej. `1 de noviembre de 2026`, `01/11/2026`) y euros en formato español (p. ej. `1.234,50 €`). Usar `Intl` con `es-ES`.
5. **Tiene que verse bien en el portátil y en el móvil** (diseño adaptable).
6. **Mis datos no salen del ordenador**: nada de enviar datos a servicios externos, analíticas ni peticiones a internet.

## Migración a Angular: sesiones

| Lección | Estado |
| --- | --- |
| 1. Crear el proyecto y arrancarlo | ✅ Hecha |
| 2. Idioma español y estilos globales | ✅ Hecha |
| 3. Modelos y datos de ejemplo | ✅ Hecha |
| 4. Utilidades de fechas y primeras pruebas | ✅ Hecha |
| 5. AlmacenService | ✅ Hecha |
| 6. Cabecera: saludo, fecha y tema | ✅ Hecha |
| 7. Agenda | ✅ Hecha |
| 8. Prioridades | ✅ Hecha |
| 9. Hábitos | ✅ Hecha |
| 10. Objetivos | ⬜ Sin empezar |
| 11. Tus datos (copia de seguridad) | ⬜ Sin empezar |
| 12. Quitar la versión vanilla, compilar y documentar | ⬜ Sin empezar |

Convenciones: cada componente en `src/app/componentes/<nombre>/` con sus estilos propios; la lógica sin Angular va en `src/app/utilidades/` con su `.spec.ts` al lado. Las pruebas no deben depender del día en que se ejecutan (pasar la fecha como parámetro).

**Pendiente tras la lección 12** (rama `arreglo/racha-con-fecha-fija`): `calcularRacha` ignora su parámetro `hoy` en el bucle (usa `haceDias`, que mira el reloj real); cambiarlo por `haceDiasDesde(desde + racha, hoy)` y fijar `ayer` en `fechas.spec.ts`. Hasta entonces esa prueba falla.

## Ideas para más adelante

- Conectar **Google Calendar** para la agenda del día.
- **Resumen semanal automático** cada domingo.
