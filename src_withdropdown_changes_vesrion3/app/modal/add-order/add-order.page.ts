import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import {
  NavParams, PopoverController, NavController, ModalController,
  LoadingController, ToastController
} from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { OrderModal } from '../../model/order-model';
import { OrderService } from '../../service/order.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestService } from '../../service/rest.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker'
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { RoleBaseAccesService } from '../../service/role-base-acces.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.page.html',
  styleUrls: ['./add-order.page.scss'],
})
export class AddOrderPage implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>;
  addmoreprod = '';
  updateButtonStatus = false;
  updateButtonMessage = '';
  forAdminUpdate = false;
  roleType = '';
  toggleOrderedFor = '';
  updateorderstatus = '';
  formdata: any;
  productObj: any;
  productObj1: any;
  orderTypeAgency = false;
  orderTypeOthers = false;
  result: any;
  agency_name = 'ifco';
  count: number;
  statusChangeChecker = '';
  formdataarray: any = [];
  state: any = [
    'Karnataka'
  ];
  showLoadingIndicator = false;
  product_id: any;
  place: any = [
    'marthalli',
    'Chikamagalore',
    'Hubli',
    'Davanagere',
    'dkfjd',
    'Idduki',
    'yemlur',
    'marathahalli',
    'tumkur',
    'Bangalore',
    'dsdds',
    'bda com',
    'Yadgiri',
    'bangalore',
    'Chikkamagalore',
    'Shivamogga'];
  district: any = ['Bengaluru Urban',
    'Chikamagalore',
    'Ballari',
    'Bangalore',
    'Haveri',
    'Idduki',
    'Belagavi',
    'Shivamogga',
    'Chikkamagalore',
    'Davanagere',
    'Bagalkot',
    'Yadgiri',
    'Hubli'];
  units: any;
  status = [];
  dropdownList = [];
  selectedItems = [];
  orderforSettings = {};
  dropdownSettings = {};
  dropdownSettings1 = {};
  agencydropdownSettings = {};
  farmerdropdownSettings = {};
  categorydropdownSettings = {};
  productdropdownSettings = {};
  statuSettings = {};
  orderFormArray: any = [];
  farmerList: any = [];
  categoryList: any = [];
  modal: ModalController;
  ordered_for: any = [
    'Agency',
    'Other'
  ];
  testtt: any = [{ category_id: 123, category_name: 'gggg' }];
  public orderForm: FormGroup;
  public editOrderForm: FormGroup;
  public items: FormArray;
  public moreOrderForm: FormGroup;
  public ShowAddMoreOders = false;
  public hideButton = false;
  orderformsubmitmessage = '';
  public extractButton = true;
  public showStateDistrict = false;
  public modalType: any;
  public OrderData: any = {};
  public orderModal: OrderModal = new OrderModal();
  public pop: PopoverController;

  OrderDataModel: any;
  dialogRef: any;
  products: any = [];
  unitDropval = [];
  category: any = [];
  agencyList: any = [];
  catid: any;
  userdetails: any;
  on_the_behalf: any;
  productprice = 0;
  apiProdArr = [];
  editProducts: any = [];
  role: any;
  disableAgency = false;
  arr = [];
  tomorrow: any;
  today = new Date();
  constructor(public popoverCtrl: PopoverController, public toastr: ToastrService,
    private http: HttpClient, private formBuilder: FormBuilder,
    navParams: NavParams, public modalCtrl: ModalController, public toastCtrl: ToastController,
    private roleBaseAccesService: RoleBaseAccesService, public loadingCtrl: LoadingController,
    public orderService: OrderService, public restService: RestService) {

    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-default',
      showWeekNumbers: false,
      dateInputFormat: 'DD-MM-YYYY',
      sunHighlight: true,
    });

    this.tomorrow = new Date(this.today.getTime() + 24 * 60 * 60 * 1000);
    this.restService.getUser('');


    this.categorydropdownSettings = {
      singleSelection: true,
      idField: 'category_id',
      textField: 'category_name',
      allowSearchFilter: true
    };

    this.orderService.getProducts().subscribe(res => {
      res.category_name.forEach(category => {
        if (category) {
          this.category.push(category);
        }
      });
    });


    this.dropdownSettings = {
      singleSelection: true,
      allowSearchFilter: true
    };

    this.dropdownSettings1 = {
      singleSelection: true,
      idField: 'product_id',
      textField: 'product_name',
      allowSearchFilter: true
    };
    this.statuSettings = {
      singleSelection: true,
      allowSearchFilter: true
    };

    this.farmerdropdownSettings = {
      singleSelection: true,
      idField: 'farmer_id',
      textField: 'first_name',
      allowSearchFilter: true
    };

    this.agencydropdownSettings = {
      singleSelection: true,
      idField: 'agency_id',
      textField: 'agency_name',
      allowSearchFilter: true,
    };

    this.productdropdownSettings = {
      singleSelection: true,
      idField: 'product_id',
      textField: 'product_name',
      allowSearchFilter: true
    };


    this.pop = navParams.get('modalController');
    // console.log("pop", this.pop);

    this.modalType = navParams.get('modalType');
    // console.log("this.modalType", this.modalType);
    if (this.modalType == 'addOrder') {
      // this.OrderData = this.orderModal
    }


    if (this.modalType == 'editOrder' || this.modalType == 'viewOrder') {

      this.role = JSON.parse(localStorage.getItem('user'));
      this.OrderDataModel = navParams.get('orderData');
      const token = localStorage.getItem('token');
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token
        })
      };
      const request = {
        order_id: this.OrderDataModel.order_id
      };
      this.http
        .post('http://134.209.147.129:3001/view_order', request, httpOptions).subscribe((res: any) => {

          this.OrderData = res.message;
            this.OrderData.currentStatus = this.OrderData.order_status;
          if(this.OrderData.expected_date.length > 10){
            this.OrderData.expected_date = this.convert(this.OrderData.expected_date);
          }
          if(this.OrderData.delivered_date > 10){
            this.OrderData.delivered_date = this.convert(this.OrderData.delivered_date);
          }
            if ((this.OrderData.order_status == 'cancelled' || this.OrderData.order_status == 'accepted' || this.OrderData.order_status == 'completed') && this.role.role !== 'Admin') {
            this.updateButtonStatus = true;
            this.updateButtonMessage = 'order can not be changed for cancelled or accepted or completed';
          }
          this.editProducts = this.OrderData.products.map(obj => {
            const t = {
              category_name: { category_id: obj.category_id, category_name: obj.category_name },
              product_name: { product_id: obj.product_id, product_name: obj.product_name },
              unit: { unit: obj.unit },
              mrp: obj.mrp,
              quantity: obj.quantity
            };
            return t;
          });
          // console.log('===========>editProducts', res);
          const that = this;
          this.arr = this.editProducts.map((i) => {
            return that.BuildFormDynamic(i);
          });


          // console.log('==:>?,Dilip', this.OrderData);
          this.editOrderForm.setControl('items', this.formBuilder.array(this.arr));
          const m = this.editOrderForm.get('items') as FormArray;
          // console.log('form builder', m); // this.editOrderForm.get('items'));
        });
    }

    this.orderService.farmerList().subscribe(res => {
      // console.log('farmer List', res);
      if (res && res !== undefined) {
        if (res.statusCode == 200) {
          this.farmerList = res.data;
        }
      }
    });

    this.orderService.filterProductCategory({}).subscribe(res => {
      const tmp: any = res;
      if (res) {
        this.categoryList = tmp.category_name;
        this.products = tmp.product_name;
      }
       //console.log('=====>', res );
    });

  }


  ngOnInit() {
    this.getAgencyList();
    this.orderService._page$.subscribe((res) => {
      this.count = res;
     // console.log("odrer page",res)
    });
    this.role = JSON.parse(localStorage.getItem('user'));

    if (this.role.role === 'Admin') {
      this.status = ['created', 'accepted', 'cancelled', 'processed', 'completed'];
      this.forAdminUpdate = true;
      } else {
      this.status = ['created', 'cancelled'];
      }

    if (this.role.role === 'Field Agent') {
      this.disableAgency = true;
      this.orderModal.ordered_foragency = [{ agency_id: 0, agency_name: 'none' }];
      this.orderModal.ordered_forexuser = '-';
      this.orderModal.farmer_id = '';
    } else {
      this.disableAgency = false;
      this.orderModal.farmer_id = [{ farmer_id: 0, first_name: 'none' }];
      this.orderModal.ordered_foragency = '';
      this.orderModal.ordered_forexuser = '';
    }
    this.orderModal.total_price = 0;
    this.orderForm = new FormGroup({
      ordered_foragency: new FormControl('', [Validators.required]),

      ordered_forexuser: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(30)]),
      farmer_id: new FormControl('', [Validators.required]),
      on_the_behalf: new FormControl(),
      category: new FormControl('', [Validators.required]),
      company:new FormControl(''),
      product: new FormControl('', [Validators.required]),
      unit: new FormControl(),
      order_for_mobile: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]),
      quantity: new FormControl('', [Validators.required]),
      mrp: new FormControl(),
      updated_by: new FormControl(),
      expected_date: new FormControl(),
      place: new FormControl(),
      pincode: new FormControl(),
      total_order: new FormControl(),
      total_price: new FormControl(),
      district: new FormControl(),
      state: new FormControl(),
    });

    this.editOrderForm = this.formBuilder.group({
      order_id: '',
      ordered_for: '',
      farmer_id: '',
      expected_date: '',
      delivered_date: '',
      place: '',
      pincode: '',
      district: '',
      state: '',
      order_status: new FormControl('', [Validators.required]),
      updated_by: '',
      price: '',
      comment: '',
      items: null, // this.formBuilder.array([ ...this.arr ])
    });
  }
  getAgencyList() {
    const endpoint = 'http://134.209.147.129:3001';
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    
    this.http
      .post(endpoint + '/agency_list_for_order', '', httpOptions)
      .subscribe(data => {
        if (data) {
          let res: any = {};
          res = data;
          res.data.forEach(rr => {
            const t = {
              agency_id: rr.mobile_no,
              agency_name: rr.agency_name
            };
            this.agencyList.push(t);
          });
        }
      });

  }

  BuildFormDynamic(item): FormGroup {
    return this.formBuilder.group({
      category: item.category_name,
      products: item.product_name,
      unit: item.unit,
      quantity: item.quantity,
      mrp: item.mrp,
    });
  }

  validateSubmitButton(tt) {
    if(tt == 'agency'){  
          this.orderForm.controls['ordered_forexuser'].clearValidators();
          this.orderForm.controls['ordered_forexuser'].updateValueAndValidity();
          this.orderForm.controls['farmer_id'].clearValidators();
          this.orderForm.controls['farmer_id'].updateValueAndValidity();
          this.orderForm.controls['order_for_mobile'].clearValidators();
          this.orderForm.controls['order_for_mobile'].updateValueAndValidity();
          this.orderForm.controls['ordered_foragency'].setValidators([Validators.required]);
          this.orderForm.controls['ordered_foragency'].updateValueAndValidity();
    } else if( tt == 'external_user'){

        this.orderForm.controls['ordered_forexuser'].setValidators([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(30)]);
        this.orderForm.controls['ordered_forexuser'].updateValueAndValidity();
        this.orderForm.controls['order_for_mobile'].setValidators([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]);
        this.orderForm.controls['order_for_mobile'].updateValueAndValidity();
        
        this.orderForm.controls['farmer_id'].clearValidators();
        this.orderForm.controls['farmer_id'].updateValueAndValidity();
       
        this.orderForm.controls['ordered_foragency'].clearValidators();
        this.orderForm.controls['ordered_foragency'].updateValueAndValidity();
    } else if( tt == 'farmer'){
      this.orderForm.controls['ordered_forexuser'].clearValidators();
      this.orderForm.controls['ordered_forexuser'].updateValueAndValidity();
      this.orderForm.controls['order_for_mobile'].clearValidators();
      this.orderForm.controls['order_for_mobile'].updateValueAndValidity();
      
      this.orderForm.controls['farmer_id'].setValidators([Validators.required]);
      this.orderForm.controls['farmer_id'].updateValueAndValidity();
     
      this.orderForm.controls['ordered_foragency'].clearValidators();
      this.orderForm.controls['ordered_foragency'].updateValueAndValidity();
  }
    
}


