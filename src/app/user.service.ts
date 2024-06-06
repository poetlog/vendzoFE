import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'https://localhost:7042/api';
  profileUpdated = new EventEmitter<any>();


  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/User/find/id=${localStorage.getItem('userId')}`);
  }
  updateProfile(user: any): Observable<any> {
    return this.http.put<any>(
              `${this.baseUrl}/User/update?userId=`+localStorage.getItem("userId"), 
              user
            ).pipe(
              tap(() => this.profileUpdated.emit())
            );
  }

  changePassword(oldPassword:string ,newPassword: string): Observable<any> {
    return this.http.put<any>(
              `${this.baseUrl}/Auth/changePassword/userId=`+localStorage.getItem("userId"), 
              {oldPassword, newPassword}
            );
  }

  getAddresses(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Address/find/userId=${localStorage.getItem('userId')}`);
  }

  addAddress(address: any): Observable<any> {
    const addressDTO = {
      title: address.title,
      contactNo: address.contact.toString(),
      address1: address.details,
      userId: localStorage.getItem('userId'),
      setAsDefault: address.isDefault
    };
    return this.http.post<any>(
              `${this.baseUrl}/Address/create`, 
              addressDTO
            );
  }

  setDefaultAddress(addressId: string): Observable<any> {
    return this.http.put<any>(
              `${this.baseUrl}/User/setDefaultAddress?userId=${localStorage.getItem('userId')}&addressId=${addressId}`, 
              {}
            );
  }

  deleteAddress(addressId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Address/delete/soft?addressId=${addressId}`);
  }

  getItems(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Item/find/user=${localStorage.getItem('userId')}`);
  }

  addItem(item: any): Observable<any> {
    if(item.photo === '' || item.photo === null || item.photo === undefined)
        item.photo = "https://placehold.co/600x400?text=PLACEHOLDER"

    // Normalize category name
    item.category = item.category.toLowerCase().trim();
    item.category = item.category.replace(/\b\w/g, (l:string) => l.toUpperCase());

    const itemDTO = {
      title: item.title,
      sellerId: localStorage.getItem('userId'),
      description: item.description,
      category: item.category,
      price: item.price.toString(),
      photo: item.photo,
      stock: item.stock.toString(),
    };
    return this.http.post<any>(
              `${this.baseUrl}/Item/create`, 
              itemDTO
            );
  }
  deleteItem(itemId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Item/delete/soft?id=${itemId}`);
  }

  editItem(itemId:string, item: any): Observable<any> {
    if(item.photo === '' || item.photo === null || item.photo === undefined)
        item.photo = "https://placehold.co/600x400?text=PLACEHOLDER"
    const itemDTO = {
      id: itemId,
      title: item.title,
      sellerId: localStorage.getItem('userId'),
      description: item.description,
      category: item.category,
      price: item.price,
      photo: item.photo,
      stock: item.stock,
    };
    return this.http.put<any>(
              `${this.baseUrl}/Item/update?itemId=${itemId}`, 
              itemDTO
            );
  }
}
