import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})
export class SubcategoryComponent implements OnInit {
  subcategoryDetails: any[] = [];
  subcategoryId: number;
  imageBaseUrl: string = 'https://www.mbp18k.com/Shop/';  // Base URL for images

  constructor(
    private route: ActivatedRoute,
    private subcategoryService: UserService
  ) {}

  ngOnInit(): void {
    // Get the subcategory ID from the route params
    this.route.params.subscribe(params => {
      this.subcategoryId = params['id'];
      this.loadSubcategoryData(this.subcategoryId);
    });
  }

  // Call the service to load subcategory data
  loadSubcategoryData(id: number) {
    this.subcategoryService.getAllProductByCategoryId(id).subscribe(response => {
      // Assuming the API response has a `table` property which is an array
      this.subcategoryDetails = response.table ? response.table : [];
      
      // Prepend base URL to image paths
      this.subcategoryDetails = this.subcategoryDetails.map(product => {
        return {
          ...product,
          imageUrl: this.imageBaseUrl + product.imageUrl  // Construct full image URL
        };
      });

      console.log('Processed Subcategory Details:', this.subcategoryDetails);
    },
    error => {
      console.error('Error fetching subcategory details:', error);
    });
  }
}
