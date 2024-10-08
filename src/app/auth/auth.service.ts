import { HttpClient, HttpHeaders } from '@angular/common/http';
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

    // Register MLM method
    async registerMLM(txtUserId: string, txtPassword: string, txtName: string, txtEmail: string): Promise<any> {
      const url = `${this.apiBaseUrl}RegisterMLM?txtUserId=${encodeURIComponent(txtUserId)}&txtPassword=${encodeURIComponent(txtPassword)}&txtName=${encodeURIComponent(txtName)}&txtEmail=${encodeURIComponent(txtEmail)}`;
      
      // Make HTTP POST request
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': '*/*'
      });
  
      return this.http.post(url, '', { headers }).toPromise();
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
