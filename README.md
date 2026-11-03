# Panel de vida

Un panel personal que abro cada mañana para ver de un vistazo cómo voy en todo: lo que tengo hoy, mis tres prioridades, mis hábitos y mis objetivos del año.

Está hecho con **Angular 22** y **TypeScript**: componentes standalone, signals y pruebas con Vitest. Empezó como una página en HTML, CSS y JavaScript normales y lo he migrado a Angular paso a paso para aprenderlo. La versión original sigue guardada en la etiqueta [`v1-vanilla`](https://github.com/pablomontoro5/paneldevida/tree/v1-vanilla).

**🔗 Demo:** [pablomontoro5.github.io/paneldevida](https://pablomontoro5.github.io/paneldevida/), con los datos de ejemplo. Lo que marques ahí se guarda solo en tu navegador.

> **Estado:** en desarrollo. Ya funcionan el saludo, la agenda, las prioridades, los hábitos, los objetivos del año y la copia de seguridad. La cuenta atrás de viajes está pendiente (ver [Hoja de ruta](#hoja-de-ruta)).

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
- [Licencia](#licencia)

---

## Qué hace

| Sección | Qué muestra |
|---|---|
| **Saludo** | «Buenos días», «Buenas tardes» o «Buenas noches» según la hora, y la fecha completa en español (p. ej. *Domingo, 1 de noviembre de 2026*). |
| **Agenda de hoy** | Los eventos del día ordenados por hora. Los que ya han pasado salen atenuados y el que está en curso (**Ahora**) o el próximo (**Siguiente**) salen resaltados. Se actualiza sola cada minuto. |
| **Prioridades** | Las tres cosas más importantes del día, con una casilla para marcarlas como hechas y un contador («2 de 3 hechas»). Cada día empiezan sin marcar. |
| **Hábitos** | Cada hábito con su **racha** de días seguidos 🔥, una fila con los últimos 7 días y un botón para marcarlo como hecho hoy. |
| **Objetivos del año** | Una barra de progreso por objetivo («9 de 24 libros», «1.284 € de 1.500 €»), con una marca de dónde deberías ir según la fecha y una etiqueta: *Vas al día*, *Vas por detrás* o *¡Conseguido!*. Los botones − y + actualizan el progreso. |
| **Tus datos** | Botones para **descargar** una copia de seguridad (`.json`) y **restaurarla**, con la fecha de la última copia y un aviso si han pasado más de 7 días. |
| **Modo claro y oscuro** | Sigue el tema del sistema. El botón de arriba a la derecha permite elegirlo a mano y se recuerda. |

El diseño es **adaptable**: dos columnas en el portátil y una en el móvil.

---

## Cómo usarlo

### En el navegador, sin descargar nada

Abre la **[demo](https://pablomontoro5.github.io/paneldevida/)**. Funciona también en el móvil: en el iPhone, desde Safari, pulsa **Compartir → Añadir a pantalla de inicio** para tenerla con su propio icono (de momento necesita conexión para abrirse).

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
| `npm run build` | Compila la versión de producción en `dist/paneldevida/browser/`. |

### Copia de seguridad

Lo que marcas solo existe en tu navegador: si borras sus datos, se pierde. Además, cada dirección (`localhost:4200`, la demo…) tiene sus propios datos. En la tarjeta **Tus datos**:

- **⬇️ Descargar copia** baja un archivo `panel-de-vida-copia-AAAA-MM-DD.json` con todo lo que guarda el panel. Guárdalo donde quieras (por ejemplo, en una carpeta de tu nube).
- **⬆️ Restaurar copia** carga uno de esos archivos. Antes de cambiar nada comprueba que es una copia válida y te pide confirmación, porque **sustituye** lo que tienes ahora.

El formato es el mismo que el de la versión vanilla, así que una copia hecha con ella se puede restaurar aquí.

El archivo se crea y se lee en el propio navegador: no se envía nada a internet. Por eso el `.gitignore` impide subir a GitHub por error un archivo de copia que guardes dentro de la carpeta del proyecto.

---

## Personalizar los datos

Los datos de ejemplo están en [`src/app/datos.ts`](src/app/datos.ts). Con `npm start` en marcha, basta con editar ese archivo y guardar. La forma de cada dato está definida en [`src/app/modelos/`](src/app/modelos/), así que TypeScript avisa si falta un campo o tiene el tipo equivocado.

### Agenda

```ts
agenda: [
  { inicio: '08:30', fin: '10:30', titulo: 'Clase de Estructuras de Datos', lugar: 'Aula 2.4' },
  // ...
]
```

- `inicio` y `fin` en formato 24 h (`'HH:MM'`).
- `lugar` puede ir vacío (`''`).
- No hace falta ordenarlos: el panel los ordena por hora.

### Prioridades

```ts
prioridades: [
  { id: 'p1', texto: 'Terminar la práctica 3 de Redes' },
  // ...
]
```

- `id` tiene que ser único; es lo que se guarda al marcar una prioridad.

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

---

## Estructura del proyecto

```
paneldevida/
├── src/
│   ├── index.html            La página base: solo carga <app-root>
│   ├── main.ts               Arranca la aplicación
│   ├── styles.css            Estilos globales: colores (claro y oscuro), rejilla, tarjetas
│   └── app/
│       ├── app.ts / .html    Componente raíz: la navegación y una tarjeta por sección
│       ├── datos.ts          Datos de ejemplo
│       ├── componentes/      Un componente por sección, cada uno con su HTML, CSS y pruebas
│       │   ├── cabecera/     Saludo, fecha y botón de tema
│       │   ├── agenda/
│       │   ├── prioridades/
│       │   ├── habitos/
│       │   ├── objetivos/
│       │   └── tus-datos/    Descargar y restaurar la copia
│       ├── modelos/          Tipos de TypeScript: Evento, Prioridad, Habito, Objetivo, ArchivoCopia…
│       ├── servicios/
│       │   └── almacen.ts    Guardar y leer en localStorage, exportar e importar la copia
│       └── utilidades/       Lógica sin Angular (fechas, rachas, ritmo de objetivos…) con sus pruebas
├── public/                   Archivos que se copian tal cual (favicon)
├── .github/workflows/
│   └── publicar.yml          Compila y publica la demo en GitHub Pages
├── angular.json              Configuración de Angular CLI
├── package.json              Dependencias y comandos (npm start, npm test…)
├── CLAUDE.md                 Descripción y reglas del proyecto (para Claude Code)
└── README.md                 Este archivo
```

La lógica que no depende de Angular está separada en `utilidades/` en funciones puras. Así se prueba fácil: las pruebas reciben la fecha como parámetro y no dependen del día en que se ejecutan.

---

## Cómo funciona por dentro

### Guardado (`servicios/almacen.ts`)

El servicio `Almacen` guarda los valores en `localStorage` como JSON, con el prefijo `panelDeVida:`. Los componentes lo reciben con `inject(Almacen)`. Si el navegador bloquea el almacenamiento (por ejemplo, en modo privado), el panel sigue funcionando, solo que no recuerda lo marcado.

| Clave en `localStorage` | Qué guarda | Ejemplo |
|---|---|---|
| `panelDeVida:tema` | El tema elegido a mano | `"oscuro"` |
| `panelDeVida:prioridades:AAAA-MM-DD` | Las prioridades hechas ese día | `["p1", "p3"]` |
| `panelDeVida:habitos` | Los días en que se cumplió cada hábito | `{ "leer": ["2026-10-31", "2026-11-01"] }` |
| `panelDeVida:objetivos:AAAA` | El progreso de cada objetivo ese año | `{ "libros": 11, "ahorro": 1334 }` |
| `panelDeVida:ultimaCopia` | Cuándo se descargó la última copia (no viaja en la copia) | `"2026-11-02T08:15:00.000Z"` |

Son las mismas claves que usaba la versión vanilla. Como las prioridades se guardan con la fecha en la clave, cada mañana empiezan sin marcar sin necesidad de borrar nada.

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

**Tus datos no salen del ordenador.** Lo que marcas en el panel se guarda solo en tu navegador. La página no hace ninguna petición a internet: ni analíticas, ni fuentes externas, ni servicios de terceros.

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
- [x] Agenda del día (datos de ejemplo)
- [x] Tres prioridades del día
- [x] Hábitos con rachas
- [x] Modo claro y oscuro, diseño adaptable
- [x] Objetivos del año con su progreso
- [x] Copia de seguridad: descargar y restaurar
- [x] Demo publicada en GitHub Pages
- [x] Migrar a Angular
- [ ] Cuenta atrás de viajes
- [ ] Editar prioridades, agenda y hábitos desde el propio panel
- [ ] Usarlo en el iPhone como app sin conexión (con icono y service worker)
- [ ] Conectar Google Calendar para la agenda
- [ ] Resumen semanal automático cada domingo

---

## Licencia

Este proyecto todavía **no tiene licencia**. El código se puede ver, pero no reutilizar ni redistribuir sin permiso del autor.

Hecho por [pablomontoro5](https://github.com/pablomontoro5), estudiante de Ingeniería Informática.
