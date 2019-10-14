import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../service/product.service';
@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.page.html',
  styleUrls: ['./admin-console.page.scss'],
})
export class AdminConsolePage {

  productInform = {
    category_name: '',
    Unit: '',
    product_name: '',
  };
  modalType: any;
  modal: ModalController;
  public admin_list: any;
  categorySettings: any = {};
  unitSettings: any = {};
  productSettings: any = {};
  newProductForm: FormGroup;
  CategoryName: any = [];
  UnitData: any = [];
  categoryObjId: any;
  categoryObjName: any;
  UnitList: any;
  productName = [];

  constructor(public popoverCtrl: PopoverController, private _serve: ProductService, navParams: NavParams, public renderer: Renderer) {
    this.modalType = navParams.get('modalType');
    this.modal = navParams.get('modalController');
    this.admin_list = navParams.get("viewAdmin");

  }

  ngOnInit() {
    this._serve.category_list().subscribe((res) => {
      this.CategoryName = res.message;
    });
    this._serve.filterData("").subscribe((ele) => {
      //console.log("ese", ele);
      this.UnitData = ele.units;
      this.productName = ele.product_name;
    });

    this.newProductForm = new FormGroup({
      category_name: new FormControl('', [Validators.required]),
      Unit: new FormControl('', [Validators.required]),
      product_name: new FormControl('', [Validators.required]),
    });
    this.categorySettings = {
      singleSelection: true,
      idField: 'category_id',
      textField: 'category_name',
      allowSearchFilter: true
    };

    this.productSettings = {
      singleSelection: true,
      idField: 'product_name',
      textField: 'product_name',
      allowSearchFilter: true
    };

    this.unitSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true
    };
  }

  onCategorySelect(item: any) {
    this.categoryObjId = item.category_id;
    this.categoryObjName = item.category_name;
  }
  onUnitSelect(item: any) {
    this.UnitList = item;
  }
  closeModal() {
    this.modal.dismiss();
  }


}

