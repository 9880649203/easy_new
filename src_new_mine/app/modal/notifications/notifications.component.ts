import { Component, OnInit } from '@angular/core';
import {
  NavParams, NavController, MenuController, ModalController,
  AlertController, LoadingController, ToastController
} from '@ionic/angular';
import { MyAccountPage } from 'src/app/modal/my-account/my-account.page';
import { HttpHeaders, HttpClient } from '@angular/common/http';
const endpointAddress = 'http://134.209.147.129:3001';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  modalType: any;
  loggedInUser: any;
  modalControler: any;
  messg: any;
  constructor(private navParams: NavParams, public navCtrl: NavController, private menuCtrl: MenuController,
    private modalCtrl: ModalController, public alertController: AlertController,
    public toastCtrl: ToastController,
    private http: HttpClient, public loadingCtrl: LoadingController) {
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    this.modalType = this.navParams.get('modalType');
    this.modalControler = this.navParams.get('popoverControler');
    //console.log("modal type", this.modalType)
  }

  ngOnInit() {
  }
  logout() {
    console.log('lagout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.navCtrl.navigateRoot('');
    this.modalControler.dismiss();
    this.menuCtrl.enable(false);
  }

  async myAccount() {
    this.modalControler.dismiss();
    return this.modalCtrl.create({
      component: MyAccountPage,
      componentProps: { modalType: 'myAccount', modalController: this.modalCtrl }
    })
      .then(popover => popover.present());
  }

  async resetPassword() {

    const alert = await this.alertController.create({
      subHeader: 'Change password',
      message: this.messg,
      backdropDismiss: false,
      inputs: [
        {
          name: 'old_pass',
          type: 'password',
          placeholder: 'Old password'
        },
        {
          name: 'new_pass',
          type: 'password',
          placeholder: 'New password'
        }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel');
          }
        }, {
          text: 'Update',
          handler: async (data: any) => {
            const loader = await this.loadingCtrl.create({
              // duration: 2000
            });
            loader.present();
            if (data.old_pass != '' && data.new_pass != '') {

              const token = localStorage.getItem('token');
              const uid = JSON.parse(localStorage.getItem('user')).uid;
              const sendObj = {
                uid: uid,
                new_password: data.new_pass,
                old_password: data.old_pass
              };
              const httpOptions = {
                headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  token: token
                })
              };
              this.http.post(endpointAddress + '/change_password', sendObj, httpOptions).subscribe(async (res) => {
                const tmp: any = res;
                const toast = await this.toastCtrl.create({
                  showCloseButton: true,
                  message: tmp.message,
                  duration: 3000,
                  position: 'bottom'
                });
                toast.present();
                loader.dismiss();
              }, (error) => {
                const tmp: any = error;
                this.messg = tmp.error.message
                loader.dismiss();
                return false;
              });
            }
            else {
              this.messg = 'Empty field!';
              loader.dismiss();
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
