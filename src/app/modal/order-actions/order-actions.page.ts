import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { AddOrderPage } from '../add-order/add-order.page';
import { RoleBaseAccesService } from '../../service/role-base-acces.service';
import { OrderService } from '../../service/order.service';
import { ChangeStatusPage } from '../../modal/change-status/change-status.page';
@Component({
    selector: 'app-order-actions',
    templateUrl: './order-actions.page.html',
    styleUrls: ['./order-actions.page.scss'],
})
export class OrderActionsPage implements OnInit {

    mainParams: any;
    pop: any;
    constructor(private modalCtrl: ModalController,
        public orderService: OrderService,
        public popoverController: PopoverController,
        public modelCtrl: ModalController,
        public roleService: RoleBaseAccesService, ) { }

    agInit(params: any): void {
        this.mainParams = params;
    }
    refresh(): boolean {
        return false;
    }
    openModal(data, type) { }

    openEditrole(data, type) {
        // console.log('edit ==>>', data.data);
        if (type === 'edit') {
            return this.modalCtrl.create({
                component: AddOrderPage,
                backdropDismiss: false,
                cssClass: 'my-custom-modal-css',
                componentProps: { orderData: data.data, modalType: 'editOrder', modelController: this.modalCtrl }
            })
                .then(popover => popover.present());
        } else if (type === 'view') {
            return this.modalCtrl.create({
                component: AddOrderPage,
                backdropDismiss: false,
                cssClass: 'my-custom-modal-css',
                componentProps: { orderData: data.data, modalType: 'viewOrder', modelController: this.modalCtrl }
            })
                .then(popover => popover.present());
        }
    }

    ngOnInit() {
    }

    pushedOrderId(e, e11) {
        //  console.log(e.data);
        let tmp = [];
        this.orderService._orderStatusChangeArr.subscribe(res => {
            tmp = res;
        });

        if (e11.target.checked) {
            const t = {
                order_id: e.data.order_id,
                order_status: e.data.order_status,
                order_by: e.data.order_by,
                order_for: e.data.order_for
            };
            tmp.push(t);
            this.orderService._orderStatusChangeArr$.next(tmp);
        } else {
            const i = tmp.findIndex(obj => {
                return e.data.order_id === obj.order_id;
            });
            tmp.splice(i, 1);
            this.orderService._orderStatusChangeArr$.next(tmp);
        }

        this.orderService._orderStatusChangeArr.subscribe(res => {
            tmp = res;
        });

        // console.log('tmp', tmp);
    }

    async acceptCancelOrder(data) {

        const popover = await this.popoverController.create({
            component: ChangeStatusPage,
            backdropDismiss: false,
            componentProps: {orderData: data.data, modalType: 'acceptCancelOrder', message: 'passed message', modelController: this.modelCtrl },
            translucent: true
        });
        this.pop = popover;
        return await popover.present();
    }

    closeModel() {
        this.pop.dismiss();
    }

}
