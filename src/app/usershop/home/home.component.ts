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
  currentSlide = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners() {
    this.userService.getBanners().subscribe((res: any[]) => {
      this.banners = res.map((banner) => {
        if (
          !banner.imageUrl.startsWith('http') &&
          !banner.imageUrl.startsWith('https')
        ) {
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
    this.currentSlide =
      (this.currentSlide - 1 + this.banners.length) % this.banners.length;
  }
}
