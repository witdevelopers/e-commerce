import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
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

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // this.loadCartFromLocalStorage();

    // // Check if user is logged in
    // this.customerId = Number(sessionStorage.getItem('memberId'));

    // if (this.customerId) {
    //   // User is logged in, synchronize cart with server
    //   this.syncCartWithServer();
    // }
  }

  loadCartFromLocalStorage(): void {
    const cart = localStorage.getItem('cart');
    if (cart) {
      const cartData = JSON.parse(cart);
      this.cartItems = cartData.items || [];
      this.summary = cartData.summary || {};
    } else {
      this.cartItems = [];
      this.summary = { subTotal: 0, total: 0 };
    }
  }

  saveCartToLocalStorage(): void {
    const cartData = {
      items: this.cartItems,
      summary: this.summary
    };
    localStorage.setItem('cart', JSON.stringify(cartData));
  }

  syncCartWithServer(): void {
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

        // Clear local storage after syncing
        localStorage.removeItem('cart');
      },
      (error) => {
        // Handle error silently or with an alternative method
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
      // Handle invalid quantity silently or with an alternative method
      return;
    }

    const itemIndex = this.cartItems.findIndex(item => item.productDtId === productDtId);
    if (itemIndex > -1) {
      this.cartItems[itemIndex].quantity = quantity;
    } else {
      this.cartItems.push({ productDtId, quantity });
    }

    this.updateSummary();
    this.saveCartToLocalStorage();

    if (this.customerId) {
      // Update server-side cart if user is logged in
      const cartData = { customerId: this.customerId, productDtId, quantity };
      this.userService.updateCart(cartData).subscribe(
        () => {
          // Handle success silently or with an alternative method
        },
        (error) => {
          // Handle error silently or with an alternative method
        }
      );
    }
  }

  removeCartItem(productDtId: number): void {
    this.cartItems = this.cartItems.filter(item => item.productDtId !== productDtId);
    this.updateSummary();
    this.saveCartToLocalStorage();

    if (this.customerId) {
      // Remove server-side cart item if user is logged in
      this.userService.removeCartItem(this.customerId!, productDtId, false).subscribe(
        () => {
          // Handle success silently or with an alternative method
        },
        (error) => {
          // Handle error silently or with an alternative method
        }
      );
    }
  }

  updateSummary(): void {
    this.summary.subTotal = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.summary.total = this.summary.subTotal; // Adjust this based on your requirements
  }

  onQuantityChange(event: Event, productDtId: number): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedQuantity = Number(selectElement.value);

    if (selectedQuantity > 0) {
      this.updateCartItem(productDtId, selectedQuantity);
    }
  }

  handleUserRegistrationOrLogin(): void {
    // This method should be called upon user registration or login
    // Sync cart with server and clear local storage
    this.syncCartWithServer();
  }
}
