import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { AddProductPage } from '../add-product/add-product.page';
import { RoleBaseAccesService } from '../../service/role-base-acces.service';

@Component({
  selector: 'app-product-action',
  templateUrl: './product-action.page.html',
  styleUrls: ['./product-action.page.scss'],
})
export class ProductActionPage implements OnInit {


  mainParams: any;
  constructor(private modalCtrl: ModalController, private roleService: RoleBaseAccesService, ) { }

  agInit(params: any): void {
    this.mainParams = params;
 }
  refresh(): boolean {
    return false;
  }

  openEditrole(data, type) {
    // console.log('edit ==>>', data.data);
    if (type === 'edit') {
      return this.modalCtrl.create({
        component: AddProductPage,
        backdropDismiss:false,
        componentProps: { mylist: data.data, modalType: 'editProduct', modelController: this.modalCtrl }
      })
        .then(popover => popover.present());
    } else if (type === 'view') {
      return this.modalCtrl.create({
        component: AddProductPage,
        backdropDismiss:false,
        componentProps: { mylist: data.data, modalType: 'viewProduct', modelController: this.modalCtrl }
      })
        .then(popover => popover.present());
    }
  }

  ngOnInit() {
  }

}