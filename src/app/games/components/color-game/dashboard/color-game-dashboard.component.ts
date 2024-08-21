import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
import { AuthService } from "src/app/auth/auth.service";
import { Router } from "@angular/router";
import { PeriodWinHistoryComponent } from "../period-win-history/period-win-history.component";
import { BetComponent } from "../bet/bet.component";
import { userBetOrders } from "src/app/games/models/bet.model";
import { GamesService } from "src/app/games/services/games.service";
import { RuleComponent } from "../rule-dialog/rule.component";
import { LoaderService } from "src/app/services/loader.service";

@Component({
  selector: "app-color-game",
  templateUrl: "./color-game-dashboard.component.html",
  styleUrls: ["./color-game-dashboard.component.scss"],
})
export class ColorGameComponent implements OnInit {
  
  @ViewChild(PeriodWinHistoryComponent) periodWin:PeriodWinHistoryComponent;

  @ViewChild(BetComponent) bet:BetComponent;
  userInfo:userBetOrders=new userBetOrders();
  allOrders={data:[],pageNo:1,pageSize:10,total:0}
  
  constructor(public dialog: MatDialog,private game:GamesService,public datePipe:DatePipe
    ,public loader:LoaderService) {
   }

showingAllOrders:boolean=false;
  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.refreshDashboard()
  }

  getUserOrders(){
    this.game.userDetails()
    .subscribe(resp=>{
      this.userInfo.walletBalance=resp.walletBalance
      this.userInfo.orders=resp.orders
    })
  }

  refreshDashboard(){
    this.periodWin.bindHistory()
    this.getUserOrders()
  }

 openRechargeDialog() {

}

getColor(colorName:string){
  if(colorName=="green"){
    return "#4caf50";
  }
  else if(colorName=="red"){
    return "#f44336";
  } 
  else if(colorName=="violet"){
    return "rgb(156, 39, 176)";
  }
  else{
    return "#2196f3"
  }
}

isNumber(val:any){
  return !isNaN(Number(val))
}

refreshTimer(){
  this.bet.refresh();
}


onRuleClick(){
  this.dialog.open(RuleComponent,{
    autoFocus:false,
    width:'90%',
    panelClass: 'addBet-dialog-container'
  })
}

viewAllOrders(){
  this.showingAllOrders=true;
  this.getAllOrders();
}

viewCurrentOrders(){
  this.showingAllOrders=false;
  this.getUserOrders();
}

getAllOrders(){
  this.game.getBetOrders(this.allOrders.pageNo,this.allOrders.pageSize)
  .subscribe(resp=>{
    this.allOrders.data=resp.data
    this.allOrders.total=resp.total
  })
}

onPageChange(e) {
  this.allOrders.pageSize = e.pageSize
  this.allOrders.pageNo = e.pageIndex+1
  this.getAllOrders()

}
}