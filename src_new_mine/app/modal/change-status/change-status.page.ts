import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, NavController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { OrderService } from '../../service/order.service';
import { findIndex } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
selector: 'app-change-status',
templateUrl: './change-status.page.html',
styleUrls: ['./change-status.page.scss'],
})
export class ChangeStatusPage implements OnInit {
endpontaddress = 'http://134.209.147.129:3001';
idStatus: any = [];
successfullUpdate = '';
statusChangeChecker = '';
failedOperation = '';
current_status = '';
new_order_status = '';
status: any = [];
tmpSimilarityOption = [];
checksimilarity = false;
thisorder_status = '';
thisid = '';

constructor(public modal: ModalController,
    public popCtrl: PopoverController,
private formBuilder: FormBuilder,
private http: HttpClient, navParams: NavParams,
public orderService: OrderService) {
   const tt = navParams.get('orderData');
   this.thisorder_status = tt.order_status;
   this.thisid = tt.order_id;
   this.current_status = tt.order_status;
   this.new_order_status = tt.order_status;
}

ngOnInit() {

const role = JSON.parse(localStorage.getItem('user'));
// confirmed -> accepted
// processed -> completed

if (role.role === 'Admin') {
  this.status = ['Created', 'Cancelled', 'Accepted'];
} else {
this.status = ['Created','Cancelled'];
}

this.orderService._orderStatusChangeArr.subscribe(res => {
    this.tmpSimilarityOption = [];
    res.forEach(el => {
        const i = this.idStatus.findIndex(e => {
            return e.order_id == el.order_id;
        });
        console.log("el.order_status", el.order_status);
        if (i == -1) {
            this.current_status = el.order_status;
            this.new_order_status = el.order_status;
            this.tmpSimilarityOption.push(el.order_status);
            this.idStatus.push(el);
        }
    // console.log('el', el);
    });

    const itmp = this.idStatus.findIndex(e => {
        return e.order_id == this.thisid;
    });

    if( itmp == -1 ) {
        this.idStatus.push({order_id: this.thisid, order_status: this.thisorder_status});
    }
  
    if(this.current_status == 'Accepted' && role.role === 'Admin') {
        this.status = ['Accepted', 'Processed'];
    } else if(this.current_status == 'Processed' && role.role === 'Admin') {
        this.status = ['Processed', 'Completed'];
    } else if ( this.current_status == 'Completed' ) {
        this.status = ['Completed'];
    }

});

this.checksimilarity = this.tmpSimilarityOption.every((val, i, arr) => val === arr[0]);
// console.log('el', this.checksimilarity);
}

submitOrderForm() {
let j = [];
this.idStatus.forEach(r => {
    j.push(r.order_id);
});

const sendObjData = {
order_id: j,
current_status: this.current_status.toLowerCase(),
new_status: this.new_order_status.toLowerCase()
};

const token = localStorage.getItem('token');
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
    })
};
this.http
.post(this.endpontaddress + '/update_order_status', sendObjData, httpOptions)
.subscribe(res => {
// console.log('success', res);
const m: any = res;
this.successfullUpdate = m.message;
setTimeout(() => { this.successfullUpdate = ''; this.closeModal(); }, 2000);
}, error => {
// console.log('errrrr', error);
this.successfullUpdate = error.error.message;
});
}

setOrderType(event) {

const ci = this.status.findIndex( res => {
return res == this.current_status;
});

const si = this.status.findIndex( res => {
return res == event;
});
console.log('Current status: ', this.current_status);
const fi = si-ci;

if( fi == 1 || fi == 0 || ( this.current_status == 'Created' && fi ==2)){
this.statusChangeChecker = '';
} else {
    this.statusChangeChecker = 'Can not be change to '+ this.new_order_status;
    this.new_order_status = this.current_status;   
}
}

    closeModal() {
        this.orderService.filterOrder({});
        this.orderService._orderStatusChangeArr$.next([]);
        this.popCtrl.dismiss();
    }
}