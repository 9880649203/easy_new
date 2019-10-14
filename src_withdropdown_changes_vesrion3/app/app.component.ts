import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Pages } from './interfaces/pages';
import * as $ from 'jquery';
import { ConfigService } from './service/config.service';
import { AuthenticationService } from './service/authentication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public appPages: Array<Pages>;
  url: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private config: ConfigService,
    route: ActivatedRoute
  ) {

    this.appPages = [
      {
        title: 'Dashboard',
        url: '/home/dashboard',
        direct: 'root',
        icon: 'insert_chart'
      },
      {
        title: 'Orders',
        url: '/home/order',
        direct: 'root',
        icon: 'local_grocery_store'
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
        icon: 'toys'
      },
      {
        title: 'Farms Data',
        url: '/home/farmsdata',
        direct: 'root',
        icon: 'local_florist'
      },
      {
        title: 'Users',
        url: '/home/user',
        direct: 'root',
        icon: 'supervisor_account'
      },
      {
        title: 'Admin Console',
        url: '/home/adminconsole',
        direct: 'root',
        icon: 'speaker'
      }
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
