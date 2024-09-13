import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import { UserService } from 'src/app/user/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { Settings } from 'src/app/app-setting'; // Import the Settings class

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css']
})
export class ProductSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  homePageSectionProducts: any = {};
  private ngUnsubscribe = new Subject<void>();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadHomeSectionProductsDetails();
  }

  ngAfterViewInit(): void {
    // Initialize Swipers only after the view has been fully initialized and data is loaded
    this.ngUnsubscribe.subscribe(() => this.initializeSwipers());
  }

  private loadHomeSectionProductsDetails(): void {
    this.userService
      .getHomePageSectionProduct()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (data) => {
          this.homePageSectionProducts = this.groupProductsBySection(data);
          console.log("Home Page Section Products:", this.homePageSectionProducts);
          // Use setTimeout to ensure Swipers are initialized after data is available
          setTimeout(() => this.initializeSwipers(), 0);
        },
        error: (err) => console.error('Failed to load home page section products:', err),
      });
  }

  private groupProductsBySection(data: any[]): any {
    return data.reduce((sections, product) => {
      const section = product.sectionName || 'Others';
  
      // Initialize the section if not present
      if (!sections[section]) sections[section] = [];
  
      // Process the imageUrl by replacing tilde and handling relative paths
      const processedImageUrl = product.imageUrl
        ? product.imageUrl.includes('~/') 
          ? product.imageUrl.replace('~/', Settings.imageBaseUrl) // Replace tilde with base URL
          : product.imageUrl.startsWith('http') 
            ? product.imageUrl 
            : `${Settings.imageBaseUrl}${product.imageUrl}` // Prepend base URL for relative paths
        : 'assets/default-image.jpg'; // Fallback to default image if imageUrl is missing
  
      // Add the product to the section with the processed imageUrl
      sections[section].push({
        ...product,
        imageUrl: processedImageUrl,
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
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
        },
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
