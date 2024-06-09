import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit{

    items!: MenuItem[];
    user : any;
    isLogged = this.authService.isAuthenticated();
    cartSidebarVisible: boolean = false;


    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, 
        private userService: UserService,
        private authService: AuthService) { }

    ngOnInit(): void {
        if (this.isLogged) {
            this.userService.getProfile().pipe().subscribe((data: any) => {
                this.user = data;
            }
          );
          this.userService.profileUpdated.subscribe(() => {
                this.userService.getProfile().pipe().subscribe((data: any) => {
                    this.user = data;
                }
            );
          });
        }
    }
}
