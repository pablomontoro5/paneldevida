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

- **Angular 22 con TypeScript**: componentes standalone, signals y pruebas con Vitest. La versión vanilla anterior está en la etiqueta `v1-vanilla`.
- Se arranca con `npm start` (en mi PowerShell, `npm.cmd`/`npx.cmd`) y se abre en `http://localhost:4200/`. Pruebas: `npm test -- --watch=false`. Compilar: `npm run build` (sale en `dist/paneldevida/browser/`).
- La demo se publica sola en GitHub Pages con `.github/workflows/publicar.yml`, que compila con `--base-href /paneldevida/`.
- Estructura (dentro de `src/app/`):
  - `app.ts` / `app.html` — el marco: cabecera, menú lateral (portátil), barra inferior (móvil) y `<router-outlet>`.
  - `app.routes.ts` — una ruta por sección (`''` es el Inicio); los datos de ejemplo llegan a los `input()` por `data` con `withComponentInputBinding()`. En Pages, `publicar.yml` copia `index.html` a `404.html` para que recargar una ruta no dé 404.
  - `datos.ts` — los **datos de ejemplo** (en las secciones ya editables, Viajes y Agenda, solo se usan la primera vez: luego manda lo guardado en `localStorage`) (agenda, prioridades, hábitos, objetivos); `datos.modelo.ts`, el tipo que los agrupa.
  - **PWA**: `ngsw-config.json` (qué guarda en caché el service worker, registrado en `app.config.ts` solo fuera de `ng serve`), `public/manifest.webmanifest` y `public/icons/` (el de 180 px es el `apple-touch-icon` del iPhone). Para probar sin conexión hay que servir `dist/` compilado.
  - `nucleo/` — lo que usa toda la app: `almacen.ts` (guarda y lee en **`localStorage`**, prefijo `panelDeVida:`, y exporta/importa la copia), `archivo-copia.modelo.ts`, `titulo.ts` (un `TitleStrategy` que pone el título de la pestaña y da a la `cabecera/` el nombre de la sección) la `cabecera/` y `aviso-version/` (avisa con `SwUpdate` de que hay una versión nueva y ofrece recargar).
  - `secciones/inicio/` — la bienvenida (saludo según la hora) y el resumen del día. Es la única sección que importa de las demás, porque las reúne.
  - `compartido/` — utilidades genéricas sin dependencias (`fechas.ts`, `lista.ts`).
  - Secciones editables: un `<nombre>.guardados.ts` (servicio que extiende `Coleccion` de `nucleo/coleccion.ts`, con su clave de `localStorage`) y un `<nombre>.plantillas.ts` con las ideas que rellenan el formulario. La sección y el Inicio leen del mismo servicio, así que esa sección ya no recibe `data` por la ruta. Los botones de borrar llevan siempre la clase global `boton-borrar` (recalcados en rojo) y piden confirmación (la de confirmar, `boton-peligro`).
  - `secciones/<nombre>/` — una carpeta por sección con su componente (`.ts`, `.html`, `.css`, `.spec.ts`), su `<nombre>.modelo.ts` y su `<nombre>.logica.ts` con su `.spec.ts`.
  - `src/styles.css` tiene los estilos globales con **modo claro y oscuro**.
  - Dependencias: `secciones/` importa de `nucleo/` y `compartido/`; `nucleo/` solo de `compartido/`; `compartido/` de nada.

## Reglas

1. **Antes de un cambio grande, primero el plan** y espera a que diga que sí.
2. **Un cambio cada vez, en su propia rama.** Nunca se trabaja ni se fusiona directamente en `main`:
   - Se crea una rama desde `main` con nombre en español: `funcionalidad/...`, `arreglo/...`, `diseño/...` o `documentacion/...`.
   - Cuando funcione, se guarda con **commits de Git con mensaje en español**.
   - Se sube la rama a GitHub y se abre un **pull request** hacia `main` con una descripción en español (qué cambia y cómo se ha probado).
   - **El PR lo fusiono yo.** Después se actualiza `main` en local con `git pull`.
3. **Nada de librerías nuevas aparte de Angular** salvo que lo pida expresamente.
4. **Todo en español de España**: textos, nombres en la interfaz y mensajes. Fechas en formato español (p. ej. `1 de noviembre de 2026`, `01/11/2026`) y euros en formato español (p. ej. `1.234,50 €`). Usar `Intl` con `es-ES`.
5. **Tiene que verse bien en el portátil y en el móvil** (diseño adaptable).
6. **Mis datos no salen del ordenador**: nada de enviar datos a servicios externos, analíticas ni peticiones a internet.

## Migración a Angular

✅ **Hecha** en 12 lecciones: proyecto, idioma y estilos, modelos, utilidades, almacén, cabecera, agenda, prioridades, hábitos, objetivos, copia de seguridad y quitar la versión vanilla.

