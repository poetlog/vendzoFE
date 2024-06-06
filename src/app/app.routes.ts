import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { authGuard } from './auth.guard'; 
import { UserPageComponent } from './user-page/user-page.component';
import { signGuard } from './sign.guard';
import { HomepageComponent } from './homepage/homepage.component';
import { AppLayoutComponent } from "./layout/app.layout.component";

export const routes: Routes = [
  { path: 'signup', component: SignupComponent, canActivate: [signGuard] },
  { path: 'signin', component: SigninComponent, canActivate: [signGuard]},
  {
    path: '', component: AppLayoutComponent,
    children: [
        { path: '', component: HomepageComponent },
        { path: 'profile', component: UserPageComponent, canActivate: [authGuard] },
        //{ path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
        //{ path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
        //{ path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
        //{ path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
        //{ path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) }
    ]
  },
];

export const appRoutingProviders = [
    provideRouter(routes)
  ];