import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  customerId: number = 41;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.userService.getCart(this.customerId).subscribe(
      (data) => {
        this.cartItems = data;
        console.log("Cart wala data: ", data); // Adjust based on actual data structure
      },
      (error) => {
        console.error('Error fetching cart data:', error);
      }
    );
  }

  updateCartItem(productDtId: number, quantity: number): void {
    const cartData = {
      customerId: this.customerId,
      productDtId: productDtId,
      quantity: quantity
    };

    this.userService.updateCart(cartData).subscribe(
      (response) => {
        console.log('Cart updated successfully:', response);
        this.loadCart(); // Reload the cart after updating
      },
      (error) => {
        console.error('Error updating cart:', error);
      }
    );
  }

}
