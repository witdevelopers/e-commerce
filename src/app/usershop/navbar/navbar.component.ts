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
    const keyword = event.target.value;
    if (keyword.length > 2) {
      this.getProductByKeyword(keyword);
    }
  }

  getProductByKeyword(keyword: string): void {
    this.userService.SearchProductByKeyword(keyword).subscribe((data) => {
      this.productByKeyword = data;
    });
  }
  
  navigateToProduct(productId: string): void {
    // Use Angular Router to navigate to the product page
    this.router.navigate([`/product/${productId}`]);
  }
  

  onAddToCart(): void {
    this.router.navigate(['/shopping-cart']);
  }
  

  clearSearch(): void {
    this.productByKeyword = [];
  }
}
