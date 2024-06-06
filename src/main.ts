import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes, appRoutingProviders } from './app/app.routes';
import { authInterceptor } from './app/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CommonModule } from '@angular/common';

/*
if (environment.production) {
  enableProdMode();
}
*/

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    appRoutingProviders,
    provideHttpClient(withInterceptors([authInterceptor])), 
    provideAnimationsAsync()
  ]
});
