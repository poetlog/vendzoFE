import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AppLayoutModule } from './layout/app.layout.module';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule, AppLayoutModule]
})
export class AppComponent {
  items: MenuItem[] = [];
  constructor(private primengConfig: PrimeNGConfig) { }

    ngOnInit() {
        this.items = [
          {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/']
          },
          // other menu items...
        ];
        this.primengConfig.ripple = true;

    }
}
