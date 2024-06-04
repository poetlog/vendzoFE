import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { authGuard } from './auth.guard'; 
import { UserPageComponent } from './user-page/user-page.component';
import { signGuard } from './sign.guard';
import { HomepageComponent } from './homepage/homepage.component';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent, canActivate: [signGuard] },
  { path: 'signin', component: SigninComponent, canActivate: [signGuard]},
  { path: 'profile', component: UserPageComponent, canActivate: [authGuard] },
  { path: '', component: HomepageComponent },
  { path: 'home', component: HomepageComponent }
];

export const appRoutingProviders = [
    provideRouter(routes)
  ];