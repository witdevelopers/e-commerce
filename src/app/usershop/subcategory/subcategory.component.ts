import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import Swal from 'sweetalert2';

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

  // Method to add a product to the cart
  addToCart(productDtId: number, quantity: number): void {
    let customerId = sessionStorage.getItem('memberId') || localStorage.getItem('memberId');

    if (!customerId) {
      alert('Customer ID is missing. Please log in again.');
      return;
    }

    if (!productDtId || isNaN(productDtId)) {
      alert('Invalid Product ID.');
      return;
    }

    if (!quantity || isNaN(quantity)) {
      alert('Invalid quantity.');
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
          title: 'Product already added.',
        });
        console.error('Error adding product to cart:', error);
      }
    );
  }
}
