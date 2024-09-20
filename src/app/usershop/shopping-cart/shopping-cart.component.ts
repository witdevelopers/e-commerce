import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Settings } from 'src/app/app-setting'; // Import the Settings class

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  summary: any = {};
  customerId: number | null = null;
  imageBaseUrl: string = Settings.imageBaseUrl; // Use dynamic base URL from Settings
  quantities: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  userName: string;
  cartQuantity: number;
  isLoggedIn: boolean;

  constructor(private userService: UserService, private router: Router) {
    // No need to set imageBaseUrl in constructor, it's already set statically
  }

  ngOnInit(): void {
    this.customerId = Number(sessionStorage.getItem('memberId')) || Number(localStorage.getItem('TempUserId'));
    if (this.customerId) {
      this.loadCart();
    } 
    else {
      this.router.navigate(['/auth/signin']);
    }
  }

  updateCartQuantity(): void {
    const sessionUserId = sessionStorage.getItem('memberId');
    const tempUserId = localStorage.getItem('TempUserId');
    
    if (sessionUserId) {
      // If userId is found in sessionStorage, consider the user logged in
      this.isLoggedIn = true;
      this.userName = sessionStorage.getItem('userId') || 'Profile';
      
      // Subscribe to cart quantity observable
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity; // Automatically update the cart quantity
      });
  
      // Initial cart quantity load from sessionStorage userId
      this.userService.updateCartQuantity(Number(sessionUserId));
    } else if (tempUserId) {
      // If userId is found only in localStorage (guest/anonymous user), set isLoggedIn to false
      this.isLoggedIn = false;
  
      // Subscribe to cart quantity observable for anonymous user
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity;
      });
  
      // Initial cart quantity load from localStorage (anonymous userId)
      this.userService.updateCartQuantity(Number(tempUserId));
    } 
  }
  
  loadCart(): void {
    this.userService.getCart(this.customerId!).subscribe(
      (data) => {
        this.cartItems = data.items?.map((item: any) => ({
          ...item,
          imageUrl: this.getImageUrl(item.imageUrl), // Dynamically construct the image URL
        })) || [];

        this.summary = {
          subTotal: data.summary.bvTotal || 0,
          total: data.summary.priceTotal || 0,
        };
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load cart data. Please try again later.',
        });
      }
    );
  }

  getImageUrl(imagePath: string): string {
    return imagePath
      ? `${this.imageBaseUrl}${imagePath.replace('~/', '')}` // Construct the full URL using dynamic base URL
      : 'assets/default-image.jpg'; // Fallback image URL
  }

  updateCartItem(productDtId: number, quantity: number): void {
    if (quantity < 1) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Quantity',
        text: 'Please enter a valid quantity.',
      });
      return;
    }

    const cartData = {
      customerId: this.customerId,
      productDtId,
      quantity
    };

    this.userService.updateCart(cartData).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Cart Updated',
          text: 'Your cart has been updated successfully!',
        });
        this.loadCart();
        this.updateCartQuantity();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Error updating cart. Please try again.',
        });
      }
    );
  }

  removeCartItem(productDtId: number): void {
    this.userService.removeCartItem(this.customerId!, productDtId, false).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Item Removed',
          text: 'The item has been removed from your cart.',
        });
        this.loadCart();
        this.updateCartQuantity();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Remove Failed',
          text: 'Error removing item. Please try again.',
        });
      }
    );
  }

  onQuantityChange(event: Event, productDtId: number): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedQuantity = Number(selectElement.value);

    if (selectedQuantity > 0) {
      this.updateCartItem(productDtId, selectedQuantity);
    }
  }
}
