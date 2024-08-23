import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements OnInit {
  banners: any[] = [];
  categories: any;
  baseUrl: string = 'https://www.mbp18k.com';

  productId: number;
  productDetails: any;
  errorMessage: string;
  mainCategory: any;

  constructor(private userservice: UserService) {}

  ngOnInit(): void {
    this.getProduct();
    this.getMainCategory();

    this.userservice.getBanners().subscribe((res: any[]) => {
      this.banners = res.map((banner) => {
        // Check if the imageUrl is relative or absolute
        if (
          !banner.imageUrl.startsWith('http') &&
          !banner.imageUrl.startsWith('https')
        ) {
          // Prepend the base URL only if the imageUrl is relative
          banner.imageUrl = `${this.baseUrl}${banner.imageUrl}`;
        }
        return banner;
      });
    });
  }

  getProduct() {
    if (this.productId) {
      this.userservice.getProductDetails(this.productId).subscribe(
        (data) => {
          if (data) {
            this.productDetails = data;
            this.errorMessage = ''; // Clear any previous error message
            console.log(this.productDetails);
          } else {
            this.productDetails = null;
            this.errorMessage = 'No product found for the given ID'; // Handle no data case
          }
        },
        (error) => {
          this.productDetails = null;
          this.errorMessage = 'Product not found or API error'; // Handle errors
        }
      );
    } else {
      this.errorMessage = 'Please enter a valid product ID'; // Handle empty input
    }
  }

  getMainCategory() {
    this.userservice.getMainCategory().subscribe((res: any[]) => {
      this.mainCategory = res;
    });
  }
}
