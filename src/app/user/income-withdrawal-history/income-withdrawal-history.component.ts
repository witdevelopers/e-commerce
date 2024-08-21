import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-income-withdrawal-history',
  templateUrl: './income-withdrawal-history.component.html',
  styleUrls: ['./income-withdrawal-history.component.css']
})
export class IncomeWithdrawalHistoryComponent implements OnInit {

  directs: any = [];
  
  
  constructor(private api: UserService) {
    this.IncomeWithdawalHistory();
  }
  // this.Level
  // level: any
  async IncomeWithdawalHistory() {

    this.  directs= [];
   
    let res = ((await this.api.IncomeWithdawalHistory()) as any).data.table;
    
    // console.log(res)

    if(res){
      this.  directs = res;
    
    }
    else{
      this.  directs = [];
    
    }
    // console.log(this.data)
  }

 ngOnInit(): void{ }

}
