import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
addToCart(arg0: any) {
throw new Error('Method not implemented.');
}
  singleProduct: any;
  singleProductDetails: any[] = [];
  singleProductImages: any[] = [];
  productId: number;
  mainImageUrl: string = '';

  constructor(private route: ActivatedRoute, private productService: UserService) {
    this.productId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadProductDetails(this.productId);
  }

  loadProductDetails(id: number): void {
    this.productService.getProductById(id).subscribe((response: any) => {
      this.singleProduct = response.singleProduct;
      this.singleProductDetails = response.singleProductDetails;
      this.singleProductImages = response.singleProductImages;
    });
  }

  getImageUrl(imagePath: string): string {
    return imagePath.replace('~', 'https://www.mbp18k.com'); // Update with your base URL for images
  }

  changeMainImage(imageUrl: string): void {
    this.mainImageUrl = this.getImageUrl(imageUrl);
  }
}
