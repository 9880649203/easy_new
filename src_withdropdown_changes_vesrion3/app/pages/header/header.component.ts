import { Component, OnInit } from '@angular/core';
import { PopoverController, NavController, MenuController } from '@ionic/angular';

import { NotificationsComponent } from '../../modal/notifications/notifications.component';
import { popoverController } from '@ionic/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(public popoverCtrl: PopoverController, public navCtrl: NavController, private menuCtrl: MenuController) {
    // setTimeout(() => {
    //   this.menuCtrl.enable(true);
    // }, 1000)
    if (localStorage.getItem('user')) {
      this.menuCtrl.enable(true);
    }
  }

  ngOnInit() {
  }

  async notifications(ev: any) {
    // const popover = await this.popoverCtrl.create({
    //   component: NotificationsComponent,
    //   event: ev,
    //   animated: true,
    //   showBackdrop: true
    // });
    // return await popover.present();

  }
  async openSetting(type: any) {
    const popover = await this.popoverCtrl.create({
      component: NotificationsComponent,
      componentProps: { modalType: type, popoverControler: this.popoverCtrl },
      // event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }

  logout() {
    this.navCtrl.navigateRoot('');
  }
}
