import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  singleProduct: any;
  singleProductDetails: any[] = [];
  singleProductImages: any[] = [];
  productId: number;
  mainImageUrl: string = 'assets/default-image.jpg'; // Default image URL

  constructor(private route: ActivatedRoute, private userService: UserService) {
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
        this.mainImageUrl = this.getImageUrl(this.singleProductImages[0].imageUrl);
      }
    });
  }

  getImageUrl(imagePath: string): string {
    return imagePath ? imagePath.replace('~', 'https://www.mbp18k.com') : this.mainImageUrl;
  }

  changeMainImage(imageUrl: string): void {
    this.mainImageUrl = this.getImageUrl(imageUrl);
  }

  addToCart(product: any): void {
    // Implement add to cart functionality
    console.log('Added to cart:', product);
  }
}
