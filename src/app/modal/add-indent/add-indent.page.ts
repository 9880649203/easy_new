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
  newupdterrormsg = '';
  buttonValidator = false;
  buttonValidatorArr = [];
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
  unit:any = [];
  company:any = [];
  // displaySettings = true;
  upOrderDta = {
    company: '',
    category: '',
    product: '',
    unit: '',
    quantity: '',
    mrp: ''
  };

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
  companydropdownSettings = {};
  agencydropdownSettings = {};
  categorydropdownSettings = {};
  productdropdownSettings = {};
  statedropDownSettings = {};
  districtdropDownSettings = {};
  toggleOrderedFor = '';
  unitCheck:boolean = true;
  companyDropDownSettings = {};
  addmoreeditproduct = false;

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
      closeDropDownOnSelection :true,
    };

    this.categorydropdownSettings = {
      singleSelection: true,
      idField: 'category_id',
      textField: 'category_name',
      allowSearchFilter: true,
      closeDropDownOnSelection :true,
    };

    this.productdropdownSettings = {
      singleSelection: true,
      idField: 'product_id',
      textField: 'product_name',
      allowSearchFilter: true,
      closeDropDownOnSelection :true,
    };

    this.statedropDownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true,
      closeDropDownOnSelection :true,
    
    };

    this.districtdropDownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true,
      closeDropDownOnSelection :true,
    };


    this.companyDropDownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true
    };

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true
    };

    this.pop = navParams.get('modelController');
    // console.log('pop', this.pop);

    // this.orderService.filterProductCategory({}).subscribe(res => {
    //   let tmp: any = res;
    //   if (res) {
    //     this.category = tmp.category_name;
    //     this.products = tmp.product_name;
    //     this.unit = tmp.units;
    //     this.company = tmp.company_name;
    //   }
    //   // console.log('=====>Dilip', res );
    // });

    this.orderService.filterProductCategory({}).subscribe(res => {
      console.log("indent ",res)
      let tmp: any = res;
      if (res) {
        this.category = tmp.category_name;
        this.products = tmp.product_name;
       // this.unit = tmp.units;
        this.company = tmp.company_name;
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
      ordered_for_other: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(30)]),
      on_behalf: new FormControl(),
      category: new FormControl('', [Validators.required]),
      products: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      unit: new FormControl('', [Validators.required]),
      company: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      expected_date: new FormControl(),
      delivered_date: new FormControl(),
      place: new FormControl(),
      pincode: new FormControl(),
      district: new FormControl(),
      state: new FormControl(),
      total_order: new FormControl(),
      total_price: new FormControl(),
      order_for_mobile:new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]),
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
      indent_status: new FormControl('', [Validators.required]),
      price: '',
      updated_by: '',
      expected_date: '',
      delivered_date: '',
      place: '',
      pincode: '',
      district: '',
      state: '',
      comment: '',
      //items: null
      company: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      products: new FormControl('', [Validators.required]),
      unit: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      mrp: new FormControl('', [Validators.required]),
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
          this.indentModal.order_total = this.IndentData.order_total;

          // if(this.IndentData.expected_date.length > 10){
          //   this.IndentData.expected_date = this.convert(this.IndentData.expected_date);
          // }

          if(this.IndentData.expected_date){
            this.IndentData.expected_date = this.IndentData.expected_date.slice(0,10);
          }

          this.editProducts = this.IndentData.products.map(obj => {
            const t = {
              company: obj.company_name,
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
          //this.editindentForm.setControl('price', this.formBuilder.control(this.IndentData.order_total));
          this.editindentForm.setControl('updated_by', this.formBuilder.control(this.IndentData.updated_by));
          this.editindentForm.setControl('expected_date', this.formBuilder.control(this.IndentData.expected_date));
          this.editindentForm.setControl('delivered_date', this.formBuilder.control(this.IndentData.delivered_date));
          this.editindentForm.setControl('place', this.formBuilder.control(this.IndentData.place));
          this.editindentForm.setControl('pincode', this.formBuilder.control(this.IndentData.pincode));
          this.editindentForm.setControl('items', this.formBuilder.array(this.arr));
          if(this.IndentData.comment){
             this.editindentForm.setControl('comment', this.formBuilder.control(this.IndentData.comment));
          } else {
            this.editindentForm.setControl('comment', this.formBuilder.control(''));
          }
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
          // console.log(this.agencyList);
        }
      });
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    // console.log("date new", [day, mnth, date.getFullYear()].join("-"));
    return [day, mnth, date.getFullYear()].join("-");
  }

  isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
  }

  // onItemSelect(event, t) {
  //   // console.log('event==================>', event);
  //   if (t === 'category') {
  //     const cid = {
  //       category_id: [event.category_id]
  //     };
  //     this.orderService.filterProductCategory(cid).subscribe(res => {
  //       // console.log('filtered product', res.product_name);
  //       const tmp: any = res;
  //       if (res) {
  //         this.products = tmp.product_name;
  //         this.unitDropval = tmp.units;
  //       }
  //     });
  //   } else if (t === 'product') {
  //     this.products.forEach(element => {
  //       if (element.product_id == event.product_id) {
  //         //this.indentModal.quantity = 1;
  //         this.indentModal.price = element.mrp;
  //         this.indentModal.total_price = parseInt(this.indentModal.total_price, 10) + parseInt(element.mrp, 10);
  //       }
  //     });
  //   } else if (t === 'quantity' || t === 'mrp') {
      
  //     if (this.indentModal.quantity && this.indentModal.price) {
  //         //console.log(this.indentModal.price, this.indentModal.quantity);
  //         this.indentModal.total_order = parseInt(this.indentModal.price, 10) * parseInt(this.indentModal.quantity, 10);
  
  //         if(this.apiProdArr.length) {         
  //           this.apiProdArr.forEach( r =>{
  //             this.indentModal.total_order += parseInt(r.mrp, 10) * parseInt(r.quantity, 10);
  //           });
  //         }
  //     } else if(this.apiProdArr.length) {
  //       this.indentModal.total_order = 0;
  //       this.apiProdArr.forEach( r =>{
  //         this.indentModal.total_order += parseInt(r.mrp, 10) * parseInt(r.quantity, 10);
  //       });
  //     }
  //   } 
  // }


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
           this.company = tmp.company_name;
          //  this.unitDropval = tmp.units;
         }
       });
     }  
      else if(t === 'company'){
       const cid = {
         comapny_name: event.company
       };
       this.orderService.filterProductCategory(cid).subscribe(res => {
       
         var tmp:any =res;
         //console.log("res company",res);
        this.category = tmp.category_name;
          var tmparr =[];
          tmp.product_name.forEach((ele)=>{
            if(ele.company_name == event ){
             tmparr.push(ele);
            } 
          });
         // console.log("res company",tmparr);
          this.products = tmparr;
        
      });
     } 
     
     
     else if (t === 'product') {
       const cid = {
         product_id: [event.product_id]
       };
       this.orderService.filterProductCategory(cid).subscribe(res => {
         //console.log("res product",res);
         var tmp:any =res;
         this.unitCheck = false;
         this.unit = tmp.units;
         this.category = tmp.category_name;
         this.company =tmp.company_name;
      });
       
       this.products.forEach(element => {
         
         if (element.product_id == event.product_id) {
           //this.indentModal.quantity = 1;
           this.indentModal.price = element.mrp;
           this.indentModal.total_price = parseInt(this.indentModal.total_price, 10) + parseInt(element.mrp, 10);
         }
       });
     } else if (t === 'quantity' || t === 'mrp') {
       
       if (this.indentModal.quantity && this.indentModal.price) {
           //console.log(this.indentModal.price, this.indentModal.quantity);
           this.indentModal.total_order = parseInt(this.indentModal.price, 10) * parseInt(this.indentModal.quantity, 10);
   
           if(this.apiProdArr.length) {         
             this.apiProdArr.forEach( r =>{
               this.indentModal.total_order += parseInt(r.mrp, 10) * parseInt(r.quantity, 10);
             });
           }
       } else if(this.apiProdArr.length) {
         this.indentModal.total_order = 0;
         this.apiProdArr.forEach( r =>{
           this.indentModal.total_order += parseInt(r.mrp, 10) * parseInt(r.quantity, 10);
         });
       }
     } 
   }


  validateSubmitButton(tt) {
      if(tt == 'agency'){  
            this.indentForm.controls['ordered_for_other'].clearValidators();
            this.indentForm.controls['ordered_for_other'].updateValueAndValidity();
            this.indentForm.controls['order_for_mobile'].clearValidators();
            this.indentForm.controls['order_for_mobile'].updateValueAndValidity();
            this.indentForm.controls['ordered_for'].setValidators([Validators.required]);
            this.indentForm.controls['ordered_for'].updateValueAndValidity();
      } else if( tt == 'others'){
          this.indentForm.controls['ordered_for'].clearValidators();
          this.indentForm.controls['ordered_for'].updateValueAndValidity();
          this.indentForm.controls['ordered_for_other'].setValidators([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(30)]);
          this.indentForm.controls['ordered_for_other'].updateValueAndValidity();
          this.indentForm.controls['order_for_mobile'].setValidators([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]);
          this.indentForm.controls['order_for_mobile'].updateValueAndValidity();
      }
      
  }

  // addMoreProduct() {
  //   this.indentForm.controls['category'].clearValidators();
  //   this.indentForm.controls['category'].updateValueAndValidity();
  //   this.indentForm.controls['products'].clearValidators();
  //   this.indentForm.controls['products'].updateValueAndValidity();    
  //   this.indentForm.controls['quantity'].clearValidators();
  //   this.indentForm.controls['quantity'].updateValueAndValidity();

  //   if (this.indentModal.category && this.indentModal.products && this.indentModal.quantity) {
  //     const t = {
  //       category: this.indentModal.category,
  //       products: this.indentModal.products,
  //       quantity: this.indentModal.quantity,
  //       price: this.indentModal.price
  //     };

  //     const tt = {
  //       product_id: this.indentModal.products[0].product_id,
  //       quantity: this.indentModal.quantity,
  //       mrp: this.indentModal.price
  //     };

  //     this.apiProdArr.push(tt);

  //     this.formdataarray.push(t);
  //     //  console.log(this.formdataarray);
  //     this.indentModal.category = '';
  //     this.indentModal.products = '';
  //     this.indentModal.quantity = '';
  //     this.indentModal.price = '';

  //     this.addmoreprod = '';
  //   } else {
  //     this.addmoreprod = 'Missing mandatory field...';
  //   }
  // }

  addMoreProduct() {
    this.indentForm.controls['category'].clearValidators();
    this.indentForm.controls['category'].updateValueAndValidity();
    this.indentForm.controls['products'].clearValidators();
    this.indentForm.controls['products'].updateValueAndValidity();    
    this.indentForm.controls['quantity'].clearValidators();
    this.indentForm.controls['quantity'].updateValueAndValidity();
    this.indentForm.controls['company'].clearValidators();
    this.indentForm.controls['company'].updateValueAndValidity();
    this.indentForm.controls['unit'].clearValidators();
    this.indentForm.controls['unit'].updateValueAndValidity();

    if (this.indentModal.category && this.indentModal.products && this.indentModal.quantity) {
      const t = {
        category: this.indentModal.category,
        products: this.indentModal.products,
        quantity: this.indentModal.quantity,
        price: this.indentModal.price,
        company:this.indentModal.company,
        unit:this.indentModal.units,
      };

      const tt = {
        product_id: this.indentModal.products[0].product_id,
        quantity: this.indentModal.quantity,
        mrp: this.indentModal.price,
        
      };

      this.apiProdArr.push(tt);

      this.formdataarray.push(t);
      //  console.log(this.formdataarray);
      this.indentModal.category = '';
      this.indentModal.products = '';
      this.indentModal.quantity = '';
      this.indentModal.price = '';
      this.indentModal.company = '';
      this.indentModal.units = '';

      this.addmoreprod = '';
    } else {
      this.addmoreprod = 'Missing mandatory field...';
    }

    this.orderService.filterProductCategory({}).subscribe(res => {
      const tmp: any = res;
      this.unitCheck = true;
     // console.log("only category res",res);
      if (res) {
        this.category = tmp.category_name;
          this.products = tmp.product_name;
         this.company = tmp.company_name;
      }
    });

  }

  BuildFormDynamic(item): FormGroup {
    return this.formBuilder.group({
      category: new FormControl(item.category_name, [Validators.required]), 
      products: item.product_name,
      unit: item.unit,
      quantity: item.quantity,
      mrp: item.mrp,
    });
  }

  // addMoreIndent(vall) {
  //   this.formdata = vall;

  //   const t = {
  //     category: vall.category[0].category_name,
  //     products: vall.products[0].product_name,
  //     units: vall.units,
  //     quantity: vall.quantity,
  //     price: vall.price
  //   };

  //   const tt = {
  //     product_id: vall.products[0].product_id,
  //     quantity: vall.quantity,
  //     mrp: vall.price
  //   };

  //   this.apiProdArr.push(tt);

  //   this.formdataarray.push(t);
  //   let tprc = 0;
  //   this.formdataarray.forEach(itm => {
  //     tprc = tprc + itm.price;
  //   });

  //   this.ShowAddMoreIndents = true;
  //   this.indentModal.total_price = tprc;
  //   if (this.indentModal.state) { } else {
  //     this.indentModal.state = 'Karnataka';
  //   }

  //   if (this.indentModal.place) { } else {
  //     this.indentModal.place = 'Abbani';
  //   }

  //   if (this.indentModal.pincode) { } else {
  //     this.indentModal.pincode = '560037';
  //   }

  //   if (this.indentModal.district) { } else {
  //     this.indentModal.district = 'Kolar';
  //   }
  //   // this.orderForm.reset();
  //   this.indentModal.quantity = '';
  //   this.indentModal.category = '';
  //   this.indentModal.products = '';
  //   this.indentModal.units = '';
  //   this.indentModal.price = '';
  // }

  addMoreIndent(vall) {
    this.formdata = vall;

    const t = {
      category: vall.category[0].category_name,
      products: vall.products[0].product_name,
      units: vall.units,
      quantity: vall.quantity,
      price: vall.price,
      company:vall.company,
      unit:vall.unit
    };

    const tt = {
      product_id: vall.products[0].product_id,
      quantity: vall.quantity,
      mrp: vall.price,
      company:vall.company,
      unit:vall.unit
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
    this.indentModal.company = '';
   
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

      this.orderService.createIndent(finalObj).subscribe(async res => {
        const tmp: any = res;
        if (res) {
          if (tmp.statusCode == 200) {
            this.toastr.success('Indent '+tmp.indent_id+ ' created successfully');
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
       // const tmp: any = error;
        //this.toastr.error(tmp);
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
    let chkfield = true;
    //const p = val.items.map(m => {
    if (this.upOrderDta.category && this.upOrderDta.product && this.upOrderDta.mrp && this.upOrderDta.quantity) {
      const t = {
        category_name: this.upOrderDta.category[0],
        product_name: this.upOrderDta.product[0],
        unit: { unit: this.upOrderDta.unit },
        mrp: this.upOrderDta.mrp,
        quantity: this.upOrderDta.quantity
      };
      this.editProducts.push(t);
    } else if(this.addmoreeditproduct){
      chkfield = false;
    }

    //const p = val.items.map(m => {
    const p = this.editProducts.map(m => {
      // const mp = Array.isArray(m.products) ? m.products[0] : m.products;
      // const mc = Array.isArray(m.category) ? m.category[0] : m.category;
      let mu;
      if (m.unit.unit) {
        mu = Array.isArray(m.unit.unit) ? m.unit.unit[0] : m.unit.unit;
      } else {
        mu = Array.isArray(m.unit) ? m.unit[0] : m.unit;
      }
      const tt = {
        product_id: m.product_name.product_id,
        product_name: m.product_name.product_name,
        cat_id: m.category_name.category_id,
        category_name: m.category_name.category_name,
        unit: mu,
        mrp: m.mrp,
        quantity: m.quantity
      };
      return tt;
    });

    const sendObjData = {
      indent_id: val.indent_id,
      indent_status: val.indent_status,
      order_total: this.indentModal.order_total,
      products: p,
      expected_date: val.expected_date,
      delivered_date: val.delivered_date,
      comment: val.comment,
    };

    if (chkfield) {
      const loader = await this.loadingCtrl.create({
        duration: 2000
      });
      loader.present();
    this.orderService.indentUpdate(sendObjData).subscribe(async res => {
      const tmp: any = res;
      if (res) {
        if (tmp.statusCode == 200) {
          this.toastr.success(res.message);

          setTimeout(() => {
            this.modalclose();
          }, 1000);
        }
        this.updatestatus = tmp.message;
      }

      loader.dismiss();
      let sendObjData = {
        "page": this.count,
        "limit": 10,
      }
      this.orderService.indentList(sendObjData);
    }, async error => {
      // const tmp: any = error;
      // this.toastr.error(tmp);
      loader.dismiss();
    });
  } else {
    this.newupdterrormsg = 'Missing mandatory fields.';
  }
  };

  closeModal() {
    this.modal.dismiss();
  }

  removeProduct(cat, prod) {
    const indx = this.formdataarray.findIndex( itm =>{
         return (itm.category[0].category_name == cat && itm.products[0].product_name == prod);
    });

    if(indx != -1) {
      this.formdataarray.splice(indx, 1);
      this.apiProdArr.splice(indx, 1);
    }

    if (this.indentModal.quantity && this.indentModal.price) {
      //console.log(this.indentModal.price, this.indentModal.quantity);
      this.indentModal.total_order = parseInt(this.indentModal.price, 10) * parseInt(this.indentModal.quantity, 10);

      if(this.apiProdArr.length) {         
        this.apiProdArr.forEach( r =>{
          this.indentModal.total_order += parseInt(r.mrp, 10) * parseInt(r.quantity, 10);
        });
      }
  } else if(this.apiProdArr.length) {
    this.indentModal.total_order = 0;
    this.apiProdArr.forEach( r =>{
      this.indentModal.total_order += parseInt(r.mrp, 10) * parseInt(r.quantity, 10);
    });
  }
    // console.log(this.formdataarray, indx);
  }

  onItemSelectEdit(e, q) {
    if (this.upOrderDta.mrp && this.upOrderDta.quantity) {
      this.indentModal.order_total = 0;
      this.editProducts.forEach(r => {
        this.indentModal.order_total += parseInt(r.mrp, 10) * parseInt(r.quantity, 10);
      });
      this.indentModal.order_total += parseInt(this.upOrderDta.mrp, 10) * parseInt(this.upOrderDta.quantity, 10);
    } else if(this.editProducts.length) {
      this.indentModal.order_total = 0;
      this.editProducts.forEach(r => {
        this.indentModal.order_total += parseInt(r.mrp, 10) * parseInt(r.quantity, 10);
      });
    }
  }

  addMoreProduct1() {
    const l = this.editProducts.length;

    //console.log(this.editProducts[l-1], l);
    let tmp = true;
    // this.editProducts.forEach( d =>{
    //      if(d.category[0] && d.mrp && d.product[0] && d.quantity && d.unit[0]) {}
    //      else { tmp = false; }
    // });

    if (this.upOrderDta.company && this.upOrderDta.category && this.upOrderDta.product && this.upOrderDta.mrp && this.upOrderDta.quantity) {
      // console.log(this.upOrderDta);
      const t = {
        company: this.upOrderDta.company,
        category_name: this.upOrderDta.category[0],
        product_name: this.upOrderDta.product[0],
        unit: { unit: this.upOrderDta.unit },
        mrp: this.upOrderDta.mrp,
        quantity: this.upOrderDta.quantity
      };
      this.editProducts.push(t);
      this.indentModal.order_total = 0;
      this.editProducts.forEach(r => {
        this.indentModal.order_total += parseInt(r.mrp, 10) * parseInt(r.quantity, 10);
      });


      this.upOrderDta = {
        company: '',
        category: '',
        product: '',
        mrp: '',
        unit: '',
        quantity: ''
      }
    } else {
      this.addmoreeditproduct = true;
      if (this.upOrderDta.company || this.upOrderDta.category || this.upOrderDta.product || this.upOrderDta.mrp || this.upOrderDta.quantity) { }
      else {
        this.upOrderDta = {
          company: '',
          category: '',
          product: '',
          mrp: '',
          unit: '',
          quantity: ''
        }
      }
    }

    console.log(this.editProducts);
  }

  removeProduct1(cat, prod) {

    const indx = this.editProducts.findIndex(itm => {
      return (itm.category_name.category_id == cat && itm.product_name.product_id == prod);
    });

    if (indx != -1) {
      this.editProducts.splice(indx, 1);
    }

    this.indentModal.order_total = 0;
    this.editProducts.forEach(r => {
      this.indentModal.order_total += parseInt(r.mrp, 10) * parseInt(r.quantity, 10);
    });
  }
  
  onItemSelect1(event, t) {
    this.products.forEach(element => {
      if (element.product_id == event.product_id) {
        this.upOrderDta.mrp = element.mrp;
        this.upOrderDta.unit = element.unit;
      }
    });
  }

}
