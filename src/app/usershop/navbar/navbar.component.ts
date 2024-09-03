import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
clearSearch() {
throw new Error('Method not implemented.');
}
  isLoggedIn: boolean = false;
  userName: string = '';
  
  mainCategory: any[] = [];
  subCategory: { [key: number]: any[] } = {};
  isSubCategoryVisible: { [key: number]: boolean } = {};
  AllProductByCategoryId: any[] = [];
  productByKeyword: any[] = [];

  constructor(
    private userService: UserService,
    private router: Router // Inject Router here
  ) {}

  ngOnInit(): void {
    this.getMainCategory();
    this.getAllProductByCategoryId(7);
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      this.isLoggedIn = true;
      this.userName = sessionStorage.getItem('userName') || 'Profile';
    }
  }

  signOut(): void {
    sessionStorage.clear(); // Clear all session storage
    this.isLoggedIn = false;
    this.router.navigate(['/auth/signin']); // Redirect to the sign-in page
  }

  getMainCategory() {
    this.userService.getMainCategory().subscribe(
      (res: any[]) => {
        this.mainCategory = res;
      },
      (error) => {
        console.error('Error fetching main categories', error);
      }
    );
  }

  loadSubCategory(parentCategoryId: number) {
    if (parentCategoryId === undefined || parentCategoryId === null) {
      console.error('Invalid parentCategoryId:', parentCategoryId);
      return;
    }

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
  

  hideSubCategory(parentCategoryId: number) {
    if (parentCategoryId !== undefined && parentCategoryId !== null) {
      this.isSubCategoryVisible[parentCategoryId] = false;
    }
  }

  getAllProductByCategoryId(categoryId: number) {
    this.userService.getAllProductByCategoryId(categoryId).subscribe((data) => {
      this.AllProductByCategoryId = data;
    });
  }

  onSearch(event: any): void {
    const keyword = event.target.value;

    if (keyword.length > 2) {
      // Start searching after 3 characters
      this.getProductByKeyword(keyword);
    }
  }

  getProductByKeyword(keyword: string) {
    this.userService.SearchProductByKeyword(keyword).subscribe((data) => {
      this.productByKeyword = data;
    });
  }

  navigateToProduct(productId: string): void {
    this.router.navigate([`/product/${productId}`]);
  }

  onAddToCart(): void {
    this.router.navigate(['/shopping-cart']);
  }
}
