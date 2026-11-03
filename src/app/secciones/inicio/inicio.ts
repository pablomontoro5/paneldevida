import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Almacen } from '../../nucleo/almacen';
import { mayusculaInicial, saludoSegunHora } from '../../compartido/fechas';
import { crearDatosDeEjemplo } from '../../datos';
import { clavePrioridades } from '../prioridades/prioridades.logica';
import { RegistroHabitos, completarRegistro, textoRacha } from '../habitos/habitos.logica';
import { ProgresoObjetivos, claveObjetivos, formatoPorcentaje, fraccionDelAnio } from '../objetivos/objetivos.logica';
import { textoCuentaAtras } from '../viajes/viajes.logica';
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
  private readonly datos = crearDatosDeEjemplo();
  private readonly hoy = new Date();
  private readonly minutoActual = this.hoy.getHours() * 60 + this.hoy.getMinutes();

  protected readonly saludo = saludoSegunHora(this.hoy.getHours());
  protected readonly fecha = mayusculaInicial(formatoFecha.format(this.hoy));

  // Lo que ya está marcado en cada sección, para que el resumen coincida con ellas.
  private readonly hechas = this.almacen.leer<string[]>(clavePrioridades(this.hoy), []);
  private readonly registro = completarRegistro(
    this.almacen.leer<RegistroHabitos | null>('habitos', null),
    this.datos.habitos,
    this.hoy,
  );
  private readonly progreso = this.almacen.leer<ProgresoObjetivos>(claveObjetivos(this.hoy), {});
  private readonly ritmo = fraccionDelAnio(this.hoy);

  protected readonly agenda = {
    evento: eventoDestacado(this.datos.agenda, this.minutoActual),
    restantes: eventosRestantes(this.datos.agenda, this.minutoActual),
  };

  protected readonly prioridades = {
    hechas: this.hechas.length,
    total: this.datos.prioridades.length,
    ancho: (this.hechas.length / Math.max(this.datos.prioridades.length, 1)) * 100,
  };

  protected readonly habitos = {
    mejor: mejorRacha(this.datos.habitos, this.registro, this.hoy),
    hechosHoy: habitosHechosHoy(this.datos.habitos, this.registro, this.hoy),
    total: this.datos.habitos.length,
  };

  protected readonly objetivos = {
    alDia: objetivosAlDia(this.datos.objetivos, this.progreso, this.ritmo),
    total: this.datos.objetivos.length,
    textoRitmo: formatoPorcentaje(this.ritmo),
  };

  protected readonly viaje = proximoViaje(this.datos.viajes, this.hoy);

  protected readonly frase = fraseDelDia(
    this.agenda.restantes,
    this.prioridades.total - this.prioridades.hechas,
  );

  protected readonly textoRacha = textoRacha;
  protected readonly textoCuentaAtras = textoCuentaAtras;
}
