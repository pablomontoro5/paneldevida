# Cómo contribuir

¡Gracias por interesarte en el Panel de vida! Es un proyecto personal con el que aprendo Angular, así que cualquier idea, aviso de fallo o mejora es bienvenida.

## Antes de empezar

- Lee el [código de conducta](CODE_OF_CONDUCT.md).
- Mira los [issues abiertos](https://github.com/pablomontoro5/paneldevida/issues) por si alguien ya ha propuesto lo mismo.
- Para un cambio grande, **abre primero un issue** y cuéntame el plan. Así lo hablamos antes de que dediques tiempo a programarlo.

## Avisar de un fallo o proponer una idea

Abre un issue con la plantilla que corresponda:

- **🐞 Informe de fallo**: qué pasa, qué esperabas y cómo reproducirlo (navegador, móvil o portátil…).
- **💡 Propuesta de mejora**: qué te gustaría y para qué sirve.

Si el fallo es de **seguridad**, no abras un issue público: sigue la [política de seguridad](SECURITY.md).

## Preparar el entorno

Necesitas [Node.js](https://nodejs.org/) 22.22, 24.15 o una versión más nueva.

```bash
git clone https://github.com/pablomontoro5/paneldevida.git
cd paneldevida
npm install
npm start
```

Abre `http://localhost:4200/`. En Windows con PowerShell, si `npm` da error, usa `npm.cmd`.

## Hacer un cambio

1. **Crea una rama** desde `main` con nombre en español y uno de estos prefijos:
   - `funcionalidad/...` para algo nuevo,
   - `arreglo/...` para corregir un fallo,
   - `diseño/...` para cambios visuales,
   - `documentacion/...` para textos y documentos.
2. **Un cambio por rama.** Si quieres arreglar dos cosas distintas, mejor dos pull requests.
3. **Haz commits pequeños** con el mensaje en español y en presente (p. ej. «Añade la cuenta atrás de viajes»).
4. **Comprueba que todo funciona**:
   ```bash
   npm test -- --watch=false
   npm run build
   ```
5. **Abre un pull request** hacia `main` rellenando la plantilla: qué cambia, por qué y cómo lo has probado.

Los pull requests los reviso y fusiono yo.

## Reglas del proyecto

- **Todo en español de España**: textos de la interfaz, mensajes, nombres de variables y commits. Fechas y euros con `Intl` y `es-ES` (`1 de noviembre de 2026`, `1.234,50 €`).
- **Nada de librerías nuevas** aparte de Angular, salvo que lo hablemos antes en un issue.
- **Los datos no salen del ordenador**: nada de analíticas, fuentes externas ni peticiones a internet.
- **Tiene que verse bien en el portátil y en el móvil.**
- **Estilo del código**: componentes standalone y signals; la lógica sin Angular va en `src/app/utilidades/` con su `.spec.ts` al lado. Las pruebas no deben depender del día en que se ejecutan (pasa la fecha como parámetro). El formato lo marca el `.prettierrc` del proyecto.

## Licencia

Al contribuir aceptas que tu código se publique con la [licencia MIT](LICENSE) del proyecto.
