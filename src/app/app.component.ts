import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Pages } from './interfaces/pages';
import * as $ from 'jquery';
import { ConfigService } from './service/config.service';
import { AuthenticationService } from './service/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { RoleBaseAccesService } from './service/role-base-acces.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public appPages: Array<Pages>;
  url: any;
  toggleDashboard: boolean = true;
  toggleOrders: boolean = true;
  toggleProducts: boolean = true;
  toggleUsers: boolean = true;
  toggleFarmsData: boolean = true;
  toggleAdminConsole: boolean = true;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private config: ConfigService,
    route: ActivatedRoute,
    private roleService: RoleBaseAccesService
  ) {
    this.roleService._roleList$.subscribe(data => {
      let role = JSON.parse(localStorage.getItem('user')).role;
      if (data.length > 0) {
        this.roleService.role_list = []
        this.roleService.role_list = data.filter((item) => item.name === role)
        this.roleService.role_list = this.roleService.role_list[0].role;
        this.roleService.loggedInUser = this.roleService.role_list[0].name
        this.roleService.determineRoleBasedAccess();
        this.toggleDashboard = this.roleService.viewDashboard;
        this.toggleProducts = this.roleService.viewProducts;
        this.toggleFarmsData = this.roleService.viewFarmData;
        if (this.roleService.viewOrders || this.roleService.viewIndent) {
          this.toggleOrders = true
        }
        else {
          this.toggleOrders = false;
        }

        if (this.roleService.viewAgencyManager || this.roleService.viewFieldAgent || this.roleService.viewOthers) {
          this.toggleUsers = true
        }
        else {
          this.toggleUsers = false;
        }
        if (this.roleService.viewAgency || this.roleService.viewRole || this.roleService.viewProductCategory) {
          this.toggleAdminConsole = true
        }
        else {
          this.toggleAdminConsole = false;
        }
        console.log("app component", this.toggleAdminConsole)
      }


    });
    this.appPages = [
      {
        title: 'Dashboard',
        url: '/home/dashboard',
        direct: 'root',
        icon: 'insert_chart',
        visible: this.toggleDashboard
      },
      {
        title: 'Orders',
        url: '/home/order',
        direct: 'root',
        icon: 'local_grocery_store',
        visible: this.toggleOrders
      },

      // {
      //   title: 'Reports',
      //   url: '/reports',
      //   direct: 'forward',
      //   icon: 'paper'
      // },
      {
        title: 'Products',
        url: '/home/products',
        direct: 'root',
        icon: 'toys',
        visible: this.toggleProducts
      },
      {
        title: 'Farms Data',
        url: '/home/farmsdata',
        direct: 'root',
        icon: 'local_florist',
        visible: this.toggleFarmsData
      },
      {
        title: 'Users',
        url: '/home/user',
        direct: 'root',
        icon: 'supervisor_account',
        visible: this.toggleUsers
      },
      {
        title: 'Admin Console',
        url: '/home/adminconsole',
        direct: 'root',
        icon: 'speaker',
        visible: this.toggleAdminConsole
      },
    ];


    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }).catch(() => { });
  }

}
