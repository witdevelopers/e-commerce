import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Settings } from 'src/app/app-setting';

@Component({
  selector: 'app-usershop-master',
  templateUrl: './usershop-master.component.html',
  styleUrls: ['./usershop-master.component.css']
})
export class UsershopMasterComponent implements OnInit {

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
    this.router.navigate(['']);
  }

  collapse(){
    if(document.body.clientWidth<600)
    {
      document.getElementById("btnToggler")?.click();
    }
  }
}
