import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import { EncryptionService } from '../encryption.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';
  cartQuantity: number = 0; // To store the cart quantity
  mainCategory: any[] = [];
  subCategory: { [key: number]: any[] } = {};
  isSubCategoryVisible: { [key: number]: boolean } = {};
  productByKeyword: any[] = [];
  searchTerm: string = ''; // To track search input

  constructor(
    private userService: UserService,
    private router: Router,
    private encryptionService: EncryptionService // Inject EncryptionService
  ) {}

  ngOnInit(): void {
    this.getMainCategory();

    // Check if the user is logged in
    const userId = sessionStorage.getItem('memberId');
    if (userId) {
      this.isLoggedIn = true;
      this.userName = sessionStorage.getItem('userId') || 'Profile';

      // Subscribe to cart quantity observable
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity; // Automatically update the cart quantity
      });

      // Initial cart quantity load
      this.userService.updateCartQuantity(Number(userId));
    }
  }

  signOut(): void {
    sessionStorage.clear();
    this.isLoggedIn = false;
  
    // Forcefully reload the home page after sign out
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/home']);
    });
  }
  
  getMainCategory(): void {
    this.userService.getMainCategory().subscribe(
      (res: any[]) => {
        this.mainCategory = res;
      },
      (error) => {
        console.error('Error fetching main categories', error);
      }
    );
  }

  loadSubCategory(parentCategoryId: number): void {
    if (!this.subCategory[parentCategoryId]) {
      this.userService.getSubCategory(parentCategoryId).subscribe(
        (res: any[]) => {
          this.subCategory[parentCategoryId] = res;
        },
        (error) => {
          console.error('Error fetching subcategories', error);
        }
      );
    }
    this.isSubCategoryVisible[parentCategoryId] = true;
  }

  hideSubCategory(parentCategoryId: number): void {
    this.isSubCategoryVisible[parentCategoryId] = false;
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value; // Update search term
    if (this.searchTerm.length > 2) {
      this.getProductByKeyword(this.searchTerm);
    } else {
      this.clearSearch();
    }
  }

  getProductByKeyword(keyword: string): void {
    this.userService.SearchProductByKeyword(keyword).subscribe((data) => {
      this.productByKeyword = data;
    });
  }

  navigateToProduct(productId: number): void {
    // Encrypt the product ID if necessary
     const encryptedId = this.encryptionService.encrypt(productId.toString());

    // Force navigation to the same product page or a new one
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/product', productId]);
    });

    // Clear the search or any other logic as required
    this.clearSearch();
}


  onAddToCart(): void {
    // Forcefully reload the shopping cart route
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/shopping-cart']);
    });
  }

  clearSearch(): void {
    this.searchTerm = ''; // Clear search term
    this.productByKeyword = []; // Clear the search results
  }
}
