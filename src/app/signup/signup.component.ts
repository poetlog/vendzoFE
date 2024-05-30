import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SignupComponent {
  signupForm: FormGroup;
  //satici = false;

  constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      satici: [false]
    });
  }

  navigateToSignin() {
    this.router.navigate(['/signin']);
    }

  onSignup() {
    if (this.signupForm.valid) {
      this.authService.signup(
        this.signupForm.value.email, 
        this.signupForm.value.username,
        this.signupForm.value.password,
        this.signupForm.value.satici
      )
        .subscribe(response => {
          console.log('Signup successful', response);
        }, error => {
          console.error('Signup failed', error);
        });
    }
  }
}
