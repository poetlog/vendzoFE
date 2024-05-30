import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7042/api'; // TODO: change in prod

  constructor(private http: HttpClient, private router: Router) { }

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
          let errorMessage = 'Kayıt Başarısız\n';
          if (error.error && error.error.length) {
            errorMessage += error.error.map((err: any) => err.description).join('\n');
          } else if (error.error.error) {
            errorMessage += error.error.error;
          } else {
            errorMessage += 'Bilinmeyen Hata';
          }
          alert(errorMessage);
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

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    this.router.navigate(['/signin']);
  }

}
