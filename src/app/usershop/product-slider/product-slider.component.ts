import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EncryptionService } from '../encryption.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css'],
})
export class ProductSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  baseUrlProduct: string = 'https://www.mbp18k.com/Shop//';
  homePageSectionProducts: any = {};
  private ngUnsubscribe = new Subject<void>();
  private leftValue = 0;
  private totalMovementSize = 0;
  private carouselInner: HTMLElement | null = null;
  private carouselVp: HTMLElement | null = null;

  constructor(
    private userService: UserService,
    private encryptionService: EncryptionService
  ) {}

  ngOnInit(): void {
    this.loadHomeSectionProductsDetails();
  }

  ngAfterViewInit(): void {
    this.initializeCarousel();
  }

  // Load Home Page Section Products
  private loadHomeSectionProductsDetails(): void {
    this.userService
      .getHomePageSectionProduct()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (data) => {
          this.homePageSectionProducts = this.groupProductsBySection(data);
        },
        error: (err) => console.error('Failed to load home page section products:', err),
      });
  }

  // Group products by section
  private groupProductsBySection(data: any[]): any {
    return data.reduce((sections, product) => {
      const section = product.sectionName || 'Others';
      if (!sections[section]) sections[section] = [];
      sections[section].push({
        ...product,
        imageUrl: product.imageUrl.startsWith('http')
          ? product.imageUrl
          : `${this.baseUrlProduct}${product.imageUrl}`,
      });
      return sections;
    }, {});
  }

  // Add to Cart Method
  addToCart(productDtId: number): void {
    const customerId = sessionStorage.getItem('memberId') || localStorage.getItem('memberId');
    if (!customerId) {
      Swal.fire({ icon: 'error', title: 'Customer ID is missing. Please log in again.' });
      return;
    }

    if (!productDtId || isNaN(productDtId)) {
      Swal.fire({ icon: 'error', title: 'Invalid Product ID.' });
      return;
    }

    this.userService.addToCart(+customerId, productDtId, 1).subscribe(
      () => Swal.fire({ icon: 'success', title: 'Product added to cart successfully.' }),
      () => Swal.fire({ icon: 'error', title: 'Product already added.' })
    );
  }

  // Initialize Carousel
  private initializeCarousel(): void {
    this.carouselInner = document.querySelector<HTMLElement>('#cCarousel-inner');
    this.carouselVp = document.querySelector<HTMLElement>('#carousel-vp');

    if (this.carouselInner && this.carouselVp) {
      const carouselItems = document.querySelectorAll<HTMLElement>('.cCarousel-item');
      if (carouselItems.length) {
        this.totalMovementSize = parseFloat(
          carouselItems[0].getBoundingClientRect().width.toFixed(2)
        ) + parseFloat(window.getComputedStyle(this.carouselInner).getPropertyValue('gap'));

        document.querySelector<HTMLButtonElement>('#prev')?.addEventListener('click', () => this.moveCarousel(-1));
        document.querySelector<HTMLButtonElement>('#next')?.addEventListener('click', () => this.moveCarousel(1));
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
      } else if (direction === 1 && carouselInnerWidth - Math.abs(this.leftValue) > carouselVpWidth) {
        this.leftValue -= this.totalMovementSize;
        this.carouselInner.style.left = `${this.leftValue}px`;
      }
    }
  }

  // Helper method to get object keys
  objectKeys = Object.keys;

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
