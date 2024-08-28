import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {

  banners: any[] = [];
  baseUrl: string = 'https://www.mbp18k.com';
  baseUrlProduct: string = 'https://www.mbp18k.com/Shop//';
  categories: any;
  products: any;
  homePageSectionProducts: any = {}; // Initialize as an object
  currentSlide = 0;
  image: any[] = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  // Carousel properties
  private leftValue = 0;
  private totalMovementSize: number;
  private carouselInner: HTMLElement | null = null;
  private carouselVp: HTMLElement | null = null;

  constructor(private userService: UserService) {}

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
    this.userService.getBanners().subscribe((res: any[]) => {
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

  nextSection(): void {
    if (this.carouselInner && this.carouselVp) {
      const carouselVpWidth = this.carouselVp.getBoundingClientRect().width;
      const carouselInnerWidth = this.carouselInner.getBoundingClientRect().width;

      if ((carouselInnerWidth - Math.abs(this.leftValue)) > carouselVpWidth) {
        this.leftValue -= this.totalMovementSize;
        this.carouselInner.style.left = `${this.leftValue}px`;
      }
    }
  }

  prevSection(): void {
    if (this.carouselInner && this.carouselVp) {
      if (this.leftValue < 0) {
        this.leftValue += this.totalMovementSize;
        this.carouselInner.style.left = `${this.leftValue}px`;
      }
    }
  }

  // Load Categories
  loadCategories() {
    this.userService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  // Load Products
  loadProducts() {
    this.userService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  // Load Home Page Section Products
  loadHomeSectionProductsDetails(): void {
    this.userService.getHomePageSectionProduct()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (data) => {
          // Group products by sectionName
          const groupedProducts = data.reduce((sections, product) => {
            const section = product.sectionName || 'Others'; // Fallback for products without a section
            if (!sections[section]) {
              sections[section] = [];
            }
            sections[section].push({
              ...product,
              imageUrl: product.imageUrl.startsWith('http') ? product.imageUrl : `${this.baseUrlProduct}${product.imageUrl}`
            });
            return sections;
          }, {});
          this.homePageSectionProducts = groupedProducts;
        },
        error: (err) => console.error('Failed to load home page section products:', err)
      });
  }

  // Helper method to get object keys
  objectKeys = Object.keys;

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

        const prev = document.querySelector<HTMLElement>("#prev");
        const next = document.querySelector<HTMLElement>("#next");

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
