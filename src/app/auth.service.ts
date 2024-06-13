import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://vendzoapi-a5e9c7fua5c5bney.polandcentral-01.azurewebsites.net/api'; // TODO: change in prod

  constructor(private http: HttpClient, 
    private router: Router, 
    private snackBar: MatSnackBar) { }

  signup(email: string, username:string, password: string, isClient: boolean): Observable<any> {
    const url = `${this.baseUrl}/auth/register`;
    const body = { email, username, password , isClient};
    return this.http.post(url, body, { observe: 'response' }).pipe(
      tap((response: HttpResponse<any>) => {
        if (response.status === 200) {
          alert('Kayıt Tamamlandı.\nGiriş Yapabilirsiniz.');

          this.router.navigate(['/signin']);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return new Observable((observer: Observer<any>) => {
          observer.error(error);
          console.log(error.error);
          let errorMessage = 'HATA:\n';
          if (error.error && error.error.length) {
            errorMessage += error.error.map((err: any) => err.description).join('\n');
          } else if (error.error.error) {
            errorMessage += error.error.error;
          } else {
            errorMessage += 'Bilinmeyen Hata';
          }
          //alert(errorMessage);
          this.snackBar.open(errorMessage, 'Kapat', {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
        });
      })
    );
  }

  signin(username: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { username, password };
    return this.http.post(url, body).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userId', response.userId);
          this.router.navigate(['/profile']);
        }
      })
    );
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  isTokenExpired(token: any): void {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime){
      console.log('Token süresi dolmuş');
      this.logout();
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    window.location.href = '';
  }

}

