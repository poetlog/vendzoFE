import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'https://localhost:7042/api';

  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/User/find/id=${localStorage.getItem('userId')}`);
  }
  updateProfile(user: any): Observable<any> {
    return this.http.put<any>(
              `${this.baseUrl}/User/update?userId=`+localStorage.getItem("userId"), 
              user
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
}
