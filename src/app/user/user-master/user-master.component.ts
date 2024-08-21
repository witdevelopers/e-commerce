import { Component, OnInit } from '@angular/core';
import { mixinInitialized } from '@angular/material/core';
import { Router } from '@angular/router';
import { Settings } from 'src/app/app-setting';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent implements OnInit {

  appName:string;
  logo: string = Settings.logo;
  constructor(private router:Router) {
    this.appName=Settings.AppName;
    var x = sessionStorage.getItem("address");
    if(x==undefined || x==null || x=="")
    {
      this.logout();
    }
   }
   
  ngOnInit(): void {
  }

  logout(){
    sessionStorage.removeItem("address");
    sessionStorage.removeItem("memberId");
    
    this.router.navigate(['auth/login']);
  }

  collapse(){
    if(document.body.clientWidth<600)
    {
      document.getElementById("btnToggler")?.click();
    }
  }
}
