import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import { EncryptionService } from '../encryption.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userName: string = '';
  cartQuantity: number = 0; // To store the cart quantity
  mainCategory: any[] = [];
  subCategory: { [key: number]: any[] } = {};
  isSubCategoryVisible: { [key: number]: boolean } = {};
  isDropdownVisible: { [key: number]: boolean } = {}; // Dropdown visibility
  productByKeyword: any[] = [];
  searchTerm: string = ''; // To track search input
  myId = Date.now(); // Epoch time
  isSidebarOpen: boolean = false; // Sidebar state
  private searchSubject = new Subject<string>();
  private routerSubscription: Subscription;
  isHovered: { [key: number]: boolean } = {}; // To track hover state for categories

  constructor(
    private userService: UserService,
    private router: Router,
    private encryptionService: EncryptionService // Inject EncryptionService
  ) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeSidebar(); // Close sidebar on navigation
      }
    });
  }

  ngOnInit(): void {
    this.getMainCategory();
    this.createanonUser();
    this.updateCartQuantity();

    // Setup search subscription
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap((keyword) => this.userService.SearchProductByKeyword(keyword))
    ).subscribe((data) => {
      this.productByKeyword = data;
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe(); // Cleanup
  }

  updateCartQuantity(): void {
    const sessionUserId = sessionStorage.getItem('memberId');
    const tempUserId = localStorage.getItem('TempUserId');

    if (sessionUserId) {
      this.isLoggedIn = true;
      this.userName = sessionStorage.getItem('userId') || 'Profile';
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity; // Automatically update the cart quantity
      });
      this.userService.updateCartQuantity(Number(sessionUserId));
    } else if (tempUserId) {
      this.isLoggedIn = false;
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity; // Update cart quantity for anonymous user
      });
      this.userService.updateCartQuantity(Number(tempUserId));
    }
  }

  createanonUser(): void {
    const uid = localStorage.getItem('TempUserId');
    if (!uid) {
      localStorage.setItem('TempUserId', this.myId.toString());
    }
  }

  signOut(): void {
    sessionStorage.clear();
    this.isLoggedIn = false;
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
          this.isSubCategoryVisible[parentCategoryId] = true; // Show subcategory after loading
        },
        (error) => {
          console.error('Error fetching subcategories', error);
        }
      );
    } else {
      // If already loaded, just toggle visibility
      this.isSubCategoryVisible[parentCategoryId] = !this.isSubCategoryVisible[parentCategoryId];
    }
  }

  toggleDropdown(subCategoryId: number): void {
    this.isDropdownVisible[subCategoryId] = !this.isDropdownVisible[subCategoryId];
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value; // Update search term
    if (this.searchTerm.length > 2) {
      this.searchSubject.next(this.searchTerm); // Push to subject
    } else {
      this.clearSearch();
    }
  }

  navigateToProduct(productId: number): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/product', productId]);
    });
    this.clearSearch();
  }

  onAddToCart(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/shopping-cart']);
    });
    this.updateCartQuantity(); // Update cart quantity after adding to cart
  }

  clearSearch(): void {
    this.searchTerm = ''; // Clear search term
    this.productByKeyword = []; // Clear the search results
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen; // Toggle sidebar visibility
  }

  toggleSubCategory(parentCategoryId: number): void {
    this.isSubCategoryVisible[parentCategoryId] = !this.isSubCategoryVisible[parentCategoryId];
    // Load subcategories if they haven't been loaded yet
    if (!this.subCategory[parentCategoryId]) {
      this.loadSubCategory(parentCategoryId);
    }
  }

  redirectToLogin(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']); // Redirect to login page
  }

  updateUserName(): void {
    this.userName = sessionStorage.getItem('userId') || 'Profile';
  }

  closeSidebar(): void {
    this.isSidebarOpen = false; // Close the sidebar
  }

  showSubCategory(categoryID: number) {
    this.isHovered[categoryID] = true;
  }

  hideSubCategory(categoryID: number) {
    this.isHovered[categoryID] = false;
  }
}
