import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Almacen } from '../../nucleo/almacen';
import { nuevoId } from '../../compartido/lista';
import { calcularRacha, claveFecha } from '../../compartido/fechas';
import { Habito } from './habito.modelo';
import { HabitosGuardados } from './habitos.guardados';
import { ICONOS_HABITO, PLANTILLAS_HABITO, aplicarPlantilla } from './habitos.plantillas';
import {
  BORRADOR_HABITO_VACIO,
  BorradorHabito,
  ErroresHabito,
  RegistroHabitos,
  alternarDia,
  borradorAHabito,
  completarRegistro,
  habitoABorrador,
  quitarRegistro,
  textoRacha,
  ultimosSieteDias,
  validarHabito,
} from './habitos.logica';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-habitos',
  styleUrl: './habitos.css',
  templateUrl: './habitos.html',
})
export class Habitos {
  private readonly guardados = inject(HabitosGuardados);
  protected readonly habitos = this.guardados.elementos;

  // ---------- Los días que has cumplido cada hábito ----------
  private readonly almacen = inject(Almacen);
  private readonly hoy = new Date();

  private readonly guardado = signal(this.almacen.leer<RegistroHabitos | null>('habitos', null));
  private readonly registro = computed(() => completarRegistro(this.guardado(), this.habitos(), this.hoy));

  protected readonly textoRacha = textoRacha;
  protected readonly filas = computed(() => {
    const registro = this.registro();
    const claveHoy = claveFecha(this.hoy);
    return this.habitos().map(h => {
      const fechas = registro[h.id];
      const semana = ultimosSieteDias(fechas, this.hoy);
      return {
        ...h,
        racha: calcularRacha(fechas, this.hoy),
        hechoHoy: fechas.includes(claveHoy),
        semana,
        cumplidosSemana: semana.filter(d => d.cumplido).length,
      };
    });
  });

  private guardarRegistro(nuevo: RegistroHabitos): void {
    this.guardado.set(nuevo);
    this.almacen.guardar('habitos', nuevo);
  }

  protected marcarHoy(id: string): void {
    const actual = this.registro();
    this.guardarRegistro({ ...actual, [id]: alternarDia(actual[id], claveFecha(this.hoy)) });
  }

  // ---------- Formulario ----------
  protected readonly plantillas = PLANTILLAS_HABITO;
  protected readonly iconos = ICONOS_HABITO;

  // null = formulario cerrado; '' = hábito nuevo; otro texto = id del que se edita.
  protected readonly editando = signal<string | null>(null);
  // Id del hábito que espera confirmación para borrarse.
  protected readonly borrando = signal<string | null>(null);
  protected readonly errores = signal<ErroresHabito>({});

  protected readonly formulario = new FormGroup({
    icono: new FormControl(BORRADOR_HABITO_VACIO.icono, { nonNullable: true }),
    nombre: new FormControl('', { nonNullable: true }),
  });

  private readonly campoNombre = viewChild<ElementRef<HTMLInputElement>>('campoNombre');

  protected abrirNuevo(): void {
    this.abrir('', BORRADOR_HABITO_VACIO);
  }

  protected editar(h: Habito): void {
    this.abrir(h.id, habitoABorrador(h));
  }

  protected usarPlantilla(plantilla: BorradorHabito): void {
    this.formulario.setValue(aplicarPlantilla(this.formulario.getRawValue(), plantilla));
  }

  protected cancelar(): void {
    this.editando.set(null);
    this.errores.set({});
  }

  protected guardar(): void {
    const borrador = this.formulario.getRawValue();
    const errores = validarHabito(borrador);
    this.errores.set(errores);
    if (Object.keys(errores).length > 0) return;

    const id = this.editando();
    const anterior = this.habitos().find(h => h.id === id);
    if (anterior) {
      // Al editar se mantienen el id y el historial de ejemplo, así no se pierde ningún día.
      this.guardados.guardar({ ...borradorAHabito(borrador, anterior.id), historialEjemplo: anterior.historialEjemplo });
    } else {
      this.guardados.guardar(borradorAHabito(borrador, nuevoId('habito', this.habitos())));
    }
    this.cancelar();
  }

  // Al borrar un hábito también se borran los días que lo habías cumplido (y su racha).
  protected confirmarBorrado(id: string): void {
    const registro = this.registro();
    this.guardados.borrar(id);
    this.guardarRegistro(quitarRegistro(registro, id));
    this.borrando.set(null);
    if (this.editando() === id) this.cancelar();
  }

  private abrir(id: string, borrador: BorradorHabito): void {
    this.formulario.setValue(borrador);
    this.errores.set({});
    this.borrando.set(null);
    this.editando.set(id);
    // Espera a que se pinte el formulario para llevar el foco (y la pantalla) al nombre.
    setTimeout(() => {
      const campo = this.campoNombre()?.nativeElement;
      campo?.focus();
      campo?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
    });
  }
}
