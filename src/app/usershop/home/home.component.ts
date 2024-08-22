import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  banners: any[] = [];
  baseUrl: string = 'https://www.mbp18k.com';

  constructor(private userservice: UserService) { }

  ngOnInit(): void {
    this.userservice.getBanners().subscribe((res: any[]) => {
      this.banners = res.map(banner => {
        // Check if the imageUrl is relative or absolute
        if (!banner.imageUrl.startsWith('http') && !banner.imageUrl.startsWith('https')) {
          // Prepend the base URL only if the imageUrl is relative
          banner.imageUrl = `${this.baseUrl}${banner.imageUrl}`;
        }
        return banner;
      });
    });
  }

}
