import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { IndentModal } from '../../model/indent-model';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../service/order.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RoleBaseAccesService } from '../../service/role-base-acces.service';

@Component({
  selector: 'app-add-indent',
  templateUrl: './add-indent.page.html',
  styleUrls: ['./add-indent.page.scss']
})
export class AddIndentPage implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>
  addmoreprod = '';
  orderformsubmitmessage = '';
  updatestatus = '';
  agencyList: any = [];
  userRole: any;
  formdata: any;
  formdataarray: any = [];
  stateffff = [
    { 'sid': 1, 'sname': 'KARNATAKA' },
    { 'sid': 2, 'sname': 'KRISHNA' },
    { 'sid': 3, 'sname': 'TELANGANA' },
    { 'sid': 4, 'sname': 'WEST GODAVARI' },
    { 'sid': 5, 'sname': 'EAST GODAVARI' }
  ];

  district = ['Bengaluru Urban',
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
  place = ['marthalli',
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
  state = ['Karnataka'];
  category = [];
  product_indent: any = [];
  category_indent: any = [];
  editProducts: any = [];
  products: any = [];
  status = ['created', 'success'];
  modal: ModalController;
  productprice = 0;
  apiProdArr = [];
  // displaySettings = true;

  ordered_for = ['Farmers', 'Agency', 'Companies', 'Field_Agents'];
  Category1 = ['Product List', 'Product Id'];
  Category2 = ['Product List', 'product Category'];
  Category3 = ['Product Field', 'product Category'];
  Category4 = ['Product Field', 'Product Agency'];
  Category5 = ['Product Agency', 'Product Id'];

  unitDropval = [];
  onBehalfOf = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  agencydropdownSettings = {};
  categorydropdownSettings = {};
  productdropdownSettings = {};
  statedropDownSettings = {};
  districtdropDownSettings = {};
  toggleOrderedFor = '';
  arr = [];
  tomorrow: any;
  today = new Date();
  public indentForm: FormGroup;
  public editindentForm: FormGroup;
  public items: FormArray;
  public moreindentForm: FormGroup;
  public ShowAddMoreIndents = false;
  public hideButton = false;
  public modalType: any;
  public IndentData: any = {};
  public indentModal: IndentModal = new IndentModal();
  public pop: PopoverController;
  IndentDataModel: any;
  count: number;

  constructor(public popoverCtrl: PopoverController, public toastCtrl: ToastController,
    public navParams: NavParams, public modalCtrl: ModalController, private formBuilder: FormBuilder,
    private orderService: OrderService, private http: HttpClient, public loadingCtrl: LoadingController,
    public roleBaseAccesService: RoleBaseAccesService, private toastr: ToastrService,
  ) {

    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-default',
      showWeekNumbers: false,
      dateInputFormat: 'DD-MM-YYYY',
      sunHighlight: true,
    });

    this.tomorrow = new Date(this.today.getTime() + 24 * 60 * 60 * 1000);

    this.agencydropdownSettings = {
      singleSelection: true,
      idField: 'agency_id',
      textField: 'agency_name',
      allowSearchFilter: true,
    };

    this.categorydropdownSettings = {
      singleSelection: true,
      idField: 'category_id',
      textField: 'category_name',
      allowSearchFilter: true
    };

    this.productdropdownSettings = {
      singleSelection: true,
      idField: 'product_id',
      textField: 'product_name',
      allowSearchFilter: true
    };

    this.statedropDownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true
    };

    this.districtdropDownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true
    };

    this.pop = navParams.get('modelController');
    // console.log('pop', this.pop);

    this.orderService.filterProductCategory({}).subscribe(res => {
      let tmp: any = res;
      if (res) {
        this.category = tmp.category_name;
      }
      // console.log('=====>', res );
    });

    this.orderService.filterIndentCategory({}).subscribe((res) => {
      let tmp: any = res;
      if (res) {
        this.product_indent = tmp.product_name;
        this.category_indent = tmp.category_name;
      }
    });


    this.userRole = JSON.parse(localStorage.getItem('user'));
    this.indentModal.ordered_by = this.userRole.role;
    // console.log('User Role', this.userRole);

  }



  ngOnInit() {
    this.orderService._totalIndPage$.subscribe((res) => {
      this.count = res;
      // console.log("odrer page",res)
    });
    this.getAgencyList();
    this.indentModal.total_price = 0;
    this.indentForm = new FormGroup({
      ordered_for: new FormControl('', [Validators.required]),
      ordered_for_other: new FormControl(),
      on_behalf: new FormControl(),
      category: new FormControl('', [Validators.required]),
      products: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      price: new FormControl(),
      expected_date: new FormControl(),
      delivered_date: new FormControl(),
      place: new FormControl(),
      pincode: new FormControl(),
      district: new FormControl(),
      state: new FormControl(),
      total_order: new FormControl(),
      total_price: new FormControl(),
      order_for_mobile: new FormControl('', [Validators.minLength(10)])
    });


    this.moreindentForm = new FormGroup({

      place: new FormControl('', [Validators.required]),
      pincode: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      total_order: new FormControl(),
      total_price: new FormControl('', [Validators.required]),
      // notes: new FormControl()
    });


    this.editindentForm = this.formBuilder.group({
      indent_id: '',
      indent_status: '',
      price: '',
      updated_by: '',
      expected_date: '',
      delivered_date: '',
      place: '',
      pincode: '',
      district: '',
      state: '',
      comment: '',
      items: null
    });


    this.modalType = this.navParams.get('modalType');
    if (this.modalType == 'addIndent') {
      this.IndentData = this.indentModal;

    } else if (this.modalType === 'editIndent' || this.modalType === 'viewIndent') {

      this.IndentDataModel = this.navParams.get('indentData');
      const token = localStorage.getItem('token');
      let httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": token,
        })
      };
      const request = {
        indent_id: this.IndentDataModel.indent_id
      };
      this.http
        .post('http://134.209.147.129:3001/view_indent', request, httpOptions).subscribe((res: any) => {
          //  if ( res ) {
          this.updatestatus = '';
          this.IndentData = res.result;
          this.editProducts = this.IndentData.products;
          // console.log('this.IndentData.products', this.IndentData.products);
          // this.IndentData.indent_status = [this.IndentData.indent_status];
          this.editProducts = this.IndentData.products.map(obj => {
            const t = {
              category_name: { category_id: obj.category_id, category_name: obj.category_name },
              product_name: { product_id: obj.product_id, product_name: obj.product_name },
              unit: { unit: obj.unit },
              mrp: obj.mrp,
              quantity: obj.quantity
            };
            return t;
          });
          const that = this;
          this.arr = this.editProducts.map((i) => {
            return that.BuildFormDynamic(i);
          });


          // console.log('==:>?,', this.IndentData);
          this.editindentForm.setControl('indent_id', this.formBuilder.control(this.IndentData.indent_id));
          this.editindentForm.setControl('indent_status', this.formBuilder.control(this.IndentData.indent_status));
          this.editindentForm.setControl('price', this.formBuilder.control(this.IndentData.order_total));
          this.editindentForm.setControl('updated_by', this.formBuilder.control(this.IndentData.updated_by));
          this.editindentForm.setControl('expected_date', this.formBuilder.control(this.IndentData.expected_date));
          this.editindentForm.setControl('delivered_date', this.formBuilder.control(this.IndentData.delivered_date));
          this.editindentForm.setControl('place', this.formBuilder.control(this.IndentData.place));
          this.editindentForm.setControl('pincode', this.formBuilder.control(this.IndentData.pincode));
          this.editindentForm.setControl('items', this.formBuilder.array(this.arr));
          this.editindentForm.setControl('comment', this.formBuilder.control(this.IndentData.comment));
          // const m = this.editindentForm;
          // console.log('form builder', m); // this.editOrderForm.get('items'));
        });
    }
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
          console.log(this.agencyList);
        }
      });
  }

  onItemSelect(event, t) {
    // console.log('event==================>', event);
    if (t === 'category') {
      const cid = {
        category_id: [event.category_id]
      };
      this.orderService.filterProductCategory(cid).subscribe(res => {
        // console.log('filtered product', res.product_name);
        const tmp: any = res;
        if (res) {
          this.products = tmp.product_name;
          this.unitDropval = tmp.units;
        }
      });
    } else if (t === 'product') {
      this.products.forEach(element => {
        if (element.product_id == event.product_id) {
          //this.indentModal.quantity = 1;
          this.indentModal.price = element.mrp;
          this.indentModal.total_price = parseInt(this.indentModal.total_price, 10) + parseInt(element.mrp, 10);
        }
      });
    } else if (t === 'quantity') {
      if (event) {
        this.indentModal.total_price = parseInt(this.indentModal.total_price, 10) + parseInt(event.target.value, 10) * parseInt(this.indentModal.price, 10);
      } else {
        this.indentModal.total_price = 0;
      }
    }

  }

  addMoreProduct() {

    if (this.indentModal.category && this.indentModal.products && this.indentModal.quantity) {
      const t = {
        category: this.indentModal.category,
        products: this.indentModal.products,
        quantity: this.indentModal.quantity,
        price: this.indentModal.price
      };

      const tt = {
        product_id: this.indentModal.products[0].product_id,
        quantity: this.indentModal.quantity,
        mrp: this.indentModal.price
      };

      this.apiProdArr.push(tt);

      this.formdataarray.push(t);
      //  console.log(this.formdataarray);
      this.indentModal.category = '';
      this.indentModal.products = '';
      this.indentModal.quantity = '';
      this.indentModal.price = '';

      this.addmoreprod = '';
    } else {
      this.addmoreprod = 'Missing mandatory field...';
    }
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

  addMoreIndent(vall) {
    this.formdata = vall;

    const t = {
      category: vall.category[0].category_name,
      products: vall.products[0].product_name,
      units: vall.units,
      quantity: vall.quantity,
      price: vall.price
    };

    const tt = {
      product_id: vall.products[0].product_id,
      quantity: vall.quantity,
      mrp: vall.price
    };

    this.apiProdArr.push(tt);

    this.formdataarray.push(t);
    let tprc = 0;
    this.formdataarray.forEach(itm => {
      tprc = tprc + itm.price;
    });

    this.ShowAddMoreIndents = true;
    this.indentModal.total_price = tprc;
    if (this.indentModal.state) { } else {
      this.indentModal.state = 'Karnataka';
    }

    if (this.indentModal.place) { } else {
      this.indentModal.place = 'Abbani';
    }

    if (this.indentModal.pincode) { } else {
      this.indentModal.pincode = '560037';
    }

    if (this.indentModal.district) { } else {
      this.indentModal.district = 'Kolar';
    }
    // this.orderForm.reset();
    this.indentModal.quantity = '';
    this.indentModal.category = '';
    this.indentModal.products = '';
    this.indentModal.units = '';
    this.indentModal.price = '';
  }

  async submitIndentForm(val) {
    // console.log('indent form submited', val.on_behalf);

    let chk = true;
    let finalObj: any = {};
    finalObj.on_behalf_of = val.on_behalf;
    if (this.toggleOrderedFor === 'agency') {
      finalObj.order_for = 'agency';
      finalObj.order_total = val.total_order;
      finalObj.expected_date = val.expected_date;
      finalObj.ordered_for_id = val.ordered_for[0].agency_id;
    } else {
      finalObj.order_for = 'external user';
      finalObj.order_total = val.total_order;
      finalObj.expected_date = val.expected_date;
      finalObj.order_for_name = val.ordered_for_other;
      finalObj.place = val.place;
      finalObj.pincode = val.pincode;
      finalObj.district = val.district;
      finalObj.state = val.state;
    }

    if (this.indentModal.category && this.indentModal.products && this.indentModal.quantity && this.indentModal.price >= 0) {
      const tt = {
        product_id: this.indentModal.products[0].product_id,
        quantity: this.indentModal.quantity,
        mrp: this.indentModal.price
      };

      this.apiProdArr.push(tt);
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

      // console.log('Final obj', finalObj);

      this.orderService.createIndent(finalObj).subscribe(async res => {
        // console.log('create order=>', res);
        const tmp: any = res;
        if (res) {
          console.log('add res', res);
          if (tmp.statusCode == 200) {
            this.toastr.success(res.message);
            //  this.closeModal();
            setTimeout(() => {
              this.modalclose();
            }, 1000);
          }
          this.orderformsubmitmessage = tmp.message;
        }

        let sendObjData = {
          "page": this.count,
          "limit": 10,
        }
        this.orderService.indentList(sendObjData);
        loader.dismiss();
      }, async error => {
        const tmp: any = error;
        this.toastr.error(tmp);
        loader.dismiss();
      });
    }
    // this.orderService.indentList();
  }

  editIndentOrder(val) {
    //  console.log('edit indent data', val);
  }

  modalclose() {
    this.pop.dismiss();

  }

  async updateIndent(val) {
    // console.log('ttttttttttt',val);
    const loader = await this.loadingCtrl.create({
      // duration: 2000
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
        quantity: parseInt(m.quantity, 10),
        mrp: m.mrp
      };
      return tt;
    });

    // console.log('p', val);
    const sendObjData = {
      indent_id: val.indent_id,
      indent_status: val.indent_status,
      products: p,
      expected_date: val.expected_date,
      delivered_date: val.delivered_date,
      comment: val.comment,
    };

    // console.log('val  ==>', sendObjData);
    this.orderService.indentUpdate(sendObjData).subscribe(async res => {
      const tmp: any = res;
      if (res) {
        // console.log('add res',res);
        if (tmp.statusCode == 200) {
          this.toastr.success(res.message);
          //this.closeModal();
          setTimeout(() => {
            this.modalclose();
          }, 1000);
        }
        this.updatestatus = tmp.message;
      }

      // const toast = await this.toastCtrl.create({
      //   showCloseButton: true,
      //   message: tmp.message,
      //   duration: 3000,
      //   position: 'top'
      // });
      // toast.present();
      loader.dismiss();
      let sendObjData = {
        "page": this.count,
        "limit": 10,
      }
      this.orderService.indentList(sendObjData);
    }, async error => {
      // console.log('oo--',error);
      const tmp: any = error;
      this.toastr.error(tmp);
      // const toast = await this.toastCtrl.create({
      //   showCloseButton: true,
      //   message: 'Error occurred...',
      //   duration: 3000,
      //   position: 'top'
      // });
      // toast.present();
      loader.dismiss();
    });

  };

  closeModal() {
    this.modal.dismiss();

  }

}
