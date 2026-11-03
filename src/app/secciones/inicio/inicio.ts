import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Almacen } from '../../nucleo/almacen';
import { mayusculaInicial, saludoSegunHora } from '../../compartido/fechas';
import { HabitosGuardados } from '../habitos/habitos.guardados';
import { clavePrioridades, contarHechas } from '../prioridades/prioridades.logica';
import { PrioridadesGuardadas } from '../prioridades/prioridades.guardados';
import { RegistroHabitos, completarRegistro, textoRacha } from '../habitos/habitos.logica';
import { ProgresoObjetivos, claveObjetivos, formatoPorcentaje, fraccionDelAnio } from '../objetivos/objetivos.logica';
import { ObjetivosGuardados } from '../objetivos/objetivos.guardados';
import { AgendaGuardada } from '../agenda/agenda.guardados';
import { textoCuentaAtras } from '../viajes/viajes.logica';
import { ViajesGuardados } from '../viajes/viajes.guardados';
import {
  eventoDestacado,
  eventosRestantes,
  fraseDelDia,
  habitosHechosHoy,
  mejorRacha,
  objetivosAlDia,
  proximoViaje,
} from './inicio.logica';

const formatoFecha = new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' });

// La portada: bienvenida según la hora y un resumen corto de cada sección.
@Component({
  imports: [RouterLink],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  private readonly almacen = inject(Almacen);
  private readonly hoy = new Date();
  private readonly minutoActual = this.hoy.getHours() * 60 + this.hoy.getMinutes();

  protected readonly saludo = saludoSegunHora(this.hoy.getHours());
  protected readonly fecha = mayusculaInicial(formatoFecha.format(this.hoy));

  private readonly listaHabitos = inject(HabitosGuardados).elementos();

  // Lo que ya está marcado en cada sección, para que el resumen coincida con ellas.
  private readonly hechas = this.almacen.leer<string[]>(clavePrioridades(this.hoy), []);
  private readonly registro = completarRegistro(
    this.almacen.leer<RegistroHabitos | null>('habitos', null),
    this.listaHabitos,
    this.hoy,
  );
  private readonly progreso = this.almacen.leer<ProgresoObjetivos>(claveObjetivos(this.hoy), {});
  private readonly ritmo = fraccionDelAnio(this.hoy);

  private readonly eventos = inject(AgendaGuardada).elementos();
  protected readonly agenda = {
    evento: eventoDestacado(this.eventos, this.minutoActual),
    restantes: eventosRestantes(this.eventos, this.minutoActual),
  };

  private readonly listaPrioridades = inject(PrioridadesGuardadas).elementos();
  private readonly prioridadesHechas = contarHechas(this.listaPrioridades, this.hechas);
  protected readonly prioridades = {
    hechas: this.prioridadesHechas,
    total: this.listaPrioridades.length,
    ancho: (this.prioridadesHechas / Math.max(this.listaPrioridades.length, 1)) * 100,
  };

  protected readonly habitos = {
    mejor: mejorRacha(this.listaHabitos, this.registro, this.hoy),
    hechosHoy: habitosHechosHoy(this.listaHabitos, this.registro, this.hoy),
    total: this.listaHabitos.length,
  };

  private readonly listaObjetivos = inject(ObjetivosGuardados).elementos();
  protected readonly objetivos = {
    alDia: objetivosAlDia(this.listaObjetivos, this.progreso, this.ritmo),
    total: this.listaObjetivos.length,
    textoRitmo: formatoPorcentaje(this.ritmo),
  };

  protected readonly viaje = proximoViaje(inject(ViajesGuardados).elementos(), this.hoy);

  protected readonly frase = fraseDelDia(
    this.agenda.restantes,
    this.prioridades.total - this.prioridades.hechas,
  );

  protected readonly textoRacha = textoRacha;
  protected readonly textoCuentaAtras = textoCuentaAtras;
}
