// Datos de ejemplo del panel. Más adelante se sustituirán por datos reales.
var DATOS = {
  // Eventos de hoy. Horas en formato 24 h ("HH:MM").
  agenda: [
    { inicio: "08:30", fin: "10:30", titulo: "Clase de Estructuras de Datos", lugar: "Aula 2.4" },
    { inicio: "11:00", fin: "13:00", titulo: "Prácticas de Redes", lugar: "Laboratorio L3" },
    { inicio: "14:00", fin: "15:00", titulo: "Comida con el grupo", lugar: "Cafetería" },
    { inicio: "16:30", fin: "18:00", titulo: "Estudiar para el parcial de Sistemas Operativos", lugar: "Biblioteca" },
    { inicio: "19:00", fin: "20:00", titulo: "Gimnasio", lugar: "" }
  ],

  // Las tres cosas más importantes del día.
  prioridades: [
    { id: "p1", texto: "Terminar la práctica 3 de Redes" },
    { id: "p2", texto: "Repasar los temas 4 y 5 de Sistemas Operativos" },
    { id: "p3", texto: "Llamar a casa" }
  ],

  // Hábitos. "historialEjemplo" son los días atrás en que se cumplió (1 = ayer),
  // y solo se usa la primera vez que se abre el panel.
  habitos: [
    { id: "leer", icono: "📚", nombre: "Leer 20 minutos", historialEjemplo: [1, 2, 3, 4, 5, 6, 8, 9] },
    { id: "ejercicio", icono: "🏃", nombre: "Hacer ejercicio", historialEjemplo: [1, 3, 4, 6] },
    { id: "agua", icono: "💧", nombre: "Beber 2 litros de agua", historialEjemplo: [1, 2, 3] },
    { id: "programar", icono: "💻", nombre: "Programar algo propio", historialEjemplo: [2, 3, 4, 5] }
  ]
};
