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

  getSellerOfItem(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Item/find/seller/itemId=${id}`);
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
  
  addToCart(itemId: string): Observable<any> {
    let basket = {
      UserId: localStorage.getItem('userId'),
      ItemId: itemId,
      Quantity: 1
    };
    return this.http.post(`${this.baseUrl}/Basket/create`, basket );
  }
  
  getCartItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Basket/user/${localStorage.getItem('userId')}`);
  }

  deleteCartItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Basket/delete/soft?basketId=${id}`);
  }

  deleteCart(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Basket/clear/user/${localStorage.getItem('userId')}`);
  }

  updateCartItemQuantity(id: number, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/Basket/update/quantity/basketId=${id}&quantity=${quantity}`, null);
  }

  checkPromoCode(code: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Promotion/check/code=${code}`);
  }

}
