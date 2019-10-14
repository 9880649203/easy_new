import { AuthenticationService } from '../service/authentication.service';
import { Component, OnInit } from '@angular/core';
import {
  NavController, MenuController, PopoverController, NavParams
} from '@ionic/angular';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordPage } from '../modal/forgot-password/forgot-password.page';
import { ForgotPasswordService } from '../service/forgot-password.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public pop: any;
  boolbackdropdis = false;
  toggleFA = false;
  toggleOther = true;
  openMenu: Boolean = false;
  mobilemessage = '';
  loginform: FormGroup;
  userData = { uid: '', password: '' };
  result: any;
  noDetails = false;
  // pass; uid;
  submitted = false;
  message = false;
  uistatus: any;
  passstatus: any;
  constructor(
    private authService: AuthenticationService,
    public navCtrl: NavController,
    private router: Router,
    public menuCtrl: MenuController,
    public popoverController: PopoverController,
    public forgotPasswordService: ForgotPasswordService,
  ) {
    this.menuCtrl.enable(false);
    //this.pop = navParams.get('modelController');
    this.forgotPasswordService._closePopover.subscribe(d => {
      if (d == 'close') {
        this.closeModel();
       }
    });
  }

  ngOnInit() {
    this.loginform = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]),
      uid: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      // uid: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(10)]),
    });
    this.formControlValueChanged();
  }
  // setUserType(type) {
  //   if (type == 'Other') {
  //     this.userData.requestor_type = 'admin_app';
  //     this.toggleFA = false;
  //     this.toggleOther = true;
  //   }
  //   else if (type == 'Field Agent') {
  //     this.userData.requestor_type = 'FA_app';
  //     this.toggleFA = true;
  //     this.toggleOther = false;
  //   }
  // }

  goTo(path): void {
    this.navCtrl.navigateRoot(path);
  }

  formControlValueChanged() {
    console.log('values', this.loginform)
    //  var x=  this.loginform.controls['uid'].status;
    //  var y=  this.loginform.controls['password'].status;
    //console.log("x",y,x);
    this.loginform.get('uid').statusChanges.subscribe((mode: any) => {
     // console.log('form uid', mode);
      this.uistatus = mode;
      if (this.uistatus || this.passstatus == 'VALID') {
        // console.log(this.message);
        if (this.message || this.noDetails) {
          this.message = false;
          this.noDetails = false;
        }
      }
    });
    this.loginform.get('password').statusChanges.subscribe((mode: any) => {
      this.passstatus = mode;
      if (this.uistatus || this.passstatus == 'VALID') {
        console.log(this.message || this.noDetails);
        if (this.message) {
          this.message = false;
          this.noDetails = false;
        }
      }
    });



  }

  login(): void {
    // const val = this.loginform.value;
   // console.log('values', this.loginform)
    if (this.userData.uid == "" && this.userData.password == '') {
      this.message = false;
      this.noDetails = true;
    }
    else if (this.userData.uid == '' && this.userData.password !== '') {
      this.message = false;
      this.noDetails = true;
    }
    else if (this.userData.password == "" && this.userData.uid !== '') {
      this.message = false;
      this.noDetails = true;

    }
    else {
      // console.log('values', val)
      this.noDetails = false;
      this.submitted = true;
      // let sendObjData = {
      //   "uid": val.uid,
      //   "password": val.password,
      //   "status": "active",
      //   "requestor_type": "admin_app",
      // }

      this.authService.login(this.userData)
        .subscribe(res => {
          this.result = res;
          if (res === undefined) {
            this.message = true;

          }
          else {
            this.loginform.reset();
            this.message = false;
            this.router.navigate(['/dashboard']
            
            )
          }
        },
          error => {
            console.log('err', error);
          });
    }

  }

  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  }

  async forgotPass(ev: any) {
    const popover = await this.popoverController.create({
      component: ForgotPasswordPage,
      // backdropDismiss: false,
      translucent: true
    });
    this.pop = popover;
    return await popover.present();
  }

  closeModel() {
    this.pop.dismiss();
  }

}
