import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValidationMessageComponent } from './validation-message/validation-message.component';
import { AuthMasterComponent } from './auth/auth-master/auth-master.component';
import { LoginComponent } from './auth/login/login.component';
import { UserMasterComponent } from './user/user-master/user-master.component';
import { RegisterComponent } from './auth/register/register.component';
import { DirectsComponent } from './user/directs/directs.component';
import { RankComponent } from './user/rank/rank.component';

import { NgxSpinnerModule } from "ngx-spinner";
import { BuySellMasterComponent } from './user/buy-sell-token/buy-sell-master/buy-sell-master.component';
import { BuyComponent } from './user/buy-sell-token/buy/buy.component';
import { SellComponent } from './user/buy-sell-token/sell/sell.component';
import { ContractService } from './services/contract.service';
import { WithdrawDividendComponent } from './user/withdraw-dividend/withdraw-dividend.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { LevelDividendComponent } from './user/level-dividend/level-dividend.component';
import { RoiDividendComponent } from './user/roi-dividend/roi-dividend.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TransactionsComponent } from './user/transactions/transactions.component';
// import { PriceChartComponent } from './price-chart/price-chart.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { CompanyService } from './services/company.service';
import { DailyEORComponent } from './user/daily-eor/daily-eor.component';
import { BoardBinaryIncomeComponent } from './user/board-binary-income/board-binary-income.component';

import { MiningIncomeComponent } from './user/mining-income/mining-income.component';
import { MineComponent } from './user/mine/mine.component';
import { BoardCountComponent } from './user/board-count/board-count.component';
import { WithdrawMtaComponent } from './user/withdraw-mta/withdraw-mta.component';
import { WithdrawalLevelIncomeComponent } from './user/withdrawal-level-income/withdrawal-level-income.component';
import { SalaryIncomeComponent } from './user/salary-income/salary-income.component';
import { DividendIncomeComponent } from './user/dividend-income/dividend-income.component';
import { CountdownModule } from 'ngx-countdown';
import { DepositComponent } from './user/deposit/deposit.component';
import { TeamComponent } from './user/team/team.component';
import { IncomeWithdrawalHistoryComponent } from './user/income-withdrawal-history/income-withdrawal-history.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './usershop/home/home.component';
import { UsershopMasterComponent } from './usershop/usershop-master/usershop-master.component';
import { FooterComponent } from './usershop/footer/footer.component';
import { NavbarComponent } from './usershop/navbar/navbar.component';
import { BannerComponent } from './usershop/banner/banner.component';
import { SubcategoryComponent } from './usershop/subcategory/subcategory.component';
import { ProductDetailsComponent } from './usershop/product-details/product-details.component';
import { ProductSliderComponent } from './usershop/product-slider/product-slider.component';
import { ShoppingCartComponent } from './usershop/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './usershop/checkout/checkout.component';
import { OrderHistoryComponent } from './usershop/order-history/order-history.component';
import { CheckoutConfirmComponent } from './usershop/checkout-confirm/checkout-confirm.component';
import { OrderInvoiceComponent } from './usershop/order-invoice/order-invoice.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthMasterComponent,
    LoginComponent,
    ValidationMessageComponent,
    RegisterComponent,
    UserMasterComponent,
    DirectsComponent,
    TeamComponent,
    RankComponent,
    BuySellMasterComponent,
    BuyComponent,
    SellComponent,
    WithdrawDividendComponent,
    DashboardComponent,
    LevelDividendComponent,
    RoiDividendComponent,
    PageNotFoundComponent,
    TransactionsComponent,
    // PriceChartComponent,
    DailyEORComponent,
    BoardBinaryIncomeComponent,
    MiningIncomeComponent,
    MineComponent,
    BoardCountComponent,
    WithdrawMtaComponent,
    WithdrawalLevelIncomeComponent,
    SalaryIncomeComponent,
    DividendIncomeComponent,
    IncomeWithdrawalHistoryComponent,
    DepositComponent,
    SigninComponent,
    SignupComponent,
    HomeComponent,
    UsershopMasterComponent,
    FooterComponent,
    NavbarComponent,
    BannerComponent,
    SubcategoryComponent,
    ProductDetailsComponent,
    ProductSliderComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    OrderHistoryComponent,
    CheckoutConfirmComponent,
    OrderInvoiceComponent



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    CommonModule,
    CountdownModule ,
    ReactiveFormsModule,
    
    
  ],
  providers: [
    { provide: 'Window',  useValue: window },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    // { provide: APP_INITIALIZER, useFactory: (config: CompanyService) => () => config.getCompanyDetails(), deps: [CompanyService], multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private contractService:ContractService){
    
  }

 }