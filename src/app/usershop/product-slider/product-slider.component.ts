import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css'],
})
export class ProductSliderComponent implements OnInit, AfterViewInit {
  baseUrlProduct: string = 'https://www.mbp18k.com/Shop//';
  homePageSectionProducts: any = {}; // Initialize as an object

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  // Carousel properties
  private leftValue = 0;
  private totalMovementSize: number = 0;
  private carouselInner: HTMLElement | null = null;
  private carouselVp: HTMLElement | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadHomeSectionProductsDetails();
  }

  ngAfterViewInit(): void {
    this.initializeCarousel(); // Initialize carousel
    this.initializeCartButtons(); // Initialize cart buttons
  }

  // Load Home Page Section Products
  loadHomeSectionProductsDetails(): void {
    this.userService
      .getHomePageSectionProduct()
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
              imageUrl: product.imageUrl.startsWith('http')
                ? product.imageUrl
                : `${this.baseUrlProduct}${product.imageUrl}`,
            });
            return sections;
          }, {});
          this.homePageSectionProducts = groupedProducts;
          // console.log("home page wala section product::::===", this.homePageSectionProducts);
        },
        error: (err) =>
          console.error('Failed to load home page section products:', err),
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
    this.carouselInner =
      document.querySelector<HTMLElement>('#cCarousel-inner');
    this.carouselVp = document.querySelector<HTMLElement>('#carousel-vp');

    if (this.carouselInner && this.carouselVp) {
      const carouselItems =
        document.querySelectorAll<HTMLElement>('.cCarousel-item');

      if (carouselItems.length > 0) {
        this.totalMovementSize =
          parseFloat(
            carouselItems[0].getBoundingClientRect().width.toFixed(2)
          ) +
          parseFloat(
            window.getComputedStyle(this.carouselInner).getPropertyValue('gap')
          );

        const prev = document.querySelector<HTMLButtonElement>('#prev');
        const next = document.querySelector<HTMLButtonElement>('#next');

        if (prev && next) {
          prev.addEventListener('click', () => this.moveCarousel(-1));
          next.addEventListener('click', () => this.moveCarousel(1));
        }

        this.handleMediaQueries();
      }
    }
  }

  // Move Carousel
  private moveCarousel(direction: number): void {
    if (this.carouselInner && this.carouselVp) {
      const carouselVpWidth = this.carouselVp.getBoundingClientRect().width;
      const carouselInnerWidth =
        this.carouselInner.getBoundingClientRect().width;

      if (direction === -1 && this.leftValue < 0) {
        this.leftValue += this.totalMovementSize;
        this.carouselInner.style.left = `${this.leftValue}px`;
      } else if (
        direction === 1 &&
        carouselInnerWidth - Math.abs(this.leftValue) > carouselVpWidth
      ) {
        this.leftValue -= this.totalMovementSize;
        this.carouselInner.style.left = `${this.leftValue}px`;
      }
    }
  }

  // Handle Media Queries
  private handleMediaQueries(): void {
    const mediaQuery510 = window.matchMedia('(max-width: 510px)');
    const mediaQuery770 = window.matchMedia('(max-width: 770px)');

    mediaQuery510.addEventListener('change', this.mediaManagement.bind(this));
    mediaQuery770.addEventListener('change', this.mediaManagement.bind(this));
  }

  // Media Management
  private mediaManagement(event: MediaQueryListEvent): void {
    if (this.carouselInner) {
      const newViewportWidth = window.innerWidth;

      // Adjust leftValue based on viewport width changes
      if (
        this.leftValue <= -this.totalMovementSize &&
        window.innerWidth < newViewportWidth
      ) {
        this.leftValue += this.totalMovementSize;
        this.carouselInner.style.left = `${this.leftValue}px`;
      } else if (
        this.leftValue <= -this.totalMovementSize &&
        window.innerWidth > newViewportWidth
      ) {
        this.leftValue -= this.totalMovementSize;
        this.carouselInner.style.left = `${this.leftValue}px`;
      }
    }
  }

  // Helper method to get object keys
  objectKeys = Object.keys;
}