Convenciones: cada sección en `src/app/secciones/<nombre>/` con su componente y estilos propios; la lógica sin Angular va en `<nombre>.logica.ts` con su `.spec.ts` al lado (la genérica, en `compartido/`). Las pruebas no deben depender del día en que se ejecutan (pasar la fecha como parámetro).
## Ideas para más adelante

- Conectar **Google Calendar** para la agenda del día.
- **Resumen semanal automático** cada domingo.

## Próximas tareas (de más fácil a más difícil)

Cada una se hace en su propia conversación, rama y pull request.

| # | Tarea | Dificultad | Qué implica | Estado |
| --- | --- | --- | --- | --- |
| 1 | Cumplir los community standards de GitHub | ⭐ | Solo documentos: `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md` y plantillas de issues y PR en `.github/`. Licencia elegida: MIT. Seguridad por aviso privado de GitHub. | ✅ Hecha |
| 2 | Reorganizar las carpetas | ⭐⭐ | Mover archivos a una estructura más clara (p. ej. `nucleo/`, `secciones/<nombre>/`, `compartido/`) y arreglar los `import`; las pruebas avisan si algo se rompe. Antes de añadir secciones nuevas. | ✅ Hecha |
| 3 | Cuenta atrás de viajes | ⭐⭐ | Sección nueva con el mismo patrón que Objetivos: modelo, datos de ejemplo, utilidad de días que faltan con su `.spec.ts` y componente. | ✅ Hecha |
| 4 | Panel de navegación entre secciones | ⭐⭐⭐ | Pasar de anclas (`#agenda`) a **Angular Router**: una ruta por sección, menú lateral en el portátil y barra inferior en el móvil. Ojo: en GitHub Pages, recargar una ruta da 404 (se arregla con `404.html` o `withHashLocation()`). Antes de Planes. | ✅ Hecha |
| 5 | App sin conexión en el iPhone (PWA) | ⭐⭐⭐ | `ng add @angular/pwa` (paquete oficial de Angular). Lo difícil es probar la caché, el `base-href` y el icono en el móvil. Después del router. | ✅ Hecha |
| 6 | Añadir, editar y borrar agenda, prioridades, hábitos, objetivos y viajes | ⭐⭐⭐⭐ | Formularios (crear, editar, borrar), pasar los datos de `datos.ts` a `localStorage` y migrar lo guardado sin perder el historial. **Plantillas de ideas** en un `<nombre>.plantillas.ts` por sección (p. ej. 📚 Leer 20 minutos, ahorrar X €, 🏖️ playa) que rellenan el formulario, además de crear desde cero. Una conversación por sección. Piezas comunes ya hechas: `compartido/lista.ts` y `nucleo/coleccion.ts` (lista editable que se guarda sola y empieza con los datos de ejemplo); Viajes y Agenda son el modelo a copiar; los estilos del formulario (`.formulario`, `.campo`, `.campos-fila`, `.plantilla`…) ya están en `styles.css`. Orden: viajes → agenda → prioridades → objetivos → hábitos (el último, por el historial). | En curso (2/5: ✅ viajes, ✅ agenda) |
| 7 | Sección de planes con recordatorios | ⭐⭐⭐⭐ | Formularios y guardado como en la 6, más fechas y horas, la API de `Notification` y temporizadores. Sin servidor, el aviso solo salta con la página abierta. | Pendiente |
| 8 | Mejorar el README | ⭐ (al final) | En cada PR se actualiza lo justo; aquí, repaso final con capturas, un GIF de la demo y la arquitectura. | Pendiente |
| 9 | Resumen semanal cada domingo | ⭐⭐⭐⭐ | Necesita historial de hábitos, objetivos y planes. Sin servidor, se genera al abrir el panel el domingo (o el primer día después). | Pendiente |
| 10 | Conectar Google Calendar | ⭐⭐⭐⭐⭐ | OAuth, API de Google y tokens. **Choca con la regla 6**: hay que decidir si se hace una excepción o se descarta. Alternativa sin internet: importar un `.ics`. | Pendiente |
| 11 | Perfiles locales (un usuario por persona) | ⭐⭐⭐⭐ | Elegir perfil al abrir el panel (como en Netflix); cada uno con su agenda, hábitos, objetivos y viajes en `localStorage` con su prefijo (`panelDeVida:<perfil>:…`). Sin servidor para cumplir la regla 6: los perfiles viven en el dispositivo y se pasan a otro con la copia de seguridad. Un PIN sería solo cortesía, no seguridad. Los datos de ejemplo quedan como perfil «Demo». Después de la 6. | Pendiente |

Orden recomendado (el README como repaso final): 1 → 2 → 3 → 4 → 5 → 6 → 11 → 7 → 9 → 8 → 10.
