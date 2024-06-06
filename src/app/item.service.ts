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

  getItemCount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Item/count`);
  }

  getAllItemsByPage(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Item/all/page=${page}`);
  }

  getItemById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Item/find/id=${id}`);
  }

  getItemsByCategory(category: string, page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Item/filter/${category}/page=${page}`);
  }

  getItemsBySearch(search: string, page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Item/search/${search}/page=${page}`);
  }

  getItemsSortedByPriceAsc(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Item/sort/priceAsc/page=${page}`);
  }

  getItemsSortedByPriceDesc(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Item/sort/priceDesc/page=${page}`);
  }
  
  getItemsSortedByTitle(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Item/sort/title/page=${page}`);
  }

  getItemsSortedByDateAsc(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Item/sort/dateAsc/page=${page}`);
  }

  getItemsSortedByDateDesc(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Item/sort/dateDesc/page=${page}`);
  }

  getItemsSorted(sortTerm: string, page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Item/sort/${sortTerm}/page=${page}`);
  }

  getFeaturedItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Item/featured`);
  }
  
}
