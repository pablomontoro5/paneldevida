import { Evento } from './modelos/agenda';
import { Prioridad } from './modelos/prioridad';
import { Habito } from './modelos/habito';
import { Objetivo } from './modelos/objetivo';
import { CopiaSeguridad } from './modelos/copia-seguridad';

export function crearDatosDeEjemplo(): CopiaSeguridad {
  return {
    agenda: [
      { inicio: '08:30', fin: '10:30', titulo: 'Clase de Estructuras de Datos', lugar: 'Aula 2.4' },
      // ...y el resto de tus eventos, copiados de js/datos.js
    ],
    prioridades: [
      { id: 'p1', texto: 'Terminar la práctica 3 de Redes' },
      { id: 'p2', texto: 'Repasar los temas 4 y 5 de Sistemas Operativos' },
      { id: 'p3', texto: 'Llamar a casa' },
    ],
    habitos: [
      { id: 'leer', icono: '📚', nombre: 'Leer 20 minutos', historialEjemplo: [1, 2, 3, 4, 5, 6, 8, 9] },
      // ...y el resto
    ],
    objetivos: [
      { id: 'libros', icono: '📚', nombre: 'Leer 24 libros', actual: 9, meta: 24, paso: 1, unidad: 'libros' },
      { id: 'ahorro', icono: '💶', nombre: 'Ahorrar 1.500 €', actual: 1284, meta: 1500, paso: 50, formato: 'euros' },
      // ...y el resto
    ],
  };
}