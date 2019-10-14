import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController
} from '@ionic/angular';

import { Component, OnInit, Input, OnChanges, AfterViewInit, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { RoleBaseAccesService } from '../../service/role-base-acces.service';

import { ProductService } from '../../service/product.service';
import { GridOptions } from "ag-grid-community";
import { AuthenticationService } from '../../service/authentication.service';
import { DataManager, Query, ODataV4Adaptor } from "@syncfusion/ej2-data";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddProductPage } from '../../modal/add-product/add-product.page';
import { ProductActionPage } from '../../modal/product-action/product-action.page';
import * as _ from 'underscore';
import { LoadingController } from '@ionic/angular';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material';
import { ConfigService } from 'src/app/service/config.service';


export interface filterlist {
  type: any;
  displayName: any;
  value: any;
  id: any;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class ProductsPage {
  openMenu: Boolean = false;
  // faCoffee = faCoffee;
  //filter variables
  @ViewChild('search') searchTextBox: ElementRef;
  @Output() passdata = new EventEmitter<string>();
  searchCategoryControl = new FormControl();
  searchProductControl = new FormControl();
  searchBrandControl = new FormControl();
  searchCompanyControl = new FormControl();

  selectCategoryFormControl = new FormControl();
  selectProductFormControl = new FormControl();
  selectBrandFormControl = new FormControl();
  selectCompanyFormControl = new FormControl();

  filteredCategory: Observable<any[]>;
  filteredProduct: Observable<any[]>;
  filteredBrand: Observable<any[]>;
  filteredCompany: Observable<any[]>;
  selectedCategoryValues = [];
  selectedProductValues = [];
  selectedBrandValues = [];
  selectedCompanyValues = [];
  companyName = []; brandName = []; productName = []; CategoryName: any = [];
  selectedDataToFilter: any = {
    category_name: [], product_name: [], brand_name: [], company_name: [],
    category_id: [],
    product_id: []
  }
  filterList: filterlist[] = [];
  productHeader: any = [];
  toggling: boolean = false;
  removable = true;
  selectable = true;
  cat_id: any = [];
  productId: any = [];
  public filterTags: any = [];
  public filterFlag: boolean = false;
  public clearButtonFlag: Boolean = false;
  CategoryCount: any;
  ProductCount: any;
  allrowdata: any = [];
  rowdata: any = [];
  filterLength: number;
  agencyFilter: boolean = false;
  result;
  public gridOptions: GridOptions;
  selectedItems = [];
  newcat: any = [];
  countpage = 1;
  gridApi;
  gridColumnApi;
  opendrop: boolean = false;
  allItems: any[];
  count: any;
  checkboxes: any;
  // config.opendrop: boolean = false;
  totalCount: number;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  limit: number = 10;
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private authService: AuthenticationService, private route: ActivatedRoute,
    private userService: ProductService, private http: HttpClient,
    public roleService: RoleBaseAccesService,
    public loadingController: LoadingController,
    private toastr: ToastrService,
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
        }
      });
    })
    this.openMenu = false;
    document.addEventListener('click', this.stoping.bind(this));
    this.gridOptions = <GridOptions>{
      enableSorting: true,
      enableFilter: true,
      enableBrowserTooltips: true,
      suppressRowClickSelection: true,
      groupSelectsFiltered: true,
      resizable: true,
      //  domLayout: 'autoHeight',

    };

    this.gridOptions.columnDefs = [

      {
        headerName: "Action",
        field: "actions",
        cellRendererFramework: ProductActionPage,
        cellRendererParams: { viewProduct: true, editProduct: true },
        suppressFilter: true,
        suppressSorting: true,
        width: 110,
        suppressSizeToFit: true
      },

      {
        headerName: 'Product ID', field: 'product_id', sortable: true, filter: true, width: 130,
        tooltipField: "Product Id",
        suppressSizeToFit: true,

        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: 'Product Name', field: 'product_name', sortable: true, filter: true, width: 200,
        tooltipField: "Product",
        suppressSizeToFit: true,

        cellStyle: { color: 'black', fontSize: '14px' }
      },

      {
        headerName: 'Category Name', field: 'category_name', sortable: true, filter: true, width: 180,
        tooltipField: "Category Name",
        suppressSizeToFit: true,

        cellStyle: { color: 'black', fontSize: '14px' }
      },


      {
        headerName: 'Company Name', field: 'company_name', sortable: true, filter: true, width: 200,
        tooltipField: "Company Name",
        suppressSizeToFit: true,

        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: 'Brand Name', field: 'brand_name', sortable: true, filter: true, width: 130,
        tooltipField: "Brand Name",
        suppressSizeToFit: true,

        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: 'MRP', field: 'mrp', sortable: true, filter: true, width: 100,
        tooltipField: "MRP",
        suppressSizeToFit: true,

        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: 'Unit', field: 'unit', sortable: true, filter: true, width: 100,
        tooltipField: "Unit",
        suppressSizeToFit: true,

        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: 'Quantity', field: 'quantity', sortable: true, filter: true, width: 100,
        tooltipField: "Quantity",
        suppressSizeToFit: true,

        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: 'Availability', field: 'availability', sortable: true, filter: true, width: 130,
        tooltipField: "Availability",
        suppressSizeToFit: true,

        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: 'Expiry Date', field: 'expiry_date', sortable: true, filter: true, width: 160,
        tooltipField: "Expiry Date",
        suppressSizeToFit: true,

        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: 'Status', field: 'status', sortable: true, filter: true, width: 100,
        tooltipField: "status",
        suppressSizeToFit: true,

        cellStyle: { color: 'black', fontSize: '14px' }
      },





    ];
    this.gridOptions.localeText = { noRowsToShow: 'No Products to show' };
    this.gridOptions.rowData = this.rowdata;
    this.gridOptions.rowClass = 'my-green-class';
    this.gridOptions.rowHeight = 34;
    //this.productHeader = this.gridOptions.columnDefs;
    this.productHeader = this.gridOptions.columnDefs.filter((item) => {
      if (item.headerName === 'Product ID' && 'Action') {
        return false
      }
      else {
        return true
      }
    });



    this.userService.filterData().subscribe((ele) => {
      var result = ele.product_name.reduce((unique, o) => {
        if (!unique.some(obj => obj.product_name === o.product_name)) {
          unique.push(o);
        }
        return unique;
      }, []);


      var cat = ele.category_name.reduce((unique, o) => {
        if (!unique.some(obj => obj.category_name === o.category_name)) {
          unique.push(o);
        }
        return unique;
      }, []);


      this.userService._initializeCategory$.next(cat);
      this.userService._product$.next(result);
      this.userService._barnd$.next(ele.brand_name);
      this.userService._company$.next(ele.company_name);

    });


    this.filteredCategory = this.searchCategoryControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterCategory(name))
      );
    this.filteredProduct = this.searchProductControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterProduct(name))
      );
    this.filteredBrand = this.searchBrandControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterBrand(name))
      );
    this.filteredCompany = this.searchCompanyControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterCompany(name))
      );


  }


  ngOnInit() {
    this.userService._product_list.subscribe((res) => {
      //  console.log("res iam getting list", res);
      this.rowdata = res;
      this.countpage = 1;
    });
    this.userService._list$.subscribe((res) => {
      //console.log('page num', res)
      this.count = res;
    });

    this.getPaginatorData(this.countpage)
    this.userService._initializeCategory.subscribe(data => {
      data = data.filter(el => {
        return el != null;
      });
      //  console.log('category***', data)
      this.CategoryName = [];
      this.CategoryName = data;
      this.filteredCategory = this.searchCategoryControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filterCategory(name))
        );
    });
    this.userService._product.subscribe(data => {
      data = data.filter(el => {
        return el != null;
      });
      //   console.log('product***', data)
      this.productName = [];
      this.productName = data;
      this.filteredProduct = this.searchProductControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filterProduct(name))
        );
    });
    this.userService._barnd.subscribe(data => {
      data = data.filter(el => {
        return el != null;
      });
      // console.log('barand***', data)
      this.brandName = [];
      this.brandName = data
      this.filteredBrand = this.searchBrandControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filterBrand(name))
        );
    });

    this.userService._company.subscribe(data => {
      data = data.filter(el => {
        return el != null;
      });
      // console.log('company***', data)
      this.companyName = [];
      this.companyName = data
      this.filteredCompany = this.searchCompanyControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filterCompany(name))
        );
    });


  }


  addProduct(): Promise<void> {
    return this.modalCtrl.create({
      component: AddProductPage,
      backdropDismiss: false,
      componentProps: { message: 'passed message', modalType: 'addProduct', modalController: this.modalCtrl }
    })
      .then(popover => popover.present());
  }



  getPaginatorData(e) {
    // console.log('now',e);
    this.countpage = e.pageIndex;
    if (e.pageSize) {
      this.limit = e.pageSize;
    }
    // console.log('now', this.countpage);
    let sendObjData = {
      "page": this.countpage,
      "limit": this.limit
    }
    this.userService._list$.next(this.countpage);
    this.present('messagesService.loadMessagesOverview', 'Loading...').then(() => {
      this.userService.productList(sendObjData).subscribe(ele => {
        this.totalCount = ele.product_count;
        //console.log("this.length", this.totalCount);
        // this.pager = this.getPager(this.totalCount, e);
        var temp: any = ele;
        if (ele.statusCode == "200") {
          this.result = temp.message;
          this.rowdata = this.result.map(o => {
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
          this.allrowdata = this.rowdata;
          this.allItems = this.rowdata;
        }
      }, error => {
        // console.log('err', error);
        this.toastr.error(`there is some problem please try again later`);
        // setTimeout(() => {
        //   this.present('messagesService.loadMessagesOverview', 'Loading...')
        // }, 1000)
      });
    });
  }


  stoping(e) {
   // console.log(e);
  //  console.log("tttt", this.opendrop);
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
    //console.log(e)
    if (e.target.className == 'popup-menu-overlay in') {
      this.openMenu = false;
    }
    else if (e.target.nodeName == 'ION-CONTENT') {
      this.openMenu = false;
    }
  }



  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddProductPage,
      componentProps: { message: 'passed message', modalType: 'addProduct', modalController: this.modalCtrl }
    })
    await modal.present();

  }


  async present(loadingId: string, loadingMessage: string) {
    const loading = await this.loadingController.create({
      id: loadingId,
      message: loadingMessage,
      cssClass: 'custom-class custom-loading',
      spinner: 'lines-small',
      duration: 1000

    });
    return await loading.present();
  }

  async dismiss(loadingId: string) {
    return await this.loadingController.dismiss(null, null, loadingId);
  }


  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    //console.log("date new", [day, mnth, date.getFullYear()].join("-"));
    return [day, mnth, date.getFullYear()].join("-");
  }


  onItemSelect(e, ) {
    for (let i = 0; i <= this.productName.length; i++) {
      if (this.selectedItems[0].category_id === this.productName[i].category_id) {
        this.newcat = [];
        this.newcat.push(this.productName[i]);
        this.productName = this.newcat;
      }
    }
  }


  export() {
    const sendObjData = {
      'page': this.countpage,
      'limit': this.limit,
    };

    const endpoint = 'http://134.209.147.129:3001';
    const constants = {
      xmlheaders: {
        headers: new HttpHeaders({
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }),
        responseType: 'blob' as 'blob'
      }
    };
    this.http
      .post(endpoint + '/export_list_product', sendObjData, constants.xmlheaders)
      .subscribe(data => {
        const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        FileSaver.saveAs(new Blob([data], { type: type }), 'product-list.xlsx');
      });
  }


  hideShowColumns(data) {
    //   console.log('data', data);
    const columns = this.gridOptions.columnApi.getAllColumns();
    const valueColumn = columns.filter(column => column.getColDef().headerName === data.headerName)[0];
    const newState = !valueColumn.isVisible();
    this.gridOptions.columnApi.setColumnVisible(valueColumn, newState);
    this.gridOptions.api.sizeColumnsToFit();
  }



  // Used to filter data based on search input
  private _filterCategory(name: string): String[] {
    const filterValue = name.toString().toLowerCase();
    this.selectCategoryFormControl.patchValue(this.selectedCategoryValues);

    let filteredList = this.CategoryName.filter(option => option.category_name.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }
  private _filterProduct(name: string): String[] {
    const filterValue = name.toString().toLowerCase();
    this.selectProductFormControl.patchValue(this.selectedProductValues);
    let filteredList = this.productName.filter(option => option.product_name.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }
  private _filterBrand(name: string): String[] {
    const filterValue = name.toString().toLowerCase();
    this.selectBrandFormControl.patchValue(this.selectedBrandValues);
    let filteredList = this.brandName.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }

  private _filterCompany(name: string): String[] {
    const filterValue = name.toString().toLowerCase();
    this.selectCompanyFormControl.patchValue(this.selectedCompanyValues);
    let filteredList = this.companyName.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;

  }




  submit(e) {
    if (e.checked) {
      this.selectedDataToFilter.category_id.push(e.category_id);
    }

    else {
      for (let i = 0; i < this.selectedDataToFilter.category_id.length; i++) {
        if (this.selectedDataToFilter.category_id[i] == e.category_id) {
          this.selectedDataToFilter.category_id.splice(i, 1);
          break;
        }
      }
    }
    this.CategoryCount = this.selectedDataToFilter.category_id.length;
  }


  productSubmit(e) {
    if (e.checked) {
      this.selectedDataToFilter.product_id.push(e.product_id);
    }
    else {
      for (let i = 0; i <= this.selectedDataToFilter.product_id.length; i++) {
        if (this.selectedDataToFilter.product_id[i] == e.product_id) {
          this.selectedDataToFilter.product_id.splice(i, 1);
          break;
        }
      }
      return
    }
    this.ProductCount = this.selectedDataToFilter.product_id.length;
    // console.log('product id', this.selectedDataToFilter.product_id.map(String))

  }

  applyFilter() {
    let finalObject: any = {};
    Object.assign(finalObject, this.selectedDataToFilter);
    Object.keys(finalObject).forEach(key => {
      finalObject[key].length === 0 ? delete finalObject[key] : key
    });
    this.userService.productList(finalObject).subscribe(data => {
      //  console.log('filter data',data);
      if (data) {
        if (data.statusCode == '200') {
          this.rowdata = [];
          this.totalCount = data.message.length;
          this.userService._list$.subscribe((res) => {
            this.count = res;
          });
          data.message.forEach(o => {

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
              expiry_date: this.convert(new Date(o.expiry_date))

            };
            this.rowdata.push(tmp);
          });
        }
        else {
          this.totalCount = data.message.length;
          this.rowdata = [];
          this.allrowdata = [];
        }
      }
      else {
        this.totalCount = data.message.length;
        this.rowdata = [];
        this.allrowdata = [];
      }

    },
      error => {
        this.totalCount = 0;
        this.rowdata = [];
        this.allrowdata = [];
        console.log(error)
      }
    );
    this.togglePopupMenu();
  }

  selectionChange(event, type) {
    if (event.isUserInput && event.source.selected == false) {
      if (type == 'Category') {
        let indexCategory = this.selectedCategoryValues.indexOf(event.source.value);
        this.selectedCategoryValues.splice(indexCategory, 1)
        let index = this.selectedDataToFilter.category_name.indexOf(event.source.value)
        this.selectedDataToFilter.category_name.splice(index, 1);
      }

      if (type == 'Product') {
        let indexProduct = this.selectedProductValues.indexOf(event.source.value);
        this.selectedProductValues.splice(indexProduct, 1)
        let index = this.selectedDataToFilter.product_name.indexOf(event.source.value)
        this.selectedDataToFilter.product_name.splice(index, 1);
      }

      if (type == 'Brand') {
        let indexBrand = this.selectedBrandValues.indexOf(event.source.value);
        this.selectedBrandValues.splice(indexBrand, 1)
        let index = this.selectedDataToFilter.brand_name.indexOf(event.source.value)
        this.selectedDataToFilter.brand_name.splice(index, 1);
      }

      if (type == 'Company') {
        let indexCompany = this.selectedCompanyValues.indexOf(event.source.value);
        this.selectedCompanyValues.splice(indexCompany, 1)
        let index = this.selectedDataToFilter.company_name.indexOf(event.source.value)
        this.selectedDataToFilter.company_name.splice(index, 1)
      }

      let indexFilter = this.filterList.findIndex(x => x.displayName === event.source.value);
      this.filterList.splice(indexFilter, 1);

    }

    if (event.isUserInput && event.source._selected) {

      if (type == 'Category') {
        this.selectedDataToFilter.category_name = this.selectedDataToFilter.category_name.concat(event.source.value);
      }
      else if (type == 'Product') {
        this.selectedDataToFilter.product_name = this.selectedDataToFilter.product_name.concat(event.source.value);
      }
      else if (type == 'Company') {
        this.selectedDataToFilter.company_name = this.selectedDataToFilter.company_name.concat(event.source.value);
      }
      else if (type == 'Brand') {
        this.selectedDataToFilter.brand_name = this.selectedDataToFilter.brand_name.concat(event.source.value);
      }

      // console.log("testtttttt", this.selectedDataToFilter);

      let selected_data = { type: type, displayName: event.source.value, value: event, id: '' }
      if (this.filterList.indexOf(event.source.value) === -1) {
        this.filterList.push(selected_data);
      }

      if (this.filterList.length > 0) {
        this.filterLength = this.filterList.length;
        this.clearButtonFlag = true;
      } else {
        this.clearButtonFlag = false;
      }
    }
    if (event.source._selected == false) {
      let selected_data = { id: event.source.id, displayName: event.source.value, value: event }
    }
  }



  openedChangeCategory(e) {
    //  console.log('category', e);
    this.setSelectedValuesCategory();
    this.searchCategoryControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  };
  openedChangeProduct(e) {
    this.setSelectedValuesProduct();
    this.searchProductControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  };
  openedChangeBrand(e) {
    this.setSelectedValuesBrand();
    this.searchBrandControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }

  };


  openedChangeCompany(e) {
    this.setSelectedValuesCompany();
    this.searchCompanyControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }

  }

  setAgencyFilter() {
    this.agencyFilter = !this.agencyFilter;
  }

  /**
  * Clearing search textbox value
  */
  clearSearch(event) {
    event.stopPropagation();
    this.searchCategoryControl.patchValue('');

  }


  setSelectedValuesCategory() {
    //  console.log('ddddd', this.selectCategoryFormControl)
    if (this.selectCategoryFormControl.value && this.selectCategoryFormControl.value.length > 0) {
      this.selectCategoryFormControl.value.forEach((e) => {
        if (this.selectedCategoryValues.indexOf(e) == -1) {
          this.selectedCategoryValues.push(e);
        }
      });
    }
  }
  setSelectedValuesProduct() {
    if (this.selectProductFormControl.value && this.selectProductFormControl.value.length > 0) {
      this.selectProductFormControl.value.forEach((e) => {
        if (this.selectedProductValues.indexOf(e) == -1) {
          this.selectedProductValues.push(e);
        }
      });
    }
  }
  setSelectedValuesBrand() {
    if (this.selectBrandFormControl.value && this.selectBrandFormControl.value.length > 0) {
      this.selectBrandFormControl.value.forEach((e) => {
        if (this.selectedBrandValues.indexOf(e) == -1) {
          this.selectedBrandValues.push(e);
        }
      });
    }
  }


  setSelectedValuesCompany() {
    if (this.selectCompanyFormControl.value && this.selectCompanyFormControl.value.length > 0) {
      this.selectCompanyFormControl.value.forEach((e) => {
        if (this.selectedCompanyValues.indexOf(e) == -1) {
          this.selectedCompanyValues.push(e);
        }
      });
    }
  }



  onFiltering(e) {
    // cpublic onFiltering: EmitType = (e: FilteringEventArgs) => {
    let query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.CategoryName, query);
  }

  remove(filter): void {

    if (filter.type == 'Category') {
      let indexCategory = this.selectedCategoryValues.indexOf(filter.displayName);
      this.selectedCategoryValues.splice(indexCategory, 1)
      let index = this.selectedDataToFilter.category_name.indexOf(filter.displayName)
      this.selectedDataToFilter.category_name.splice(index, 1);
      this.selectedDataToFilter.category_id.splice(index, 1);
    }
    if (filter.type == 'Product') {
      let indexProduct = this.selectedProductValues.indexOf(filter.displayName);
      this.selectedProductValues.splice(indexProduct, 1);
      let index = this.selectedDataToFilter.product_name.indexOf(filter.displayName);
      this.selectedDataToFilter.product_name.splice(index, 1);
      this.selectedDataToFilter.product_id.splice(index, 1);

    }
    if (filter.type == 'Brand') {
      let indexBrand = this.selectedBrandValues.indexOf(filter.displayName);
      this.selectedBrandValues.splice(indexBrand, 1)
      let index = this.selectedDataToFilter.brand_name.indexOf(filter.displayName)
      this.selectedDataToFilter.brand_name.splice(index, 1)
    }
    if (filter.type == 'Company') {
      let indexCompany = this.selectedCompanyValues.indexOf(filter.displayName);
      this.selectedCompanyValues.splice(indexCompany, 1)
      let index = this.selectedDataToFilter.company_name.indexOf(filter.displayName)
      this.selectedDataToFilter.company_name.splice(index, 1)
    }


    let indexFilter = this.filterList.findIndex(x => {
      return (x.displayName === filter.displayName) && (x.type === filter.type);
    });
    this.filterList.splice(indexFilter, 1);
    if (this.filterList.length == 0) {

      this.clearButtonFlag = false;
      this.rowdata = this.allrowdata;

    } else {
      this.clearButtonFlag = true;
    }



  }
  filter(event) {
    if (this.filterList.indexOf(event) === -1) {

    }
    if (this.filterList.length > 0) {
      this.clearButtonFlag = true;
    } else {
      this.clearButtonFlag = false;
    }

  }
  clearFilter() {
    this.selectedDataToFilter.product_name = [];
    this.selectedDataToFilter.category_name = [];
    this.selectedDataToFilter.company_name = [];
    this.selectedDataToFilter.brand_name = [];
    this.selectedDataToFilter.category_id = [];
    this.selectedDataToFilter.product_id = [];
    this.selectCategoryFormControl.patchValue("");
    this.selectProductFormControl.patchValue("");
    this.selectBrandFormControl.patchValue("");
    this.selectCompanyFormControl.patchValue("");
    this.selectedCategoryValues = [];
    this.selectedProductValues = [];
    this.selectedBrandValues = [];
    this.selectedCompanyValues = [];
    this.filterList = [];



    if (this.filterList.length == 0) {
      this.clearButtonFlag = false;
    } else {
      this.clearButtonFlag = true;
    }

    let sendObjData = {
      "page": this.countpage,
      "limit": this.limit,
    }
    this.userService.productList(sendObjData).subscribe(data => {
      // console.log('eee', data);
      this.totalCount = data.product_count;
      this.rowdata = data.message.map(o => {
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
          expiry_date: this.convert(new Date(o.expiry_date))
        };
        return tmp;
      });
    });



  };

  togglePopupMenu() {
    return this.openMenu = !this.openMenu;

  }


}
