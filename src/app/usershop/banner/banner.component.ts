import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  banners: any[] = [];
  categories: any;
  baseUrl: string = 'https://www.mbp18k.com';



  constructor(private userservice: UserService) { }

  ngOnInit(): void {
    // this.loadBanners();
    // this.Categories();

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
  
// ~~~~~~~~~~~~~~~Load Banners~~~~~~~~~~~~~~~~~~~~~~~~
  // loadBanners(){
  //   this.userservice.getBanners().subscribe((data: any[])=> {
  //     console.log(data);
  //     this.banners = data;
  //   } );
  //   console.log(this.banners);
  // }


  // ~~~~~~~~~~~~~~~Categories~~~~~~~~~~~~~~~~~~~~~~~~
  // Categories(){
  //   this.userservice.getCategories().subscribe((data)=> {
  //     console.log(data);
  //     this.categories = data;
  //     } );
  // }s