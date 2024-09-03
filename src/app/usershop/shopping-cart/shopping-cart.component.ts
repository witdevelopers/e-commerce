import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  summary: any = {}; // To hold the summary data
  customerId: number | null = null; // Initialized as null to handle cases where user is not logged in
  imageBaseUrl: string = 'https://www.mbp18k.com/'; // Base URL for images

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.customerId = Number(sessionStorage.getItem('memberId')); // Retrieve customerId from sessionStorage
    if (this.customerId) {
      this.loadCart(); // Load cart only if customerId is available
    } else {
      Swal.fire({
        icon: 'error',
        title: 'No customer ID found',
        text: 'Please log in first to view your shopping cart.',
      });
    }
  }

  loadCart(): void {
    if (this.customerId) {
      this.userService.getCart(this.customerId).subscribe(
        (data) => {
          console.log("Image wala data", data);
          this.cartItems = data.items?.map((item: any) => ({
            ...item,
            imageUrl: this.imageBaseUrl + item.imageUrl.replace('~/', '') // Construct full image URL
          })) || []; // Extracting items array and constructing image URLs
          this.summary = data.summary || {}; // Extracting summary object
        },
        (error) => {
          console.error('Error fetching cart data:', error);
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Cannot load cart. No customer ID available.',
      });
    }
  }

  updateCartItem(productDtId: number, quantity: number): void {
    if (this.customerId) {
      const cartData = {
        customerId: this.customerId,
        productDtId: productDtId,
        quantity: quantity
      };

      this.userService.updateCart(cartData).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Cart Updated',
            text: 'Your cart has been updated successfully!',
          });
          this.loadCart(); // Reload the cart after updating
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'Error updating cart. Please try again.',
          });
          console.error('Error updating cart:', error);
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Cannot update cart. No customer ID available.',
      });
    }
  }

  removeCartItem(productDtId: number): void {
    if (this.customerId) {
      this.userService.removeCartItem(this.customerId, productDtId, false).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Item Removed',
            text: 'The item has been removed from your cart.',
          });
          this.loadCart(); // Reload the cart after removing item
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Remove Failed',
            text: 'Error removing item. Please try again.',
          });
          console.error('Error removing cart item:', error);
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Cannot remove item. No customer ID available.',
      });
    }
  }

  removeAllCartItems(): void {
    if (this.customerId) {
      this.userService.removeCartItem(this.customerId, 0, true).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'All Items Removed',
            text: 'All items have been removed from your cart.',
          });
          this.loadCart(); // Reload the cart after removing all items
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Remove Failed',
            text: 'Error removing items. Please try again.',
          });
          console.error('Error removing all cart items:', error);
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Cannot remove items. No customer ID available.',
      });
    }
  }
}
