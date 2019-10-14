import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import * as FileSaver from 'file-saver';
// import { OrderActionsPage } from '../../modal/order-actions/order-actions.page';
import { AddOrderPage } from '../../modal/add-order/add-order.page';
import { AddIndentPage } from '../../modal/add-indent/add-indent.page';
import { OrderService } from '../../service/order.service';
import { RoleBaseAccesService } from '../../service/role-base-acces.service';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController
} from '@ionic/angular';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { IndentActionsPage } from '../../modal/indent-actions/indent-actions.page';
import { LoadingController } from '@ionic/angular';
import { OrderActionsPage } from '../../modal/order-actions/order-actions.page';
import * as $ from 'jquery';
const endpointAddress = 'http://134.209.147.129:3001';
const token = localStorage.getItem('token');

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: token
  })
};

// import { SearchFilterPage } from './filter/search-filter.page';
import { Router } from '@angular/router';
import { RestService } from 'src/app/service/rest.service';
import * as _ from 'underscore';
import { ChangeStatusPage } from '../../modal/change-status/change-status.page';
import { ConfigService } from 'src/app/service/config.service';

// import { OrderActionsPage } from '../order-actions/order-actions.page';

export class credit {
  public Order_Id: number;
  public Company_Name: string;
  public Brand_Name: string;
  public Agency_Name: string;
  public Price: number;
  public Unit: string;
  public Ordered_by: string;
  public Expected_Date: any;
  public Delivered_Date: any;
  public Created_Date: any;
  public ordered_for: string;
  public Place: string;
  public PinCode: number;
  public District: string;
  public State: string;
  public Farmer_id: number;
  public Field_Agent: string;
  public Category: string;
  public Products: string;
  public Quantity: string;
}
export class indcredit {
  public Indent_Id: number;
  public Company_Name: string;
  public Brand_Name: string;
  public Agency_Name: string;
  public Price: number;
  public Unit: string;
  public Ordered_by: string;
  public Expected_Date: any;
  public Delivered_Date: any;

