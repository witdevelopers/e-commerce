import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  team:any=[];

  isPaginated: boolean = false;
  hasNextPage: boolean = false;
  level: number = 0;
  pageNo: number = 1;
  pageSize: number = 10;
  pageCount: number = 0;

  constructor(private api: UserService) {
    this.getTeam(this.pageNo);
  }

  async getTeam(pageNo: number) {
    this.team = [];
    let res = ((await this.api.TeamDetails(this.level)) as any).data.table;
    
    // console.log(res)

    if(res){
      this.team = res;
    }
    else{
      this.team = []
    }
    // console.log(this.directs)
  }

  ngOnInit(): void {
  }

  // OnPreviousClick(){
  //   if(this.pageNo>1)
  //   {
  //     this.pageNo--;
  //     this.getDirects(this.pageNo);
  //   }
  // }

  OnNextClick(){
    if(this.hasNextPage)
    {
      this.pageNo++;
      this.getTeam(this.pageNo);
    }
  }

  OnPageNoChange(){
    if(this.pageNo>=1 && this.pageNo<=this.pageCount)
    {
      this.getTeam(this.pageNo);
    }
  }
}
