import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import Swal from 'sweetalert2';

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
  private imageBaseUrl = 'https://www.mbp18k.com/'; // Base URL for images
  walletBalance: number = 0; // To store wallet balance
  selectedPaymentMethod: string = '';  // Store the selected payment method
  memberId: number = 0; // User's memberId for API

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const memberId = sessionStorage.getItem('memberId'); // Retrieve memberId from sessionStorage
    if (memberId) {
      this.memberId = +memberId;
      this.getWalletBalance(this.memberId); // Call the API with memberId as walletId
      this.getCartDetails(); // Fetch cart details
    } else {
      console.error('No memberId found in sessionStorage');
      Swal.fire('Error', 'No member ID found. Please log in again.', 'error');
    }
  }

  // Method to fetch wallet balance from the API
  getWalletBalance(walletId: number) {
    this.userService.getWalletBalance(walletId).subscribe(
      (data: any) => {
        this.walletBalance = data.balance; // Extracting balance from the response object
      },
      (error) => {
        console.error('Error fetching wallet balance:', error);
      }
    );
  }

  // Fetch cart details and calculate total prices, quantities
  getCartDetails(): void {
    if (this.memberId) {
      this.userService.getCart(this.memberId).subscribe(
        data => {
          this.cartDetails = data;
          console.log("Cart details:", data);
          this.isCartEmpty = !this.cartDetails || !this.cartDetails.items || this.cartDetails.items.length === 0;

          if (!this.isCartEmpty) {
            // Fix image URLs and calculate prices/quantities
            this.cartDetails.items = this.cartDetails.items.map((item: any) => {
              if (item.imageUrl && item.imageUrl.startsWith('~/')) {
                item.imageUrl = this.imageBaseUrl + item.imageUrl.replace('~/', '');
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
      console.error('Customer ID is not found in session storage.');
      Swal.fire('Error', 'Customer ID is missing. Please log in and try again.', 'error');
    }
  }

  // Capture the selected payment method
  onPaymentMethodSelect(method: string) {
    this.selectedPaymentMethod = method;
  }

  // Confirm checkout based on the selected payment method
  confirmCheckout() {
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
        this.placeOrder('Cash on Delivery');
        break;
      default:
        Swal.fire('Error', 'Invalid payment method selected', 'error');
        break;
    }
  }

  // Handle wallet payment
  handleWalletPayment() {
    if (this.walletBalance >= this.totalDiscountPrice) {
      // Proceed with the order
      this.placeOrder('Wallet');
    } else {
      Swal.fire('Insufficient Balance', 'Your wallet balance is insufficient', 'error');
    }
  }

  // Handle card payment (show a form or prompt to collect card details)
  handleCardPayment() {
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
        // Handle the card payment here (using the entered card details)
        // For now, just simulating card payment success
        this.placeOrder('Credit Card');
      }
    });
  }
// Method to place the order dynamically
placeOrder(paymentMethod: string) {
  // Check if the cart is empty
  if (this.isCartEmpty) {
    Swal.fire('Error', 'Your cart is empty. Please add items to your cart before proceeding.', 'error');
    return;
  }

  // Ensure the customer ID and other necessary data are available
  if (!this.memberId) {
    Swal.fire('Error', 'Member ID is missing. Please log in and try again.', 'error');
    return;
  }

  // Create the dynamic order payload
  const orderPayload = {
    customerId: this.memberId,  // Dynamically retrieved from session or user data
    addressId: this.getSelectedAddressId(),  // Dynamically selected by user
    remarks: 'order',  // Optional remarks for the order
    orderPayments: [
      {
        orderId: this.generateOrderId(),  // Dynamically generated Order ID
        transactionId: new Date().getTime().toString(), // Dynamic transaction ID (current timestamp)
        paymentMethodId: paymentMethod === 'Wallet' ? 1 : 2,  // Dynamic payment method based on selection
        paymentStatus: 'Completed',  // Static for now, you can handle payment statuses differently
        paymentStatusId: 3,  // Status ID (can be dynamic if needed)
        amountPaid: this.totalDiscountPrice,  // Total amount dynamically fetched
        onDate: new Date().toISOString()  // Dynamic timestamp
      }
    ]
  };

  // Send the order payload to the backend
  this.userService.createOrder(orderPayload).subscribe(
    (response: any) => {
      Swal.fire('Order Placed', 'Your order has been placed successfully', 'success');
      // Optionally, redirect or clear the cart
    },
    (error) => {
      console.error('Error placing order:', error);
      Swal.fire('Error', 'There was an error placing the order', 'error');
    }
  );
}
// Utility method to dynamically generate an order ID
generateOrderId(): string {
  return 'ORD-' + new Date().getTime();  // Example, you can improve the logic here
}

// Utility method to get the dynamically selected address ID
getSelectedAddressId(): number {
  // Fetch the selected address ID from the user's saved addresses or an address selection process
  // Replace this with actual logic to select the address
  return 12;  // Example: Replace with dynamic address fetching
}
}