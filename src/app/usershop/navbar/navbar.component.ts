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
  isLoggedIn: boolean = false;
  userName: string = '';
  cartQuantity: number = 0; // To store the cart quantity
  mainCategory: any[] = [];
  subCategory: { [key: number]: any[] } = {};
  isSubCategoryVisible: { [key: number]: boolean } = {};
  productByKeyword: any[] = [];
  searchTerm: string = ''; // To track search input
  // myId = uuidv4(); // --------> UUID
  myId = Date.now() // --------> epoch time

  constructor(
    private userService: UserService,
    private router: Router,
    private encryptionService: EncryptionService // Inject EncryptionService
  ) { }

  ngOnInit(): void {
    this.getMainCategory();
    this.createanonUser();
    this.updateCartQuantity();
    // Check if the user is logged in
   
  }

  updateCartQuantity(): void {
    const sessionUserId = sessionStorage.getItem('memberId');
    const tempUserId = localStorage.getItem('TempUserId');
    
    if (sessionUserId) {
      // If userId is found in sessionStorage, consider the user logged in
      this.isLoggedIn = true;
      this.userName = sessionStorage.getItem('userId') || 'Profile';
      
      // Subscribe to cart quantity observable
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity; // Automatically update the cart quantity
      });
  
      // Initial cart quantity load from sessionStorage userId
      this.userService.updateCartQuantity(Number(sessionUserId));
    } else if (tempUserId) {
      // If userId is found only in localStorage (guest/anonymous user), set isLoggedIn to false
      this.isLoggedIn = false;
  
      // Subscribe to cart quantity observable for anonymous user
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity;
      });
  
      // Initial cart quantity load from localStorage (anonymous userId)
      this.userService.updateCartQuantity(Number(tempUserId));
    }
  }
  
  
  createanonUser(): void{
    
    const uid = localStorage.getItem('TempUserId')
    if (uid) {
      // Do nothing
    } else {
      localStorage.setItem('TempUserId', this.myId.toString());
    }
  }

  // getUniqueId(parts: number): string {
  //   const stringArr = [];
  //   for(let i = 0; i< parts; i++){
  //     // tslint:disable-next-line:no-bitwise
  //     const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  //     stringArr.push(S4);
  //   }
  //   return stringArr.join('-');
  // }

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
    //  const encryptedId = this.encryptionService.encrypt(productId.toString());

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
    this.updateCartQuantity();
  }

  clearSearch(): void {
    this.searchTerm = ''; // Clear search term
    this.productByKeyword = []; // Clear the search results
  }
}
  