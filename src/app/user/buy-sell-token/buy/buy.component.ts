import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Settings } from 'src/app/app-setting';
import { NgxSpinnerService } from "ngx-spinner";
import { ContractService } from 'src/app/services/contract.service';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { CompanyService } from 'src/app/services/company.service';
import { FundService } from '../../services/fund.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {

  maticAmount: number = 0;
  tokenAmount: number = 0;
  tokenSymbol: string = "";
  account: any;
  maticToToken: any;

  MaticBalance: number = 0;
  tokenAmount_WithoutDeduction: number = 0;
  packages: any[] = []

  _startId: number = 0;
  SecondsRemainingForNextBoosterTopup: number = 0;
  timer: any;
  constructor(private spinnerService: NgxSpinnerService, private api: UserService, private fund: FundService, private company: CompanyService, private contractService: ContractService) {
    this.tokenSymbol = Settings.coinSymbol;
    this.packages = this.company.topupPackages;
    this.initialize();
  }

  ngOnInit(): void {
  }

  async initialize() {
    
    let userInfo = ((await this.api.dashboard()) as any).data.table[0];

    this.SecondsRemainingForNextBoosterTopup = userInfo.secondsRemainingForNextBoosterTopup;
    this.startCountdown();
    // console.log("seconds", this.SecondsRemainingForNextBoosterTopup)

    this.maticToToken = 1/this.company.companyDetails.tokenRate;
    this.MaticBalance = await this.contractService.fetchAddressBalance();
    // console.log("balance", this.MaticBalance)

    this.calculateTokens();

  }

  calculateTokens() {
    let temp_matic = this.maticAmount * 0.6;
    this.tokenAmount = temp_matic * this.maticToToken;
    this.tokenAmount_WithoutDeduction = this.maticAmount * this.maticToToken;
    console.log(temp_matic, this.tokenAmount, this.tokenAmount_WithoutDeduction)
  }

  async buy(pack) {
    this.maticAmount = pack.value;
    if (this.maticAmount < this.MaticBalance) {
      if (this.maticAmount > 0) {
        this.spinnerService.show();

        let receipt = await this.contractService.Reinvest(this.maticAmount, pack.srno);

        //console.log(receipt);

        if (receipt.success) {
          let result: any = await this.fund.invest(receipt.data.transactionHash);


          this.spinnerService.hide();
          // console.log(x);
          if (result.status) {
            Swal.fire({
              icon: "success",
              title: 'Deposit successful!'
            }).then(async () => {
              //await this.company.getCompanyDetails();
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
        else {
          Swal.fire({
            icon: 'error',
            title: 'Transaction failed!'
          });
        }

        this.spinnerService.hide();
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Enter a valid amount'
        });
      }
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Insufficient balance!'
      });
    }
  }

  setAmount(percentage: number) {
    this.maticAmount = percentage;
    this.calculateTokens();
  }

  
  startCountdown() {
    // console.log(this.secondsRemaining)
    let that = this;
    this.timer = setInterval(function () {
      if (that.SecondsRemainingForNextBoosterTopup <= 0) {
        clearInterval(this.timer);
        // document.getElementById("timer").innerHTML = "00:00:00";
        return;
      }
      
      var hours = Math.floor(that.SecondsRemainingForNextBoosterTopup / 3600);
      var minutes = Math.floor((that.SecondsRemainingForNextBoosterTopup % 3600) / 60);
      var seconds = that.SecondsRemainingForNextBoosterTopup % 60;

      var formattedHours = (hours < 10 ? "0" : "") + hours;
      var formattedMinutes = (minutes < 10 ? "0" : "") + minutes;
      var formattedSeconds = (seconds < 10 ? "0" : "") + seconds;

      document.getElementById("timer").innerHTML = formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;

      that.SecondsRemainingForNextBoosterTopup--;
    }, 1000);
  }

}
