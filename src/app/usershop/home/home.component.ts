import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import { Settings } from 'src/app/app-setting'; // Adjust the import path as needed

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
  baseUrl: string;
  currentSlide = 0;
  isDataFetched = false;
  isLoggedIn: boolean = false;
  userName: string;
  cartQuantity: number;

  constructor(private userService: UserService) {
    // Set the baseUrl based on the development mode
    this.baseUrl = Settings.isDevelopment ? Settings.apiUrl : Settings.ApiUrlLive;
  }

  ngOnInit(): void {
    this.loadBanners();
    this.updateCartQuantity();
  }

  updateCartQuantity(): void {
    const sessionUserId = sessionStorage.getItem('memberId');
    const tempUserId = localStorage.getItem('TempUserId');
    const hasReloaded = sessionStorage.getItem('hasReloaded'); // Get the reload flag
    
    if (sessionUserId) {
      // User is logged in
      this.isLoggedIn = true;
      this.userName = sessionStorage.getItem('userId') || 'Profile';

      // Subscribe to cart quantity observable
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity;
      });

      // Initial cart quantity load for logged-in user
      this.userService.updateCartQuantity(Number(sessionUserId));

      // Check if the page has already been reloaded after login
      if (!hasReloaded) {
        // Set a flag to prevent the reload loop
        sessionStorage.setItem('hasReloaded', 'true');
        window.location.reload();  // Reload the page once after login
      }

    } else if (tempUserId) {
      // Guest/Anonymous user
      this.isLoggedIn = false;

      // Subscribe to cart quantity observable for guest user
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity;
      });

      // Initial cart quantity load for guest user
      this.userService.updateCartQuantity(Number(tempUserId));
    }
  }

  loadBanners() {
    console.log('Starting to load banners...');

    this.userService.getBanners().subscribe(
      (res: any[]) => {
        console.log('Response received from server:', res);

        if (res && res.length > 0) {
          this.banners = res.map((banner) => {
            if (!banner.imageUrl.startsWith('http')) {
              banner.imageUrl = `${this.baseUrl}${banner.imageUrl}`;
            }
            return banner;
          });
          this.isDataFetched = true;
          console.log('Dynamic banners set:', this.banners);
        } else {
          this.isDataFetched = false;
          console.log('No data found, falling back to static images.');
        }
      },
      (error) => {
        console.error('Error fetching banners:', error);
        this.isDataFetched = false;
      }
    );
  }

  nextSlide(): void {
    const length = this.isDataFetched ? this.banners.length : this.staticBanners.length;
    console.log('Current slide before next:', this.currentSlide);
    this.currentSlide = (this.currentSlide + 1) % length;
    console.log('Next slide:', this.currentSlide);
  }

  prevSlide(): void {
    const length = this.isDataFetched ? this.banners.length : this.staticBanners.length;
    console.log('Current slide before previous:', this.currentSlide);
    this.currentSlide = (this.currentSlide - 1 + length) % length;
    console.log('Previous slide:', this.currentSlide);
  }
}
