import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  singleProduct: any;
  singleProductDetails: any[] = [];
  singleProductImages: any[] = [];
  productId: number;
  mainImageUrl: string = 'assets/default-image.jpg'; // Default image URL
  quantity: number = 1; // Default quantity

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private http: HttpClient
  ) {
    this.productId = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadProductDetails(this.productId);
  }

  loadProductDetails(id: number): void {
    this.userService.getProductById(id).subscribe((response: any) => {
      this.singleProduct = response.singleProduct;
      this.singleProductDetails = response.singleProductDetails;
      this.singleProductImages = response.singleProductImages;

      // Set the main image URL to the first image if available
      if (this.singleProductImages.length > 0) {
        this.mainImageUrl = this.getImageUrl(
          this.singleProductImages[0].imageUrl
        );
      }
    });
    console.log('single Product: ', this.singleProduct);
  }

  getImageUrl(imagePath: string): string {
    return imagePath
      ? imagePath.replace('~', 'https://www.mbp18k.com')
      : this.mainImageUrl;
  }

  changeMainImage(imageUrl: string): void {
    this.mainImageUrl = this.getImageUrl(imageUrl);
  }

  addToCart(): void {
    let customerId = sessionStorage.getItem('memberId'); // Try to retrieve customer ID from sessionStorage
  
    if (!customerId) {
      customerId = localStorage.getItem('memberId'); // Fall back to localStorage if sessionStorage is empty
    }
  
    const productDtId = this.productId;
    const quantity = this.quantity;
  
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
  
    this.userService.addToCart(+customerId, productDtId, quantity).subscribe(
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
        console.log('Error adding product to cart:', error);
      }
    );
  }  
}
