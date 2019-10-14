import { Component, OnInit } from '@angular/core';
import {
  NavController, MenuController, AlertController, PopoverController,
  LoadingController, ToastController
} from '@ionic/angular';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { async } from '@angular/core/testing';
import { ForgotPasswordService } from '../../service/forgot-password.service';
const endpointAddress = 'http://134.209.147.129:3001';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  public mobileForm: FormGroup;
  public otpForm: FormGroup;
  public newPassForm: FormGroup;
  validbutton = true;
  submitedMobile = false;
  titleHeader = 'Forgot Password?';
  otpSection = false;
  newPasswordsection = false;
  validotpbutton = true;
  uid = '';
  otp: any = '';
  mobnumber = '';

  constructor(public toastCtrl: ToastController,
    public forgotPasswordService: ForgotPasswordService,
    private http: HttpClient, public loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.mobileForm = new FormGroup({
      mobile_no: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10)]),
    });

    this.otpForm = new FormGroup({
      otp: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(4)]),
    });

    this.newPassForm = new FormGroup({
      new_password: new FormControl('', [Validators.required])
    });
  }

  enablebutton(e) {
    if (e.target.value.length == 10) {
      this.validbutton = false;
    } else {
      this.validbutton = true;
    }
  }

  enableotpbutton(e) {
    if (e.target.value.length == 4) {
      this.validotpbutton = false;
    } else {
      this.validotpbutton = true;
    }
  }

  async getOtp(val: any) {
    this.mobnumber = val.mobile_no;
    const sendObj = {
      mobile_no: val.mobile_no.toString()
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const loader = await this.loadingCtrl.create({
      // duration: 2000
    });
    loader.present();
    this.http.post(endpointAddress + '/generate_otp', sendObj, httpOptions).subscribe(async (res) => {
      this.titleHeader = 'Enter OTP';
      this.newPasswordsection = false;
      this.submitedMobile = true;
      this.otpSection = true;
      const tmp: any = res;
      this.otp = tmp.otp;
      this.uid = tmp.uid;
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        message: tmp.message,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      loader.dismiss();
    }, async (error) => {
      this.titleHeader = 'Forgot Password?';
      this.newPasswordsection = false;
      this.submitedMobile = false;  // change to false
      this.otpSection = false;    // change to false
      const tmp: any = error;
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        message: tmp.error.message,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      loader.dismiss();
    });
  }

  async submitOtp(val: any) {

    const loader = await this.loadingCtrl.create({
      // duration: 2000
    });
    loader.present();
    //  this.http.post(endpointAddress + '/submit_OTP', sendObj, httpOptions).subscribe(async (res) => {
    if (val.otp == this.otp) {
      this.titleHeader = 'Enter new password!';
      this.submitedMobile = true;
      this.otpSection = false;
      this.newPasswordsection = true;
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        message: 'OTP matched!',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      loader.dismiss();
    } else {
      this.titleHeader = 'Enter OTP';
      this.submitedMobile = true;
      this.otpSection = true;
      this.newPasswordsection = false;
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        message: 'OTP did not match!',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      loader.dismiss();
    }
  }

  async resetPassword(val: any) {
    const sendObj = {
      new_password: val.new_password,
      uid: this.uid
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const loader = await this.loadingCtrl.create({
      // duration: 2000
    });
    loader.present();
    this.http.post(endpointAddress + '/reset_password', sendObj, httpOptions).subscribe(async (res) => {
      this.titleHeader = 'Password updated successfully!';
      this.submitedMobile = true;
      this.otpSection = false;
      this.newPasswordsection = false;
      const tmp: any = res;
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        message: tmp.message,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      loader.dismiss();
    }, async (error) => {
      this.titleHeader = 'Enter new password!';
      this.submitedMobile = true;
      this.otpSection = false;
      this.newPasswordsection = true;
      const tmp: any = error;
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        message: tmp.error.message,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      loader.dismiss();
    });
  }

  closemodel() {
    this.forgotPasswordService._closePopover$.next('close');
  }
}
