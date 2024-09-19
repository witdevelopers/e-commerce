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

  constructor(private userService: UserService, private router: Router) {
    // No need to set imageBaseUrl in constructor, it's already set statically
  }

  ngOnInit(): void {
    this.customerId = Number(sessionStorage.getItem('memberId'));
    if (this.customerId) {
      this.loadCart();
    } else {
      this.router.navigate(['/auth/signin']);
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

    const cartData = {
      customerId: this.customerId,
      productDtId,
      quantity
    };

    this.userService.updateCart(cartData).subscribe(
      () => {
        // Handle success silently or with an alternative method
        this.loadCart();
      },
      (error) => {
        // Handle error silently or with an alternative method
      }
    );
  }

  removeCartItem(productDtId: number): void {
    this.userService.removeCartItem(this.customerId!, productDtId, false).subscribe(
      () => {
        // Handle success silently or with an alternative method
        this.loadCart();
      },
      (error) => {
        // Handle error silently or with an alternative method
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
