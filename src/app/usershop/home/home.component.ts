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

  // Carousel properties
  private leftValue = 0;
  private totalMovementSize: number;
  private carouselInner: HTMLElement | null = null;
  private carouselVp: HTMLElement | null = null;

  constructor(private userservice: UserService) {}

  ngOnInit(): void {
    this.loadBanners();
    this.loadCategories();
    this.loadProducts();
    this.loadHomeSectionProductsDetails();
  }

  ngAfterViewInit(): void {
    this.initializeCartButtons(); // Initialize cart buttons
    this.initializeCarousel(); // Initialize carousel
  }

  // Loading Banners
  loadBanners() {
    this.userservice.getBanners().subscribe((res: any[]) => {
      this.banners = res.map((banner) => {
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

  // Initialize Carousel
  private initializeCarousel(): void {
    this.carouselInner = document.querySelector<HTMLElement>("#cCarousel-inner");
    this.carouselVp = document.querySelector<HTMLElement>("#carousel-vp");
    
    if (this.carouselInner && this.carouselVp) {
      const carouselItem = document.querySelector<HTMLElement>(".cCarousel-item");
      
      if (carouselItem) {
        this.totalMovementSize = 
          parseFloat(carouselItem.getBoundingClientRect().width.toFixed(2)) +
          parseFloat(window.getComputedStyle(this.carouselInner).getPropertyValue("gap"));
        
        const prev = document.querySelector<HTMLButtonElement>("#prev");
        const next = document.querySelector<HTMLButtonElement>("#next");
        
        if (prev && next) {
          prev.addEventListener("click", () => this.moveCarousel(-1));
          next.addEventListener("click", () => this.moveCarousel(1));
        }

        this.handleMediaQueries();
      }
    }
  }

  // Move Carousel
  private moveCarousel(direction: number): void {
    if (this.carouselInner && this.carouselVp) {
      const carouselVpWidth = this.carouselVp.getBoundingClientRect().width;
      const carouselInnerWidth = this.carouselInner.getBoundingClientRect().width;

      if (direction === -1 && this.leftValue < 0) {
        this.leftValue += this.totalMovementSize;
        this.carouselInner.style.left = `${this.leftValue}px`;
      } else if (direction === 1 && (carouselInnerWidth - Math.abs(this.leftValue)) > carouselVpWidth) {
        this.leftValue -= this.totalMovementSize;
        this.carouselInner.style.left = `${this.leftValue}px`;
      }
    }
  }

  // Handle Media Queries
  private handleMediaQueries(): void {
    const mediaQuery510 = window.matchMedia("(max-width: 510px)");
    const mediaQuery770 = window.matchMedia("(max-width: 770px)");

    mediaQuery510.addEventListener("change", this.mediaManagement.bind(this));
    mediaQuery770.addEventListener("change", this.mediaManagement.bind(this));
  }

  // Media Management
  private mediaManagement(event: MediaQueryListEvent): void {
    if (this.carouselInner) {
      const newViewportWidth = window.innerWidth;

      if (this.leftValue <= -this.totalMovementSize && window.innerWidth < newViewportWidth) {
        this.leftValue += this.totalMovementSize;
        this.carouselInner.style.left = `${this.leftValue}px`;
      } else if (this.leftValue <= -this.totalMovementSize && window.innerWidth > newViewportWidth) {
        this.leftValue -= this.totalMovementSize;
        this.carouselInner.style.left = `${this.leftValue}px`;
      }
    }
  }
}
