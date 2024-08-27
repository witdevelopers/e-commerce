import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  user: string = 'Sign in';
  mainCategory: any[] = [];
  subCategory: { [key: number]: any[] } = {};
  isSubCategoryVisible: { [key: number]: boolean } = {};
  AllProductByCategoryId:any [] = [];


  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userData();
    this.getMainCategory();
    this.getAllProductByCategoryId(7);
  }

  userData() {
    const address = sessionStorage.getItem('address');
    if (address) {
      this.user = address;
    }
  }

  getMainCategory() {
    this.userService.getMainCategory().subscribe(
      (res: any[]) => {
        this.mainCategory = res;
        // console.log("Get Main Category: ", this.mainCategory);
      },
      (error) => {
        console.error('Error fetching main categories', error);
      }
    );
  }

  loadSubCategory(parentCategoryId: number) {
    if (parentCategoryId === undefined || parentCategoryId === null) {
      console.error('Invalid parentCategoryId:', parentCategoryId);
      return;
    }

    if (!this.subCategory[parentCategoryId]) {
      this.userService.getSubCategory(parentCategoryId).subscribe(
        (res: any[]) => {
          this.subCategory[parentCategoryId] = res;
          console.log("Subcategories: ", this.subCategory);
        },
        (error) => {
          console.error('Error fetching subcategories', error);
        }
      );
    }
    this.isSubCategoryVisible[parentCategoryId] = true;
  }

  hideSubCategory(parentCategoryId: number) {
    if (parentCategoryId !== undefined && parentCategoryId !== null) {
      this.isSubCategoryVisible[parentCategoryId] = false;
    }
  }


  getAllProductByCategoryId(categoryId: number){
    this.userService.getAllProductByCategoryId(categoryId).subscribe((data)=>{
      this.AllProductByCategoryId = data;
    })
  }
}
