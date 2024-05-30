import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { authGuard } from './auth.guard'; 
import { UserPageComponent } from './user-page/user-page.component';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'profile', component: UserPageComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/signin', pathMatch: 'full' }
];

export const appRoutingProviders = [
    provideRouter(routes)
  ];