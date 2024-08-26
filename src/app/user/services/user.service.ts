import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../../app-setting';
import { Observable } from 'rxjs';
import { Categories } from 'src/app/usershop/interface';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Shopping Url Link start here
 //bannerUrl = "https://localhost:44320/api/Shop/banners";
 categoriesUrl = "https://localhost:44320/api/Shop/allcategories_without_parentcategories";
 productUrl = "https://localhost:44320/api/Shop/home-page/products";
//  productDetailsByIdUrl = 'https://localhost:44320/api/Shop/products-by-categoryid';
 
 
 // Shopping Url Link end here

  private apiBaseUrl = Settings.apiUrl;
  


  

  constructor(private http: HttpClient) { }

  dashboard() {
    return new Promise((resolve, reject) => {

      this.http.get(this.apiBaseUrl + "DashboardDetails").subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  mine() {
    return new Promise((resolve, reject) => {

      this.http.get(this.apiBaseUrl + "Mine").subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  directs() {
    return new Promise((resolve, reject) => {

      this.http.get(this.apiBaseUrl + "DirectDetails").subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  TeamDetails(level) {
    return new Promise((resolve, reject) => {

      this.http.get(this.apiBaseUrl + "TeamDetails?level="+level).subscribe((res: any) => {
        resolve(res);
      });
    });
  }
  
  levelIncome() {
    return new Promise((resolve, reject) => {

      this.http.get(this.apiBaseUrl + "GetLevelIncome").subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  salaryIncome() {
    return new Promise((resolve, reject) => {

      this.http.get(this.apiBaseUrl + "GetSalaryIncome").subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  withdrawalLevelIncome() {
    return new Promise((resolve, reject) => {

      this.http.get(this.apiBaseUrl + "GetWithdrawalLevelIncome_APR").subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  dividendIncome() {
    return new Promise((resolve, reject) => {

      this.http.get(this.apiBaseUrl + "GetDividendIncome").subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  POIIncome(){
    return new Promise((resolve, reject) => {

      this.http.get(this.apiBaseUrl + "GetPOIIncome").subscribe((res: any) => {
        resolve(res);
      });
    });

  }
  
  VIPIncome(){
    return new Promise((resolve, reject) => {

      this.http.get(this.apiBaseUrl + "GetVIPIncome").subscribe((res: any) => {
        resolve(res);
      });
    });

  }
  
  BoardIncome(){
    return new Promise((resolve,rejects)=>{

      this.http.get(this.apiBaseUrl + "GetBoardIncome").subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  
  EORIncome(){
    return new Promise((resolve,rejects)=>{

      this.http.get(this.apiBaseUrl + "GetEORIncome").subscribe((res: any) => {
        resolve(res);
      });
    });
  }
  
  MiningIncome(){
    return new Promise((resolve,rejects)=>{

      this.http.get(this.apiBaseUrl + "GetMiningIncome").subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  IncomeWithdawalHistory(){
    return new Promise((resolve,rejects)=>{

      this.http.get(this.apiBaseUrl + "GetIncomeWithdrawal").subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  
  BoardPools(){
    return new Promise((resolve,rejects)=>{

      this.http.get(this.apiBaseUrl + "GetBoardPools").subscribe((res: any) => {
        resolve(res);
      });
    });
  }


  BoardEntries(poolId:any){
    return new Promise((resolve,rejects)=>{
      this.http.get(this.apiBaseUrl + "GetBoardEntries?poolId=" +poolId).subscribe((res:any)=>{
        
        // resolve(poolId);
        console.log('poolId:', poolId);
        
      })
    })
  }

  BoardCount(entryId:any,poolId:any){
    return new Promise((resolve,rejects)=>{
      this.http.get(this.apiBaseUrl + "GetBoardCount?entryId=" + entryId + "&poolId=" + poolId).subscribe((res:any)=>{
        // resolve(res);
        console.log('entryId:', entryId, 'poolId:', poolId);
      })
    })
  }

  TopupDetails(){
    return new Promise((resolve,rejects)=>{

      this.http.get(this.apiBaseUrl + "GetTopupDetails").subscribe((res: any) => {
        resolve(res);
      });
    });
  }


  // ~~~~~~~~~~~~~Shopping~~~~~~~~~~~~~

  // ~~~~~~~~~~~~~~~~~~~Get Banners~~~~~~~~~~~~~~~~~~~~~~~
  getBanners(){
    return this.http.get(this.apiBaseUrl+"api/Shop/banners",);
  }

  // ~~~~~~~~~~~~~~~~~~~Categories~~~~~~~~~~~~~~~~~~~~~~~
  getCategories(): Observable<Categories>{
    return this.http.get<Categories>(this.categoriesUrl);
  } 

   //~~~~~~~~~~~~~~~~~~~~Get User Data~~~~~~~~~~~~~~~~~~
   getProducts(){
    return this.http.get(this.productUrl);
  } 

   // Method to fetch product details by ID
  //  getProductDetails(productId: number): Observable<any> {
  //   const url = `${this.productDetailsByIdUrl}/${productId}`;
  //   return this.http.get<any>(url);
  // }

  //Main category fetched
  getMainCategory(){
    return this.http.get(this.apiBaseUrl+"api/Shop/allparentcategories");
  }


  //get Subcategory from parent category
  getSubCategory(menuId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}api/Shop/categories/${menuId}`);
  }
  
  

}
