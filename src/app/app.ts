import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
@Component({
  imports: [DatePipe],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Pablo Javier Montoro Bermudez');
  protected readonly hoy = new Date();
  protected readonly descripcion = signal('Desarrollador web y programador de aplicaciones móviles');
}
