import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private baseUrl = 'https://localhost:7042/api';

  constructor(private http: HttpClient) { }

  getAllItems(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Item/all`);
  }

}
