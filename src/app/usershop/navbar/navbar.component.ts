import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  user: string = 'Sign in';
  constructor() {}

  ngOnInit(): void {
    this.userData();
  }

  userData() {
    if (sessionStorage.getItem('address')) {
      this.user = sessionStorage.getItem('address');
    }
  }
}
