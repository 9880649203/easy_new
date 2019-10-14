import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Pages } from './interfaces/pages';
import * as $ from 'jquery';
import { ConfigService } from './service/config.service';
import { AuthenticationService } from './service/authentication.service';
import { ActivatedRoute } from '@angular/router';
import {DashboardService} from './service/dashboard.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public appPages: Array<Pages>;
  url: any;
  router_change:any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private config: ConfigService,
     private  route: ActivatedRoute,
   private rouetChange:DashboardService  ) {

    this.appPages = [
      {
        title: 'Dashboard',
        url: '/dashboard',
        direct: 'root',
        icon: 'apps'
      },
      {
        title: 'Orders',
        url: '/order',
        direct: 'root',
        icon: 'cart'
      },

      // {
      //   title: 'Reports',
      //   url: '/reports',
      //   direct: 'forward',
      //   icon: 'paper'
      // },
      {
        title: 'Products',
        url: '/products',
        direct: 'root',
        icon: 'business'
      },
      {
        title: 'Farms Data',
        url: '/farmsdata',
        direct: 'root',
        icon: 'stats'
      },
      {
        title: 'Users',
        url: '/user',
        direct: 'root',
        icon: 'people'
      },
      {
        title: 'Admin Console',
        url: '/adminconsole',
        direct: 'root',
        icon: 'person'
      }
    ];


    this.initializeApp();
  }

  initializeApp() {
    // let elementToshowMenuButton = document.getElementsByTagName("ion-menu-button");
    // console.log("menu-button-hidden", elementToshowMenuButton)
    // elementToshowMenuButton[0].className.replace("menu-button-hidden", "")
    // $("ion-menu-button").remove(".menu-button-hidden");
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }).catch(() => { });
  }

  goToEditProgile() {
    this.navCtrl.navigateForward('edit-profile');
  }

  logout() {
    this.navCtrl.navigateRoot('/');
  }
 changeRoute(e){
    console.log('routes',e);
    if(e == 'Dashboard'){
      return  this.router_change  = true;
     }
     else{
       return false;
     }
    //this.rouetChange._route_change$.next(e);
  };
  
}
