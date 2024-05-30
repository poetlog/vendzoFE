import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutService } from '../layout/service/app.layout.service';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule,    
    ButtonModule,
    CheckboxModule,
    FormsModule,
    PasswordModule,
    InputTextModule,
    RadioButtonModule,]
})
export class SignupComponent {
  signupForm: FormGroup;
  satici = false;
  isLoading = false;

  selectedButton = 'false';

  selectButton(button: string) {
    this.selectedButton = button;
    button === 'true' ? this.satici = true : this.satici = false;
  }

  constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  navigateToSignin() {
    this.router.navigate(['/signin']);
    }

  onSignup() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.authService.signup(
        this.signupForm.value.email, 
        this.signupForm.value.username,
        this.signupForm.value.password,
        this.satici
      )
        .subscribe(response => {
          this.isLoading = false;
          console.log('Signup successful', response);
        }, error => {
          this.isLoading = false;
          console.error('Signup failed', error);
        });
    }
  }
}
