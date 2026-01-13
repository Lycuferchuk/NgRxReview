import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, ViewTransitionInfo, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ViewTransitionService } from './core/services/view-transition.service';

function onViewTransitionCreated(info: ViewTransitionInfo): void {
  const viewTransitionService = inject(ViewTransitionService);
  viewTransitionService.currentTransition.set(info);

  info.transition.finished.finally(() => {
    viewTransitionService.currentTransition.set(null);
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions({ onViewTransitionCreated })),
    provideHttpClient(),
  ],
};
