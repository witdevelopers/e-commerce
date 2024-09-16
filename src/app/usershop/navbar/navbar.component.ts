import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';
  cartQuantity: number = 0;
  mainCategory: any[] = [];
  subCategory: { [key: number]: any[] } = {};
  isSubCategoryVisible: { [key: number]: boolean } = {};
  productByKeyword: any[] = [];
  searchTerm: string = ''; // Track search input

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getMainCategory();
    const userId = sessionStorage.getItem('memberId');
    if (userId) {
      this.isLoggedIn = true;
      this.userName = sessionStorage.getItem('userId') || 'Profile';
      this.userService.cartQuantity$.subscribe(quantity => {
        this.cartQuantity = quantity;
      });
      this.userService.updateCartQuantity(Number(userId));
    }
  }

  signOut(): void {
    sessionStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/auth/signin']).then(() => {
      window.location.href = '/auth/signin';
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

  navigateToProduct(productId: string): void {
    this.router.navigate([`/usershop/product/${productId}`]);
  }

  onAddToCart(): void {
    this.router.navigate(['/usershop/shopping-cart']);
  }

  clearSearch(): void {
    this.searchTerm = ''; // Clear search term
    this.productByKeyword = []; // Clear the search results
  }
}
