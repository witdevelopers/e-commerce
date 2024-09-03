import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../app-setting';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiBaseUrl = Settings.apiUrl + 'Account/';

  constructor(private http: HttpClient) {}

  // Commented out the previous login method using address and signature
  login(address, signature) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl + "Login?address=" + address + "&signature=" + signature).subscribe((res: any) => {
        resolve(res);
      });
    });
  }


    loginMLM(UserID:string, password:string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl + "loginMLM?UserID=" + UserID + "&password=" + password).subscribe((res: any) => {
        resolve(res);
        console.log("Login MLM Details: ",res);
        
      });
    });
  }

  
  register(sponsorAddress, transactionHash) {
    return new Promise((resolve, reject) => {
      let payload = { sponsorAddress, transactionHash };
      this.http.post(this.apiBaseUrl + 'Register', payload).subscribe((res: any) => {
        resolve(res);
      });
    });
  }




  // registerMLM(userData: any): Observable<any> {
  //   // Directly return the observable from the HTTP request
  //   return this.http.post<any>(this.apiBaseUrl + 'RegisterMLM', userData);
  // }

  registerMLM(userData: any): Promise<any> {
    const body = {
      txtUserId: userData.userId,
      txtPassword: userData.password,
      txtName: userData.name,
      txtEmail: userData.email
    };

    return new Promise((resolve, reject) => {
      this.http.post<any>(`${this.apiBaseUrl}RegisterMLM`, body).toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }


  // registerMLM(fullName: string, email: string, password: string): Observable<any> {
  //   const body = { fullName, email, password };
  //   return this.http.post<any>(`${this.apiBaseUrl}RegisterMLM`, body);
  // }


  isSponsorValid(sponsorId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl + 'IsSponsorValid?sponsorId=' + sponsorId).subscribe((res: any) => {
        resolve(res);
      });
    });
  }


  getPackages() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl + 'GetPackages').subscribe((res: any) => {
        resolve(res);
      });
    });
  }
}
