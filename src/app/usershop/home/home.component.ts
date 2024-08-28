import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  banners: any[] = [];
  baseUrl: string = 'https://www.mbp18k.com';
  baseUrlProduct: string = 'https://www.mbp18k.com/Shop//';
  homePageSectionProducts: any = {}; // Initialize as an object
  currentSlide = 0;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  // Carousel properties
  private leftValue = 0;
  private totalMovementSize: number;
  private carouselInner: HTMLElement | null = null;
  private carouselVp: HTMLElement | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadBanners();
    this.loadHomeSectionProductsDetails();
  }

  ngAfterViewInit(): void {
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

  // Load Home Page Section Products
  loadHomeSectionProductsDetails(): void {
    this.userService.getHomePageSectionProduct()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (data) => {
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
}
