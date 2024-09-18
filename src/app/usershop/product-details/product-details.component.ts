import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Settings } from 'src/app/app-setting'; // Adjust the import path as needed
import { EncryptionService } from '../encryption.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  singleProduct: any;
  singleProductDetails: any[] = [];
  singleProductImages: any[] = [];
  relatedProducts: any[] = []; // For storing related products
  productId: number;
  mainImageUrl: string = 'assets/default-image.jpg'; // Default image URL
  quantity: number = 1; // Default quantity


    // Zoom-related variables
  isZooming: boolean = false;
  backgroundPosition: string = '0% 0%';
  backgroundSize: string = '250%'; // Zoom level (adjust as needed)

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private http: HttpClient,
    private router: Router, // Add Router for redirection
    private encryptionService: EncryptionService,
  ) {
    this.route.params.subscribe(params => {
      const encryptedId = params['id'];
      this.productId = +this.encryptionService.decrypt(encryptedId); // Decrypt and parse the ID
    this.productId = +this.route.snapshot.params['id'];
  });
}

  ngOnInit(): void {
    this.loadProductDetails(this.productId);
  }

    onMouseMove(event: MouseEvent): void {
    const container = event.target as HTMLElement;
    const containerRect = container.getBoundingClientRect();

    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;

    // Calculate background position for zoomed image
    const xPercent = (x / containerRect.width) * 100;
    const yPercent = (y / containerRect.height) * 100;

    this.backgroundPosition = `${xPercent}% ${yPercent}%`;
    this.isZooming = true; // Show the zoomed image when the mouse is inside
  }

  // Hide zoom result when the mouse leaves the image
  onMouseLeave(): void {
    this.isZooming = false;
  }
  // Load product details by product ID
  loadProductDetails(id: number): void {
    this.userService.getProductById(id).subscribe((response: any) => {
      this.singleProduct = response.singleProduct;
      this.singleProductDetails = response.singleProductDetails;
      this.singleProductImages = response.singleProductImages;
  
      // Find the image with isMainImage set to true
      const mainImage = this.singleProductImages.find(image => image.isMainImage);
  
      // Set the main image URL if a main image is found
      if (mainImage) {
        this.mainImageUrl = this.getImageUrl(mainImage.imageUrl);
      } else {
        // Fallback to the first image if no main image is found
        if (this.singleProductImages.length > 0) {
          this.mainImageUrl = this.getImageUrl(this.singleProductImages[0].imageUrl);
        } else {
          // Fallback to default image if no images are available
          this.mainImageUrl = 'assets/default-image.jpg';
        }
      }
      
      // Log the main image URL
      console.log("Main image URL", this.mainImageUrl);
  
      // Fetch related products by category ID
      this.loadRelatedProducts(this.singleProduct.categoryId);
    }, (error) => {
      console.error('Error loading product details:', error);
    });
  }
  

  // Load related products based on category ID, excluding the current product
  loadRelatedProducts(categoryId: number): void {
    this.userService.getAllProductByCategoryId(categoryId).subscribe((response: any) => {
      if (response && response.table) {
        this.relatedProducts = response.table.filter((product: any) => product.productId !== this.productId); // Exclude current product
      } else {
        this.relatedProducts = [];
      }
      console.log("Related products:", this.relatedProducts);
    });
  }

  // Convert image path to a usable URL
  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'assets/default-image.jpg'; // Fallback to default image if no image path is provided
    }

    // Replace tilde with base URL if present
    if (imagePath.includes('~/')) {
      imagePath = imagePath.replace('~/', Settings.imageBaseUrl);
    }

    return !imagePath.startsWith('http') ? `${Settings.imageBaseUrl}${imagePath}` : imagePath;
  }

  // Change main image when selecting a different one
  changeMainImage(imageUrl: string): void {
    this.mainImageUrl = this.getImageUrl(imageUrl);
  }

  // Add product to cart
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
          icon: 'warning',
          title: 'Product already added to cart.',
        });
        console.log('Product already added to cart:', error);
      }
    );
  }

  // Buy now functionality
  buyNow(): void {
    let customerId = sessionStorage.getItem('memberId');
    if (!customerId) {
      customerId = localStorage.getItem('memberId');
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
        setTimeout(() => {
          this.router.navigate(['/usershop/checkout']);
        }, 100);
      },
      (error) => {
        Swal.fire({
          icon: 'warning',
          title: 'Product is already added in the cart go there and checkout.',
        });
        console.log('Product is already added in the cart go there and checkout:', error);
      }
    );
  }

  // View related product's details
  viewProduct(productId: number): void {
    // Navigate to the product details route
    this.router.navigate(['/product', productId]).then(() => {
        // Use `navigateByUrl` to force a reload
        this.router.navigateByUrl('/product', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/product', productId]);
        });
    });
  }
}
