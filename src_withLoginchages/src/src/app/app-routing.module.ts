import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPage } from './login/login.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { OrderPage } from './pages/order/order.page';
import { Product } from './model/product.model';
import { FarmsdataPage } from './pages/farmsdata/farmsdata.page';
import { UsersPage } from './pages/users/users.page';
import { AdminconsolePage } from './pages/adminconsole/adminconsole.page';
import { ProductsPage } from './pages/products/products.page';
import { AuthenticationService } from './service/authentication.service';
import { HomePage } from './pages/home/home.page';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage, },
  {
    path: 'home', component: HomePage, children: [
      { path: 'dashboard', component: DashboardPage, canActivate: [AuthenticationService] },
      { path: 'order', component: OrderPage, canActivate: [AuthenticationService] },
      { path: 'products', component: ProductsPage, canActivate: [AuthenticationService] },
      { path: 'farmsdata', component: FarmsdataPage, canActivate: [AuthenticationService] },
      { path: 'user', component: UsersPage, canActivate: [AuthenticationService] },
      { path: 'adminconsole', component: AdminconsolePage, canActivate: [AuthenticationService] },
    ]
  }



  // { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  declarations: [],

  exports: [RouterModule],
  // providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})

export class AppRoutingModule { }
