# Política de seguridad

## Versiones con soporte

Solo se mantiene la versión que está en la rama `main`, que es la que se publica en la [demo](https://pablomontoro5.github.io/paneldevida/). La versión vanilla antigua (etiqueta `v1-vanilla`) ya no recibe arreglos.

| Versión | Soporte |
| --- | --- |
| `main` (Angular) | ✅ |
| `v1-vanilla` | ❌ |

## Cómo avisar de una vulnerabilidad

**No abras un issue público.** Usa el aviso privado de GitHub:

1. Ve a la pestaña [**Security**](https://github.com/pablomontoro5/paneldevida/security) del repositorio.
2. Pulsa **Report a vulnerability**.
3. Cuenta qué has encontrado, cómo reproducirlo y qué impacto crees que tiene.

Solo lo veremos tú y yo hasta que esté arreglado.

## Qué puedes esperar

- Intentaré responder en **una semana** como mucho. Es un proyecto personal de estudiante, así que puede que tarde algo más en épocas de exámenes.
- Te diré si confirmo el fallo y, si es así, cuándo calculo tenerlo arreglado.
- Cuando esté arreglado, si quieres, te mencionaré como quien lo encontró.

## Qué entra

El panel funciona entero en el navegador: no tiene servidor ni cuentas, y los datos se guardan en `localStorage`. Lo que más me interesa saber:

- Cualquier forma de que el panel **envíe datos fuera del navegador**.
- Inyección de código (XSS), por ejemplo al **restaurar una copia de seguridad** (`.json`) manipulada.
- Dependencias con vulnerabilidades conocidas que afecten a la demo.
