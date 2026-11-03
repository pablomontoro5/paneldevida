import { Evento } from './secciones/agenda/agenda.modelo';
import { Prioridad } from './secciones/prioridades/prioridad.modelo';
import { Habito } from './secciones/habitos/habito.modelo';
import { Objetivo } from './secciones/objetivos/objetivo.modelo';
import { Viaje } from './secciones/viajes/viaje.modelo';
import { CopiaSeguridad } from './datos.modelo';

export function crearDatosDeEjemplo(): CopiaSeguridad {
  return {
    agenda: [
      { id: 'clase-estructuras', inicio: '08:30', fin: '10:30', titulo: 'Clase de Estructuras de Datos', lugar: 'Aula 2.4' },
      { id: 'practicas-redes', inicio: '11:00', fin: '13:00', titulo: 'Prácticas de Redes', lugar: 'Laboratorio L3' },
      { id: 'comida-grupo', inicio: '14:00', fin: '15:00', titulo: 'Comida con el grupo', lugar: 'Cafetería' },
      { id: 'estudiar-so', inicio: '16:30', fin: '18:00', titulo: 'Estudiar para el parcial de Sistemas Operativos', lugar: 'Biblioteca' },
      { id: 'gimnasio', inicio: '19:00', fin: '20:00', titulo: 'Gimnasio', lugar: '' },
    ],
    prioridades: [
      { id: 'p1', texto: 'Terminar la práctica 3 de Redes' },
      { id: 'p2', texto: 'Repasar los temas 4 y 5 de Sistemas Operativos' },
      { id: 'p3', texto: 'Llamar a casa' },
    ],
    habitos: [
      { id: 'leer', icono: '📚', nombre: 'Leer 20 minutos', historialEjemplo: [1, 2, 3, 4, 5, 6, 8, 9] },
      { id: 'ejercicio', icono: '🏃', nombre: 'Hacer ejercicio', historialEjemplo: [1, 3, 4, 6] },
      { id: 'agua', icono: '💧', nombre: 'Beber 2 litros de agua', historialEjemplo: [1, 2, 3] },
      { id: 'programar', icono: '💻', nombre: 'Programar algo propio', historialEjemplo: [2, 3, 4, 5] },
    ],
    objetivos: [
      { id: 'libros', icono: '📚', nombre: 'Leer 24 libros', actual: 9, meta: 24, paso: 1, unidad: 'libros' },
      { id: 'asignaturas', icono: '🎓', nombre: 'Aprobar 10 asignaturas', actual: 9, meta: 10, paso: 1, unidad: 'asignaturas' },
      { id: 'ahorro', icono: '💶', nombre: 'Ahorrar 1.500 €', actual: 1284, meta: 1500, paso: 50, formato: 'euros' },
      { id: 'correr', icono: '🏃', nombre: 'Correr 300 km', actual: 300, meta: 300, paso: 5, unidad: 'km' },
    ],
    viajes: [
      { id: 'navidad', icono: '🎄', destino: 'Navidad en casa', salida: '2026-12-19', vuelta: '2027-01-07' },
      { id: 'puente', icono: '🏔️', destino: 'Puente de diciembre en los Picos de Europa', salida: '2026-12-05', vuelta: '2026-12-08' },
      { id: 'erasmus', icono: '✈️', destino: 'Visitar a Lucía en Lisboa', salida: '2027-03-26', vuelta: '2027-03-29' },
      { id: 'verano', icono: '🏖️', destino: 'Verano en Cádiz', salida: '2027-07-15', vuelta: '2027-07-30' },
    ],
  };
}