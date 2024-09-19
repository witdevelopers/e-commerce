import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import Swal from 'sweetalert2';
import { Settings } from 'src/app/app-setting';
import { EncryptionService } from '../encryption.service'; // Assuming encryption service is needed

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})
export class SubcategoryComponent implements OnInit {
  subcategoryDetails: any[] = [];
  filteredSubcategoryDetails: any[] = [];
  subcategoryId: number;
  imageBaseUrl: string = Settings.imageBaseUrl;
  cartQuantity: number = 0;
  isLoggedIn: boolean = false;
  userName: string = '';
  searchTerm: string = '';
  productByKeyword: any[] = [];

  // Price filter properties
  minPrice: number = 0;
  maxPrice: number = 10000;

  // To keep track of products in cart
  productsInCart: Set<number> = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private encryptionService: EncryptionService // Inject encryption service
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.subcategoryId = params['id'];
      this.loadSubcategoryData(this.subcategoryId);
    });

    const userId = sessionStorage.getItem('memberId');
    if (userId) {
      this.isLoggedIn = true;
      this.userName = sessionStorage.getItem('userId') || 'Profile';

      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity;
      });

      this.userService.updateCartQuantity(Number(userId));
      this.loadProductsInCart(Number(userId)); // Load products in cart on init
    }
  }

  loadSubcategoryData(id: number): void {
    this.userService.getAllProductByCategoryId(id).subscribe(response => {
      this.subcategoryDetails = response.table || [];
      this.subcategoryDetails = this.subcategoryDetails.map(product => ({
        ...product,
        imageUrl: this.getImageUrl(product.imageUrl)
      }));
      this.filteredSubcategoryDetails = [...this.subcategoryDetails];
    }, error => {
      console.error('Error fetching subcategory details:', error);
    });
  }

  getImageUrl(imagePath: string): string {
    return imagePath ? `${this.imageBaseUrl}${imagePath.replace('~/', '')}` : 'assets/default-image.jpg';
  }

  filterByPrice(): void {
    this.filteredSubcategoryDetails = this.subcategoryDetails.filter(product =>
      product.discountPrice >= this.minPrice && product.discountPrice <= this.maxPrice
    );
  }

  loadProductsInCart(customerId: number): void {
    this.userService.getCart(customerId).subscribe(response => {
      this.productsInCart = new Set(response.items.map(item => item.productId));
    }, error => {
      console.error('Error fetching cart items:', error);
    });
  }

  addToCart(productDtId: number, quantity: number): void {
    const customerId = sessionStorage.getItem('memberId') || localStorage.getItem('memberId');
    if (!customerId) {
      Swal.fire({ icon: 'error', title: 'Please log in first.' });
      return;
    }

    this.userService.addToCart(+customerId, productDtId, quantity).subscribe(response => {
      Swal.fire({ icon: 'success', title: 'Added to cart successfully.' });
      this.loadProductsInCart(+customerId); // Refresh cart items after adding
    },);
  }

  goToCart(): void {
    this.router.navigate(['/shopping-cart']);
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
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
    const encryptedId = this.encryptionService.encrypt(productId.toString());
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/product', encryptedId]);
    });
    this.clearSearch();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.productByKeyword = [];
  }

  // Method to get button text
  getButtonText(productId: number): string {
    return this.productsInCart.has(productId) ? 'Go to Cart' : 'Add to Cart';
  }
}
