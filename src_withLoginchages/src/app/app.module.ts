import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MomentModule } from 'ngx-moment';
import { ChartsModule } from 'ng2-charts';
import { ForgotPasswordPage } from './modal/forgot-password/forgot-password.page';
import { AppComponent } from './app.component';

// module import
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AgGridModule } from "ag-grid-angular/main";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ToastrModule } from 'ngx-toastr';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


//service import
import { AuthenticationService } from './service/authentication.service';
import { OrderService } from './service/order.service';


//page import
import { AddAgencyPage } from './modal/add-agency/add-agency.page';
import { ActionTablePage } from './modal/action-table/action-table.page';
import { NotificationsComponent } from './modal/notifications/notifications.component';
import { AddFarmerPage } from './modal/add-farmer/add-farmer.page';
import { AddProductPage } from './modal/add-product/add-product.page';
import { LoginPage } from './login/login.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { OrderPage } from './pages/order/order.page';
import { ProductsPage } from './pages/products/products.page';
import { FarmsdataPage } from './pages/farmsdata/farmsdata.page';
import { UsersPage } from './pages/users/users.page';
import { AdminconsolePage } from './pages/adminconsole/adminconsole.page';
import { HeaderComponent } from './pages/header/header.component';
import { OrderActionsPage } from './modal/order-actions/order-actions.page';
import { AddIndentPage } from './modal/add-indent/add-indent.page';
import { AddOrderPage } from './modal/add-order/add-order.page';
import { IndentActionsPage } from './modal/indent-actions/indent-actions.page';
import { FilterComponent } from './filter/order-filter/filter.component';
import { IndentFilterComponent } from './filter/indent-filter/indent-filter.component';
import { MyAccountPage } from './modal/my-account/my-account.page';
import { RoleBaseAccesService } from './service/role-base-acces.service';
import { ProductActionPage } from './modal/product-action/product-action.page';
import { ChangeStatusPage } from './modal/change-status/change-status.page';
import { AdminConsolePage } from './modal/admin-console/admin-console.page';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NotificationsComponent,
    ActionTablePage,
    AddAgencyPage,
    AddFarmerPage,
    AddProductPage,
    LoginPage,
    DashboardPage,
    OrderPage,
    ProductsPage,
    FarmsdataPage,
    UsersPage,
    AdminconsolePage,
    IndentActionsPage,
    OrderActionsPage,
    AddIndentPage,
    AddOrderPage,
    FilterComponent,
    IndentFilterComponent,
    MyAccountPage,
    ProductActionPage,
    ChangeStatusPage,
    AdminConsolePage,
    ForgotPasswordPage,

  ],

  entryComponents: [
    NotificationsComponent,
    ActionTablePage,
    AddAgencyPage,
    AddFarmerPage,
    IndentActionsPage,
    OrderActionsPage,
    AddIndentPage,
    AddOrderPage,
    AddProductPage,
    FilterComponent,
    IndentFilterComponent,
    MyAccountPage,
    ProductActionPage,
    ChangeStatusPage,
    ForgotPasswordPage,
    AdminConsolePage

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    AgGridModule.withComponents([ActionTablePage]),
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgbDropdownModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild([]),
    MomentModule,
    NgSelectModule,
    ChartsModule
  ],

  providers: [
    StatusBar,
    AuthenticationService,
    SplashScreen,
    OrderService,
    RoleBaseAccesService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LocationStrategy, useClass: HashLocationStrategy },

  ],
  bootstrap: [AppComponent],
  exports: [ChartsModule]
})

export class AppModule { }
