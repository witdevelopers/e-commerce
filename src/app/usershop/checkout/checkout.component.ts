import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartDetails: any = null;
  addresses: any[] = [];
  selectedAddress: any = null;
  newAddress = {
    customerId: 0,
    firstName: '',
    lastName: '',
    address1: '',
    postalCode: '',
    countryName: '',
    addressType: 0,
    isActive: true,
    createdOn: new Date().toISOString()
  };
  showAddressForm = false;
  isCartEmpty = true; // New property to track if the cart is empty

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getCartDetails();
  }

  getCartDetails(): void {
    const customerId = +sessionStorage.getItem('memberId'); // Convert to number

    if (customerId) {
      this.userService.getCart(customerId).subscribe(
        data => {
          this.cartDetails = data;
          this.isCartEmpty = !this.cartDetails || this.cartDetails.length === 0;
          console.log('Cart Details:', this.cartDetails);

          if (!this.isCartEmpty) {
            this.loadAddresses();
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

  loadAddresses(): void {
    const customerId = +sessionStorage.getItem('memberId'); // Convert to number

    if (customerId) {
      this.userService.getAddressesByCustomerId(customerId).subscribe(
        (data: any[]) => {
          this.addresses = data;
          if (this.addresses.length > 0) {
            this.selectedAddress = this.addresses[0]; // Select the first address by default
          }
          this.showAddressForm = this.addresses.length === 0;
        },
        error => {
          console.error('Error fetching addresses:', error);
          alert('There was an error fetching addresses. Please try again later.');
        }
      );
    } else {
      console.error('Customer ID is not found in session storage.');
      alert('Customer ID is missing. Please log in and try again.');
    }
  }

  createAddress(): void {
    const customerId = +sessionStorage.getItem('memberId'); // Convert to number
    this.newAddress.customerId = customerId;

    if (customerId) {
      this.userService.createAddress(this.newAddress).subscribe(
        response => {
          console.log('Address created successfully:', response);
          this.loadAddresses(); // Reload addresses after creation
          this.showAddressForm = false; // Hide form after successful creation
        },
        error => {
          console.error('Error creating address:', error);
          alert('There was an error creating the address. Please try again later.');
        }
      );
    } else {
      console.error('Customer ID is not found in session storage.');
      alert('Customer ID is missing. Please log in and try again.');
    }
  }

  selectAddress(address: any): void {
    this.selectedAddress = address;
    console.log('Selected Address:', this.selectedAddress);
  }

  increaseQuantity(item: any): void {
    if (item.quantity < item.stock) {
      item.quantity += 1;
      this.updateCart(item);
    } else {
      alert('Maximum quantity reached');
    }
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.updateCart(item);
    } else {
      alert('Minimum quantity is 1');
    }
  }

  updateCart(item: any): void {
    this.userService.updateCart(item).subscribe(
      response => {
        console.log('Cart updated successfully:', response);
        this.getCartDetails(); // Reload cart details to reflect changes
      },
      error => {
        console.error('Error updating cart:', error);
        alert('There was an error updating the cart. Please try again later.');
      }
    );
  }

  checkout(): void {
    if (this.selectedAddress) {
      console.log('Proceeding with checkout. Selected Address:', this.selectedAddress);
      this.router.navigate(['/checkout/confirm']); // Example navigation
    } else {
      console.error('No address selected.');
      alert('Please select an address to proceed with checkout.');
    }
  }
}
