import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from './services/loader.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  constructor(public loader:LoaderService,public spinner:NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.spinner.show()
  }

}