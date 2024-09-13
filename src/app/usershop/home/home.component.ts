import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  banners: any[] = [];
  staticBanners: any[] = [
    { imageUrl: 'assets/Shopimg/1.jpg', alt: 'Static Placeholder 1' },
    { imageUrl: 'assets/Shopimg/2.jpg', alt: 'Static Placeholder 2' },
    { imageUrl: 'assets/Shopimg/3.jpg', alt: 'Static Placeholder 3' }
  ];
  baseUrl: string = 'https://www.mbp18k.com';
  currentSlide = 0;
  isDataFetched = false; // Start with false to indicate data is not yet fetched

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners() {
    console.log('Starting to load banners...'); // Debug: Start of loading banners

    this.userService.getBanners().subscribe(
      (res: any[]) => {
        console.log('Response received from server:', res); // Debug: Data received from server
        
        if (res && res.length > 0) {
          this.banners = res.map((banner) => {
            if (!banner.imageUrl.startsWith('http')) {
              banner.imageUrl = `${this.baseUrl}${banner.imageUrl}`;
            }
            return banner;
          });
          this.isDataFetched = true; // Data is fetched and banners are available
          console.log('Dynamic banners set:', this.banners); // Debug: Dynamic banners set
        } else {
          this.isDataFetched = false; // No data, fallback to static images
          console.log('No data found, falling back to static images.'); // Debug: No data
        }
      },
      (error) => {
        console.error('Error fetching banners:', error); // Debug: Error in fetching data
        this.isDataFetched = false; // On error, fallback to static images
      }
    );
  }

  // Slide navigation methods
  nextSlide(): void {
    const length = this.isDataFetched ? this.banners.length : this.staticBanners.length;
    console.log('Current slide before next:', this.currentSlide); // Debug: Current slide before moving to the next
    this.currentSlide = (this.currentSlide + 1) % length;
    console.log('Next slide:', this.currentSlide); // Debug: Current slide after moving to the next
  }

  prevSlide(): void {
    const length = this.isDataFetched ? this.banners.length : this.staticBanners.length;
    console.log('Current slide before previous:', this.currentSlide); // Debug: Current slide before moving to the previous
    this.currentSlide = (this.currentSlide - 1 + length) % length;
    console.log('Previous slide:', this.currentSlide); // Debug: Current slide after moving to the previous
  }
}
