import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-profile',
  templateUrl: './shopping-profile.component.html',
  styleUrls: ['./shopping-profile.component.css']
})
export class ShoppingProfileComponent implements OnInit {
  activeSection = 'profile-info'; // Default active section

  constructor() { }

  ngOnInit(): void {
  }

  showSection(sectionId: string) {
    this.activeSection = sectionId; // Set the active section
  }
}
