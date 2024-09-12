import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import { UserService } from 'src/app/user/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css']
})
export class ProductSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  baseUrlProduct: string = 'https://www.mbp18k.com/Shop//';
  homePageSectionProducts: any = {};
  private ngUnsubscribe = new Subject<void>();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadHomeSectionProductsDetails();
  }

  ngAfterViewInit(): void {
    this.initializeSwipers(); // Initialize Swipers after view is fully initialized
  }

  private loadHomeSectionProductsDetails(): void {
    this.userService
      .getHomePageSectionProduct()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (data) => {
          this.homePageSectionProducts = this.groupProductsBySection(data);
          setTimeout(() => this.initializeSwipers(), 0); // Initialize Swipers after data is loaded
        },
        error: (err) => console.error('Failed to load home page section products:', err),
      });
  }

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

  private initializeSwipers(): void {
    Object.keys(this.homePageSectionProducts).forEach(sectionName => {
      new Swiper(`#swiper-${sectionName}`, {
        loop: true,
        centeredSlides: true,
        navigation: {
          nextEl: `.swiper-button-next[data-swiper-id="swiper-${sectionName}"]`,
          prevEl: `.swiper-button-prev[data-swiper-id="swiper-${sectionName}"]`,
        },
        breakpoints: {
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        },
      });
    });
  }

  objectKeys = Object.keys;

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
