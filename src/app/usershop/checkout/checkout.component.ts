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
    address2: '',
    address3: '',
    postalCode: '',
    cityName: '',
    stateId: 0,
    countryId: 0,
    addressType: 0,
    phone: '',
    isActive: true,
    createdOn: new Date().toISOString()
  };
  showAddressForm = false;
  isCartEmpty = true;
  isEditMode = false;

  private imageBaseUrl = 'https://www.mbp18k.com/Shop//'; // Base URL for images

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getCartDetails();
  }

  // Add new address or reset form
  addAddress(): void {
    this.isEditMode = false;
    this.resetNewAddress();
    this.showAddressForm = true;
  }

  resetNewAddress(): void {
    this.newAddress = {
      customerId: 0,
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      address3: '',
      postalCode: '',
      cityName: '',
      stateId: 0,
      countryId: 0,
      addressType: 0,
      phone: '',
      isActive: true,
      createdOn: new Date().toISOString()
    };
  }

  // Fetch cart details
  getCartDetails(): void {
    const customerId = +sessionStorage.getItem('memberId');
    if (customerId) {
      this.userService.getCart(customerId).subscribe(
        data => {
          this.cartDetails = data;
          this.isCartEmpty = !this.cartDetails || this.cartDetails.length === 0;

          this.cartDetails = this.cartDetails.map((item: any) => {
            if (item.imageUrl) {
              item.imageUrl = this.imageBaseUrl + item.imageUrl.replace('~/', '');
            }
            return item;
          });

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

  // Fetch addresses
  loadAddresses(): void {
    const customerId = +sessionStorage.getItem('memberId');
    if (customerId) {
      this.userService.getAddressesByCustomerId(customerId).subscribe(
        (data: any[]) => {
          this.addresses = data;
          if (this.addresses.length > 0) {
            this.selectedAddress = this.addresses[0];
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

  // Create a new address
  createAddress(): void {
    const customerId = +sessionStorage.getItem('memberId');
    this.newAddress.customerId = customerId;

    if (customerId) {
      this.userService.createAddress(this.newAddress).subscribe(
        response => {
          console.log('Address created successfully:', response);
          this.loadAddresses();
        },
        error => {
          console.error('Error creating address:', error);
          alert('There was an error creating the address. Please try again later.');
        }
      );
    } else {
      alert('Customer ID is missing. Please log in and try again.');
    }
  }

  // Select an address
  selectAddress(address: any): void {
    this.selectedAddress = address;
  }

  // Edit an address
  editAddress(address: any): void {
    this.newAddress = { ...address };
    this.isEditMode = true;
    this.showAddressForm = true;
  }

  // Update address
  updateAddress(): void {
    const customerId = +sessionStorage.getItem('memberId');
    this.newAddress.customerId = customerId;

    if (customerId) {
      this.userService.updateAddress(this.newAddress).subscribe(
        response => {
          console.log('Address updated successfully:', response);
          this.loadAddresses();
          this.resetNewAddress();
          this.isEditMode = false;
          this.showAddressForm = false;
        },
        error => {
          console.error('Error updating address:', error);
          alert('There was an error updating the address. Please try again later.');
        }
      );
    } else {
      alert('Customer ID is missing. Please log in and try again.');
    }
  }

  // Delete an address
  deleteAddress(addressId: number): void {
    const customerId = +sessionStorage.getItem('memberId');
    if (confirm('Are you sure you want to delete this address?')) {
      this.userService.deleteAddress(addressId, customerId).subscribe(
        response => {
          console.log('Address deleted successfully:', response);
          this.loadAddresses();
        },
        error => {
          console.error('Error deleting address:', error);
          alert('There was an error deleting the address. Please try again later.');
        }
      );
    }
  }

  // Proceed to checkout
  checkout(): void {
    if (this.selectedAddress) {
      console.log('Proceeding with checkout. Selected Address:', this.selectedAddress);
      this.router.navigate(['/checkout/confirm']);
    } else {
      alert('Please select an address to proceed with checkout.');
    }
  }
}
