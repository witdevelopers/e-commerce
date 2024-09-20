import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import { EncryptionService } from '../encryption.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false; // Track login state
  userName: string = ''; // Track username for display
  cartQuantity: number = 0; // To store the cart quantity
  mainCategory: any[] = [];
  subCategory: { [key: number]: any[] } = {};
  isSubCategoryVisible: { [key: number]: boolean } = {};
  productByKeyword: any[] = [];
  searchTerm: string = ''; // To track search input
  myId = Date.now(); // Generate unique ID for anonymous users

  constructor(
    private userService: UserService,
    private router: Router,
    private encryptionService: EncryptionService // Inject EncryptionService
  ) {}

  ngOnInit(): void {
    this.getMainCategory();
    this.createanonUser(); // Create an anonymous user if not logged in
    this.updateCartQuantity(); 
    // Check and update cart quantity based on logged-in status
  }

  updateCartQuantity(): void {
    const sessionUserId = sessionStorage.getItem('memberId'); // Check sessionStorage for logged-in user
    const tempUserId = localStorage.getItem('TempUserId');    // Check localStorage for guest/anonymous user


    if (sessionUserId) {
      // User is logged in
      
      this.isLoggedIn = true;
      this.userName = sessionStorage.getItem('userId') || 'Profile'; // Fetch username from sessionStorage

      // Subscribe to cart quantity observable
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity; // Automatically update the cart quantity
       
      });

      // Initial cart quantity load from sessionStorage userId
      this.userService.updateCartQuantity(Number(sessionUserId));
      
    } else if (tempUserId) {
      // Anonymous user, not logged in
      this.isLoggedIn = false;

      // Subscribe to cart quantity observable for anonymous user
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity; // Update cart quantity for anonymous user
      });

      // Initial cart quantity load from localStorage (anonymous userId)
      this.userService.updateCartQuantity(Number(tempUserId));
    }
  }

  createanonUser(): void {
    const uid = localStorage.getItem('TempUserId');
    if (!uid) {
      // Create anonymous user if not already in localStorage
      localStorage.setItem('TempUserId', this.myId.toString());
    }
  }

  signOut(): void {
    sessionStorage.clear(); // Clear sessionStorage on sign out
    this.isLoggedIn = false; // Update login status

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
    this.updateCartQuantity(); // Ensure cart quantity is updated after fetching categories
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
    // Force navigation to the same product page or a new one
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/product', productId]);
    });
    this.clearSearch(); // Clear search results after navigating
  }

  onAddToCart(): void {
    // Forcefully reload the shopping cart route
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/shopping-cart']);
    });
    this.updateCartQuantity(); // Update cart quantity after adding to cart
  }

  clearSearch(): void {
    this.searchTerm = ''; // Clear search term
    this.productByKeyword = []; // Clear the search results
  }
  
}
