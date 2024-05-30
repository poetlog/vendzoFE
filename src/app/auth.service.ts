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
          alert('Registration complete. Please sign in.');

          this.router.navigate(['/signin']);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        alert('Registration failed');
        return new Observable((observer: Observer<any>) => {
          observer.error(error);
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
          localStorage.setItem('username', username);
          this.router.navigate(['/profile']);
        }
      })
    );
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.router.navigate(['/signin']);
  }

}
