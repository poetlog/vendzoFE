import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements OnInit {
  user: any;
  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getProfile().subscribe(data => {
      this.user = data;
    });
  }
  signOut(): void {
    this.authService.logout();
  }
}
