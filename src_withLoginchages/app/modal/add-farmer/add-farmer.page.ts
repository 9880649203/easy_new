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
  selector: 'app-add-farmer',
  templateUrl: './add-farmer.page.html',
  styleUrls: ['./add-farmer.page.scss'],
})
export class AddFarmerPage implements OnInit {
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
  dropdownListUserType = ['Agency Manager', "Field Agent", "Others"]
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
  public userModel: UserModel = new UserModel;
  resMessage: any;
  displayError: boolean = false;
  selectedDataToFilter: any = { district: [], place: [], agency_name: [], field_agent: [], roleType: null }

  constructor(navParams: NavParams, private rest: RestService, private authService: AuthenticationService, private config: ConfigService, public alertController: AlertController, private toastr: ToastrService, ) {
    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-default',
      showWeekNumbers: false,
      //dateInputFormat : 'DD MMM YYYY'
      dateInputFormat: 'DD-MM-YYYY',

    });
    // this.rest._message$.subscribe(msg => {
    //   this.resMessage = msg;
    // })

    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    this.userList = this.userModel.AddUser;
    this.userList.user_level = this.loggedInUser.user_level + 1;

    this.modalType = navParams.get('modalType');
    this.modal = navParams.get('modalController');
    this.data = navParams.get('data');
    this.userList.role = ['Agency Manager']

    if (this.modalType == 'editFarmer' || this.modalType == 'viewFarmer') {
      this.userList = Object.assign({}, this.data)
      this.userList.country = [this.data.country]
      this.userList.state = [this.data.state]
      this.userList.district = [this.data.district]

      if (this.modalType == 'editFarmer') {
        this.area_list.state = this.userList.state[0];
        this.config.getDistrict(this.area_list).then(data => {
          this.config._listDistrict.subscribe(data => {
            this.dropdownListDistrict = [];
            this.dropdownListDistrict = data;
          })
        });
      }
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

    this.dropdownListAgency = [
      { item: 'FpC 1' },
      { item: 'FpC 2' },
      { item: 'agency_1' },
      { item: 'Farmers co-operative' },
      { item: 'Farmers Agency' },
      { item: 'schenker' },

    ];
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
      { item: 'EK Order Manager' },
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
    this.config.getCountry(this.area_list).then(data => {
      this.config._listCountry.subscribe(data => {
        this.dropdownListState = [];
        this.dropdownListState = data;
      })
    });
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.newUserForm = new FormGroup({
      first_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2), Validators.maxLength(30)]),
      last_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2), Validators.maxLength(30)]),
      mobile_no: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]),
      aadhar_no: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(12), Validators.maxLength(12)]),
      dob: new FormControl('', [Validators.required]),
      place: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]),
      pincode: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(6), Validators.maxLength(6)]),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
    });
  }
  getFormattedDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return year + '-' + month + '-' + day;
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
    console.log("date", event)
  }
  createUserManager(data) {
    let managerData = this.userList;
    managerData.country = this.userList.country[0];
    managerData.state = this.userList.state[0];
    managerData.district = this.userList.district[0];
    if (this.userTypeAgency) {
      managerData.agency_name = this.userList.agency_name[0];
    }
    this.rest.createFarmer(managerData).then(data => {
      if (this.rest._creationSuccess) {
        this.toastr.success("Farmer " + this.rest._createdUser + " " + this.rest.successMsg);
        this.loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (this.loggedInUser.role == 'Field Agent') {
          this.selectedDataToFilter.roleType = "AM";
        }
        let req = {
          roleType: this.selectedDataToFilter.roleType
        }
        this.rest.getFarmerDropdown(req).subscribe((response) => {
          this.rest._userDropDownList$.next(response)
        })
      }
      else {
        this.toastr.success(this.rest.successMsg);
      }
      this.closeModal()
      // this.rest.getFarmerDropdown()
    })
  }
  // checkDateFormat(date) {
  //   if (date) {
  //     this.userList.dob = this.getFormattedDate(new Date(date))
  //   }
  //   // if (event != "Invalid Date") {
  //   //   event.hour(24).toGMTString()
  //   //   var localDate = event.setHours(0, 0, 0, 0);
  //   //   var pre_moment_date = moment(localDate);
  //   //   var post_moment_date = this.config.convertToMomentDate(pre_moment_date);
  //   //   this.userList.dob = post_moment_date;
  //   // }
  // }
  checkDateFormat(str) {
    console.log("new date", str);
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
  updateUserManager() {
    let managerData = this.userList;
    managerData.country = this.userList.country[0];
    managerData.state = this.userList.state[0];
    managerData.district = this.userList.district[0];
    managerData.status = this.data.status;
    if (this.userTypeAgency) {
      managerData.agency_name = this.userList.agency_name[0];
    }
    this.rest.updateFarmer(managerData).then(data => {
      if (this.rest._creationSuccess) {
        this.toastr.success("Farmer " + managerData.farmer_id + " " + this.rest.successMsg);
        this.loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (this.loggedInUser.role == 'Field Agent') {
          this.selectedDataToFilter.roleType = "AM";
        }
        let req = {
          roleType: this.selectedDataToFilter.roleType
        }
        this.rest.getFarmerDropdown(req).subscribe((response) => {
          this.rest._userDropDownList$.next(response)
        })
      }
      else {
        this.toastr.success("Farmer already exists");
      }
      this.closeModal()
      // this.rest.getFarmerDropdown()
    })
  }
  closeModal() {
    this.modal.dismiss();
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
    console.log("country set")
  }
  onCountrySelect(event) {
    // console.log("country", this.newUserForm('country')
    this.userList.country = [event];
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
  onAgencySelect(event) {
    this.userList.agency_name = [event];
  }
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
            console.log("status", this.deactivateStatusToggle, this.activateStatusToggle)
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
            console.log("status", this.deactivateStatusToggle, this.activateStatusToggle)
          }
        }
      ]
    });

    await alert.present();

  }
  trimValue(formControl) {
    if (formControl.value == " " || undefined || null) {
      formControl.setValue(formControl.value.trim());
    }
  }
}
