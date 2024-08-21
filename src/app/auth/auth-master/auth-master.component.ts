import { Component, OnInit } from '@angular/core';
import { Settings } from 'src/app/app-setting';

@Component({
  selector: 'app-auth-master',
  templateUrl: './auth-master.component.html',
  styleUrls: ['./auth-master.component.css']
})
export class AuthMasterComponent implements OnInit {

  logo: string = Settings.logo;
  constructor() { }

  ngOnInit(): void {
  }

}
