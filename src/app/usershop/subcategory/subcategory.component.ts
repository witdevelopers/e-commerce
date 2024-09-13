import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import Swal from 'sweetalert2';
import { Settings } from 'src/app/app-setting'; // Import the Settings class

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})
export class SubcategoryComponent implements OnInit {
  subcategoryDetails: any[] = [];
  filteredSubcategoryDetails: any[] = [];  // Filtered products to display
  subcategoryId: number;
  imageBaseUrl: string = Settings.imageBaseUrl;  // Use the dynamic base URL from Settings

  // Price filter properties
  minPrice: number = 0;
  maxPrice: number = 10000;

  constructor(
    private route: ActivatedRoute,
    private subcategoryService: UserService
  ) {
    // No need to set imageBaseUrl in constructor as it's already set statically
  }

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
          imageUrl: this.getImageUrl(product.imageUrl)  // Dynamically construct full image URL
        };
      });

      // Initially, show all products
      this.filteredSubcategoryDetails = [...this.subcategoryDetails];

      console.log('Processed Subcategory Details:', this.subcategoryDetails);
    },
    error => {
      console.error('Error fetching subcategory details:', error);
    });
  }

  // Method to construct the full image URL
  getImageUrl(imagePath: string): string {
    return imagePath
      ? `${this.imageBaseUrl}${imagePath.replace('~/', '')}`  // Construct full image URL using dynamic base URL
      : 'assets/default-image.jpg';  // Fallback image URL
  }

  // Method to filter products by price
  filterByPrice(): void {
    this.filteredSubcategoryDetails = this.subcategoryDetails.filter(product => {
      return product.discountPrice >= this.minPrice && product.discountPrice <= this.maxPrice;
    });
  }

  // Method to add a product to the cart
  addToCart(productDtId: number, quantity: number): void {
    let customerId = sessionStorage.getItem('memberId') || localStorage.getItem('memberId');

    if (!customerId) {
      Swal.fire({
        icon: 'error',
        title: 'Customer ID is missing. Please log in again.',
      });
      return;
    }

    if (!productDtId || isNaN(productDtId)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Product ID.',
      });
      return;
    }

    if (!quantity || isNaN(quantity)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid quantity.',
      });
      return;
    }

    this.subcategoryService.addToCart(+customerId, productDtId, quantity).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Product added to cart successfully.',
        });
        console.log('Product added to cart successfully.', response);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error adding product to cart.',
        });
        console.error('Error adding product to cart:', error);
      }
    );
  }
}
