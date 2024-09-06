import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getCartDetails();
  }

  // Fetch cart details and calculate total prices, quantities
  getCartDetails(): void {
    const customerId = +sessionStorage.getItem('memberId');
    if (customerId) {
      this.userService.getCart(customerId).subscribe(
        data => {
          this.cartDetails = data;
          console.log("Cart details:", data);
          this.isCartEmpty = !this.cartDetails || this.cartDetails.items.length === 0;
  
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
          alert('There was an error fetching cart details. Please try again later.');
        }
      );
    } else {
      console.error('Customer ID is not found in session storage.');
      alert('Customer ID is missing. Please log in and try again.');
    }
  }
}
