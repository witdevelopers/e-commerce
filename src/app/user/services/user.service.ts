import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../../app-setting';
import { BehaviorSubject, Observable } from 'rxjs';
import { Categories } from 'src/app/usershop/interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private selectedAddressIdSubject = new BehaviorSubject<number | null>(null);
  private cartSubject = new BehaviorSubject<number>(0);
  cartQuantity$ = this.cartSubject.asObservable();
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
      this.http.get(this.apiBaseUrl + "TeamDetails?level=" + level).subscribe((res: any) => {
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
        console.log('poolId:', poolId);
      });
    });
  }

  BoardCount(entryId:any,poolId:any){
    return new Promise((resolve,rejects)=>{
      this.http.get(this.apiBaseUrl + "GetBoardCount?entryId=" + entryId + "&poolId=" + poolId).subscribe((res:any)=>{
        console.log('entryId:', entryId, 'poolId:', poolId);
      });
    });
  }

  TopupDetails(){
    return new Promise((resolve,rejects)=>{
      this.http.get(this.apiBaseUrl + "GetTopupDetails").subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  getBanners(){
    return this.http.get(this.apiBaseUrl+"api/Shop/banners");
  }

  getCategories(): Observable<Categories>{
    return this.http.get<Categories>(this.apiBaseUrl+"api/Shop/allcategories_without_parentcategories");
  }

  getProducts(){
    return this.http.get(this.apiBaseUrl+"api/Shop/home-page/products");
  }

  getMainCategory(){
    return this.http.get(this.apiBaseUrl+"api/Shop/allparentcategories");
  }

  getSubCategory(menuId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}api/Shop/categories/${menuId}`);
  }

  getHomePageSectionProduct(): Observable<any[]>{
    return this.http.get<any[]>(this.apiBaseUrl+"api/Shop/home-page/products");
  }

  getAllProductByCategoryId(categoryId: number): Observable<any>{
    return this.http.get<any[]>(this.apiBaseUrl+"api/Shop/products-by-categoryid/"+categoryId);
  }

  getProductById(productId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}api/Shop/getprodbyid/${productId}`);
  }

  SearchProductByKeyword(keyword: string): Observable<any>{
    return this.http.get<any>(this.apiBaseUrl+"api/Shop/searchbyKeyword?keyword="+keyword);
  }

  addToCart(customerId: number, productDtId: number, quantity: number): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}api/Shop/shopping-cart/add?customerId=${customerId}&productDtId=${productDtId}&quantity=${quantity}`;
    return this.http.post<any>(apiUrl, {});
  }

  getCart(customerId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}api/Shop/Getshopping-cartDetails/${customerId}`);
  }

  updateCart(cartData: { customerId: number; productDtId: number; quantity: number }): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}api/Shop/shopping-cart/update`, cartData);
  }
  
  removeCartItem(customerId: number, productDtId: number, removeAll: boolean): Observable<any> {
    const url = `${this.apiBaseUrl}api/Shop/shopping-cart/remove?customerId=${customerId}&productDtId=${productDtId}&removeAll=${removeAll}`;
    return this.http.delete(url);
  }

  updateCartQuantity(customerId: number): void {
    this.getCart(customerId).subscribe(
      (data: any) => {
        const totalQuantity = data.items.reduce((total: number, item: any) => total + item.quantity, 0);
        this.cartSubject.next(totalQuantity);
      },
      (error) => {
        console.error('Error fetching cart details', error);
      }
    );
  }
  
  getAddressesByCustomerId(customerId: number): Observable<any> {
    const url = `${this.apiBaseUrl}api/Shop/GetCustomerId/addresses?customerId=${customerId}`;
    return this.http.get<any>(url);
  }

  createAddress(address: any): Observable<any> {
    const url = `${this.apiBaseUrl}api/Shop/CreateAddress`;
    return this.http.post<any>(url, address, {
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json-patch+json'
      }
    });
  }

  deleteAddress(customerId: number, addressId: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}api/Shop/DeleteAddress?id=${customerId}&addressid=${addressId}`);
  }

  updateAddress(address: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json-patch+json' });
    return this.http.put(`${this.apiBaseUrl}api/Shop/UpdateAddress`, address, { headers });
  }

  getCountries(): Observable<any[]>{
    return this.http.get<any[]>(this.apiBaseUrl+"api/Shop/countrylist");
  }

  getStatesByCountry(countryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}api/Shop/GetStatesByCountry/${countryId}`);
  }

  getPaymentMethods(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}api/Shop/GetPaymentMethod`);
  }

  getWalletBalance(walletId: number): Observable<number> {
    return this.http.get<number>(`${this.apiBaseUrl}Wallet/getBalance?walletId=${walletId}`);
  }

  createOrder(orderPayload: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiBaseUrl}api/Shop/create-order`, orderPayload, { headers });
  }

    // Set the selected address ID
    setSelectedAddressId(addressId: number): void {
      this.selectedAddressIdSubject.next(addressId);
    }
  
    // Get the selected address ID synchronously
    getSelectedAddressId(): number | null {
      return this.selectedAddressIdSubject.getValue();
    }

     // Method to call the invoice API using orderId from session storage
  getInvoiceByOrderNo(): Observable<any> {
    const orderId = sessionStorage.getItem('orderNo');  // Retrieve orderId from session storage
    if (!orderId) {
      throw new Error('Order ID not found in session storage.');
    }
    const url = `${this.apiBaseUrl}api/Shop/invoicebyorderno?orderId=${orderId}`;
    return this.http.get<any>(url);
  }

  getOrderDetails(customerId: string): Observable<any> {
    const url = `${this.apiBaseUrl}api/Shop/customer/${customerId}`;
    return this.http.get<any>(url);
  }


}
