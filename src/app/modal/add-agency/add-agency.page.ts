//dependency import
import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment_ from 'moment';
//datepicker custom config
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker'

//model import
import { UserModel } from '../../model/user-model'

//service import
import { RestService } from 'src/app/service/rest.service';
import { ConfigService } from 'src/app/service/config.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

const moment = moment_;
@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.page.html',
  styleUrls: ['./add-agency.page.scss'],
})
export class AddAgencyPage implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>
  userTypeAgency: boolean = false;
  userTypeFieldAgent: boolean = false;
  userTypeOther: boolean = false;
  newAgencyForm: FormGroup;
  newUserForm: FormGroup;
  modalType: any;
  modal: ModalController;
  countrySettings: any = {}
  country: any = []
  dropdownListUserType = []
  dropdownListCountry = [];
  dropdownListState = [];
  dropdownListDistrict = [];
  dropdownListRoleOther = [];
  dropdownListRoleManager = []
  dropdownListRoleAgent = []
  dropdownListAgency = []
  selectedItems = [];
  dropdownSingleSelection = {};
  dropdownMultiSelection = {};
  userList: any;
  data: any;
  status: any = "Active";
  activateStatusToggle: boolean;
  deactivateStatusToggle: boolean;
  activateMale: boolean = true;
  activateFemale: boolean = false;
  activateOther: boolean = false;
  area_list: any = { country: 'India' }
  loggedInUser: any;
  resMessage: any;
  toggleAgencyName: boolean = true;

  public userModel: UserModel = new UserModel;
  // today = new Date();
  errMessage: string;
  displayError: boolean = false;
  searchValue: string;
  constructor(navParams: NavParams, private rest: RestService, private authService: AuthenticationService, private config: ConfigService, public alertController: AlertController,
    private toastr: ToastrService, ) {
    var date = new Date();
    var currentMonth = date.getMonth();
    var currentDate = date.getDate();
    var currentYear = date.getFullYear();
    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-default',
      showWeekNumbers: false,
      dateInputFormat: 'DD-MMM-YYYY',
      // endDate: "today",
      //maxDate: new Date(2001, 3, 31),
      maxDate: new Date(currentYear, currentMonth, currentDate)
    });
    // this.rest._message$.subscribe(msg => {
    //   this.resMessage = msg;
    // })
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (this.loggedInUser.role == 'Admin') {
      this.dropdownListUserType = ['Agency Manager', "Others"]
    }
    if (this.loggedInUser.role == 'Agency Manager') {
      this.dropdownListUserType = ['Agency Manager', 'Field Agent']
    }
    this.userList = this.userModel.AddUser;
    this.userList.user_level = this.loggedInUser.user_level + 1;

    this.modalType = navParams.get('modalType');
    this.modal = navParams.get('modalController');
    this.data = navParams.get('data');
    this.userList.role = ['Agency Manager']

    if (this.modalType == 'editManager' || this.modalType == 'viewManager' || this.modalType == 'editFieldAgent' || this.modalType == 'viewFieldAgent' || this.modalType == 'editOther' || this.modalType == 'viewOther') {

      delete this.data.parentAgency_id;
      delete this.data.parentAgency_name;

      // this.newUserForm.get('password').markAsTouched
      // console.log("password", pwd)
      this.userList = Object.assign({}, this.data)
      this.userList.country = [this.data.country]
      this.userList.state = [this.data.state]
      this.userList.district = [this.data.district]
      this.userList.role = [this.data.role]

      this.userList.agency_name = this.data.agency_name
      if (this.data.gender == 'male') {
        this.activateMale = true;
        this.activateFemale = false;
        this.activateOther = false;
      }
      else if (this.data.gender == 'female') {
        this.activateMale = false;
        this.activateFemale = true;
        this.activateOther = false;
      }
      else if (this.data.gender == 'other') {
        this.activateMale = false;
        this.activateFemale = false;
        this.activateOther = true;
      }
      if (this.data.status == 'active') {
        this.activateStatusToggle = true;
        this.deactivateStatusToggle = false;
      }
      else {
        this.activateStatusToggle = false;
        this.deactivateStatusToggle = true;
      }
    }

    // this.dropdownListAgency = [
    //   { item: 'FpC 1' },
    //   { item: 'FpC 2' },
    //   { item: 'agency_1' },
    //   { item: 'Farmers co-operative' },
    //   { item: 'Farmers Agency' },
    //   { item: 'Sampath Traders' },
    //   { item: 'Venkateshwara Traders' },
    //   { item: 'Dibbadahalli Traders' },
    //   { item: 'Vasavi Traders' },


    // ];
    this.dropdownListCountry = [
      { item: 'India' },
    ];
    this.dropdownListRoleManager = [
      { item: 'Agency Manager' },
    ];
    this.dropdownListRoleAgent = [
      { item: 'Field Agent' },
    ];
    this.dropdownListRoleOther = [
      // { item: 'Admin' },
      { item: 'Order Manager' },
      { item: 'Viewer' },
    ];
    this.dropdownMultiSelection = {
      singleSelection: true,
      idField: 'item',
      textField: 'item',
      // selectAllText: 'Select All',
      // unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
      maxHeight: 150
    };
    this.dropdownSingleSelection = {
      singleSelection: true,
      idField: 'item',
      textField: 'item',
      // selectAllText: 'Select All',
      // unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      // allowSearchFilter: true,
      maxHeight: 150
    };

  }

  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.newUserForm = new FormGroup({
      first_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2), Validators.maxLength(30)]),
      last_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2), Validators.maxLength(30)]),
      // mail_id: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      mobile_no: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]),
      role: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      aadhar_no: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(12), Validators.maxLength(12)]),
      // gender: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      place: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]),
      pincode: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(6), Validators.maxLength(6)]),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
    });

    this.newAgencyForm = new FormGroup({
      agency_name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
      first_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2), Validators.maxLength(30)]),
      last_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2), Validators.maxLength(30)]),
      mobile_no: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]),
      role: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      aadhar_no: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(12), Validators.maxLength(12)]),
      dob: new FormControl('', [Validators.required]),
      place: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]),
      pincode: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(6), Validators.maxLength(6)]),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
    });

    if (this.modalType == 'editManager' || this.modalType == 'editFieldAgent' || this.modalType == 'editOther') {
      this.toggleAgencyName = false;
      this.newAgencyForm.controls['agency_name'].setValue('abcd');
      this.newAgencyForm.controls['password'].setValue('bbbbbbbb');
      this.newAgencyForm.controls['mobile_no'].setValue('1234567890');
      this.newUserForm.controls['password'].setValue('aaaaaa');
      this.newUserForm.controls['mobile_no'].setValue('1234567890');
      ;
      this.area_list.country = this.userList.country[0]
      this.config.getState(this.area_list).then(data => {
        this.config._listState.subscribe(data => {
          this.dropdownListState = [];
          this.dropdownListState = data;
        })
      });
      this.area_list.state = this.userList.state[0]
      this.config.getDistrict(this.area_list).then(data => {
        this.config._listDistrict.subscribe(data => {
          this.dropdownListDistrict = [];
          this.dropdownListDistrict = data;
        })
      });
    }
    else {
      this.toggleAgencyName = true;;
    }


    this.config._listAgency.subscribe(data => {
      if (data.length > 0) {
        this.dropdownListAgency = [];
        data.forEach(agency => {
          const list = {
            item: agency.agency_name,
          }
          this.dropdownListAgency.push(list)
        })
      }
    })


  }

  getFormattedDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return year + '-' + month + '-' + day;

  }
  // checkDateFormat(date) {
  //   console.log("new date",date);

  //   // if (date) {
  //   //   this.userList.dob = this.getFormattedDate(new Date(date))
  //   //   console.log("date", date)
  //   // }
  // }

  checkDateFormat(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    let temp = [date.getFullYear(), mnth, day].join("/");
    var years = new Date(+(new Date()) - +(new Date(temp))).getFullYear() - 1970;
    if (years < 18) {
      this.displayError = true;

    } else {
      this.displayError = false;
    }
  }

  trimValue(formControl) {
    if (formControl.value == " " || undefined || null) {
      formControl.setValue(formControl.value.trim());
    }
  }




  setUserType(event) {
    if (event == "Agency Manager") {
      this.userTypeAgency = true;
      this.userTypeFieldAgent = false;
      this.userTypeOther = false;
      this.userList = Object.assign({}, this.userModel.AddUser)
      this.userList.role = ['Agency Manager']
    }
    else if (event == "Field Agent") {
      this.userTypeAgency = false;
      this.userTypeFieldAgent = true;
      this.userTypeOther = false;
      this.userList = Object.assign({}, this.userModel.AddFieldAgent)
      this.userList.role = ['Field Agent']
      this.userList.agency_id = this.loggedInUser.agency_id;
      this.userList.agency_name = this.loggedInUser.agency_name;

    }
    else if (event == "Others") {
      this.userTypeAgency = false;
      this.userTypeFieldAgent = false;
      this.userTypeOther = true;
      this.userList.role = [];
      this.userList.agency_id = this.loggedInUser.agency_id;
      this.userList.agency_name = this.loggedInUser.agency_name;

    }
  }
  updateMyDate(event) {
    // console.log("date", event)
  }
  createUserManager(data) {
    let managerData = this.userList;
    managerData.role = this.userList.role[0];
    managerData.country = this.userList.country[0];
    managerData.state = this.userList.state[0];
    managerData.district = this.userList.district[0];
    if (this.userTypeAgency) {
      managerData.agency_name = this.userList.agency_name;
    }
    else {
      delete managerData.agency_id
      managerData.agency_name = this.loggedInUser.agency_name;

    }
    this.rest.createUserManager(managerData).then(data => {
      if (this.rest._creationSuccess) {
        this.toastr.success("User " + this.rest._createdUser + " " + this.rest.successMsg);
        let req = {
          roleType: this.rest.roleType
        }
        this.rest.getUserDropDownList(req).subscribe((response) => {
          this.rest._userDropDownList$.next(response)
        })
      }
      // else {
      //   this.toastr.error(this.rest.successMsg);
      // }
      this.closeModal();
    })
  }
  updateUserManager() {
    delete this.userList.role_id;
    let managerData = this.userList;
    managerData.role = this.userList.role[0];
    managerData.country = this.userList.country[0];
    managerData.state = this.userList.state[0];
    managerData.district = this.userList.district[0];
    managerData.agency_name = this.userList.agency_name;
    managerData.status = this.data.status;
    managerData.status = this.data.status;

    this.rest.updateUserManager(managerData).then(data => {
      if (this.rest._creationSuccess) {
        this.toastr.success("User " + managerData.uid + " " + this.rest.successMsg);
        let req = {
          roleType: this.rest.roleType
        }
        this.rest.getUserDropDownList(req).subscribe((response) => {
          this.rest._userDropDownList$.next(response)
        })
      }
      // else {
      //   this.toastr.error("User already exists");
      // }
      this.closeModal();

    })
  }
  closeModal() {
    this.modal.dismiss();
    // this.rest.getUserDropDownList()
  }
  setGender(data) {
    if (data == "male") {
      this.userList.gender = "male";
    }
    else if (data == "female") {
      this.userList.gender = "female";
    }
    else if (data == "other") {
      this.userList.gender = "other";
    }
  }
  test() {
    this.newUserForm.setValue({
      country: [Validators.required]
    });
  }
  onCountrySelect(event) {
    this.userList.country = [event];
    this.config.getState(this.area_list).then(data => {
      this.config._listState.subscribe(data => {
        this.dropdownListState = [];
        this.dropdownListState = data;
      })
    });
  }
  onStateSelect(event) {
    this.userList.state = [event];
    this.area_list.state = event;
    this.config.getDistrict(this.area_list).then(data => {
      this.config._listDistrict.subscribe(data => {
        this.dropdownListDistrict = [];
        this.dropdownListDistrict = data;
      })
    });
  }
  onDistrictSelect(event) {
    this.userList.district = [event];
  }
  onRoleSelect(event) {
    this.userList.role = [event];
  }
  // onAgencySelect(event) {
  //   this.userList.agency_name = [event];
  // }
  async changeStatus(value) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to change the status',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            if (this.data.status == 'active') {
              this.activateStatusToggle = true;
              this.deactivateStatusToggle = false;
              this.data.status = 'active'
            }
            else {
              this.activateStatusToggle = false;
              this.deactivateStatusToggle = true;
              this.data.status = 'deactive'
            }
          }
        }, {
          text: 'Okay',
          handler: () => {
            if (value == '1') {
              this.deactivateStatusToggle = false;
              this.activateStatusToggle = true;
              this.data.status = 'active'
            }
            else if (value == '0') {
              this.deactivateStatusToggle = true;
              this.activateStatusToggle = false;
              this.data.status = 'deactive'
            }
          }
        }
      ]
    });

    await alert.present();

  }
}
