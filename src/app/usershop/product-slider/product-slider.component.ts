import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { Settings } from 'src/app/app-setting'; // Import the Settings class
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css']
})
export class ProductSliderComponent implements OnInit, OnDestroy {
  homePageSectionProducts: any = {};
  private ngUnsubscribe = new Subject<void>();
  addedProducts: Set<number> = new Set(); // Track added products

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadHomeSectionProductsDetails();
    this.loadCartState();
  }

  private loadHomeSectionProductsDetails(): void {
    this.userService
      .getHomePageSectionProduct()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (data) => {
          this.homePageSectionProducts = this.groupProductsBySection(data);
          console.log("Home Page Section Products:", this.homePageSectionProducts);
        },
        error: (err) => console.error('Failed to load home page section products:', err),
      });
  }

  private groupProductsBySection(data: any[]): any {
    return data.reduce((sections, product) => {
      const section = product.sectionName || 'Others';
  
      // Initialize the section if not present
      if (!sections[section]) sections[section] = [];
  
      // Process the imageUrl by replacing tilde and handling relative paths
      const processedImageUrl = product.imageUrl
        ? product.imageUrl.includes('~/') 
          ? product.imageUrl.replace('~/', Settings.imageBaseUrl) // Replace tilde with base URL
          : product.imageUrl.startsWith('http') 
            ? product.imageUrl 
            : `${Settings.imageBaseUrl}${product.imageUrl}` // Prepend base URL for relative paths
        : 'assets/default-image.jpg'; // Fallback to default image if imageUrl is missing
  
      // Add the product to the section with the processed imageUrl
      sections[section].push({
        ...product,
        imageUrl: processedImageUrl,
      });
  
      return sections;
    }, {});
  }

  private loadCartState(): void {
    const customerId = sessionStorage.getItem('memberId') || localStorage.getItem('memberId');
    if (customerId) {
      this.userService.getCart(+customerId).subscribe({
        next: (response: any) => {
          // Check if response has 'items' property and it's an array
          if (response && Array.isArray(response.items)) {
            response.items.forEach(item => this.addedProducts.add(item.productId));
          } else {
            console.error('Unexpected response format from getCart:', response);
          }
        },
        error: (error) => {
          console.error('Failed to load cart items:', error);
        }
      });
    } else {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (Array.isArray(cart)) {
        cart.forEach((item: any) => this.addedProducts.add(item.productId));
      } else {
        console.error('Unexpected format in local storage cart:', cart);
      }
    }
  }
  

  addToCart(productId: number, buttonElement: HTMLElement): void {
    const customerId = sessionStorage.getItem('memberId') || localStorage.getItem('memberId');
    
    if (!customerId) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingProductIndex = cart.findIndex((item: any) => item.productId === productId);

      if (existingProductIndex === -1) {
        cart.push({ productId, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        Swal.fire({ icon: 'success', title: 'Added to cart' });
        this.addedProducts.add(productId); // Mark product as added
        buttonElement.classList.add('clicked');
      } else {
        Swal.fire({ icon: 'info', title: 'Product already in cart' });
        this.goToCart(); // Navigate to cart if already in cart
      }
      return;
    }

    this.userService.addToCart(+customerId, productId, 1).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Added to cart' });
        this.addedProducts.add(productId); // Mark product as added
        buttonElement.classList.add('clicked');
      },
      error: (error) => {
        console.error('Failed to add to cart:', error);
        Swal.fire({ icon: 'warning', title: 'Already added in cart.' });
      }
    });
  }

  isProductAdded(productId: number): boolean {
    return this.addedProducts.has(productId);
  }

  goToCart(): void {
    this.router.navigate(['/shopping-cart']);
  }

  objectKeys = Object.keys;

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
