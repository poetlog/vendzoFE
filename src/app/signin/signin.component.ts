import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SigninComponent {
  signinForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router) {
    this.signinForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }

  onSignin() {
    if (this.signinForm.valid) {
      this.isLoading = true;
      this.authService.signin(this.signinForm.value.username, this.signinForm.value.password)
        .subscribe(response => {
          this.isLoading = false;
          console.log('Signin successful', response);
        }, error => {
          this.isLoading = false;
          console.error('Signin failed', error);
          alert("Giriş Başarısız!\nLütfen bilgilerinizi kontrol edin.")
        });
    }
  }
}
