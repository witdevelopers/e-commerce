import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import { Settings } from 'src/app/app-setting'; // Import the Settings class

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartDetails: any = null;
  totalCartPrice = 0;
  totalDiscountPrice = 0;
  totalQuantity = 0;
  addresses: any[] = [];
  selectedAddress: any = null;
  newAddress = {
    customerId: 0,
    name: '',
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
  countries: any[] = [];
  states: any[] = [];
  
  isAddressSelected = false;
  private imageBaseUrl: string = Settings.imageBaseUrl; // Dynamic base URL for images
  
  addressTypeMapping = {
    Home: 1,
    Office: 2,
    Other: 3
  };
  selectedAddressId: number | null = null;

  constructor(private userService: UserService, private router: Router) {
    // No need to set imageBaseUrl in constructor as it's already set statically
  }

  ngOnInit(): void {
    this.getCartDetails();
    this.getCountries();
  }

  addAddress(): void {
    this.isEditMode = false;
    this.resetNewAddress();
    this.showAddressForm = true;
  }

  resetNewAddress(): void {
    this.newAddress = {
      customerId: 0,
      name: '',
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

  onCountryChange(countryId: number): void {
    if (countryId) {
      this.userService.getStatesByCountry(countryId).subscribe(
        (data) => {
          this.states = data;
        },
        (error) => {
          console.error('Error fetching states:', error);
        }
      );
    } else {
      this.states = [];
    }
  }

  getCartDetails(): void {
    const customerId = +sessionStorage.getItem('memberId');
    if (customerId) {
      this.userService.getCart(customerId).subscribe(
        data => {
          this.cartDetails = data;
          this.isCartEmpty = !this.cartDetails || this.cartDetails.items.length === 0;
  
          if (!this.isCartEmpty) {
            this.cartDetails.items = this.cartDetails.items.map((item: any) => {
              if (item.imageUrl && item.imageUrl.startsWith('~/')) {
                item.imageUrl = this.getImageUrl(item.imageUrl); // Dynamically construct image URL
              }
              return item;
            });
  
            this.totalCartPrice = this.cartDetails.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
            this.totalDiscountPrice = this.cartDetails.items.reduce((sum: number, item: any) => sum + item.discountPrice * item.quantity, 0);
            this.totalQuantity = this.cartDetails.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  
            this.loadAddresses();
          }
        },
        error => {
          console.error('Error fetching cart details:', error);
          alert('There was an error fetching cart details. Please try again later.');
        }
      );
    } else {
      alert('Customer ID is missing. Please log in and try again.');
    }
  }
  
  loadAddresses(): void {
    const customerId = +sessionStorage.getItem('memberId');
    if (customerId) {
      this.userService.getAddressesByCustomerId(customerId).subscribe(
        (data: any[]) => {
          this.addresses = data;
          this.selectedAddressId = null;
          this.isAddressSelected = false;
          this.showAddressForm = this.addresses.length === 0;
        },
        (error) => {
          console.error('Error loading addresses:', error);
        }
      );
    } else {
      alert('Customer ID is missing. Please log in and try again.');
    }
  }

  onAddressTypeChange(event: any): void {
    const addressType = event.target.value;
    this.newAddress.addressType = this.addressTypeMapping[addressType] || 0;
  }

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

  editAddress(address: any): void {
    this.newAddress = { ...address };
    this.isEditMode = true;
    this.showAddressForm = true;
  }

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

  deleteAddress(addressId: number): void {
    const customerId = +sessionStorage.getItem('memberId');
    if (confirm('Are you sure you want to delete this address?')) {
      this.userService.deleteAddress(customerId, addressId).subscribe(
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

  selectAddress(addressId: number): void {
    this.selectedAddress = addressId;
    this.isAddressSelected = true;
    this.userService.setSelectedAddressId(addressId);
  }

  checkout(): void {
    if (this.selectedAddress) {
      console.log('Proceeding with checkout. Selected Address:', this.selectedAddress);
      this.router.navigate(['/usershop/confirm']);
    } else {
      alert('Please select an address to proceed with checkout.');
    }
  }

  getCountries(): void {
    this.userService.getCountries().subscribe(
      (countries: any[]) => {
        this.countries = countries;
      },
      error => {
        console.error('Error fetching countries:', error);
        alert('There was an error fetching the country list. Please try again later.');
      }
    );
  }

  // Method to construct the full image URL
  private getImageUrl(imagePath: string): string {
    return imagePath
      ? `${this.imageBaseUrl}${imagePath.replace('~/', '')}`  // Construct full image URL using dynamic base URL
      : 'assets/default-image.jpg';  // Fallback image URL
  }
}
