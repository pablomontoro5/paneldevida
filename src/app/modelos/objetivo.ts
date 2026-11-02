// Un objetivo del año. "actual" es el progreso y "paso" lo que suman o restan los botones.
// Con formato "euros" se muestra como dinero; si no, se usa "unidad".
export interface Objetivo {
  id: string;
  icono: string;
  nombre: string;
  actual: number;
  meta: number;
  paso: number;
  unidad?: string; // ? = no obligatorio
  formato?: 'euros'; // ? = no obligatorio
}