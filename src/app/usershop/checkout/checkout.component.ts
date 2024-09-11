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
    addressType: 0, // Store integer for address type
    phone: '',
    isActive: true,
    createdOn: new Date().toISOString()
  };
  showAddressForm = false;
  isCartEmpty = true;
  isEditMode = false;
  countries: any[] = [];
  states: any[] = [];
  
  isAddressSelected = false; // To check if an address is selected
  private imageBaseUrl = 'https://www.mbp18k.com/'; // Base URL for images
  
  // Mapping address types to integers
  addressTypeMapping = {
    Home: 1,
    Office: 2,
    Other: 3
  };
  selectedAddressId: null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getCartDetails();
    this.getCountries(); // Fetch country list on initialization
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
      name: '',    
      address1: '',
      address2: '',
      address3: '',
      postalCode: '',
      cityName: '',
      stateId: 0,
      countryId: 0,
      addressType: 0, // Reset to default
      phone: '',
      isActive: true,
      createdOn: new Date().toISOString()
    };
  }

  // Method to fetch states based on selected country ID
  onCountryChange(countryId: number): void {
    if (countryId) {
      this.userService.getStatesByCountry(countryId).subscribe(
        (data) => {
          this.states = data; // Bind fetched states
        },
        (error) => {
          console.error('Error fetching states:', error);
        }
      );
    } else {
      this.states = [];
    }
  }

  // Fetch cart details and update image URLs with base URL
  getCartDetails(): void {
    const customerId = +sessionStorage.getItem('memberId');
    if (customerId) {
      this.userService.getCart(customerId).subscribe(
        data => {
          this.cartDetails = data;
          this.isCartEmpty = !this.cartDetails || this.cartDetails.items.length === 0;
  
          if (!this.isCartEmpty) {
            // Fix image URLs to ensure correct base path
            this.cartDetails.items = this.cartDetails.items.map((item: any) => {
              if (item.imageUrl && item.imageUrl.startsWith('~/')) {
                item.imageUrl = this.imageBaseUrl + item.imageUrl.replace('~/', '');
              }
              return item;
            });
  
            // Calculate total price, discount price, and quantity
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
  
  // Fetch addresses
  loadAddresses(): void {
    const customerId = +sessionStorage.getItem('memberId');
    if (customerId) {
      this.userService.getAddressesByCustomerId(customerId).subscribe(
        (data: any[]) => {
          this.addresses = data;
          this.selectedAddressId = null; // No address is selected initially
          this.isAddressSelected = false; // Disable the "Proceed to Payment" button until an address is selected
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
  

  // Handle address type selection from dropdown and map to integer
  onAddressTypeChange(event: any): void {
    const addressType = event.target.value;
    this.newAddress.addressType = this.addressTypeMapping[addressType] || 0; // Fallback to 0 if not mapped
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
    const customerId = +sessionStorage.getItem('memberId'); // Get customer ID from session
    if (confirm('Are you sure you want to delete this address?')) {
      this.userService.deleteAddress(customerId, addressId).subscribe(
        response => {
          console.log('Address deleted successfully:', response);
          this.loadAddresses(); // Refresh the address list after deletion
        },
        error => {
          console.error('Error deleting address:', error);
          alert('There was an error deleting the address. Please try again later.');
        }
      );
    }
  }


  selectAddress(address: number): void {
    this.selectedAddress = address; // Set the selected address ID
    this.isAddressSelected = true; // Enable the "Proceed to Payment" button
    this.userService.setSelectedAddressId(address); // Store the address ID if needed
  }
  

  checkout(): void {
    if (this.selectedAddress) {
      console.log('Proceeding with checkout. Selected Address:', this.selectedAddress);
      this.router.navigate(['/confirm']); // Navigate to the checkout confirm page
    } else {
      alert('Please select an address to proceed with checkout.');
    }
  }

  // Fetch list of countries
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
}
