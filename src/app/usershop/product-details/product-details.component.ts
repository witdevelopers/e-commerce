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
  isProductInCartFlag: boolean = false;
  cartQuantity: number = 0; // Variable to track cart quantity

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
    this.loadProductDetails(this.productId);
  }

  ngOnInit(): void {
    this.checkIfProductInCart(); 
    this.updateCartQuantity();
  }

  // Subscribe to the cart quantity observable to track cart updates
  updateCartQuantity(): void {
    const userId = sessionStorage.getItem('memberId') || localStorage.getItem('memberId');
    
    // Subscribe to cart quantity observable
    this.userService.cartQuantity$.subscribe((quantity) => {
      this.cartQuantity = quantity; // Automatically update the cart quantity
    });

    // Initial load of cart quantity
    if (userId) {
      this.userService.updateCartQuantity(Number(userId));
    }
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

  checkIfProductInCart(): void {
    let customerId = sessionStorage.getItem('memberId') || localStorage.getItem('memberId');
    
    if (customerId) {
      this.userService.getCart(+customerId).subscribe((response: any) => {
        this.isProductInCartFlag = response.items.some(item => item.productId === this.productId);
      }, (error) => {
        console.error('Error fetching cart items:', error);
        this.isProductInCartFlag = false;  // Default to "not in cart" if there's an error
      });
    }
  }

  // Load product details by product ID
  loadProductDetails(id: number): void {
    this.userService.getProductById(id).subscribe((response: any) => {
      this.singleProduct = response.singleProduct;
      this.singleProductDetails = response.singleProductDetails;
      this.singleProductImages = response.singleProductImages;

      const mainImage = this.singleProductImages.find(image => image.isMainImage);

      if (mainImage) {
        this.mainImageUrl = this.getImageUrl(mainImage.imageUrl);
      } else {
        if (this.singleProductImages.length > 0) {
          this.mainImageUrl = this.getImageUrl(this.singleProductImages[0].imageUrl);
        } else {
          this.mainImageUrl = 'assets/default-image.jpg';
        }
      }
      
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
    });
  }

  // Convert image path to a usable URL
  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'assets/default-image.jpg'; // Fallback to default image if no image path is provided
    }

    if (imagePath.includes('~/')) {
      imagePath = imagePath.replace('~/', Settings.imageBaseUrl);
    }

    return !imagePath.startsWith('http') ? `${Settings.imageBaseUrl}${imagePath}` : imagePath;
  }

  // Change main image when selecting a different one
  changeMainImage(imageUrl: string): void {
    this.mainImageUrl = this.getImageUrl(imageUrl); // Update the main image
  }

  // Add product to cart
  addToCart(): void {
    let customerId = sessionStorage.getItem('memberId') || localStorage.getItem('memberId');
    const productDtId = this.productId;
    const quantity = this.quantity;

    if (customerId) {
      this.userService.addToCart(+customerId, productDtId, quantity).subscribe(
        () => {
          this.ngOnInit(); // Re-run the component initialization to update the cart status
          Swal.fire({
            icon: 'success',
            title: 'Product added to cart successfully.',
          });

          // Update the cart quantity after adding to cart
          this.userService.updateCartQuantity(+customerId);
        },
        () => {
          Swal.fire({
            icon: 'warning',
            title: 'Product already in cart.',
          });
        }
      );
    }
  }

  // Go to the cart page
  goToCart(): void {
    this.router.navigate(['/shopping-cart']);
  }

  // Buy now functionality
  buyNow(): void {
    this.router.navigate(['/shopping-cart']);
  }

  // View related product's details
  viewProduct(productId: number): void {
    this.router.navigate(['/product', productId]).then(() => {
      this.router.navigateByUrl('/product', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/product', productId]);
      });
    });
  }
}
