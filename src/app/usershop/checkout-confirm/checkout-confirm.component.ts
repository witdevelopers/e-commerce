import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import Swal from 'sweetalert2';
import { Settings } from 'src/app/app-setting'; // Import the Settings class

@Component({
  selector: 'app-checkout-confirm',
  templateUrl: './checkout-confirm.component.html',
  styleUrls: ['./checkout-confirm.component.css']
})
export class CheckoutConfirmComponent implements OnInit {

  cartDetails: any = null;
  totalCartPrice = 0;
  totalDiscountPrice = 0;
  totalQuantity = 0;
  isCartEmpty = true;
  walletBalance: number = 0; // Wallet balance
  selectedPaymentMethod: string = '';  // Selected payment method
  memberId: number = 0; // User's memberId for API
  selectedAddressId: number | null = null;
  private imageBaseUrl: string = Settings.imageBaseUrl; // Dynamic base URL for images from Settings

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.retrieveAddressId();
    const memberId = sessionStorage.getItem('memberId'); // Retrieve memberId from sessionStorage
    if (memberId) {
      this.memberId = +memberId;
      this.getWalletBalance(this.memberId); // Fetch wallet balance
      this.getCartDetails(); // Fetch cart details
    } else {
      Swal.fire('Error', 'No member ID found. Please log in again.', 'error');
    }
  }

  private retrieveAddressId(): void {
    this.selectedAddressId = this.userService.getSelectedAddressId();
    if (!this.selectedAddressId) {
      Swal.fire('Error', 'No selected address ID found.', 'error');
    }
  }

  getWalletBalance(walletId: number): void {
    this.userService.getWalletBalance(walletId).subscribe(
      (data: any) => this.walletBalance = data.balance,
      (error) => {
        console.error('Error fetching wallet balance:', error);
        Swal.fire('Error', 'There was an error fetching wallet balance. Please try again later.', 'error');
      }
    );
  }

  getCartDetails(): void {
    if (this.memberId) {
      this.userService.getCart(this.memberId).subscribe(
        data => {
          this.cartDetails = data;
          this.isCartEmpty = !this.cartDetails?.items?.length;

          if (!this.isCartEmpty) {
            // Fix image URLs and calculate prices/quantities
            this.cartDetails.items = this.cartDetails.items.map((item: any) => {
              if (item.imageUrl?.startsWith('~/')) {
                item.imageUrl = this.getImageUrl(item.imageUrl);  // Dynamically construct image URL
              }
              return item;
            });

            // Calculate total prices and quantities
            this.totalCartPrice = this.cartDetails.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
            this.totalDiscountPrice = this.cartDetails.items.reduce((sum: number, item: any) => sum + item.discountPrice * item.quantity, 0);
            this.totalQuantity = this.cartDetails.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
          }
        },
        error => {
          console.error('Error fetching cart details:', error);
          Swal.fire('Error', 'There was an error fetching cart details. Please try again later.', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Customer ID is missing. Please log in and try again.', 'error');
    }
  }

  // Method to construct the full image URL
  private getImageUrl(imagePath: string): string {
    return imagePath
      ? `${this.imageBaseUrl}${imagePath.replace('~/', '')}`  // Construct full image URL using dynamic base URL
      : 'assets/default-image.jpg';  // Fallback image URL
  }

  onPaymentMethodSelect(method: string): void {
    this.selectedPaymentMethod = method;
  }

  confirmCheckout(): void {
    if (!this.selectedPaymentMethod) {
      Swal.fire('Error', 'Please select a payment method', 'error');
      return;
    }

    switch (this.selectedPaymentMethod) {
      case 'wallet':
        this.handleWalletPayment();
        break;
      case 'credit-card':
        this.handleCardPayment();
        break;
      case 'cod':
        this.placeOrder(3);
        break;
      default:
        Swal.fire('Error', 'Invalid payment method selected', 'error');
    }
  }

  handleWalletPayment(): void {
    if (this.walletBalance >= this.totalDiscountPrice) {
      this.placeOrder(1);
    } else {
      Swal.fire('Insufficient Balance', 'Your wallet balance is insufficient', 'error');
    }
  }

  handleCardPayment(): void {
    Swal.fire({
      title: 'Enter Card Details',
      html: `
        <input type="text" id="cardNumber" class="swal2-input" placeholder="Card Number">
        <input type="text" id="expiryDate" class="swal2-input" placeholder="Expiry Date (MM/YY)">
        <input type="text" id="cvv" class="swal2-input" placeholder="CVV">
      `,
      showCancelButton: true,
      confirmButtonText: 'Proceed with Card',
      preConfirm: () => {
        const cardNumber = (document.getElementById('cardNumber') as HTMLInputElement).value;
        const expiryDate = (document.getElementById('expiryDate') as HTMLInputElement).value;
        const cvv = (document.getElementById('cvv') as HTMLInputElement).value;

        if (!cardNumber || !expiryDate || !cvv) {
          Swal.showValidationMessage('Please enter all card details');
          return null;
        }

        return { cardNumber, expiryDate, cvv };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.placeOrder(2);
      }
    });
  }

  placeOrder(paymentMethod: number): void {
    if (this.isCartEmpty) {
      Swal.fire('Error', 'Your cart is empty. Please add items to your cart before proceeding.', 'error');
      return;
    }

    if (!this.memberId) {
      Swal.fire('Error', 'Member ID is missing. Please log in and try again.', 'error');
      return;
    }

    const orderPayload = {
      customerId: this.memberId,
      addressId: this.selectedAddressId,
      remarks: 'order',
      orderPayments: [
        {
          orderNo: this.generateOrderId(),
          transactionId: new Date().getTime().toString(),
          paymentMethodId: paymentMethod,
          amountPaid: this.totalDiscountPrice,
          onDate: new Date().toISOString()
        }
      ]
    };

    this.userService.createOrder(orderPayload).subscribe(
      (response: any) => {
        Swal.fire('Order Placed', 'Your order has been placed successfully', 'success');
        sessionStorage.setItem('orderNo', response.orderId);
        this.router.navigate(['/usershop/order-invoice']);
      },
      (error) => {
        console.error('Error placing order:', error);
        Swal.fire('Error', 'There was an error placing the order. Please try again later.', 'error');
      }
    );
  }

  generateOrderId(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString(); // Generates a 10-digit random number
  }
}
