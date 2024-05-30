import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutService } from '../layout/service/app.layout.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    PasswordModule,
    InputTextModule,
  ]
})
export class SigninComponent {
  signinForm: FormGroup;
  isLoading = false;
  constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    public layoutService: LayoutService,
    private snackBar: MatSnackBar,) {
    this.signinForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
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
          //alert("Giriş Başarısız!\nLütfen bilgilerinizi kontrol edin.")
          this.snackBar.open("Giriş Başarısız!\nLütfen bilgilerinizi kontrol edin.", 'KAPAT', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        });
    }
  }
}
