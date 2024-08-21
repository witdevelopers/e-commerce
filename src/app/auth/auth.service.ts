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
        console.log(res);
        
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

  saveUsers(UserID, password){
    
    return new Promise((resolve, reject) => {
      const body = { userId: UserID, password: password };
      this.http.get(this.apiBaseUrl + "registerMLM?UserID=" + UserID + "&password=" + password).subscribe((res: any) => {
               resolve(res);
            });
    });
  }



  // saveUsers(UserID: string, password: string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     const body = { userId: UserID, password: password };
  
  //     this.http.post(this.apiBaseUrl + "registerMLM", body).subscribe((res: any) => {
  //       resolve(res);
  //     });
  //   });
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
