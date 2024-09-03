import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../app-setting';



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

  saveUsers(userData: any) {
    return new Promise((resolve, reject) => {
      const body = {
        txtUserId: userData.userId,    // Ensure these names match backend requirements
        txtPassword: userData.password,
        txtName: userData.name,
        txtEmail: userData.email
      };

      // Use POST request
      this.http.post(this.apiBaseUrl + 'RegisterMLM', body).subscribe(
        (res: any) => {
          resolve(res);
          console.log("RegisterMLM", res);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }
  

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
