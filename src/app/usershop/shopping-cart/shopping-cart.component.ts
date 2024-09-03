import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  customerId: number = 41;
  promoCode: string | null = null;
  promoPrice: number | null = null;
  fadeTime: number = 300;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadCart();
    this.initEventListeners();
  }

  loadCart(): void {
    this.userService.getCart(this.customerId).subscribe(
      (data) => {
        this.cartItems = data;
        console.log("Cart data:", data);
        this.updateSumItems();
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

  applyPromoCode(): void {
    const promoCodeInput = (document.getElementById('promo-code') as HTMLInputElement)?.value;
    this.promoCode = promoCodeInput || null;

    if (this.promoCode === '10off' || this.promoCode === '10OFF') {
      if (this.promoPrice === null) {
        this.promoPrice = 10;
      }
    } else if (this.promoCode !== '') {
      alert('Invalid Promo Code');
      this.promoPrice = 0;
    }

    if (this.promoPrice !== null) {
      document.querySelector('.summary-promo')?.classList.remove('hide');
      (document.querySelector('.promo-value') as HTMLElement).textContent = this.promoPrice.toFixed(2);
      this.recalculateCart(true);
    }
  }

  recalculateCart(onlyTotal: boolean): void {
    let subtotal: number = 0;

    // Sum up row totals
    document.querySelectorAll('.basket-product').forEach(row => {
      const subtotalText = (row.querySelector('.subtotal') as HTMLElement).textContent || '0';
      subtotal += parseFloat(subtotalText);
    });

    let total: number = subtotal;

    const promoPrice = parseFloat((document.querySelector('.promo-value') as HTMLElement).textContent || '0');
    if (promoPrice) {
      if (subtotal >= 10) {
        total -= promoPrice;
      } else {
        alert('Order must be more than £10 for Promo code to apply.');
        document.querySelector('.summary-promo')?.classList.add('hide');
      }
    }

    if (onlyTotal) {
      // Update total display
      const totalValue = document.querySelector('.total-value') as HTMLElement;
      totalValue.style.opacity = '0';
      setTimeout(() => {
        (document.querySelector('#basket-total') as HTMLElement).textContent = total.toFixed(2);
        totalValue.style.opacity = '1';
      }, this.fadeTime);
    } else {
      // Update summary display
      const finalValue = document.querySelector('.final-value') as HTMLElement;
      finalValue.style.opacity = '0';
      setTimeout(() => {
        (document.querySelector('#basket-subtotal') as HTMLElement).textContent = subtotal.toFixed(2);
        (document.querySelector('#basket-total') as HTMLElement).textContent = total.toFixed(2);
        if (total === 0) {
          document.querySelector('.checkout-cta')?.classList.add('hide');
        } else {
          document.querySelector('.checkout-cta')?.classList.remove('hide');
        }
        finalValue.style.opacity = '1';
      }, this.fadeTime);
    }
  }

  updateQuantity(quantityInput: HTMLInputElement): void {
    const productRow = (quantityInput.closest('.basket-product') as HTMLElement);
    const price = parseFloat((productRow.querySelector('.price') as HTMLElement).textContent || '0');
    const quantity = parseInt(quantityInput.value, 10);
    const linePrice = price * quantity;

    // Update line price display and recalculate cart totals
    (productRow.querySelector('.subtotal') as HTMLElement).style.opacity = '0';
    setTimeout(() => {
      (productRow.querySelector('.subtotal') as HTMLElement).textContent = linePrice.toFixed(2);
      this.recalculateCart(false);
      (productRow.querySelector('.subtotal') as HTMLElement).style.opacity = '1';
    }, this.fadeTime);

    (productRow.querySelector('.item-quantity') as HTMLElement).textContent = quantity.toString();
    this.updateSumItems();
  }

  updateSumItems(): void {
    let sumItems: number = 0;
    document.querySelectorAll('.quantity input').forEach(input => {
      sumItems += parseInt((input as HTMLInputElement).value, 10);
    });
    (document.querySelector('.total-items') as HTMLElement).textContent = sumItems.toString();
  }

  removeItem(removeButton: HTMLButtonElement): void {
    const productRow = (removeButton.closest('.basket-product') as HTMLElement);
    productRow.style.opacity = '0';
    setTimeout(() => {
      productRow.remove();
      this.recalculateCart(false);
      this.updateSumItems();
    }, this.fadeTime);
  }

  initEventListeners(): void {
    document.querySelectorAll('.quantity input').forEach(input => {
      (input as HTMLInputElement).addEventListener('change', () => this.updateQuantity(input as HTMLInputElement));
    });

    document.querySelectorAll('.remove button').forEach(button => {
      (button as HTMLButtonElement).addEventListener('click', () => this.removeItem(button as HTMLButtonElement));
    });

    document.querySelector('.promo-code-cta')?.addEventListener('click', () => this.applyPromoCode());
  }
}
