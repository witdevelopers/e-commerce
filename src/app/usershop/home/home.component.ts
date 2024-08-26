import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  banners: any[] = [];
  baseUrl: string = 'https://www.mbp18k.com';
  categories: any;
  products: any;
  homePageSectionProducts: any[] = [];
  currentSlide = 0;

  constructor(private userservice: UserService) {}

  ngOnInit(): void {
    this.loadBanners();
    this.loadCategories();
    this.loadProducts();
    this.loadHomeSectionProductsDetails();
  }

  ngAfterViewInit(): void {
    this.initializeCartButtons();
  }

  // Loading Banners
  loadBanners() {
    this.userservice.getBanners().subscribe((res: any[]) => {
      this.banners = res.map((banner) => {
        // Prepend the base URL only if the imageUrl is relative
        if (!banner.imageUrl.startsWith('http') && !banner.imageUrl.startsWith('https')) {
          banner.imageUrl = `${this.baseUrl}${banner.imageUrl}`;
        }
        return banner;
      });
    });
  }

  // Slide navigation methods
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.banners.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.banners.length) % this.banners.length;
  }

  // Load Categories
  loadCategories() {
    this.userservice.getCategories().subscribe((data) => {
      this.categories = data;
      console.log("Loaded categories: ", data);
    });
  }

  // Load Products
  loadProducts() {
    this.userservice.getProducts().subscribe((data) => {
      this.products = data;
      console.log("Loaded products: ", data);
    });
  }

  // Load Home Page Section Products
  loadHomeSectionProductsDetails() {
    this.userservice.getHomePageSectionProduct().subscribe((data) => {
      this.homePageSectionProducts = data;
      console.log('Loaded home page section products: ', data);
    });
  }

  // Initialize Cart Buttons after view initialization
  private initializeCartButtons(): void {
    const cartButtons = document.querySelectorAll<HTMLElement>('.cart-button');

    // Define the click event handler function
    function cartClick(this: HTMLElement): void {
      this.classList.add('clicked');
    }

    // Add event listeners to each button
    cartButtons.forEach((button) => {
      button.addEventListener('click', cartClick);
    });
  }
  
}
