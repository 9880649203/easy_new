import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ConfigService } from 'src/app/service/config.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {
  modalCtrl: any
  userData: any;
  constructor(private navParam: NavParams, private config: ConfigService) {
    this.modalCtrl = navParam.get('modalController')
    this.userData = Object.assign({}, this.config.logedInUser)
  }

  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
