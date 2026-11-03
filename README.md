# Panel de vida

Un panel personal que abro cada mañana para ver de un vistazo cómo voy en todo: lo que tengo hoy, mis tres prioridades, mis hábitos, mis objetivos del año y cuánto falta para mis viajes.

Está hecho con **Angular 22** y **TypeScript**: componentes standalone, signals y pruebas con Vitest. Empezó como una página en HTML, CSS y JavaScript normales y lo he migrado a Angular paso a paso para aprenderlo. La versión original sigue guardada en la etiqueta [`v1-vanilla`](https://github.com/pablomontoro5/paneldevida/tree/v1-vanilla).

**🔗 Demo:** [pablomontoro5.github.io/paneldevida](https://pablomontoro5.github.io/paneldevida/), con los datos de ejemplo. Lo que marques ahí se guarda solo en tu navegador.

> **Estado:** en desarrollo. Ya funcionan el saludo, la agenda, las prioridades, los hábitos, los objetivos del año, la cuenta atrás de viajes, la copia de seguridad y la app sin conexión en el móvil (lo siguiente, en la [Hoja de ruta](#hoja-de-ruta)).

---

## Índice

- [Qué hace](#qué-hace)
- [Cómo usarlo](#cómo-usarlo)
- [Personalizar los datos](#personalizar-los-datos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo funciona por dentro](#cómo-funciona-por-dentro)
- [Privacidad](#privacidad)
- [Reglas del proyecto](#reglas-del-proyecto)
- [Publicación en GitHub Pages](#publicación-en-github-pages)
- [Flujo de trabajo con Git](#flujo-de-trabajo-con-git)
- [Hoja de ruta](#hoja-de-ruta)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## Qué hace

| Sección | Qué muestra |
|---|---|
| **Inicio** | La bienvenida: «Buenos días», «Buenas tardes» o «Buenas noches» según la hora, la fecha completa en español (p. ej. *Domingo, 1 de noviembre de 2026*) y una frase con lo que te queda del día. Debajo, un resumen de cada sección que enlaza a ella: el evento en curso o el siguiente, las prioridades hechas, la mejor racha, los objetivos al día y el próximo viaje. |
| **Agenda de hoy** | Los eventos del día ordenados por hora. Los que ya han pasado salen atenuados y el que está en curso (**Ahora**) o el próximo (**Siguiente**) salen resaltados. Se actualiza sola cada minuto. Con **＋ Añadir evento** se crean nuevos (desde cero o con una idea: 📚 Estudiar, 🎓 Clase, 🏋️ Gimnasio…; si no pones la hora de fin, dura una hora), y cada evento tiene **Editar** y **Borrar** (con confirmación). Se guardan en este navegador. |
| **Prioridades** | Las tres cosas más importantes del día, con una casilla para marcarlas como hechas y un contador («2 de 3 hechas»). Cada día empiezan sin marcar. Con **＋ Añadir prioridad** se crean nuevas (desde cero o con una idea: 📚 Repasar apuntes, 📝 Entregar la práctica, 📞 Llamar a casa…) hasta un máximo de tres; al llegar a tres, el botón se cambia por un aviso. Cada una tiene **Editar** y **Borrar** (con confirmación). Se guardan en este navegador. |
| **Hábitos** | Cada hábito con su **racha** de días seguidos 🔥, una fila con los últimos 7 días y un botón para marcarlo como hecho hoy. |
| **Objetivos del año** | Una barra de progreso por objetivo («9 de 24 libros», «1.284 € de 1.500 €»), con una marca de dónde deberías ir según la fecha y una etiqueta: *Vas al día*, *Vas por detrás* o *¡Conseguido!*. Los botones − y + actualizan el progreso. |
| **Próximos viajes** | Cada viaje con su destino, sus fechas («19 de diciembre de 2026 – 7 de enero de 2027») y los **días que faltan**. Muestra *Mañana* y *¡Es hoy!* cuando toca, *En curso* mientras estás de viaje, y oculta los que ya han pasado. Con **＋ Añadir viaje** se crean nuevos (desde cero o con una idea: 🏖️ playa, 🏔️ montaña, 🎄 Navidad…), y cada viaje tiene **Editar** y **Borrar** (con confirmación). Se guardan en este navegador. |
| **Tus datos** | Botones para **descargar** una copia de seguridad (`.json`) y **restaurarla**, con la fecha de la última copia y un aviso si han pasado más de 7 días. |
| **App sin conexión** | Se puede instalar en el móvil o en el portátil con su propio icono y abre aunque no haya internet. Cuando se publica una versión nueva, un aviso arriba ofrece **Recargar** para usarla. |
| **Modo claro y oscuro** | Sigue el tema del sistema. El botón de arriba a la derecha permite elegirlo a mano y se recuerda. |

Cada sección tiene su propia página (`/agenda`, `/habitos`, `/viajes`…), con su nombre en la cabecera. El diseño es **adaptable**:

- **En el portátil**, un menú lateral con las secciones agrupadas (*Hoy*, *Planes* y *Tú*) y el contenido en dos columnas.
- **En el móvil**, una columna y una barra flotante abajo con Inicio, Agenda, Hábitos, Objetivos y Viajes. *Tus datos* se abre con el botón ⚙️ de la cabecera.

---

## Cómo usarlo

### En el navegador, sin descargar nada

Abre la **[demo](https://pablomontoro5.github.io/paneldevida/)**. Funciona también en el móvil: en el iPhone, desde Safari, pulsa **Compartir → Añadir a pantalla de inicio** para tenerla con su propio icono. Ábrela una vez con conexión y a partir de ahí funciona también sin internet (en modo avión, en el metro…). En Chrome o Edge del portátil, el botón **Instalar** de la barra de direcciones hace lo mismo.

### En tu ordenador

Necesitas [Node.js](https://nodejs.org/) 22.22, 24.15 o una versión más nueva.

1. Descarga el proyecto e instala las dependencias:
   ```bash
   git clone https://github.com/pablomontoro5/paneldevida.git
   cd paneldevida
   npm install
   ```
2. Arranca el servidor de desarrollo:
   ```bash
   npm start
   ```
   y abre `http://localhost:4200/`. La página se recarga sola cada vez que guardas un archivo.

> **En Windows con PowerShell**, si `npm` da un error de «ejecución de scripts deshabilitada», usa `npm.cmd` en su lugar (`npm.cmd install`, `npm.cmd start`…).

Ya no se puede abrir con doble clic en un `index.html`: el código compilado usa módulos de JavaScript, que el navegador no carga desde `file://`.

### Otros comandos

| Comando | Qué hace |
|---|---|
| `npm test` | Pasa las pruebas unitarias con Vitest y se queda vigilando los cambios. Para pasarlas una sola vez: `npm test -- --watch=false`. |
| `npm run build` | Compila la versión de producción en `dist/paneldevida/browser/`, con el *service worker* para usarla sin conexión. |

### Copia de seguridad

Lo que marcas solo existe en tu navegador: si borras sus datos, se pierde. Además, cada dirección (`localhost:4200`, la demo…) tiene sus propios datos. En la tarjeta **Tus datos**:

- **⬇️ Descargar copia** baja un archivo `panel-de-vida-copia-AAAA-MM-DD.json` con todo lo que guarda el panel. Guárdalo donde quieras (por ejemplo, en una carpeta de tu nube).
- **⬆️ Restaurar copia** carga uno de esos archivos. Antes de cambiar nada comprueba que es una copia válida y te pide confirmación, porque **sustituye** lo que tienes ahora.

El formato es el mismo que el de la versión vanilla, así que una copia hecha con ella se puede restaurar aquí.

El archivo se crea y se lee en el propio navegador: no se envía nada a internet. Por eso el `.gitignore` impide subir a GitHub por error un archivo de copia que guardes dentro de la carpeta del proyecto.

---

## Personalizar los datos

Los datos de ejemplo están en [`src/app/datos.ts`](src/app/datos.ts). Con `npm start` en marcha, basta con editar ese archivo y guardar. La forma de cada dato está definida en el `*.modelo.ts` de cada sección (por ejemplo, [`src/app/secciones/agenda/agenda.modelo.ts`](src/app/secciones/agenda/agenda.modelo.ts)), así que TypeScript avisa si falta un campo o tiene el tipo equivocado.

### Agenda

La agenda se edita desde el propio panel. Los eventos de `datos.ts` solo se usan la primera vez que se abre (cuando aún no hay nada guardado en `panelDeVida:agenda`); a partir de ahí manda lo guardado.

```ts
agenda: [
  { id: 'clase-estructuras', inicio: '08:30', fin: '10:30', titulo: 'Clase de Estructuras de Datos', lugar: 'Aula 2.4' },
  // ...
]
```

- `id` es único: sirve para editar y borrar cada evento.
- `inicio` y `fin` en formato 24 h (`'HH:MM'`).
- `lugar` puede ir vacío (`''`).
- No hace falta ordenarlos: el panel los ordena por hora.

### Prioridades

Las prioridades se editan desde el propio panel. Las de `datos.ts` solo se usan la primera vez que se abre (cuando aún no hay nada guardado en `panelDeVida:prioridades`); a partir de ahí manda lo guardado.

```ts
prioridades: [
  { id: 'p1', texto: 'Terminar la práctica 3 de Redes' },
  // ...
]
```

- `id` tiene que ser único; es lo que se guarda al marcar una prioridad (y sirve para editarla y borrarla).
- Como mucho, tres.
- Al borrar una prioridad se desmarca en el día de hoy; lo marcado en días anteriores no se toca.

### Hábitos

```ts
habitos: [
  { id: 'leer', icono: '📚', nombre: 'Leer 20 minutos', historialEjemplo: [1, 2, 3] },
  // ...
]
```

- `id` tiene que ser único y **no conviene cambiarlo** después: si cambia, se pierde el historial de ese hábito.
- `historialEjemplo` son los días atrás en que se cumplió (`1` = ayer, `2` = anteayer…). **Solo se usa la primera vez** que se abre el panel, para que las rachas no empiecen a cero. Después manda lo que marques tú.

### Objetivos del año

```ts
objetivos: [
  { id: 'libros', icono: '📚', nombre: 'Leer 24 libros', actual: 9, meta: 24, paso: 1, unidad: 'libros' },
  { id: 'ahorro', icono: '💶', nombre: 'Ahorrar 1.500 €', actual: 1284, meta: 1500, paso: 50, formato: 'euros' },
  // ...
]
```

- `actual` es el progreso de partida; después manda lo que cambies con los botones.
- `paso` es lo que suman o restan los botones − y +.
- Con `formato: 'euros'` las cantidades se muestran como dinero (`1.284 €`); si no, con su `unidad`.
- Como en los hábitos, el `id` no conviene cambiarlo.

### Viajes

Los viajes se editan desde el propio panel. Los de `datos.ts` solo se usan la primera vez que se abre (cuando aún no hay nada guardado en `panelDeVida:viajes`); a partir de ahí manda lo guardado.

```ts
viajes: [
  { id: 'navidad', icono: '🎄', destino: 'Navidad en casa', salida: '2026-12-19', vuelta: '2027-01-07' },
  // ...
]
```

- Las fechas van como texto `AAAA-MM-DD`.
- `vuelta` no es obligatoria: sin ella, el viaje dura un solo día.
- Se ordenan solos por fecha de salida y desaparecen al día siguiente de la vuelta.

---

## Estructura del proyecto

```
paneldevida/
├── src/
│   ├── index.html            La página base: carga <app-root>, el manifiesto y los iconos del iPhone
│   ├── main.ts               Arranca la aplicación
│   ├── styles.css            Estilos globales: colores (claro y oscuro), rejilla, tarjetas
│   └── app/
│       ├── app.ts / .html    Componente raíz: cabecera, menú lateral, barra del móvil y <router-outlet>
│       ├── app.routes.ts     Una ruta por sección, con sus datos de ejemplo
│       ├── datos.ts          Datos de ejemplo
│       ├── datos.modelo.ts   Tipo que agrupa los datos de todas las secciones
│       ├── nucleo/           Lo que usa toda la aplicación
│       │   ├── almacen.ts    Guardar y leer en localStorage, exportar e importar la copia
│       │   ├── coleccion.ts  Una lista editable que se guarda sola (empieza con los datos de ejemplo)
│       │   ├── archivo-copia.modelo.ts
│       │   ├── titulo.ts     Título de la pestaña y de la cabecera según la ruta
│       │   ├── aviso-version/  Aviso de «Hay una versión nueva» con el botón Recargar
│       │   └── cabecera/     Nombre de la sección y botones de tema y de Tus datos
│       ├── compartido/
│       │   ├── fechas.ts     Fechas y formatos en español, con sus pruebas
│       │   └── lista.ts      Añadir, editar y quitar por id en una lista, y crear ids nuevos
│       └── secciones/        Una carpeta por sección: componente, modelo y lógica con sus pruebas
│           ├── inicio/       La bienvenida y el resumen del día (reúne la lógica de las demás)
│           ├── agenda/       agenda.ts/.html/.css, agenda.modelo.ts, agenda.logica.ts, agenda.guardados.ts y agenda.plantillas.ts
│           ├── prioridades/  Además: prioridades.guardados.ts (la lista guardada) y prioridades.plantillas.ts (ideas)
│           ├── habitos/
│           ├── objetivos/
│           ├── viajes/       Además: viajes.guardados.ts (la lista guardada) y viajes.plantillas.ts (ideas)
│           └── tus-datos/    Descargar y restaurar la copia
├── public/                   Archivos que se copian tal cual
│   ├── manifest.webmanifest  Nombre, colores e iconos de la app instalada
│   └── icons/                Iconos de 72 a 512 px (el de 180 px es el del iPhone)
├── .github/
│   ├── workflows/
│   │   └── publicar.yml      Compila y publica la demo en GitHub Pages
│   ├── ISSUE_TEMPLATE/       Plantillas de issues: informe de fallo y propuesta de mejora
│   └── pull_request_template.md
├── angular.json              Configuración de Angular CLI
├── ngsw-config.json          Qué archivos guarda en caché el service worker
├── package.json              Dependencias y comandos (npm start, npm test…)
├── CLAUDE.md                 Descripción y reglas del proyecto (para Claude Code)
├── CONTRIBUTING.md           Cómo contribuir
├── CODE_OF_CONDUCT.md        Código de conducta
├── SECURITY.md               Cómo avisar de un fallo de seguridad
├── LICENSE                   Licencia MIT
└── README.md                 Este archivo
```

Cada sección importa solo de `nucleo/` y `compartido/`; `nucleo/` solo de `compartido/`, y `compartido/` de nada. La lógica que no depende de Angular está en los `*.logica.ts` (y en `compartido/fechas.ts`) como funciones puras. Así se prueba fácil: las pruebas reciben la fecha como parámetro y no dependen del día en que se ejecutan.

---

## Cómo funciona por dentro

### Guardado (`nucleo/almacen.ts`)

El servicio `Almacen` guarda los valores en `localStorage` como JSON, con el prefijo `panelDeVida:`. Los componentes lo reciben con `inject(Almacen)`. Si el navegador bloquea el almacenamiento (por ejemplo, en modo privado), el panel sigue funcionando, solo que no recuerda lo marcado.

| Clave en `localStorage` | Qué guarda | Ejemplo |
|---|---|---|
| `panelDeVida:tema` | El tema elegido a mano | `"oscuro"` |
| `panelDeVida:prioridades` | La lista de prioridades (la primera vez, las de ejemplo) | `[{ "id": "p1", "texto": "Terminar la práctica 3 de Redes" }]` |
| `panelDeVida:prioridades:AAAA-MM-DD` | Las prioridades hechas ese día | `["p1", "p3"]` |
| `panelDeVida:habitos` | Los días en que se cumplió cada hábito | `{ "leer": ["2026-10-31", "2026-11-01"] }` |
| `panelDeVida:agenda` | Los eventos de la agenda (la primera vez, los de ejemplo) | `[{ "id": "gimnasio", "inicio": "19:00", "fin": "20:00", "titulo": "Gimnasio", "lugar": "" }]` |
| `panelDeVida:viajes` | La lista de viajes (la primera vez, los de ejemplo) | `[{ "id": "navidad", "icono": "🎄", "destino": "Navidad en casa", "salida": "2026-12-19" }]` |
| `panelDeVida:objetivos:AAAA` | El progreso de cada objetivo ese año | `{ "libros": 11, "ahorro": 1334 }` |
| `panelDeVida:ultimaCopia` | Cuándo se descargó la última copia (no viaja en la copia) | `"2026-11-02T08:15:00.000Z"` |

Son las mismas claves que usaba la versión vanilla. Como lo marcado de las prioridades se guarda con la fecha en la clave, cada mañana empiezan sin marcar sin necesidad de borrar nada; la lista de prioridades va en su propia clave, sin fecha, así que se mantiene de un día para otro.

### Rutas (`app.routes.ts`)

Cada sección tiene su ruta con **Angular Router**, y `''` abre el Inicio. Cualquier dirección desconocida vuelve al Inicio. Con `withComponentInputBinding()`, los datos que se ponen en `data` de cada ruta llegan directamente a los `input()` de su componente, así que las secciones no saben si se muestran solas o dentro del Inicio. Los enlaces usan `routerLink` y `routerLinkActive` para resaltar la sección abierta. El `title` de cada ruta lo recoge `TituloPanel` (`nucleo/titulo.ts`), un `TitleStrategy` propio: pone «Hábitos · Panel de vida» en la pestaña y deja «Hábitos» en una signal que lee la cabecera. El Inicio no tiene `title`, así que allí la cabecera no muestra nombre y la bienvenida ocupa su lugar.

GitHub Pages no conoce estas rutas: al recargar `/paneldevida/habitos` buscaría un archivo que no existe y daría 404. Por eso `publicar.yml` copia `index.html` como `404.html`: Pages lo sirve en su lugar, carga la aplicación y el router abre la sección correcta.

### App sin conexión (PWA)

El panel es una **PWA** (aplicación web progresiva) gracias a `@angular/service-worker`, el paquete oficial de Angular:

- **`public/manifest.webmanifest`** dice el nombre («Panel de vida»), los colores y los iconos que se usan al instalarla. Usa rutas relativas (`./`), así que vale igual en `localhost` que en `/paneldevida/`.
- **`index.html`** añade lo que Safari del iPhone no lee del manifiesto: `apple-touch-icon` (icono de 180 px) y `apple-mobile-web-app-title`.
- **El service worker** (`ngsw-worker.js`, lo genera `ng build` según `ngsw-config.json`) se registra en `app.config.ts` y guarda en caché el HTML, el JavaScript, el CSS y los iconos. La siguiente vez, la app se abre desde la caché aunque no haya conexión. Solo se activa en la versión compilada: con `npm start` está apagado para no estorbar al recargar los cambios.
- **Versiones nuevas**: el service worker sigue sirviendo la versión guardada y descarga la nueva por detrás. Cuando la tiene lista, `AvisoVersion` (`nucleo/aviso-version/`) escucha `SwUpdate` y muestra «Hay una versión nueva del panel» con un botón **Recargar**.

Para probarlo en el ordenador hace falta servir la carpeta compilada (por ejemplo, la propia demo), abrirla una vez, desconectar la red en las herramientas del navegador (F12 → *Application* → *Service workers* → *Offline*) y recargar. La caché solo guarda los archivos de la propia app: los datos siguen en `localStorage`, como siempre.

### Estado con signals

Cada componente guarda su estado en **signals** (`signal()`), y lo que se calcula a partir de ellas va en `computed()`: la racha de un hábito, el contador de prioridades, el ritmo de un objetivo… Cuando cambia una signal, Angular actualiza solo la parte de la página que la usa.

### Formato de la copia de seguridad

`Almacen.exportar()` reúne todas las claves con el prefijo `panelDeVida:` (menos `ultimaCopia`) en un objeto así:

```json
{
  "app": "panel-de-vida",
  "version": 1,
  "fecha": "2026-11-02T08:15:00.000Z",
  "datos": { "tema": "oscuro", "habitos": { "leer": ["2026-11-01"] } }
}
```

Al restaurar, se comprueba que tenga `app`, `version`, `fecha` y `datos` antes de tocar nada, y `Almacen.importar()` sustituye los datos. Si algo falla a mitad, vuelve a dejar los anteriores.

### Rachas de hábitos

La racha es el número de **días seguidos** en que se ha cumplido un hábito, contando hacia atrás:

- Si **hoy ya está marcado**, se cuenta desde hoy.
- Si **hoy todavía no**, se cuenta desde ayer. Así, por la mañana la racha no aparece a 0 solo porque aún no te ha dado tiempo.

### Ritmo de los objetivos

El panel calcula qué parte del año ha pasado (el 1 de noviembre, 305 de 365 días: el 84 %) y la compara con el progreso de cada objetivo:

- Progreso ≥ 100 % → **¡Conseguido!**
- Progreso ≥ parte del año que ha pasado → **Vas al día**
- Si no → **Vas por detrás**

### Fechas e idioma

La aplicación está configurada con el idioma `es-ES` y todas las fechas y cantidades se formatean con `Intl`. Para las claves se usa la fecha **local** en formato `AAAA-MM-DD` (no `toISOString()`, que usa la hora UTC y podría dar el día anterior por la noche).

### Tema claro y oscuro

Los colores están definidos como variables CSS en `:root` (en `src/styles.css`). El modo oscuro se aplica:

- con `@media (prefers-color-scheme: dark)` si no se ha elegido nada a mano, o
- con el atributo `data-tema="oscuro"` en `<html>` cuando se elige con el botón.

### Empezar de cero

Para borrar todo lo marcado y volver a los datos de ejemplo, abre la consola del navegador (F12) y ejecuta:

```js
Object.keys(localStorage).filter(k => k.startsWith("panelDeVida:")).forEach(k => localStorage.removeItem(k));
```

---

## Privacidad

**Tus datos no salen del ordenador.** Lo que marcas en el panel se guarda solo en tu navegador. El service worker solo guarda en caché los archivos de la propia app. La página no hace ninguna petición a internet: ni analíticas, ni fuentes externas, ni servicios de terceros.

---

## Reglas del proyecto

1. Antes de un cambio grande, primero el plan, y no se empieza hasta que se apruebe.
2. Un cambio cada vez, cada uno en su rama y con su pull request (ver abajo).
3. Nada de librerías nuevas aparte de Angular salvo que se pida expresamente.
4. Todo en español de España: textos, fechas (`1 de noviembre de 2026`, `01/11/2026`) y euros (`1.234,50 €`), usando `Intl` con `es-ES`.
5. Tiene que verse bien en el portátil y en el móvil.
6. Los datos no salen del ordenador.

Las reglas completas están en [`CLAUDE.md`](CLAUDE.md).

---

## Publicación en GitHub Pages

La demo se publica sola con **GitHub Actions** ([`.github/workflows/publicar.yml`](.github/workflows/publicar.yml)) cada vez que algo entra en `main`. También se puede lanzar a mano desde la pestaña **Actions → Publicar en GitHub Pages → Run workflow**.

El workflow tiene dos partes:

1. **build**: instala Node, instala las dependencias con `npm ci` y compila con `ng build --base-href /paneldevida/`. El `--base-href` hace falta porque la demo no está en la raíz del dominio, sino en `/paneldevida/`.
2. **deploy**: publica `dist/paneldevida/browser` en `https://pablomontoro5.github.io/paneldevida/`.

Para que funcione, en *Settings → Pages → Source* tiene que estar elegido **GitHub Actions**.

> En la demo solo está el código y los datos de ejemplo. Lo que cada persona marca se queda en su navegador.

---

## Flujo de trabajo con Git

`main` siempre tiene una versión que funciona. Nunca se trabaja directamente en ella.

1. **Crear una rama** desde `main` actualizada, con nombre en español:
   ```bash
   git switch main
   git pull
   git switch -c funcionalidad/cuenta-atras-viajes
   ```
   Prefijos: `funcionalidad/`, `arreglo/`, `diseño/`, `documentacion/`.
2. **Hacer commits pequeños** con mensaje en español, uno por cambio que funcione.
3. **Subir la rama y abrir un pull request** hacia `main`:
   ```bash
   git push -u origin funcionalidad/cuenta-atras-viajes
   gh pr create --base main
   ```
   La descripción explica qué cambia, por qué y cómo se ha probado.
4. **Revisar y fusionar** el pull request en GitHub.
5. **Actualizar `main` en local**:
   ```bash
   git switch main
   git pull
   ```

---

## Hoja de ruta

- [x] Saludo con la fecha
- [x] Agenda del día
- [x] Tres prioridades del día
- [x] Hábitos con rachas
- [x] Modo claro y oscuro, diseño adaptable
- [x] Objetivos del año con su progreso
- [x] Copia de seguridad: descargar y restaurar
- [x] Demo publicada en GitHub Pages
- [x] Migrar a Angular
- [x] Cuenta atrás de viajes
- [x] Navegación por secciones
- [x] Usarlo en el iPhone como app sin conexión (con icono y service worker)
- [ ] Añadir, editar y borrar desde el propio panel (✅ viajes, agenda y prioridades; faltan hábitos y objetivos)
- [ ] Conectar Google Calendar para la agenda
- [ ] Resumen semanal automático cada domingo

### Orden previsto

Lo que falta, de más fácil a más difícil (los detalles de cada tarea están en [`CLAUDE.md`](CLAUDE.md)):

1. ~~Cumplir los *community standards* de GitHub (licencia, guía de contribución, código de conducta, política de seguridad y plantillas).~~ ✅
2. ~~Reorganizar las carpetas del proyecto.~~ ✅
3. ~~Cuenta atrás de viajes.~~ ✅
4. ~~Panel de navegación entre secciones con Angular Router.~~ ✅
5. ~~Usarlo en el iPhone como app sin conexión.~~ ✅
6. Añadir, editar y borrar desde el propio panel: ✅ viajes, agenda y prioridades; faltan hábitos y objetivos.
7. Sección de planes con recordatorios.
8. Resumen semanal cada domingo.
9. Repaso final del README.
10. Conectar Google Calendar (pendiente de decidir, porque los datos no deben salir del ordenador).

---

## Contribuir

Las ideas y los avisos de fallos son bienvenidos. Antes de abrir un issue o un pull request, echa un vistazo a:

- [Cómo contribuir](CONTRIBUTING.md): preparar el entorno, ramas, commits y pull requests.
- [Código de conducta](CODE_OF_CONDUCT.md).
- [Política de seguridad](SECURITY.md): los fallos de seguridad se avisan en privado, no en un issue.

---

## Licencia

Este proyecto tiene [licencia MIT](LICENSE): puedes usar, copiar, modificar y distribuir el código libremente, siempre que mantengas el aviso de copyright y de la licencia.

Hecho por [pablomontoro5](https://github.com/pablomontoro5), estudiante de Ingeniería Informática.
