import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { ContractService } from 'src/app/services/contract.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-mining-income',
  templateUrl: './mining-income.component.html',
  styleUrls: ['./mining-income.component.css']
})
export class MiningIncomeComponent implements OnInit {
   
  MiningIncome : any= [];

  constructor(private api:UserService) { 
    this.GetMiningIncome()
  }
 
  async GetMiningIncome(){

    this.MiningIncome=[]
    let res =((await this.api.MiningIncome()) as any)

    
    if(res && res.status){
      this.MiningIncome = res.data.table;    
    }
    else{
      this.  MiningIncome = [];    
    }

    console.log(this.MiningIncome)
  }
  
  ngOnInit(): void {
    
  }

}
