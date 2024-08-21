import { Component, Inject, OnInit, Optional } from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BetModel } from 'src/app/games/models/bet.model';
import { GamesService } from 'src/app/games/services/games.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-bet',
  templateUrl: './add-bet.component.html',
  styleUrls: ['./add-bet.component.css']
})
export class AddBetComponent implements OnInit {

  _agree:boolean=true
  betOn:string
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,private game:GamesService
  ,private dialogRef: MatDialogRef<AddBetComponent>) { 
    this.betOn=data.val
  }

  selectedAmt=5
  quantity:number=1
  totalAmount=5

  amounts:number[]=[5,50,500,5000]

  ngOnInit(): void {
  }

  onQuantityChange(type:string){
    if(type=="add"){
      this.quantity+=1
    }
    else{
      if(this.quantity>1)
      this.quantity-=1
      else
        this.quantity=1
    }
    this.calcTotal()
  }

  onSelectedAmountChange(amount:number){
    this.selectedAmt=amount
    this.calcTotal()
  }

  calcTotal(){
    this.totalAmount=this.selectedAmt*this.quantity
  }

  onAddOrder(){
    if(!this._agree){
      Swal.fire({
        icon: "error",
        title: 'Agree to PRESALE RULE!'
      })
      return
    }
   let model:BetModel={
       amount:this.totalAmount,
       quantity:this.quantity,
       betOn:this.betOn
    }

    this.dialogRef.close({event:'Submit',data:model,type:this.data.type})
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

}
