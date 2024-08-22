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
import { BannerComponent } from './usershop/banner/banner.component';

const routes: Routes = [
  // {
  //   path:'',
  //   component:AuthMasterComponent,
  //   children:[{
  //     path:'',
  //     component:SigninComponent
  //   }]
  // },

  {
    path: 'auth',
    component: AuthMasterComponent,
    children: [
      {
        path: '',
        component: SigninComponent,
      },
      {
        path: 'signin',
        component: SigninComponent,
      },

      {
        path: 'signup',
        component: SignupComponent,
      },

      {
        path: 'login',
        component: SigninComponent,
      },

      {
        path: 'register',
        component: RegisterComponent,
      },

      // {
      //   path:'register/:id',
      //   component:RegisterComponent
      // }
    ],
  },

  {
    path: 'user',
    component: UserMasterComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'directs',
        component: DirectsComponent,
      },
      {
        path: 'team',
        component: TeamComponent,
      },
      {
        path: 'royalty',
        component: RankComponent,
      },
      {
        path: 'boardIncome',
        component: BoardBinaryIncomeComponent,
      },
      {
        path: 'withdraw-mta',
        component: WithdrawMtaComponent,
      },
      {
        path: 'dailyeor',
        component: DailyEORComponent,
      },
      {
        path: 'miningIncome',
        component: MiningIncomeComponent,
      },
      {
        path: 'boardCount',
        component: BoardCountComponent,
      },
      {
        path: 'deposit',
        component: DepositComponent,
      },

      {
        path: 'token',
        component: BuySellMasterComponent,
        children: [
          {
            path: '',
            component: BuyComponent,
          },
          {
            path: 'buy',
            component: BuyComponent,
          },
          {
            path: 'sell',
            component: SellComponent,
          },
        ],
      },
      {
        path: 'withdraw-dividend',
        component: WithdrawDividendComponent,
      },
      {
        path: 'level-dividend',
        component: LevelDividendComponent,
      },
      {
        path: 'salary-income',
        component: SalaryIncomeComponent,
      },
      {
        path: 'apr-withdrawal-level',
        component: WithdrawalLevelIncomeComponent,
      },
      {
        path: 'dividend-income',
        component: DividendIncomeComponent,
      },
      {
        path: 'roi-dividend',
        component: RoiDividendComponent,
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
      {
        path: 'income-withdrawal-history',
        component: IncomeWithdrawalHistoryComponent,
      },
      {
        path: 'chart',
        component: PriceChartComponent,
      },
      {
        path: 'games',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./games/games.module').then((u) => u.GamesModule),
          },
        ],
      },
      {
        path: '**',
        component: PageNotFoundComponent,
      },
    ],
  },

  //User shop component Routing
  {
    path: '',
    component: NavbarComponent,
  },

  {
    path: 'usershop-navbar',
    component: NavbarComponent,
  },

  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'banner',
    component: BannerComponent,
  },

  
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
