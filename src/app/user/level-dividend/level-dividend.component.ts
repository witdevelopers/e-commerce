import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import  {UserService} from '../services/user.service'

@Component({
  selector: 'app-level-dividend',
  templateUrl: './level-dividend.component.html',
  styleUrls: ['./level-dividend.component.css']
})

export class LevelDividendComponent implements OnInit {

  directs: any = [];
  
  
  constructor(private api: UserService) {
    this.getLeveldiveidend();
  }
  // this.Level
  // level: any
  async getLeveldiveidend() {

    this.  directs= [];
   
    let res = ((await this.api.levelIncome()) as any).data.table;
    
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
