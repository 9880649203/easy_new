import { Component, OnInit, Output, Input, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker'

export interface filterlist {
  displayName: any;
  value: any;
  type: any;
}


@Component({
  selector: 'app-indent-filter',
  templateUrl: './indent-filter.component.html',
  styleUrls: ['./indent-filter.component.scss'],
})
export class IndentFilterComponent implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>

  @ViewChild('search') searchTextBox: ElementRef;

  selectedDataToFilter: any = {
    district: [],
    place: [], agency_name: [],
    field_agent_name: [], category_name: [], product_name: [],
    start_date: '', end_date: ''
  };


  CategoryName: any = [];
  productName = [];
  AgencyName = [];
  FieldAgent = [];
  openMenu: Boolean = false;

  selectDistrictFormControl = new FormControl();
  searchDistrictControl = new FormControl();

  selectPlaceFormControl = new FormControl();
  searchPlaceControl = new FormControl();

  selectAgencyFormControl = new FormControl();
  searchAgencyControl = new FormControl();

  selectFieldAgentFormControl = new FormControl();
  searchFieldAgentControl = new FormControl();

  selectCategoryFormControl = new FormControl();
  searchCategoryControl = new FormControl();

  selectProductFormControl = new FormControl();
  searchProductControl = new FormControl();

  selectOrderDateFormControl = new FormControl();
  searchOrderDateControl = new FormControl();

  selectedCategoryValues = [];
  selectedProductValues = [];
  selectedDistrictValues = [];
  selectedPlaceValues = [];
  selectedAgencyValues = [];
  selectedFieldAgentValues = [];
  selectedOrderDateValues = [];


  filteredCategory: Observable<any[]>;
  filteredProduct: Observable<any[]>;
  filteredOrderDate: Observable<any[]>;
  filteredDistrict: Observable<any[]>;
  filteredPlace: Observable<any[]>;
  filteredAgency: Observable<any[]>;
  filteredFieldAgent: Observable<any[]>;

  filters: filterlist[] = [];

  toggleIndent = true;
  toggleOrder = false;
  displayOrderContent = false;
  displayIndentContent = false;
  removable = true;
  public filterFlag = false;


  style = {
    marginTop: '20px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  };
  form: FormGroup;

  product = [];
  orderdate = [];
  district = [];
  place = [];

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  agencyFilter = false;

  @Output() autoSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output() groupFilters: EventEmitter<any> = new EventEmitter<any>();


  constructor(private fb: FormBuilder, private http: HttpClient,
    private orderService: OrderService) {
    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-default',
      showWeekNumbers: false,
      dateInputFormat: 'DD-MMM-YYYY'
    });

    this.orderService.getProducts().subscribe(res => {
      //   console.log('DATA FILTER', res);


      var filtered = res.district.filter(function (el) {
        return el != null;
      });
      // console.log('districtfilter',filtered);
      this.orderService._initializeDistrict$.next(filtered);
      this.place = res.place;

      // agency
      let tmpagency = [];
      res.agency_name.forEach(an => {
        if (an) { tmpagency.push(an.agency_name); }
      });
      this.orderService._initializeAgency$.next(tmpagency);
      // category
      let temp = [];
      res.category_name.forEach((v) => {
        if (v) {
          temp.push(v);
        }
      });

      this.orderService._initializeCategory$.next(temp);

      // field agent
      let tempfieldagent = [];
      res.field_agent.forEach(fan => {
        if (fan) { tempfieldagent.push(fan.order_by); }
      });
      this.orderService._initializeFieldAgent$.next(tempfieldagent);

      // product
      let prod = [];
      res.product_name.forEach((b) => {
        if (b) {
          prod.push(b);
        }
      });
      this.orderService._product$.next(prod);
      // console.log('product nnnn', prod);
    });


    this.filteredDistrict = this.searchDistrictControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterDistrict(name))
      );

    this.filteredPlace = this.searchPlaceControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterPlace(name))
      );

    this.filteredFieldAgent = this.searchFieldAgentControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterFieldAgent(name))
      );


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

    this.filteredAgency = this.searchAgencyControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterAgency(name))
      );




  }

  ngOnInit() {
    //   this.buildForm;

    this.orderService._initializeCategory.subscribe(data => {
      data = data.filter(el => {
        return el != null;
      });
      // console.log('category***', data );
      this.CategoryName = [];
      this.CategoryName = this.CategoryName.concat(data);
      this.filteredCategory = this.searchCategoryControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filterCategory(name))
        );
    });

    this.orderService._product.subscribe(data => {
      data = data.filter(el => {
        return el != null;
      });
      // console.log('product***', data );
      this.productName = [];
      this.productName = data;
      this.filteredProduct = this.searchProductControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filterProduct(name))
        );
    });

    this.orderService._initializeAgency.subscribe(data => {
      data = data.filter(el => {
        return el != null;
      });
      // console.log('Agency name***', data );
      this.AgencyName = [];
      this.AgencyName = data;
      this.filteredAgency = this.searchAgencyControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filterAgency(name))
        );
    });

    this.orderService._initializeFieldAgent.subscribe(data => {
      data = data.filter(el => {
        return el != null;
      });
      // console.log('Field Agent name***', data );
      this.FieldAgent = [];
      this.FieldAgent = data;
      this.filteredFieldAgent = this.searchFieldAgentControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filterFieldAgent(name))
        );
    });

    this.orderService._initializeDistrict.subscribe(data => {
      data = data.filter(el => {
        return el != null;
      });
      // console.log('district name***', data );
      this.district = [];
      this.district = data;
      this.filteredDistrict = this.searchDistrictControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filterDistrict(name))
        );
    });

    this.orderService._initializeDistrict.subscribe(data => {
      data = data.filter(el => {
        return el != null;
      });
      // console.log('place name***', data );
      this.place = [];
      this.place = data;
      this.filteredPlace = this.searchPlaceControl.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filterPlace(name))
        );
    });

  }

  setOrderType(type) {
    if (type == 'indent') {
      this.toggleIndent = true;
      this.toggleOrder = false;
    }
    else if (type == 'order') {
      this.toggleIndent = false;
      this.toggleOrder = true;
    }
    else return;
  }



  searchByFilter() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("filterAgency");
    filter = input.value.toUpperCase();
    ul = document.getElementById("filterAgencyList");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

  displayfilter(arg) {
    this.filterFlag = arg;
  }

  onItemSelect(item: any) {
    // console.log(item);
    // console.log('item select', this.selectedItems)
  }
  onSelectAll(items: any) {
    // console.log(items);
  }

  // buildForm() {
  //   this.form = this.fb.group({
  //     agency_name: new FormControl(''),
  //     place: new FormControl(''),
  //     district: new FormControl(''),
  //     state: new FormControl(''),
  //     product_name: new FormControl(''),
  //     category_name: new FormControl(''),
  //     start_date: new FormControl(''),
  //     end_date: new FormControl(''),
  //   });
  // }

  filter(dataa) {
    //  console.log("data is", dataa);
    //  console.log("clicked", this.form.value);
  }




  // applyFilter() {
  //   Object.keys(this.selectedDataToFilter).forEach(key => {
  //     this.selectedDataToFilter[key].length === 0 ? delete this.selectedDataToFilter[key] : key

  //   });
  //   //  console.log('filter**',this.selectedDataToFilter)


  //   this.passdata.emit(this.selectedDataToFilter);
  //   this.togglePopupMenu();


  // }

  private _filterDistrict(name: string): String[] {
    const filterValue = name.toLowerCase();
    this.selectDistrictFormControl.patchValue(this.selectedDistrictValues);
    const filteredList = this.district.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }

  private _filterPlace(name: string): String[] {
    const filterValue = name.toLowerCase();
    this.selectPlaceFormControl.patchValue(this.selectedPlaceValues);
    const filteredList = this.place.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }



  private _filterFieldAgent(name: string): String[] {
    const filterValue = name.toLowerCase();
    this.selectFieldAgentFormControl.patchValue(this.selectedFieldAgentValues);
    const filteredList = this.FieldAgent.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }

  // private _filterCategory(name: string): String[] {
  //   const filterValue = name.toString().toLowerCase();
  //   this.selectCategoryFormControl.patchValue(this.selectedCategoryValues);
  //   const filteredList = this.category.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  //   return filteredList;
  // }


  private _filterCategory(name: string): String[] {
    const filterValue = name.toString().toLowerCase();
    this.selectCategoryFormControl.patchValue(this.selectedCategoryValues);
    let filteredList = this.CategoryName.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }

  private _filterAgency(name: string): String[] {
    const filterValue = name.toString().toLowerCase();
    this.selectAgencyFormControl.patchValue(this.selectedAgencyValues);
    let filteredList = this.AgencyName.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }

  private _filterProduct(name: string): String[] {
    const filterValue = name.toString().toLowerCase();
    this.selectProductFormControl.patchValue(this.selectedProductValues);
    let filteredList = this.productName.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }

  clearSearch(event) {
    event.stopPropagation();
    this.searchAgencyControl.patchValue('');
  }


  selectionChange(event, type) {
    // console.log('Event', event);
    if (event.isUserInput && event.source.selected === false) {
      if (type === 'District') {
        const indexDistrict = this.selectedDistrictValues.indexOf(event.source.value);
        this.selectedDistrictValues.splice(indexDistrict, 1);
        const index = this.selectedDataToFilter.district.indexOf(event.source.value);
        this.selectedDataToFilter.district.splice(index, 1);
      }
      if (type === 'Place') {
        const indexPlace = this.selectedPlaceValues.indexOf(event.source.value);
        this.selectedPlaceValues.splice(indexPlace, 1);
        const index = this.selectedDataToFilter.place.indexOf(event.source.value);
        this.selectedDataToFilter.place.splice(index, 1);
      }

      if (type === 'Agency') {
        const indexAgency = this.selectedAgencyValues.indexOf(event.source.value);
        this.selectedAgencyValues.splice(indexAgency, 1);
        const index = this.selectedDataToFilter.agency_name.indexOf(event.source.value);
        this.selectedDataToFilter.agency_name.splice(index, 1);
      }

      if (type === 'Field_agent') {
        const indexFieldAgent = this.selectedFieldAgentValues.indexOf(event.source.value);
        this.selectedFieldAgentValues.splice(indexFieldAgent, 1);
        const index = this.selectedDataToFilter.field_agent_name.indexOf(event.source.value);
        this.selectedDataToFilter.field_agent_name.splice(index, 1);
      }

      // if (type === 'category') {
      //   const indexCategory = this.selectedCategoryValues.indexOf(event.source.value);
      //   this.selectedCategoryValues.splice(indexCategory, 1);
      //   const index = this.selectedDataToFilter.category.indexOf(event.source.value);
      //   this.selectedDataToFilter.category.splice(index, 1);
      // }
      if (type == 'Category') {
        let indexAgency = this.selectedCategoryValues.indexOf(event.source.value);
        this.selectedCategoryValues.splice(indexAgency, 1)
        let index = this.selectedDataToFilter.category_name.indexOf(event.source.value)
        this.selectedDataToFilter.category_name.splice(index, 1)
      }

      if (type == 'Product') {
        let indexDistrict = this.selectedProductValues.indexOf(event.source.value);
        this.selectedProductValues.splice(indexDistrict, 1)
        let index = this.selectedDataToFilter.product_name.indexOf(event.source.value)
        this.selectedDataToFilter.product_name.splice(index, 1)
      }



      if (type === 'Order_date') {
        const indexOrderDate = this.selectedOrderDateValues.indexOf(event.source.value);
        this.selectedOrderDateValues.splice(indexOrderDate, 1);
        const index = this.selectedDataToFilter.order_date.indexOf(event.source.value);
        this.selectedDataToFilter.order_date.splice(index, 1);
      }

      const indexFilter = this.filters.findIndex(x => {
        return (x.displayName === event.source.value) && (x.type === type);
      });
      this.filters.splice(indexFilter, 1);
      // console.log(this.filters);
    }

    if (event.isUserInput && event.source._selected) {
      if (type === 'District') {
        this.selectedDataToFilter.district = this.selectedDataToFilter.district.concat(event.source.value);
      } else if (type === 'Place') {
        this.selectedDataToFilter.place = this.selectedDataToFilter.place.concat(event.source.value);
      } else if (type === 'Agency') {
        this.selectedDataToFilter.agency_name = this.selectedDataToFilter.agency_name.concat(event.source.value);
      } else if (type === 'Field_agent') {
        this.selectedDataToFilter.field_agent_name = this.selectedDataToFilter.field_agent_name.concat(event.source.value);
      } else if (type === 'Category') {
        this.selectedDataToFilter.category_name = this.selectedDataToFilter.category_name.concat(event.source.value);
      } else if (type === 'Product') {
        this.selectedDataToFilter.product_name = this.selectedDataToFilter.product_name.concat(event.source.value);
      }
      const t = {
        type: type,
        displayName: event.source.value,
        value: ''

      };
      this.filters.push(t);
      // console.log('dsgdgds', this.filters);
    }

  }


  openedChangeDistrict(e) {
    this.setSelectedValuesDistrict();
    this.searchDistrictControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }

  openedChangePlace(e) {
    this.setSelectedValuesPlace();
    this.searchPlaceControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }

  openedChangeAgency(e) {
    this.setSelectedValuesAgency();
    this.searchAgencyControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }

  }

  openedChangeFieldAgent(e) {
    this.setSelectedValuesFieldAgent();
    this.searchFieldAgentControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }

  }


  openedChangeCategory(e) {
    // console.log('category',e);
    this.setSelectedValuesCategory();
    this.searchCategoryControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }



  openedChangeProduct(e) {
    this.setSelectedValuesProduct();
    this.searchProductControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
    //  console.log('evnet', e);
  }

  openedChangeOrderDate(e) {
    this.setSelectedValuesOrderDate();
    this.searchOrderDateControl.patchValue('');
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }

  }




  setSelectedValuesDistrict() {
    if (this.selectDistrictFormControl.value && this.selectDistrictFormControl.value.length > 0) {
      this.selectDistrictFormControl.value.forEach((e) => {
        if (this.selectedDistrictValues.indexOf(e) === -1) {
          this.selectedDistrictValues.push(e);
        }
      });
    }
  }

  setSelectedValuesPlace() {
    if (this.selectPlaceFormControl.value && this.selectPlaceFormControl.value.length > 0) {
      this.selectPlaceFormControl.value.forEach((e) => {
        if (this.selectedPlaceValues.indexOf(e) === -1) {
          this.selectedPlaceValues.push(e);
        }
      });
    }
  }

  setSelectedValuesAgency() {
    if (this.selectAgencyFormControl.value && this.selectAgencyFormControl.value.length > 0) {
      this.selectAgencyFormControl.value.forEach((e) => {
        if (this.selectedAgencyValues.indexOf(e) === -1) {
          this.selectedAgencyValues.push(e);
        }
      });
    }
  }

  setSelectedValuesFieldAgent() {
    if (this.selectFieldAgentFormControl.value && this.selectFieldAgentFormControl.value.length > 0) {
      this.selectFieldAgentFormControl.value.forEach((e) => {
        if (this.selectedFieldAgentValues.indexOf(e) === -1) {
          this.selectedFieldAgentValues.push(e);
        }
      });
    }
  }




  setSelectedValuesCategory() {
    // console.log('ddddd',this.selectCategoryFormControl)
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

  setSelectedValuesOrderDate() {
    if (this.selectOrderDateFormControl.value && this.selectOrderDateFormControl.value.length > 0) {
      this.selectOrderDateFormControl.value.forEach((e) => {
        if (this.selectedOrderDateValues.indexOf(e) === -1) {
          this.selectedOrderDateValues.push(e);
        }
      });
    }
  }

  remove(filter): void {
    let index;
    if (filter.type === 'Agency') {
      const indexAgency = this.selectedAgencyValues.indexOf(filter.displayName);
      this.selectedAgencyValues.splice(indexAgency, 1);
      index = this.selectedDataToFilter.agency_name.indexOf(filter.displayName);
      this.selectedDataToFilter.agency_name.splice(index, 1);
    } else if (filter.type === 'District') {
      const indexDistrict = this.selectedDistrictValues.indexOf(filter.displayName);
      this.selectedDistrictValues.splice(indexDistrict, 1);
      index = this.selectedDataToFilter.district.indexOf(filter.displayName);
      this.selectedDataToFilter.district.splice(index, 1);
    } else if (filter.type === 'Place') {
      const indexPlace = this.selectedPlaceValues.indexOf(filter.displayName);
      this.selectedPlaceValues.splice(indexPlace, 1);
      index = this.selectedDataToFilter.place.indexOf(filter.displayName);
      this.selectedDataToFilter.place.splice(index, 1);
    } else if (filter.type === 'Field_agent') {
      const indexFieldAgent = this.selectedFieldAgentValues.indexOf(filter.displayName);
      this.selectedFieldAgentValues.splice(indexFieldAgent, 1);
      index = this.selectedDataToFilter.field_agent_name.indexOf(filter.displayName);
      this.selectedDataToFilter.field_agent_name.splice(index, 1);
    }


    else if (filter.type == 'Category') {
      let indexCategory = this.selectedCategoryValues.indexOf(filter.displayName);
      this.selectedCategoryValues.splice(indexCategory, 1);
      let index = this.selectedDataToFilter.category_name.indexOf(filter.displayName);
      this.selectedDataToFilter.category_name.splice(index, 1);
    }


    else if (filter.type == 'Product') {
      let indexProduct = this.selectedProductValues.indexOf(filter.displayName);
      this.selectedProductValues.splice(indexProduct, 1);
      let index = this.selectedDataToFilter.product_name.indexOf(filter.displayName);
      this.selectedDataToFilter.product_name.splice(index, 1);
    }

    else if (filter.type === 'Order_date') {
      const indexOrderDate = this.selectedOrderDateValues.indexOf(filter.displayName);
      this.selectedOrderDateValues.splice(indexOrderDate, 1);
      index = this.selectedDataToFilter.order_date.indexOf(filter.displayName);
      this.selectedDataToFilter.order_date.splice(index, 1);
    }
    const indexFilter = this.filters.findIndex(x => {
      return (x.displayName === filter.displayName) && (x.type === filter.type);
    });
    this.filters.splice(indexFilter, 1);
  }



  clearFilter() {
    this.selectDistrictFormControl.patchValue('');
    this.selectPlaceFormControl.patchValue('');
    this.selectAgencyFormControl.patchValue('');
    this.selectFieldAgentFormControl.patchValue('');
    this.selectCategoryFormControl.patchValue('');
    this.selectProductFormControl.patchValue('');
    this.selectOrderDateFormControl.patchValue('');
    this.selectedAgencyValues = [];
    this.selectedDistrictValues = [];
    this.selectedPlaceValues = [];
    this.selectedFieldAgentValues = [];
    this.selectedCategoryValues = [];
    this.selectedProductValues = [];
    this.selectedOrderDateValues = [];
    this.filters = [];
    this.selectedDataToFilter.district = [];
    this.selectedDataToFilter.product_name = [];
    this.selectedDataToFilter.category_name = [];
    this.selectedDataToFilter.product_name = [];
    this.selectedDataToFilter.field_agent_name = [];
    this.selectedDataToFilter.agency_name = [];
    this.selectedDataToFilter.place = [];
    this.selectedDataToFilter.start_date = '';
    this.selectedDataToFilter.end_date = '';
    this.indentList();
    this.orderService._filterIndentKeys$.next({});
    // this.orderService._clear$.next('clear filter');
  }


  indentList() {
    const request = {
      PAGE_NUMBER: 1,
      NUMBER_OF_ITEMS: 10
    };
    let token = localStorage.getItem('token')
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token,
      }),
    };
    this.http
      .post('http://134.209.147.129:3001/list_indent', request, httpOptions)
      .toPromise()
      .then((res: any) => {
        // console.log('result indent', res.message);
        /// return res;
        this.orderService._initializeIndentCount$.next(res.indent_count);
        this.orderService._indent_list$.next(res.message);
      })
      .catch((data: any) => Promise.resolve());
  }


  setAgencyFilter() {
    this.agencyFilter = !this.agencyFilter;
  }

  getCustomDate(dt) {
    const current_datetime = new Date(dt);
    const formatted_date =  current_datetime.getDate()+ '-' + (current_datetime.getMonth() + 1) + '-' + current_datetime.getFullYear();
    return formatted_date;
  }

  //  submitFilter() {

  //   Object.keys(this.selectedDataToFilter).forEach(key => {

  //     if (Array.isArray(this.selectedDataToFilter[key])) {
  //           this.selectedDataToFilter[key].length === 0 ? delete this.selectedDataToFilter[key] : key;
  //       } else {
  //           this.selectedDataToFilter[key] == "" ? delete this.selectedDataToFilter[key] : key
  //       }
  //   });
  //  // console.log('selectedDataToFilter', this.selectedDataToFilter);
  //    this.orderService.filterIndent(this.selectedDataToFilter);
  //   // this.openMenu = false;
  // }
  submitFilter() {
    // console.log(',,,,', this.selectedDataToFilter);
    let finalObject: any = {};
    //console.log("this.selectedDataToFilter.start_date11", this.getCustomDate(this.selectedDataToFilter.start_date));
   
    if(this.selectedDataToFilter.start_date != ''){
     // if(this.selectedDataToFilter.start_date.length > 10) {
        this.selectedDataToFilter.start_date = this.convert(this.selectedDataToFilter.start_date);
       // console.log("this.selectedDataToFilter.start_date1", this.getCustomDate(this.selectedDataToFilter.start_date));
    //  }
    } 

    if(this.selectedDataToFilter.end_date != ''){
    //  if(this.selectedDataToFilter.end_date.length > 10) {
        this.selectedDataToFilter.end_date = this.convert(this.selectedDataToFilter.end_date);
       // console.log("this.selectedDataToFilter.end_date1", this.selectedDataToFilter.end_date);
     // }
    }
    console.log("this.selectedDataToFilter.start_date2", this.selectedDataToFilter.start_date);
    console.log("this.selectedDataToFilter.end_date2", this.selectedDataToFilter.end_date);
    Object.assign(finalObject, this.selectedDataToFilter);
    Object.keys(finalObject).forEach(key => {
      if (Array.isArray(finalObject[key])) {
        finalObject[key].length === 0 ? delete finalObject[key] : key;
      } else {
        finalObject[key] == "" ? delete finalObject[key] : key;
      }
    });
    this.orderService._filterIndentKeys$.next(finalObject);
    this.orderService.filterIndent(finalObject);
    this.orderService._clear_order$.next('clear filter');
  }

  convert(str) {
    var date = new Date(str);
    //var rr = date.toISOString();

    var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
   // console.log("date new", [day, mnth, date.getFullYear()].join("-"));
    return [date.getFullYear(), mnth, day].join("-");
  }

}
