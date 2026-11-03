import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(), // pasa los datos de la ruta a los inputs
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }), // cada sección empieza arriba
    ),
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ],
};
