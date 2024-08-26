import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';  // Import your service

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css'],
})
export class SubcategoryComponent implements OnInit {
  subcategoryId: number = 1;  // Set a sample subcategory ID for now
  subcategoryDetails: any[] = [];  // Array to store fetched data

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadSubCategoryDetails();  // Call the method to fetch data
  }

  loadSubCategoryDetails() {
    if (this.subcategoryId) {
      this.userService.getAllProductByCategoryId(this.subcategoryId).subscribe(
        (data: any[]) => {
          this.subcategoryDetails = data;  // Store the fetched data
          console.log('Subcategory ram details:', this.subcategoryDetails);
        },
        (error) => {
          console.error('Error fetching subcategory details', error);
        }
      );
    }
  }
}
