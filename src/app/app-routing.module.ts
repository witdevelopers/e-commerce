import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthMasterComponent } from './auth/auth-master/auth-master.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PriceChartComponent } from './price-chart/price-chart.component';
import { BuySellMasterComponent } from './user/buy-sell-token/buy-sell-master/buy-sell-master.component';
import { BuyComponent } from './user/buy-sell-token/buy/buy.component';
import { SellComponent } from './user/buy-sell-token/sell/sell.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { DirectsComponent } from './user/directs/directs.component';
import { LevelDividendComponent } from './user/level-dividend/level-dividend.component';
import { RankComponent } from './user/rank/rank.component';
import { RoiDividendComponent } from './user/roi-dividend/roi-dividend.component';
import { TransactionsComponent } from './user/transactions/transactions.component';
import { UserMasterComponent } from './user/user-master/user-master.component';
import { WithdrawDividendComponent } from './user/withdraw-dividend/withdraw-dividend.component';
import { BoardBinaryIncomeComponent } from './user/board-binary-income/board-binary-income.component';
import { DailyEORComponent } from './user/daily-eor/daily-eor.component';
import { MiningIncomeComponent } from './user/mining-income/mining-income.component';
import { BoardCountComponent } from './user/board-count/board-count.component';
import { WithdrawMtaComponent } from './user/withdraw-mta/withdraw-mta.component';
import { WithdrawalLevelIncomeComponent } from './user/withdrawal-level-income/withdrawal-level-income.component';
import { SalaryIncomeComponent } from './user/salary-income/salary-income.component';
import { DividendIncomeComponent } from './user/dividend-income/dividend-income.component';
import { TeamComponent } from './user/team/team.component';
import { DepositComponent } from './user/deposit/deposit.component';
import { IncomeWithdrawalHistoryComponent } from './user/income-withdrawal-history/income-withdrawal-history.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './usershop/home/home.component';
import { UsershopMasterComponent } from './usershop/usershop-master/usershop-master.component';
import { FooterComponent } from './usershop/footer/footer.component';
import { NavbarComponent } from './usershop/navbar/navbar.component';
import { SubcategoryComponent } from './usershop/subcategory/subcategory.component';
import { ProductDetailsComponent } from './usershop/product-details/product-details.component';
import { ShoppingCartComponent } from './usershop/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './usershop/checkout/checkout.component';
import { OrderHistoryComponent } from './usershop/order-history/order-history.component';
import { CheckoutConfirmComponent } from './usershop/checkout-confirm/checkout-confirm.component';
import { OrderInvoiceComponent } from './usershop/order-invoice/order-invoice.component';
import { AuthGuard } from './usershop/auth.guard';

const routes: Routes = [
  // {
  //   path:'',
  //   component:AuthMasterComponent,
  //   children:[{
  //     path:'',
  //     component:SigninComponent
  //   }]
  // },

  

  //User shop component Routing
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'usershop-navbar',
    component: NavbarComponent,
  },
  { path: 'subcategory/:id', component: SubcategoryComponent },
  { path: 'product/:id', component: ProductDetailsComponent },

  // Secure the shop routes with Auth Guard
  {
    path: 'usershop',
    canActivate: [AuthGuard],  // Protect the parent route
    children: [
      { path: 'shopping-cart', component: ShoppingCartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'confirm', component: CheckoutConfirmComponent },
      { path: 'order-invoice', component: OrderInvoiceComponent },
      { path: 'order-history', component: OrderHistoryComponent },
    ],
  },

  {
    path: 'auth',
    component: AuthMasterComponent,
    children: [
      { path: 'signin', component: SigninComponent },
      { path: 'signup', component: SignupComponent },
    ],
  },

  // Fallback route
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
