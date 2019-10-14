import { Component, OnInit } from '@angular/core';
import { AddIndentPage } from '../add-indent/add-indent.page';
import { PopoverController, ModalController } from '@ionic/angular';
import { RoleBaseAccesService } from '../../service/role-base-acces.service';

@Component({
  selector: 'app-indent-actions',
  templateUrl: './indent-actions.page.html',
  styleUrls: ['./indent-actions.page.scss'],
})
export class IndentActionsPage implements OnInit {

  mainParams: any;
  constructor(private modalCtrl: ModalController,
    private roleService: RoleBaseAccesService, 
    ) { }

  agInit(params: any): void {
    this.mainParams = params;
    // console.log('mainParams', this.mainParams);
  }
  refresh(): boolean {
    return false;
  }
  openModal(data, type) {

  }
  openEditrole(data, type) {
    // console.log('edit ==>>', data.data);
    if (type === 'edit') {
      return this.modalCtrl.create({
        component: AddIndentPage,
        backdropDismiss: false,
        componentProps: { indentData: data.data, modalType: 'editIndent', modelController: this.modalCtrl }
      })
        .then(popover => popover.present());
    } else if (type === 'view') {
      return this.modalCtrl.create({
        component: AddIndentPage,
        backdropDismiss: false,
        componentProps: { indentData: data.data, modalType: 'viewIndent', modelController: this.modalCtrl }
      })
        .then(popover => popover.present());
    }
  }

  ngOnInit() {
  }

}
