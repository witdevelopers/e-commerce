import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  banners: any[] = [];
  baseUrl: string = 'https://www.mbp18k.com';
  categories: any;
  products: any;
  productById: any;
  homePageSectionProducts: any[] = [];

  constructor(private userservice: UserService) {}

  ngOnInit(): void {
    this.userservice.getBanners().subscribe((res: any[]) => {
      this.banners = res.map((banner) => {
        // Check if the imageUrl is relative or absolute
        if (
          !banner.imageUrl.startsWith('http') &&
          !banner.imageUrl.startsWith('https')
        ) {
          // Prepend the base URL only if the imageUrl is relative
          banner.imageUrl = `${this.baseUrl}${banner.imageUrl}`;
        }
        return banner;
      });
    });

    this.Categories();
    this.getProduct();

    this.getHomeSectionProductsDetails();
  }
  currentSlide = 0;
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.banners.length;
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.banners.length) % this.banners.length;
  }

  Categories() {
    this.userservice.getCategories().subscribe((data) => {
      console.log('Your Categories wala data', data);
      this.categories = data;
    });
  }

  getProduct() {
    this.userservice.getProducts().subscribe((data) => {
      this.products = data;
      console.log('Your get Product Home Section data', data);
    });
  }

  getHomeSectionProductsDetails() {
    this.userservice.getHomePageSectionProduct().subscribe((data) => {
      this.homePageSectionProducts = data;
      console.log('Home page section data: ', data);
    });
  }
}