  public ordered_for: string;
  public Place: string;
  public PinCode: number;
  public District: string;
  public State: string;
  public Farmer_id: number;
  public Field_Agent: string;
  public Category: string;
  public Products: string;
  public Quantity: string;
}
@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class OrderPage implements OnInit {
  limitOrder: number = 10;
  limitIndent: number = 10;
  checkStatusArr = [];
  datePickerConfig: Partial<BsDatepickerConfig>;
  Order_Manager_createcheck = 'order';
  openMenu: Boolean = false;
  toggleOrder = true;
  toggleIndent = true;
  public allrowdata: any[];
  public indentdata: any[];
  public data;
  credits: credit[];
  indCredits: indcredit[];
  role_access: any;
  totalOrderCount = 0;
  totalIndentCount = 0;
  orderTab: boolean = true;
  indTab: boolean = false;

  orderHeader: any = [];
  indentHeader: any = [];
  public gridOptions: GridOptions;
  public indGridOptions: GridOptions;
  searchKey = '';
  opendrop: boolean = false;
  checkboxes: any;
  // opendrop: boolean = false;
  LIMITS = [
    { key: '10', value: 10 },
    { key: '20', value: 20 },
    { key: '50', value: 50 },
    { key: '100', value: 100 }
  ];

  countpage = 1;
  Indcountpage = 1;

  count: number;
  countInd: number;

  public togglePage: boolean = false;
  totalCount: number;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modelCtrl: ModalController,
    public toastCtrl: ToastController,
    public orderService: OrderService,
    public http: HttpClient,
    public restService: RestService,
    public roleService: RoleBaseAccesService,
    public loadingController: LoadingController,
    public config: ConfigService
  ) {
    this.roleService.getRoles().then(data => {
      this.roleService._roleList$.subscribe(data => {
        let role = JSON.parse(localStorage.getItem('user')).role;
        if (data.length > 0) {
          this.roleService.role_list = []
          this.roleService.role_list = data.filter((item) => item.name === role)
          this.roleService.role_list = this.roleService.role_list[0].role;
          this.roleService.loggedInUser = this.roleService.role_list[0].name
          this.roleService.determineRoleBasedAccess();
          if (this.roleService.viewOrders || this.roleService.viewIndent) {
            this.togglePage = true;
          }
          else {
            this.togglePage = false;
          }
        }
      });
    })

    this.orderService._orderStatusChangeArr.subscribe(res => {
      this.checkStatusArr = res;
    });
    const sendObjData = {
      page: 0,
      limit: 10,
      userType: 'Agency Manager'
    };
    // this.restService.getUser(sendObjData).then(response => {
    // });
    this.restService.getFarmer('');

    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-default',
      showWeekNumbers: false,
      dateInputFormat: 'DD-MMM-YYYY'
    });

    this.role_access = JSON.parse(localStorage.getItem('user'));
    document.addEventListener('click', this.stoping.bind(this));
    // this.allrowdata = this.orderService.credits;
    // this.data = this.orderService.credits;
    this.gridOptions = <GridOptions>{
      // domLayout: 'autoHeight',
    };
    this.indGridOptions = <GridOptions>{
      // domLayout: 'autoHeight',
    };

    this.gridOptions.columnDefs = [
      {
        headerName: 'Actions',
        width: 150,
        cellRendererFramework: OrderActionsPage,
        cellRendererParams: { editOrder: true, viewOrder: true },
        suppressFilter: true,
        suppressSorting: true,
        suppressSizeToFit: true
      },
      {
        field: 'order_id',
        width: 120,
        headerName: 'Order Id',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'order_status',
        headerName: 'Status',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'order_by',
        headerName: 'Order by',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'order_for',
        headerName: 'Order For',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'order_date',
        headerName: 'Created Date',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'category_name',
        headerName: 'Category Name',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'product_name',
        headerName: 'Product Name',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'unit',
        headerName: 'Unit',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'quantity',
        headerName: 'Quantity ',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'delivered_date',
        headerName: 'Delivered Date',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'company_name',
        headerName: 'Company Name',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'brand_name',
        headerName: 'Brand Name',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'price',
        headerName: 'Price',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'agency_name',
        headerName: 'Agency Name',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'expected_date',
        headerName: 'Expected Date',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'place',
        headerName: 'Place',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'pincode',
        headerName: 'Pincode',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'district',
        headerName: 'District',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'state',
        headerName: 'State',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'comment',
        headerName: 'Notes',
        suppressSorting: true,
        suppressSizeToFit: true,
        editable: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
    ];

    this.indGridOptions.columnDefs = [
      {
        headerName: 'Actions',
        width: 125,
        cellRendererFramework: IndentActionsPage,
        cellRendererParams: { editIndent: true, viewIndent: true },
        // suppressFilter: true,
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'indent_id',
        headerName: 'Indent Id',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'indent_status',
        headerName: 'Status',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'order_by',
        headerName: 'Order by',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'order_for',
        headerName: 'Order for',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'order_date',
        headerName: 'Created Date',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'category_name',
        headerName: 'Category Name',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'product_name',
        headerName: 'Product Name',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'company_name',
        headerName: 'Company Name',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'brand_name',
        headerName: 'Brand Name',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'price',
        headerName: 'Price',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'unit',
        headerName: 'Unit',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },

      {
        field: 'agency_name',
        headerName: 'Agency Name',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'expected_date',
        headerName: 'Expected Date',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'delivered_date',
        headerName: 'Delivered Date',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },

      {
        field: 'place',
        headerName: 'Place',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'pincode',
        headerName: 'Pincode',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'district',
        headerName: 'District',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'state',
        headerName: 'State',
        suppressSorting: true,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        field: 'comment',
        headerName: 'Notes',
        suppressSorting: true,
        suppressSizeToFit: true,
        editable: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
    ];
    this.gridOptions.localeText = { noRowsToShow: 'No order to show' };
    this.gridOptions.rowData = this.allrowdata;
    this.gridOptions.rowHeight = 34;
    this.indGridOptions.rowData = [];
    this.indGridOptions.rowHeight = 34;
    this.orderHeader = this.gridOptions.columnDefs;
    this.indentHeader = this.indGridOptions.columnDefs;

    this.orderHeader = this.gridOptions.columnDefs.filter((item) => item.headerName !== 'Order Id');
    this.indentHeader = this.indGridOptions.columnDefs.filter((item) => item.headerName !== 'Indent Id');
    // this.totalCount = this.orderService.ListCount;
    //  this.totalIndentCount = this.orderService.ListIndCount;

    this.orderService._clear.subscribe((ele) => {
      // console.log('ele888', ele);
      this.openMenu = false;
    });

    this.orderService._clear_order.subscribe((ele) => {
      // console.log('ele888', ele);
      this.openMenu = false;
    });
  }

  ngOnInit() {
    this.getPaginatorData(this.countpage);
    this.getPaginatorIndData(this.Indcountpage);
    //  this.setPage(this.countpage);
    //this.setIndent(this.Indcountpage);
    this.orderService._order_list.subscribe(data => {
      // console.log('list filter',data)
      //  this.pager = this.getPager(this.totalCount, this.countpage);
     // console.log('28-08-2019', data);

      this.allrowdata = data;

      this.allrowdata = data.map((d) => {
        d.order_status = d.order_status.charAt(0).toUpperCase() + d.order_status.slice(1);
        d.order_for = d.order_for.charAt(0).toUpperCase() + d.order_for.slice(1);

        // if (d.expected_date.length > 10) {
        //   d.expected_date = this.convert(d.expected_date);
        // }
        // if (d.order_date.length > 10) {
        //   d.order_date = this.convert(d.order_date);
        // }
        // // d.order_date = this.convert(d.order_date);
        // d.updated_at = this.convert(d.updated_at);

        if (d.expected_date ) {
          d.expected_date = d.expected_date.slice(0,10);
        }
        if (d.order_date) {
          d.order_date = d.order_date.slice(0,10);
        }
       
       if( d.updated_at) {
        d.updated_at = d.updated_at.slice(0,10);
       }
        let row = d.products.map((p) => {

          let a = { ...d, ...p };
          delete a.products;
          return a;
        });
        return row;
      }).flat();
      setTimeout(() => {
        this.gridOptions.api.setRowData(this.allrowdata);
      }, 500);
      //console.log("order final list", this.allrowdata)
    });

    this.orderService._indent_list.subscribe(data => {
      //console.log("data",data);
      //  this.pagerInd = this.getPager(this.totalIndentCount, this.Indcountpage);
      this.indentdata = data;

      this.indentdata = data.map((d) => {

        d.indent_status = d.indent_status.charAt(0).toUpperCase() + d.indent_status.slice(1);
        d.order_for = d.order_for.charAt(0).toUpperCase() + d.order_for.slice(1);

        // if (d.expected_date.length > 10) {
        //   d.expected_date = this.convert(d.expected_date);
        // }
        // if (d.order_date.length > 10) {
        //   d.order_date = this.convert(d.order_date);
        // }
       // d.expected_date = this.convert(d.expected_date);
        // d.order_date = this.convert(d.order_date);
       // d.updated_at = this.convert(d.updated_at);


       if (d.expected_date) {
        d.expected_date = d.expected_date.slice(0,10);
      }
      if (d.order_date) {
        d.order_date = d.order_date.slice(0,10);
      }

      if(d.updated_at){
        d.updated_at = d.updated_at.slice(0,10);
      }

     let row = d.products.map((p) => {

          let a = { ...d, ...p };
          delete a.products;
          return a;
        });
        return row;
      }).flat();
    });

    this.orderService._totalCount.subscribe(res => {
      this.totalCount = res;
    });
    this.orderService._initializeIndentCount.subscribe(res => {
      this.totalIndentCount = res;
    });

  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    // console.log("date new", [day, mnth, date.getFullYear()].join("-"));
    return [day, mnth, date.getFullYear()].join("-");
  }

  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  }


  limit: number = this.LIMITS[0].value;
  rowLimits: Array<any> = this.LIMITS;



  // changeRowLimits(event) {
  //   this.limit = event.target.value;
  //   this.orderService._page$.subscribe((res)=>{
  //    this.count = res;
  //   });
  //   const sendObjData = {
  //     page: this.count,
  //     limit: Number(this.limit),
  //   };
  //   this.orderService.orderList(sendObjData).then(data => {
  //     // this.totalOrderCount= data.order_count;
  //    });
  // }


  getPaginatorData(e) {
    // console.log('now',e);
    this.countpage = e.pageIndex;
    if (e.pageSize) {
      this.limitOrder = e.pageSize;
    }
    // console.log('now', this.countpage);
    let sendObjData = {
      "page": this.countpage,
      "limit": this.limitOrder
    }
    this.orderService._page$.next(this.countpage);

    this.orderService.orderList(sendObjData).then(data => {

    });

  }


  getPaginatorIndData(e) {
    this.Indcountpage = e.pageIndex;
    // console.log('now', this.countpage);
    if (e.pageSize) {
      this.limitIndent = e.pageSize;
    }
    let sendObjData = {
      "page": this.Indcountpage,
      "limit": this.limitIndent
    }
    this.orderService._totalIndPage$.next(this.Indcountpage);
    this.orderService.indentList(sendObjData).then(data => {
    });
  }




  // changeRowIndLimits(event) {
  //   this.limit = event.target.value;
  //   this.orderService._totalIndPage$.subscribe((res)=>{
  //    this.countInd = res;
  //   });
  //   const sendObjData = {
  //     page: this.countInd,
  //     limit: Number(this.limit),
  //   };
  //   this.orderService.indentList(sendObjData).then(data => {
  //     // this.totalOrderCount= data.order_count;
  //    });
  // }

  // displayDrop() {
  //   this.config.opendrop = !this.config.opendrop
  // }



  stoping(e) {
    if( this.opendrop){
       if (e.target.nodeName == 'ION-COL') {
         this.opendrop = false;
       }
       else if (e.target.nodeName == 'ION-ROW') {
         this.opendrop = false;
       }
       else if (e.target.nodeName == 'ION-CONTENT') {
         this.opendrop = false;
       }
     }
   };
 


  onClick(e) {
    // console.log(e)
    if (e.target.className == 'popup-menu-overlay in') {
      this.openMenu = false;
    }
    else if (e.target.nodeName == 'ION-CONTENT') {
      this.openMenu = false;
    }
  }


  gettingType(event) {
    console.log("clicked", event);
    console.log("clicked", event.tab.textLabel);
    if (event.tab.textLabel === "Orders") {
      this.orderTab = true;
      this.indTab = false;
    }
    else {
      this.orderTab = false;
      this.indTab = true;
    }
  }

  acceptCancelOrder() {
    return this.modelCtrl.create({
      component: ChangeStatusPage,
      backdropDismiss: false,
      componentProps: { modalType: 'acceptCancelOrder', message: 'passed message', modelController: this.modelCtrl }
    }).then(popover => popover.present());
  }

  addOrder(): Promise<void> {
    // console.log('clicked');

    return this.modelCtrl.create({
      component: AddOrderPage,
      backdropDismiss: false,
      cssClass: 'my-custom-modal-css',
      componentProps: { modalType: 'addOrder', message: 'passed message', modelController: this.modelCtrl }
    }).then(popover => popover.present());
  }

  addIndent(): Promise<void> {
    return this.modelCtrl.create({
      component: AddIndentPage,
      backdropDismiss: false,
      cssClass: 'my-custom-modal-css',
      componentProps: { modalType: 'addIndent', message: 'passed message', modelController: this.modelCtrl }
    }).then(popover => popover.present());
  }


  hideShowColumns(data) {
    const columns = this.gridOptions.columnApi.getAllColumns();
    const valueColumn = columns.filter(column => column.getColDef().headerName === data.headerName)[0];
    const newState = !valueColumn.isVisible();
    this.gridOptions.columnApi.setColumnVisible(valueColumn, newState);
    this.gridOptions.api.sizeColumnsToFit();
  }

  hideShowColumns1(data) {
    const columns = this.indGridOptions.columnApi.getAllColumns();
    const valueColumn = columns.filter(column => column.getColDef().headerName === data.headerName)[0];
    const newState = !valueColumn.isVisible();
    this.indGridOptions.columnApi.setColumnVisible(valueColumn, newState);
    this.indGridOptions.api.sizeColumnsToFit();
  }

  setOrderType(type) {
    if (type === 'indent') {
      this.toggleIndent = true;
      this.orderService._filter_type$.next('indent');
      this.toggleOrder = false;
    } else if (type === 'order') {
      this.toggleIndent = false;
      this.toggleOrder = true;
      this.orderService._filter_type$.next('order');
    } else {
      return;
    }
  }

  // ionViewWillEnter() {
  //   this.menuCtrl.enable(true);
  // }

  exportOrder():Promise<any> {
    let sendObjData = {};
    const token = localStorage.getItem('token');
    this.orderService._filterOrderKeys.subscribe(res =>{
      sendObjData = res;
    });
    
    const endpoint = 'http://134.209.147.129:3001';
    const constants = {
      xmlheaders: {
        headers: new HttpHeaders({
          Authorization: token,
          'Content-Type': 'application/json'
        }),
        responseType: 'blob' as 'blob'
       }
    };

    return this.http
    .post(endpoint + '/export_list_order', sendObjData, constants.xmlheaders)
    .toPromise()
    .then((data:any)=>{
const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    FileSaver.saveAs(new Blob([data], { type: type }), 'order-list.xlsx');
    })
    .catch((data:any)=>Promise.resolve())
  }

  exportIndent() {
    let sendObjData = {};
    const token = localStorage.getItem('token');
    this.orderService._filterIndentKeys.subscribe(res => {
      sendObjData = res;
    });
    const endpoint = 'http://134.209.147.129:3001';
    const constants = {  
      xmlheaders: {
        headers: new HttpHeaders({
          Authorization: token,
          'Content-Type': 'application/json'
        }),
        responseType: 'blob' as 'blob'
      }
    };
    this.http
      .post(endpoint + '/export_list_indent', sendObjData, constants.xmlheaders)
      .subscribe(data => {
        const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        FileSaver.saveAs(new Blob([data], { type: type }), 'indent-file.xlsx');
      });
  }

}
