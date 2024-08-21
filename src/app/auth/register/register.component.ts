import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { Settings } from 'src/app/app-setting';
import { AuthService } from '../auth.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../login/login.component.css']
})
export class RegisterComponent implements OnInit {
  paymentToken: string = Settings.paymentToken;
  account: string = '';
  sponsorId: string = '';
  amount: number = 3;
  _subscription: any;
  maticToToken: any;
  tokenSymbol: string = "";

  packages: any[] = []

  constructor(private contractService: ContractService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    private company: CompanyService,
    private api: AuthService) {

    this.getAddress();
  }

  async ngOnInit() {
    this.tokenSymbol = Settings.coinSymbol;
    this.sponsorId = this.activatedRoute.snapshot.paramMap.get("id")!;

    this.packages = this.company.packages;//((await this.api.getPackages()) as any).data;
    console.log(this.packages)

    // this.maticToToken = (await this.contractService.getCoinBuyPrice()).data;

  }

  async connect() {
    await this.getAddress();
  }

  async getAddress() {
    this.account = await this.contractService.getAddress();
    this.account = (this.account != undefined && this.account != null) ? this.account : '';
    this._subscription = this.contractService.accountChange.subscribe((value) => {
      this.account = value != undefined && value != null ? value : '';
    });
  }

  async register(pack) {
    await this.getAddress();
    console.log(pack)
    this.amount = pack.value;

    if (!this.sponsorId) {
      this.sponsorId = Settings.DefaultSponsor;
    }

    if (this.amount < (await this.contractService.fetchAddressBalance())) {
      if (this.amount > 0) {
        this.spinnerService.show();

        let sponsorRes: any = await this.api.isSponsorValid(this.sponsorId);
        if (!sponsorRes.status) {
          this.spinnerService.hide();
          Swal.fire({
            icon: "error",
            title: sponsorRes.message
          })
          return;
        }

        let userRes: any = await this.api.isSponsorValid(this.account);
        if (userRes.status) {
          this.spinnerService.hide();
          Swal.fire({
            icon: "error",
            title: "You are already registered!"
          })
          return;
        }

        let receipt = await this.contractService.registerUser(this.sponsorId, this.amount, pack.srno);

        console.log(receipt);

        if (receipt.success) {
          let result: any = await this.api.register(this.sponsorId, receipt.data);


          this.spinnerService.hide();
          // console.log(x);
          if (result.status) {
            Swal.fire({
              icon: "success",
              title: 'Deposit successful!'
            }).then(async () => {
              this.loginClick();
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

      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Enter a valid amount!'
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

  loginClick() {
    this.router.navigate(['auth/login']);
  }

  addAmount(amt: number) {
    this.amount += amt;
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