isNumber(evt) {
  evt = (evt) ? evt : window.event;
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
  }
  return true;
}

  onItemSelect(event, t) {

    // console.log('selected category', event);
    if (t === 'category') {
      const cid = {
        category_id: [event.category_id]
      };
      this.orderService.filterProductCategory(cid).subscribe(res => {
        const tmp: any = res;
        if (res) {
          this.products = tmp.product_name;
          this.unitDropval = tmp.units;
        }
      });
    } else if (t === 'product') {
      this.products.forEach(element => {
        if (element.product_id == event.product_id) {
          this.orderModal.price = element.mrp;
          this.orderModal.total_price = parseInt(this.orderModal.total_price, 10) + parseInt(element.mrp, 10);
        }
      });
    } else if (t === 'quantity' || t === 'mrp') {
      
      if (this.orderModal.quantity && this.orderModal.price) {
        this.orderModal.total_order = 0;
          if(this.apiProdArr.length) {         
            this.apiProdArr.forEach( r =>{
              this.orderModal.total_order += parseInt(r.mrp, 10) * parseInt(r.quantity, 10);
            });
          }
          this.orderModal.total_order += parseInt(this.orderModal.price, 10) * parseInt(this.orderModal.quantity, 10);
  
          
          if(this.orderModal.total_order === NaN) {
            this.orderModal.total_order = 0;
          }
    
      } else if(this.apiProdArr.length) {
        this.orderModal.total_order = 0;
        this.apiProdArr.forEach( r =>{
          this.orderModal.total_order += parseInt(r.mrp, 10) * parseInt(r.quantity, 10);
        });
      }
    }
  }

  onItemSelect1(event, t, control) {
    this.products.forEach(element => {
      if (element.product_id == event.product_id) {
        control = element.mrp;
      }
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  addMoreProduct() {
    this.orderForm.controls['category'].clearValidators();
    this.orderForm.controls['category'].updateValueAndValidity();
    this.orderForm.controls['product'].clearValidators();
    this.orderForm.controls['product'].updateValueAndValidity();    
    this.orderForm.controls['quantity'].clearValidators();
    this.orderForm.controls['quantity'].updateValueAndValidity();

    if (this.orderModal.category && this.orderModal.product && this.orderModal.quantity) {
      const t = {
        category: this.orderModal.category,
        products: this.orderModal.product,
        quantity: this.orderModal.quantity,
        price: this.orderModal.price
      };

      const tt = {
        product_id: this.orderModal.product[0].product_id,
        quantity: this.orderModal.quantity,
        mrp: this.orderModal.price
      };

      this.apiProdArr.push(tt);

      this.formdataarray.push(t);
      console.log(this.formdataarray);
      this.orderModal.category = '';
      this.orderModal.product = '';
      this.orderModal.quantity = '';
      this.orderModal.price = '';

      this.addmoreprod = '';
    } else {
      this.addmoreprod = 'Filled mandatory field...';
    }
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    // console.log("date new", [day, mnth, date.getFullYear()].join("-"));
    return [day, mnth, date.getFullYear()].join("-");
  }

  async submitOrderForm(ordersdata) {
    let chk = true;
    let finalObj: any = {};
    // const loader = await this.loadingCtrl.create({
    //   // duration: 2000
    // });
    //   loader.present();
    finalObj.expected_date = this.convert(new Date(ordersdata.expected_date));
    finalObj.mrp = ordersdata.mrp;
    finalObj.order_for = this.toggleOrderedFor;
    if (this.toggleOrderedFor === 'farmer') {
      finalObj.farmer_id = ordersdata.farmer_id[0].farmer_id;
    } else if (this.toggleOrderedFor === 'agency') {
      finalObj.on_behalf_of = this.role.mobile_no;
      finalObj.ordered_for_id = ordersdata.ordered_foragency[0].agency_id;
    } else if (this.toggleOrderedFor === 'external_user') {
      finalObj.order_for = 'external user';
      finalObj.order_for_mobile = ordersdata.order_for_mobile;
      finalObj.on_behalf_of = this.role.mobile_no;
      finalObj.order_for_name = ordersdata.ordered_forexuser;
      finalObj.place = ordersdata.place;
      finalObj.pincode = ordersdata.pincode;
      finalObj.state = ordersdata.state;
      finalObj.district = ordersdata.district;
    }

    if (this.orderModal.category && this.orderModal.product && this.orderModal.quantity) {
      const tt = {
        product_id: this.orderModal.product[0].product_id,
        quantity: this.orderModal.quantity,
        mrp: this.orderModal.price
      };

      this.apiProdArr.push(tt);
      // this.formdataarray.push(t);
      this.orderformsubmitmessage = '';
    } else if (this.apiProdArr.length) {
      this.orderformsubmitmessage = '';
    } else {
      chk = false;
      this.orderformsubmitmessage = 'Missing mandatory field';
    }

    if (chk) {
      const loader = await this.loadingCtrl.create({
        // duration: 2000
      });
      loader.present();
      finalObj.products = this.apiProdArr;
      finalObj.order_total = ordersdata.total_order;
      finalObj.expected_date = ordersdata.expected_date;
      this.orderService.createOrder(finalObj).subscribe(async res => {
        const tmp: any = res;
        if (res) {
          if (tmp.statusCode == 200) {
            this.toastr.success('Order '+ tmp.order_id+ ' created successfully');
           setTimeout(() => {
              this.closeModal();
            }, 1000);
          }
          this.orderformsubmitmessage = tmp.message;
        }
    
        let sendObjData = {
          "page": this.count,
          "limit": 10,
        }
        this.orderService.orderList(sendObjData);     
        loader.dismiss();
      }, async error => {
        const tmp: any = error;
        this.toastr.error(tmp);
        loader.dismiss();
      });
    }

  }


  async updateOrder(val) {
    const loader = await this.loadingCtrl.create({
       duration: 2000
    });
    loader.present();
    const p = val.items.map(m => {
      const mp = Array.isArray(m.products) ? m.products[0] : m.products;
      const mc = Array.isArray(m.category) ? m.category[0] : m.category;
      let mu;
      if (m.unit.unit) {
        mu = Array.isArray(m.unit.unit) ? m.unit.unit[0] : m.unit.unit;
      } else {
        mu = Array.isArray(m.unit) ? m.unit[0] : m.unit;
      }
      const tt = {
        product_id: mp.product_id,
        product_name: mp.product_name,
        cat_id: mc.category_id,
        category_name: mc.category_name,
        unit: mu,
        mrp: m.mrp,
        quantity: m.quantity
      };
      return tt;
    });

    const sendObjData = {
      order_id: val.order_id,
      order_status: val.order_status,
      products: p,
      expected_date: val.expected_date,
      delivered_date: val.delivered_date,
      comment: val.comment,
    };

    this.orderService.orderUpdate(sendObjData).subscribe(async res => {
      const tmp: any = res;
      if (res.statusCode == 200) {
        this.toastr.success(res.message);
        setTimeout(() => {
          this.closeModal();
        }, 1000);
      }
      this.updateorderstatus = tmp.message;
      let sendObjData = {
        "page": this.count,
        "limit": 10,
      }
      this.orderService.orderList(sendObjData);
      loader.dismiss();
    }, async error => {
      const tmp: any = error;
      this.toastr.error(tmp);
      loader.dismiss();
    });
  }
  addModalclose() {
    this.modalCtrl.dismiss();
  }

  modalclose() {
    this.modalCtrl.dismiss();
 }

  checkExtractbutton(event) {
    if (event.target.value.length === 6) {
      this.extractButton = false;
    } else {
      this.showStateDistrict = false;
      this.extractButton = true;
    }

  }
  extractDistrictState(pin) {
    this.showStateDistrict = true;
  }


  onProductSelect1(event) {
    this.productObj1 = event;
  }
  onProductSelect(event) {


    this.productObj = event;
  }
  setOrderType(event) {
    // const ci = this.OrderData.currentStatus
    // const arr = ['created','cancelled', 'accepted', 'processed', 'completed'];
    
    const ci = this.status.findIndex( res => {
    return res == this.OrderData.currentStatus;
    });
    
    const si = this.status.findIndex( res => {
    return res == event;
    });
    
    const fi = si-ci;
    if( fi == 1 || fi == 0 || (this.OrderData.order_status == 'created' && fi == 2) ) {
    this.statusChangeChecker = '';
    } else {
    this.OrderData.order_status = this.OrderData.currentStatus;
    this.statusChangeChecker = 'Status can not be changed to '+event;
    }
    console.log("event", this.OrderData.currentStatus, (si-ci));
    }
   
}