import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { FundService } from '../services/fund.service';
import { UserService } from '../services/user.service';
import { WalletService } from '../services/wallet.service';
import { Settings } from 'src/app/app-setting';

@Component({
  selector: 'app-withdraw-dividend',
  templateUrl: './withdraw-dividend.component.html',
  styleUrls: ['./withdraw-dividend.component.css']
})
export class WithdrawDividendComponent implements OnInit {

  withdrawalAmount: number = 0.1;
  balanceDividend: number = 0;
  amountReceived: number = 0;
  deductionPercentage: number = 10;
  selectedWallet: number = 1;

  wallets: any[] = []
  paymentToken: string = Settings.paymentToken;
  constructor(private spinnerService: NgxSpinnerService, private wallet: WalletService, private fund: FundService, private userInfoService: UserService) {
  }

  ngOnInit() {
    this.initialize();
    this.calculateAmountReceived();
  }

  async initialize() {
    let info = ((await this.userInfoService.dashboard()) as any).data.table[0];
    this.balanceDividend = Number(info.totalIncome-info.amountWithdrawn);
    //console.log(this.balanceDividend);

    this.wallets = ((await this.wallet.getWallets()) as any).table;
    this.selectedWallet = this.wallets[0].srno;
    this.onWalletChange();
    console.log(this.wallets)
  }

  async onWalletChange(){
    // console.log(((await this.wallet.getBalance(this.selectedWallet)) as any))
    this.balanceDividend = ((await this.wallet.getBalance(this.selectedWallet)) as any).balance;

    this.deductionPercentage = this.selectedWallet == 1?10:3;
  }

  max(){
    this.withdrawalAmount = this.balanceDividend;
    this.calculateAmountReceived();
  }

  async withdraw() {
    this.spinnerService.show();
    
    let result: any = await this.fund.withdrawIncome(this.withdrawalAmount, this.selectedWallet);

    this.spinnerService.hide();
    // console.log(x);
    if (result.status) {
      Swal.fire({
        icon: "success",
        title: result.message
      }).then(async () => {
        this.initialize()
      });
    }
    else {
      Swal.fire({
        icon: 'error',
        title: result.message
      });
    }
  }

  async calculateAmountReceived()
  {
    this.amountReceived = this.withdrawalAmount-(this.withdrawalAmount*this.deductionPercentage/100)
  }
}
