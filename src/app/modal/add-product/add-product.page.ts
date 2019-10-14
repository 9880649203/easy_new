import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';
import { ProductService } from '../../service/product.service';
import { Product } from '../../model/product.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

  newProductForm: FormGroup;
  showLoadingIndicator: boolean = false;

  productInform: Product = {
    product_id: '',
    brand_name: '',
    product_name: '',
    category_id: null,
    category_name: '',
    mrp: null,
    Unit: '',
    expiry: '',
    quantity: null,
    availability: 'Y',
    status: ''
  };
  productData: Product;
  productInformation: Product;
  count: number;
  //role_display:any = [];
  message: any;
  pop: PopoverController;
  modalType: any;
  CategoryName: any = [];
  modal: ModalController;
  result;
  public list: any;
  product_list: any;
  temp_id;
  datePickerConfig: Partial<BsDatepickerConfig>;
  selectedCity: any;
  UnitData: any = [];
  categorySettings: any = {};
  unitSettings: any = {};
  categoryObjId: any;
  categoryObjName: any;
  UnitList: any;
  diabledCat: boolean = true;
  rowdata: any = [];
  negativityCheck = false;
  searchValue: string;
  negativityEditCheck: any;
  negativityCheckQuantity: any;
  today = new Date();
  tomorrow: any;
  public error: any;
  statusCode:any;

  constructor(public popoverCtrl: PopoverController, navParams: NavParams, public loadingController: LoadingController,
    private toastr: ToastrService, private _serve: ProductService) {
    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-default',
      showWeekNumbers: false,
      dateInputFormat: 'DD-MM-YYYY',
      sunHighlight: true,
    });
    this.tomorrow = new Date(this.today.getTime() + 24 * 60 * 60 * 1000);
    this.message = navParams.get('message');
    this.modalType = navParams.get('modalType');
    this.modal = navParams.get('modalController');
    this.list = navParams.get("mylist");
    //console.log('list', this.list);
    this.productData = this.list;

    this._serve.filterData("").subscribe((ele) => {
      this.UnitData = ele.unit;
    });

    this._serve.category_list().subscribe((res) => {
      this.CategoryName = res.message;
    })


  }

  ngOnInit() {
    this.newProductForm = new FormGroup({
      brand_name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      product_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(30)]),
      expiry: new FormControl(''),
      mrp: new FormControl(''),
      product_id: new FormControl(''),
      category_id: new FormControl(''),
      category_name: new FormControl([[], Validators.required]),
      availability: new FormControl(''),
      Unit: new FormControl('', [Validators.required]),
      quantity: new FormControl(''),
      company_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(20)]),
      status: new FormControl(''),

    });
    this.formControlValueChanged();
    this.categorySettings = {
      singleSelection: true,
      idField: 'category_id',
      textField: 'category_name',
      allowSearchFilter: true,
      required: true,
      closeDropDownOnSelection: true
    };

    this.unitSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };

  
  }

 onCategorySelect(item: any) {
    // console.log('categoyr',item)
    this.categoryObjId = item.category_id;
    this.categoryObjName = item.category_name;
  }
  onUnitSelect(item: any) {
    this.UnitList = item;
  }



  closeModal() {
    this.modal.dismiss();
  }


  trimValue(formControl) {
    // console.log("formControl", formControl);
    //console.log("formControl", formControl.value)
    if (formControl.value == " " || undefined || null) {
      formControl.setValue(formControl.value.trim());
    }
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    // console.log("date new", [day, mnth, date.getFullYear()].join("-"));
    return [day, mnth, date.getFullYear()].join("-");
  }

  async present(loadingId: string, loadingMessage: string) {
    const loading = await this.loadingController.create({
      id: loadingId,
      message: loadingMessage,
      cssClass: 'custom-class custom-loading',
      spinner: 'lines-small',

    });
    return await loading.present();
  }

  async dismiss(loadingId: string) {
    return await this.loadingController.dismiss(null, null, loadingId);
  }

  productCreate() {
    const val = this.newProductForm.value;
    let sendObjData = {
      "product_name": val.product_name,
      "category_id": this.categoryObjId,
      "category_name": this.categoryObjName,
      "brand_name": val.brand_name,
      "mrp": val.mrp,
      "unit": this.UnitList,
      "quantity": val.quantity,
      "availability": val.availability,
      "expiry_date": val.expiry,
      "company_name": val.company_name,
      "status": "Active"
    }
    this._serve.createProduct(sendObjData).subscribe(ele => {
      console.log("update date",ele);
      if(ele.statusCode == 200){
        this.showLoadingIndicator = true;
        var temp: any = ele;
        this.showLoadingIndicator = false;
        this.result = temp.message;
        this.closeModal();
        this.toastr.success(`product ${ele.product_id} added successfully.`);
        this.productList(0);
      }
  
     },
      error => {
       this.closeModal();
      }
    );
  }



  productUpdate() {
    this._serve._list$.subscribe((res) => {
      this.count = res;
      // console.log("page", this.count)
    });


    const val = this.newProductForm.value;
    let sendObjData = {
      "product_id": val.product_id,
      "product_name": val.product_name,
      "company_name": val.company_name,
      "brand_name": val.brand_name,
      "mrp": val.mrp,
      "unit": this.UnitList,
      "quantity": val.quantity,
      "expiry_date": val.expiry,
      "availability": val.availability,
      "status": val.status,
    }
    this._serve.productUpdate(sendObjData).subscribe(ele => {
      if(ele.statusCode == 200){
     // console.log("eleffff",ele.statusCode);
      this.closeModal();
      this.toastr.success(`Product details for ${val.product_name} is modified successfully.`);
      }
     this.productList(this.count);
    },
      error => {
        console.log("msnd",error);
        this.closeModal();
      }
  )};



  productList(page) {
    let sendObjData = {
      "page": page,
      "limit": 10,
    }
    this.present('messagesService.loadMessagesOverview', 'Loading...').then(() => {
      this._serve.productList(sendObjData).subscribe(ele => {
        this.rowdata = ele.message.map(o => {
          let tmp = {
            product_id: o.product_id,
            product_name: o.product_name,
            // category_id: o.category_id,
            company_name: o.company_name,
            category_name: [o.category_name],
            brand_name: o.brand_name,
            mrp: o.mrp,
            unit: [o.unit],
            quantity: o.quantity,
            availability: o.availability,
            status: o.status,
            expiry_date: this.convert(new Date(o.expiry_date)),
          };
          return tmp;
        });
        this.dismiss('messagesService.loadMessagesOverview');
        let tmp = this.rowdata
        this._serve._product_list$.next(tmp);
      }, (error) => {
        //console.log(error)
      });
    });
  }


  onChange(data) {
    if (data < 0) {
      this.negativityEditCheck = true;
    } else {
      this.negativityEditCheck = false;
    }};

  onchanging(val) {
    if (val < 0) {
      this.negativityCheckQuantity = true;
    }
    else {
      this.negativityCheckQuantity = false;
    }
  }

  formControlValueChanged() {
    this.newProductForm.get('quantity').valueChanges.subscribe(
      (mode: any) => {
        if (mode < 0) {
          this.negativityCheck = true;
          setTimeout(() => {
            this.searchValue = "";
            this.negativityCheck = false;
          }, 1000);
        } else {
          this.negativityCheck = false;
        }
      });
  }
}