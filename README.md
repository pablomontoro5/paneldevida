# Panel de vida

Un panel personal que abro cada mañana para ver de un vistazo cómo voy en todo: lo que tengo hoy, mis tres prioridades y mis hábitos.

Es una sola página hecha con **HTML, CSS y JavaScript normales**. No hay que instalar nada, ni compilar, ni arrancar un servidor: se abre con **doble clic en `index.html`**.

> **Estado:** primera versión. Ya funcionan el saludo, la agenda, las prioridades y los hábitos. Los objetivos del año y la cuenta atrás de viajes están pendientes (ver [Hoja de ruta](#hoja-de-ruta)).

---

## Índice

- [Qué hace](#qué-hace)
- [Cómo usarlo](#cómo-usarlo)
- [Personalizar los datos](#personalizar-los-datos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo funciona por dentro](#cómo-funciona-por-dentro)
- [Privacidad](#privacidad)
- [Reglas del proyecto](#reglas-del-proyecto)
- [Flujo de trabajo con Git](#flujo-de-trabajo-con-git)
- [Hoja de ruta](#hoja-de-ruta)

---

## Qué hace

| Sección | Qué muestra |
|---|---|
| **Saludo** | «Buenos días», «Buenas tardes» o «Buenas noches» según la hora, y la fecha completa en español (p. ej. *Domingo, 1 de noviembre de 2026*). |
| **Agenda de hoy** | Los eventos del día ordenados por hora. Los que ya han pasado salen atenuados y el que está en curso (**Ahora**) o el próximo (**Siguiente**) salen resaltados. |
| **Prioridades** | Las tres cosas más importantes del día, con una casilla para marcarlas como hechas y un contador («2 de 3 hechas»). Cada día empiezan sin marcar. |
| **Hábitos** | Cada hábito con su **racha** de días seguidos 🔥, una fila con los últimos 7 días y un botón para marcarlo como hecho hoy. |
| **Modo claro y oscuro** | Sigue el tema del sistema. El botón de arriba a la derecha permite elegirlo a mano y se recuerda. |

El diseño es **adaptable**: dos columnas en el portátil y una en el móvil.

La página se actualiza sola cada minuto (saludo y agenda), y si pasa la medianoche con el panel abierto, se reinician las prioridades del nuevo día.

---

## Cómo usarlo

1. Descarga o clona el repositorio:
   ```bash
   git clone https://github.com/pablomontoro5/paneldevida.git
   ```
2. Haz **doble clic en `index.html`**. Se abre en tu navegador y ya está.

Funciona en cualquier navegador moderno (Chrome, Edge, Firefox, Safari).

> **Ojo:** el navegador guarda lo marcado por separado según *cómo* se abra la página. Si la abres a veces con doble clic (`file://`) y otras desde otra dirección, cada una tendrá sus propios datos.

---

## Personalizar los datos

Todos los datos de ejemplo están en [`js/datos.js`](js/datos.js). Basta con editar ese archivo y recargar la página.

### Agenda

```js
agenda: [
  { inicio: "08:30", fin: "10:30", titulo: "Clase de Estructuras de Datos", lugar: "Aula 2.4" },
  // ...
]
```

- `inicio` y `fin` en formato 24 h (`"HH:MM"`).
- `lugar` es opcional (puede ir vacío: `""`).
- No hace falta ordenarlos: el panel los ordena por hora.

### Prioridades

```js
prioridades: [
  { id: "p1", texto: "Terminar la práctica 3 de Redes" },
  // ...
]
```

- `id` tiene que ser único; es lo que se guarda al marcar una prioridad.

### Hábitos

```js
habitos: [
  { id: "leer", icono: "📚", nombre: "Leer 20 minutos", historialEjemplo: [1, 2, 3] },
  // ...
]
```

- `id` tiene que ser único y **no conviene cambiarlo** después: si cambia, se pierde el historial de ese hábito.
- `historialEjemplo` son los días atrás en que se cumplió (`1` = ayer, `2` = anteayer…). **Solo se usa la primera vez** que se abre el panel, para que las rachas no empiecen a cero. Después manda lo que marques tú.
- Se pueden añadir hábitos nuevos en cualquier momento; empiezan sin historial.

---

## Estructura del proyecto

```
paneldevida/
├── index.html        La página: cabecera y una tarjeta por sección
├── css/
│   └── estilos.css   Todo el diseño: colores (claro y oscuro), rejilla adaptable
├── js/
│   ├── datos.js      Datos de ejemplo (agenda, prioridades, hábitos)
│   ├── almacen.js    Guardar y leer en el navegador (localStorage)
│   └── panel.js      Lógica: dibuja cada sección y responde a los clics
├── CLAUDE.md         Descripción y reglas del proyecto (para Claude Code)
└── README.md         Este archivo
```

Los scripts se cargan con `<script src="..." defer>` normales, en este orden: `datos.js` → `almacen.js` → `panel.js`. No se usan módulos ES ni `fetch`, porque no funcionan al abrir la página desde `file://`.

---

## Cómo funciona por dentro

### Guardado (`js/almacen.js`)

`Almacen.leer(clave, porDefecto)` y `Almacen.guardar(clave, valor)` guardan los valores en `localStorage` como JSON, con el prefijo `panelDeVida:`. Si el navegador bloquea el almacenamiento (por ejemplo, en modo privado), el panel sigue funcionando, solo que no recuerda lo marcado.

| Clave en `localStorage` | Qué guarda | Ejemplo |
|---|---|---|
| `panelDeVida:tema` | El tema elegido a mano | `"oscuro"` |
| `panelDeVida:prioridades:AAAA-MM-DD` | Las prioridades hechas ese día | `["p1", "p3"]` |
| `panelDeVida:habitos` | Los días en que se cumplió cada hábito | `{ "leer": ["2026-10-31", "2026-11-01"] }` |

Como las prioridades se guardan con la fecha en la clave, cada mañana empiezan sin marcar sin necesidad de borrar nada.

### Rachas de hábitos

La racha es el número de **días seguidos** en que se ha cumplido un hábito, contando hacia atrás:

- Si **hoy ya está marcado**, se cuenta desde hoy.
- Si **hoy todavía no**, se cuenta desde ayer. Así, por la mañana la racha no aparece a 0 solo porque aún no te ha dado tiempo.

### Fechas

Todas las fechas se formatean con `Intl.DateTimeFormat("es-ES")`. Para las claves se usa la fecha **local** en formato `AAAA-MM-DD` (no `toISOString()`, que usa la hora UTC y podría dar el día anterior por la noche).

### Tema claro y oscuro

Los colores están definidos como variables CSS en `:root`. El modo oscuro se aplica:

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
3. Nada de librerías, frameworks ni servidores salvo que se pida expresamente.
4. Todo en español de España: textos, fechas (`1 de noviembre de 2026`, `01/11/2026`) y euros (`1.234,50 €`), usando `Intl` con `es-ES`.
5. Tiene que verse bien en el portátil y en el móvil.
6. Los datos no salen del ordenador.

Las reglas completas están en [`CLAUDE.md`](CLAUDE.md).

---

## Flujo de trabajo con Git

`main` siempre tiene una versión que funciona. Nunca se trabaja directamente en ella.

1. **Crear una rama** desde `main` actualizada, con nombre en español:
   ```bash
   git switch main
   git pull
   git switch -c funcionalidad/objetivos-del-año
   ```
   Prefijos: `funcionalidad/`, `arreglo/`, `diseño/`, `documentacion/`.
2. **Hacer commits pequeños** con mensaje en español, uno por cambio que funcione.
3. **Subir la rama y abrir un pull request** hacia `main`:
   ```bash
   git push -u origin funcionalidad/objetivos-del-año
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
- [ ] Objetivos del año con su progreso
- [ ] Cuenta atrás de viajes
- [ ] Editar prioridades, agenda y hábitos desde el propio panel
- [ ] Usarlo en el iPhone como app desde la pantalla de inicio
- [ ] Conectar Google Calendar para la agenda
- [ ] Resumen semanal automático cada domingo
