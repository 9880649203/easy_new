import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ModalController } from '@ionic/angular';
import { AddAgencyPage } from '../add-agency/add-agency.page';
import { AddFarmerPage } from '../add-farmer/add-farmer.page';
import { RoleBaseAccesService } from 'src/app/service/role-base-acces.service';


@Component({
  selector: 'app-action-table',
  templateUrl: './action-table.page.html',
  styleUrls: ['./action-table.page.scss'],
})
export class ActionTablePage implements ICellRendererAngularComp {

  mainParams: any
  loggedInUser: any
  editUser: boolean = true;
  editFieldAgent: boolean = true;
  editFarmer: boolean = true;
  constructor(private modalCtrl: ModalController, public roleService: RoleBaseAccesService) {
  }
  ngOnInit() {
  }

  openModalUser(request, viewType) {
    return this.modalCtrl.create({
      component: AddAgencyPage,
      componentProps: { data: request.data, modalType: viewType, modalController: this.modalCtrl }
    })
      .then(popover => popover.present());
  }
  openModalFarmer(request, viewType) {
    return this.modalCtrl.create({
      component: AddFarmerPage,
      componentProps: { data: request.data, modalType: viewType, modalController: this.modalCtrl }
    })
      .then(popover => popover.present());
  }
  agInit(params: any): void {
    this.mainParams = params;
  }

  refresh(): boolean {
    return false;
  }
}
