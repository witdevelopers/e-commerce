import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../../app-setting';

@Injectable({
  providedIn: 'root'
})
export class FundService {

  private apiBaseUrl = Settings.apiUrl + 'Fund/'

  constructor(private http: HttpClient) { }

  invest(txnHash: string) {
    return new Promise((resolve, reject) => {

      this.http.post(this.apiBaseUrl + "Invest", { transactionHash: txnHash, packageId: 0 }).subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  sellToken(tokenAmount: number) {
    return new Promise((resolve, reject) => {

      this.http.get(this.apiBaseUrl + "SellTokens?tokenAmount="+tokenAmount).subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  withdrawIncome(amount: number, walletId: number) {
    return new Promise((resolve, reject) => {

      this.http.get(this.apiBaseUrl + "Withdraw?amount="+amount+"&walletId="+walletId).subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  withdrawMTA(amount: number) {
    return new Promise((resolve, reject) => {

      this.http.get(this.apiBaseUrl + "Withdraw_MTA?amount="+amount).subscribe((res: any) => {
        resolve(res);
      });
    });
  }

}
