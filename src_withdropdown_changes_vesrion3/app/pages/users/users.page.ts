import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { GridOptions } from "ag-grid";
import { ActionTablePage } from '../../modal/action-table/action-table.page';
import { UserModel } from '../../model/user-model'
import { ModalController, PopoverController } from '@ionic/angular';
import { AddAgencyPage } from 'src/app/modal/add-agency/add-agency.page';
import { RestService } from 'src/app/service/rest.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
// import { UsersFilterComponent } from '../../filter/users-filter/users-filter.component';
// import { UsersFilterPage } from 'src/app/filter/users-filter/users-filter.page';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { ConfigService } from 'src/app/service/config.service';
import { RoleBaseAccesService } from '../../service/role-base-acces.service';
import * as _ from 'underscore';
import * as $ from 'jquery';

export interface filterlist {
  displayName: any;
  value: any;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})

export class UsersPage implements OnInit {
  @ViewChild('search') searchTextBox: ElementRef;


  openMenu: Boolean = false;
  loggedInUser: any;
  selectedDataToFilter: any = { district: [], place: [], agency_name: [] }
  allSelectedFilter: any = []
  selectDistrictFormControl = new FormControl();
  selectPlaceFormControl = new FormControl();
  selectAgencyFormControl = new FormControl();
  searchDistrictControl = new FormControl();
  searchPlaceControl = new FormControl();
  searchAgencyControl = new FormControl();
  selectedDistrictValues = [];
  selectedPlaceValues = [];
  selectedAgencyValues = [];
  filterDistrict = [];
  filterPlace = []
  filterAgency = []
  dropDownDistrict = []
  dropDownPlace = []
  dropDownAgency = []
  filteredOptions: Observable<any[]>;
  filteredDistrict: Observable<any[]>;
  filteredPlace: Observable<any[]>;
  filteredAgency: Observable<any[]>;
  agencyFilter: boolean = false;
  viewAgencyManager: boolean = true;
  viewFieldAgent: boolean = true;
  viewOther: boolean = true;
  viewUser: boolean = true;
  // config.opendrop: boolean = false;

  // public data = [
  //   // { class: 'data', text: 'Print', id: 'data1', category: 'Customize Quick Access Toolbar' },
  //   { class: 'data', text: 'Ramesh singh', id: 'data2', category: 'Field Agent' },
  //   { class: 'data', text: 'Sandeep kumar', id: 'data3', category: 'Field Agent' },
  //   { class: 'data', text: 'Shankar ehsaan', id: 'data4', category: 'Field Agent' }
  // ];

  public field: Object = { text: 'text', groupBy: 'category' };


  selectedData: any
  allHeaderManager: any = [];
  allHeaderAgent: any = [];
  allHeaderOther: any = [];
  toggleManager: boolean = false;
  toggleAgent: boolean = false;
  toggleOther: boolean = false;
  toggleUserTypeAgency: boolean = true;
  toggleUserTypeAgent: boolean = false;
  toggleUserTypeOther: boolean = false;
  gridOptions: any;
  gridOptionsAgent: any;
  gridOptionsOther: any;
  agencyList: any = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  private userModel = new UserModel()

  public filterTags: any = [];
  public filterFlag: boolean = false;
  public clearButtonFlag: Boolean = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  filters: filterlist[] = [];
  foods: any = [];
  fields: any;

  //Agency Manager
  manager_list: any = [];
  //field agent
  agent_list: any = [];
  //others
  other_list: any = [];
  // pagignation
  pagination: any = [];
  totalCount;
  countpage: number;

  // prevPage: Number;
  // nextPage: Number;
  toggleAddUser: boolean = true;
  toggleViewUser: boolean = true;
  // pager: any = {};
  // allpager: any = [];
  // pagedItems: any[];
  currentPage = 1;
  pageSize = 10;
  checkboxes: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  limit: number = 10;

  constructor(private modalCtrl: ModalController, private rest: RestService,
    private toastr: ToastrService, private popoverCtrl: PopoverController, private roleService: RoleBaseAccesService,
    public dialog: MatDialog, private config: ConfigService) {
    document.addEventListener('click', this.stoping.bind(this));
    this.rest.countpage = 0;
    this.rest.limit = this.rest.LIMITS[0].value;
    this.rest.userType = "Agency Manager";
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    this.roleService.getRoles().then(response => {
      this.roleService._roleList$.subscribe(data => {
        let role = JSON.parse(localStorage.getItem('user')).role;
        if (data.length > 0) {
          this.roleService.role_list = []
          this.roleService.role_list = data.filter((item) => item.name === role)
          this.roleService.role_list = this.roleService.role_list[0].role;
          this.roleService.loggedInUser = this.roleService.role_list[0].name
          this.roleService.determineRoleBasedAccess();
          if (this.roleService.viewAgencyManager || this.roleService.viewFieldAgent || this.roleService.viewOthers) {
            this.toggleViewUser = true;
          }
          else {
            this.toggleViewUser = false;
          }
          if (this.roleService.createAgencyManager || this.roleService.createFieldAgent || this.roleService.createOthers) {
            this.toggleAddUser = true;
          }
          else {
            this.toggleAddUser = false;
          }
        }
      });
    })


    if (this.loggedInUser.role == 'Admin' || this.loggedInUser.role == 'Order Manager' || this.loggedInUser.role == 'Field Agent' || this.loggedInUser.role == 'Viewer') {
      this.rest.roleType = null;
    }
    else if (this.loggedInUser.role == 'Agency Manager') {
      this.rest.roleType = "AM";
    }


    this.foods = [
      { value: 'steak-0', viewValue: 'Steak' },
      { value: 'pizza-1', viewValue: 'Pizza' },
      { value: 'tacos-2', viewValue: 'Tacos' }
    ];

    this.filterTags = [
      { displayName: 'Tag1', value: 'Tag1Value' },
      { displayName: 'Tag2', value: 'Tag2Value' },
      { displayName: 'Tag3', value: 'Tag3Value' },
      { displayName: 'Tag4', value: 'Tag4Value' },
      { displayName: 'Tag5', value: 'Tag5Value' }
    ]

    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
    ];
    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' }
    // ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };


    // Grid Option Column Definitions for Agency Table
    this.gridOptions = <GridOptions>{
      // domLayout: 'autoHeight',
    };
    this.gridOptions.columnDefs = [
      {
        headerName: "Action",
        field: "actions",
        cellRendererFramework: ActionTablePage,
        cellRendererParams: { viewManager: true, editManager: true },
        suppressFilter: true,
        suppressSorting: true,
        width: 70,
        suppressSizeToFit: true
      },
      {
        headerName: "AM Id",
        field: "uid",
        tooltipField: "agency_id",
        width: 100,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
        // pinned: 'left'
      },
      {
        headerName: "Agency Name",
        field: "agency_name",
        tooltipField: "agency_name",
        // width: 250,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Parent Agency",
        field: "parentAgency_name",
        tooltipField: "parentAgency_name",
        // width: 250,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Manager's First Name",
        field: "first_name",
        tooltipField: "first_name",
        // width: 250,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Manager's Last Name",
        field: "last_name",
        tooltipField: "last_name",
        // width: 250,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Mobile Number",
        field: "mobile_no",
        tooltipField: "mobile_no",
        // width: 100
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Role",
        field: "role",
        tooltipField: "role",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Aadhar Number",
        field: "aadhar_no",
        tooltipField: "aadhar_no",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Gender",
        field: "gender",
        tooltipField: "gender",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Date of Birth",
        field: "dob",
        tooltipField: "dob",
        // width: 80,
        suppressSizeToFit: true,
        valueFormatter: this.getFormattedDate,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Created By",
        field: "created_by",
        tooltipField: "created_by",
        // width: 200,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Created Time",
        field: "created_time",
        tooltipField: "created_time",
        // width: 200,
        suppressSizeToFit: true,
        valueFormatter: this.getFormattedDate,
        cellStyle: { color: 'black', fontSize: '14px' }

      },
      {
        headerName: "Updated By",
        field: "updated_by",
        tooltipField: "updated_by",
        // width: 200,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }

      },
      {
        headerName: "updated Time",
        field: "updated_time",
        tooltipField: "updated_time",
        // width: 200,
        suppressSizeToFit: true,
        valueFormatter: this.getFormattedDate,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Place",
        field: "place",
        tooltipField: "place",
        // width: 200,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Pin code",
        field: "pincode",
        tooltipField: "pincode",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "District",
        field: "district",
        tooltipField: "district",
        // width: 200,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "State",
        field: "state",
        tooltipField: "state",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Country",
        field: "country",
        tooltipField: "country",
        // width: 200,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },

      {
        headerName: "Status",
        field: "status",
        tooltipField: "status",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },

    ]

    //ageny manager Table setting
    this.gridOptions.localeText = { noRowsToShow: 'No agency to show' };
    this.gridOptions.rowData = [];
    this.gridOptions.rowHeight = 34;
    this.allHeaderManager = this.gridOptions.columnDefs.filter((item) => item.headerName != 'AM Id')

    // Grid Option Column Definitions for Agency Table
    this.gridOptionsAgent = <GridOptions>{
      // domLayout: 'autoHeight',
    };
    this.gridOptionsAgent.columnDefs = [
      {
        headerName: "Action",
        field: "actions",
        cellRendererFramework: ActionTablePage,
        cellRendererParams: { viewFieldAgent: true, editFieldAgent: true },
        suppressFilter: true,
        suppressSorting: true,
        width: 70,
        suppressSizeToFit: true
      },
      {
        headerName: "FA Id",
        field: "uid",
        tooltipField: "agency_id",
        width: 100,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
        // pinned: 'left'
      },
      {
        headerName: "Agency Name",
        field: "agency_name",
        tooltipField: "agency_name",
        // width: 250,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "First Name",
        field: "first_name",
        tooltipField: "first_name",
        // width: 250,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Last Name",
        field: "last_name",
        tooltipField: "last_name",
        // width: 250,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Mobile Number",
        field: "mobile_no",
        tooltipField: "mobile_no",
        // width: 100
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Role",
        field: "role",
        tooltipField: "role",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Aadhar Number",
        field: "aadhar_no",
        tooltipField: "aadhar_no",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Gender",
        field: "gender",
        tooltipField: "gender",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Date of Birth",
        field: "dob",
        tooltipField: "dob",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Created By",
        field: "created_by",
        tooltipField: "created_by",
        // width: 200,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Created Time",
        field: "created_time",
        tooltipField: "created_time",
        // width: 200,
        suppressSizeToFit: true,
        valueFormatter: this.getFormattedDate,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Updated By",
        field: "updated_by",
        tooltipField: "updated_by",
        // width: 200,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "updated Time",
        field: "updated_time",
        tooltipField: "updated_time",
        // width: 200,
        suppressSizeToFit: true,
        valueFormatter: this.getFormattedDate,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Place",
        field: "place",
        tooltipField: "place",
        // width: 200,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Pin code",
        field: "pincode",
        tooltipField: "pincode",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "District",
        field: "district",
        tooltipField: "district",
        // width: 200,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "State",
        field: "state",
        tooltipField: "state",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Country",
        field: "country",
        tooltipField: "country",
        // width: 200,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },

      {
        headerName: "Status",
        field: "status",
        tooltipField: "status",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },

    ]

    //Agent Table setting
    this.gridOptionsAgent.localeText = { noRowsToShow: 'No field agent to show' };
    this.gridOptionsAgent.rowData = [];
    this.gridOptionsAgent.rowHeight = 34;
    // let cropHeader = this.gridOptionsAgent.columnDefs.
    this.allHeaderAgent = this.gridOptionsAgent.columnDefs.filter((item) => item.headerName != 'FA Id')

    // Grid Option Column Definitions for Others Table
    this.gridOptionsOther = <GridOptions>{
      // domLayout: 'autoHeight',
    };
    this.gridOptionsOther.columnDefs = [
      {
        headerName: "Action",
        field: "actions",
        cellRendererFramework: ActionTablePage,
        cellRendererParams: { viewOther: true, editOther: true },
        suppressFilter: true,
        suppressSorting: true,
        width: 70,
        suppressSizeToFit: true,

      },
      {
        headerName: "User Id",
        field: "uid",
        tooltipField: "user_id",
        width: 100,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
        // pinned: 'left'
      },
      {
        headerName: "Agency Name",
        field: "agency_name",
        tooltipField: "agency_name",
        // width: 250,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "First Name",
        field: "first_name",
        tooltipField: "first_name",
        // width: 250,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Last Name",
        field: "last_name",
        tooltipField: "last_name",
        // width: 250,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Mobile Number",
        field: "mobile_no",
        tooltipField: "mobile_no",
        // width: 100
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Role",
        field: "role",
        tooltipField: "role",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Aadhar Number",
        field: "aadhar_no",
        tooltipField: "aadhar_no",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Gender",
        field: "gender",
        tooltipField: "gender",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Date of Birth",
        field: "dob",
        tooltipField: "dob",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Created By",
        field: "created_by",
        tooltipField: "created_by",
        // width: 200,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Created Time",
        field: "created_time",
        tooltipField: "created_time",
        // width: 200,
        suppressSizeToFit: true,
        valueFormatter: this.getFormattedDate,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Updated By",
        field: "updated_by",
        tooltipField: "updated_by",
        // width: 200,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "updated Time",
        field: "updated_time",
        tooltipField: "updated_time",
        // width: 200,
        suppressSizeToFit: true,
        valueFormatter: this.getFormattedDate,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Place",
        field: "place",
        tooltipField: "place",
        // width: 200,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Pin code",
        field: "pincode",
        tooltipField: "pincode",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "District",
        field: "district",
        tooltipField: "district",
        // width: 200,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "State",
        field: "state",
        tooltipField: "state",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },
      {
        headerName: "Country",
        field: "country",
        tooltipField: "country",
        // width: 200,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },

      {
        headerName: "Status",
        field: "status",
        tooltipField: "status",
        // width: 80,
        suppressSizeToFit: true,
        cellStyle: { color: 'black', fontSize: '14px' }
      },

    ]

    //Others Table setting
    this.gridOptionsOther.localeText = { noRowsToShow: 'No users to show' };
    this.gridOptionsOther.rowData = [];
    this.gridOptionsOther.rowHeight = 34;
    this.allHeaderOther = this.gridOptionsOther.columnDefs.filter((item) => item.headerName != 'User Id');

    this.rest._saveStateAgGrid$.subscribe(data => {
      // const columns = this.gridOptions.columnApi.getAllColumns();
      // const valueColumn = columns.filter(column => column.getColDef())[0];
      // const newState = !valueColumn.isVisible();
      // console.log("grid table", newState, valueColumn)
      // this.gridOptions.columnApi.setColumnVisible(valueColumn, true);

    })
  }

  ngOnInit() {

    this.rest._userList$.subscribe(data => {
      if (data.length > 0) {
        this.manager_list = []
        this.manager_list = data.filter((item) => item.role === 'Agency Manager')
        this.agent_list = []
        this.agent_list = data.filter((item) => item.role === 'Field Agent')
        this.other_list = []
        this.other_list = data.filter((item) => item.role == 'Order Manager' || item.role === 'Viewer')
      }
      else {
        this.manager_list = []
        this.agent_list = []
        this.other_list = []
      }

      setTimeout(() => {
        this.gridOptions.api.setRowData(this.manager_list);
        const columns = this.gridOptions.columnApi.getAllColumns();
        for (let i = 0; i < columns.length; i++) {
          const valueColumn = columns.filter(column => column.getColDef())[i];
          this.gridOptions.columnApi.setColumnVisible(valueColumn, true);
        }
      }, 100);
      setTimeout(() => {
        this.gridOptionsAgent.api.setRowData(this.agent_list);
        const columns = this.gridOptionsAgent.columnApi.getAllColumns();
        for (let i = 0; i < columns.length; i++) {
          const valueColumn = columns.filter(column => column.getColDef())[i];
          this.gridOptionsAgent.columnApi.setColumnVisible(valueColumn, true);
        }
      }, 100);
      setTimeout(() => {
        this.gridOptionsOther.api.setRowData(this.other_list);
        const columns = this.gridOptionsOther.columnApi.getAllColumns();
        for (let i = 0; i < columns.length; i++) {
          const valueColumn = columns.filter(column => column.getColDef())[i];
          this.gridOptionsOther.columnApi.setColumnVisible(valueColumn, true);
        }
      }, 100);
    })



    let req = {
      roleType: this.rest.roleType
    }
    this.rest.getUserDropDownList(req).subscribe((response) => {
      this.rest._userDropDownList$.next(response)
    })
    this.config.getAgency().then((response) => {
    })
    this.filteredPlace = this.searchPlaceControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterPlace(name))
      );
    this.filteredAgency = this.searchAgencyControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterAgency(name))
      );

    this.filteredDistrict = this.searchDistrictControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterDistrict(name))
      );
    this.rest._userDropDownList$.subscribe(data => {
      if (data.places || data.districts || data.agencies) {
        data.places = data.places.filter(el => {
          return el != null;
        });
        data.districts = data.districts.filter(el => {
          return el != null;
        });
        data.agencies = data.agencies.filter(el => {
          return el != null;
        });
        this.dropDownPlace = [];
        this.dropDownPlace = data.places;
        this.filteredPlace = this.searchPlaceControl.valueChanges
          .pipe(
            startWith<string>(''),
            map(name => this._filterPlace(name))
          );
        this.dropDownDistrict = [];
        this.dropDownDistrict = data.districts;
        this.filteredDistrict = this.searchDistrictControl.valueChanges
          .pipe(
            startWith<string>(''),
            map(name => this._filterDistrict(name))
          );
        this.dropDownAgency = [];
        this.dropDownAgency = data.agencies;
        this.filteredAgency = this.searchAgencyControl.valueChanges
          .pipe(
            startWith<string>(''),
            map(name => this._filterAgency(name))
          );
      }
    });
    // this.setPage(1);
    this.setTab(0);

  }

  getFormattedDate(dateValue) {
    let date = new Date(dateValue.value);
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return day + '-' + month + '-' + year;
  }


  stoping(e) {
    console.log(e)
    if (e.target.nodeName == 'ION-COL') {
      // $('#checkboxes').hide();
      this.config.opendrop = false;
    }
    else if (e.target.nodeName == 'ION-ROW') {
      this.config.opendrop = false;
    }
    else if (e.target.nodeName == 'ION-CONTENT') {
      this.config.opendrop = false;
    }
    else if (e.target.nodeName == 'DIV') {
      this.config.opendrop = false;
    }

  };


  displayDrop() {
    this.config.opendrop = !this.config.opendrop
  }


  //filter popup
  onClick(e) {
    if (e.target.className == 'popup-menu-overlay in') {
      this.openMenu = false;
    }
    else if (e.target.nodeName == 'ION-CONTENT') {
      this.openMenu = false;
    }
  }


  rowLimits: Array<any> = this.rest.LIMITS;
  // changeRowLimits(event) {
  //   this.rest.limit = event.target.value;
  //   this.setPage(1)
  // }

  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    let totalPages = Math.ceil(totalItems / pageSize);
    let startPage: number, endPage: number;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 1 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {

        if ((totalPages - (currentPage - 2)) == 5) {
          startPage = currentPage - 1;
          endPage = currentPage + 3;
        } else {
          startPage = currentPage - 2;
          endPage = currentPage + 2;
        }
      }
    }
    console.log("start and end page", startPage, endPage)

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = _.range(startPage, endPage + 1);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }


  getPaginatorData(e) {
    console.log('now', e);
    this.countpage = e.pageIndex;
    if (e.pageSize) {
      this.limit = e.pageSize;
    }
    this.rest.limit = this.limit
    //  this.selectedDataToFilter.page = this.rest.countpage;
    this.selectedDataToFilter.limit = this.rest.limit
    this.selectedDataToFilter.userType = this.rest.userType;
    this.selectedDataToFilter.roleType = this.rest.roleType;
    // console.log('now', this.countpage);
    this.selectedDataToFilter.page = this.countpage;
    this.rest.getUser(this.selectedDataToFilter).then(response => {
      this.totalCount = this.rest.userListCount;
    })

  }

  // setPage(page) {
  //  // console.log("page size", page, this.pager.totalPages)

  //   // if (page < 1 || page > this.pager.totalPages) {
  //   //   return;
  //   // }

  //   this.pagedItems = this.allpager.slice(this.pager.startIndex, this.pager.endIndex + 1);
  //   this.rest.countpage = page - 1;

  //   this.selectedDataToFilter.page = this.rest.countpage;
  //   this.selectedDataToFilter.limit = Number(this.rest.limit);
  //   this.selectedDataToFilter.userType = this.rest.userType;
  //   this.selectedDataToFilter.roleType = this.rest.roleType;


  //   this.rest.getUser(this.selectedDataToFilter).then(response => {
  //     this.totalCount = this.rest.userListCount;
  //     this.pager = this.getPager(this.totalCount, page);

  //   })

  // }
  setTab(type) {
    if (type == 0) {
      type = 'Agency Manager'
    }
    else if (type == 1) {
      type = 'Field Agent'
    }
    else if (type == 2) {
      type = 'other'
    }
    this.rest._saveStateAgGrid$.next("table changed")
    this.config.opendrop = false;
    this.selectedDataToFilter.agency_name = []
    this.selectedDataToFilter.district = []
    this.selectedDataToFilter.place = []
    this.rest.userType = type;
    this.clearFilter();
    this.openMenu = false;

    // this.getPaginatorData(1);
  }
  // selectedTab(event) {
  //   console.log("selected tab", event)
  // }

  applyFilter() {
    this.rest.limit = this.rest.LIMITS[0].value;
    this.rest.countpage = 0;
    this.getPaginatorData(1)
    this.togglePopupMenu()
  }
  // Used to filter data based on search input
  private _filterAgency(name: string): String[] {
    const filterValue = name.toLowerCase();
    this.selectAgencyFormControl.patchValue(this.selectedAgencyValues);
    let filteredList = this.dropDownAgency.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }
  private _filterDistrict(name: string): String[] {
    const filterValue = name.toLowerCase();
    this.selectDistrictFormControl.patchValue(this.selectedDistrictValues);
    let filteredList = this.dropDownDistrict.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }
  private _filterPlace(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    // this.setSelectedValuesPlace();
    this.selectPlaceFormControl.patchValue(this.selectedPlaceValues);
    let filteredList = this.dropDownPlace.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }

  /**
  * Remove from selected values based on uncheck
  */
  selectionChange(event, type) {
    if (event.isUserInput && event.source.selected == false) {
      if (type == 'Agency') {
        let indexAgency = this.selectedAgencyValues.indexOf(event.source.value);
        this.selectedAgencyValues.splice(indexAgency, 1)
        let index = this.selectedDataToFilter.agency_name.indexOf(event.source.value)
        this.selectedDataToFilter.agency_name.splice(index, 1)
      }
      if (type == 'District') {
        let indexDistrict = this.selectedDistrictValues.indexOf(event.source.value);
        this.selectedDistrictValues.splice(indexDistrict, 1)
        let index = this.selectedDataToFilter.district.indexOf(event.source.value)
        this.selectedDataToFilter.district.splice(index, 1)
      }
      if (type == 'Place') {
        let indexPlace = this.selectedPlaceValues.indexOf(event.source.value);
        this.selectedPlaceValues.splice(indexPlace, 1)
        let index = this.selectedDataToFilter.place.indexOf(event.source.value)
        this.selectedDataToFilter.place.splice(index, 1)
      }
      let indexFilter = this.filters.findIndex(x => x.displayName === event.source.value);
      this.filters.splice(indexFilter, 1);

    }
    if (event.isUserInput && event.source._selected) {
      if (type == 'District') {
        this.selectedDataToFilter.district = this.selectedDataToFilter.district.concat(event.source.value)
      }
      else if (type == 'Place') {
        this.selectedDataToFilter.place = this.selectedDataToFilter.place.concat(event.source.value)
      }
      else if (type == 'Agency') {
        this.selectedDataToFilter.agency_name = this.selectedDataToFilter.agency_name.concat(event.source.value)
      }
      let selected_data = { type: type, displayName: event.source.value, value: event }
      if (this.filters.indexOf(event.source.value) === -1) {
        this.filters.push(selected_data);
      }

      if (this.filters.length > 0) {
        this.clearButtonFlag = true;
      } else {
        this.clearButtonFlag = false;
      }
    }
    if (event.source._selected == false) {
      let selected_data = { id: event.source.id, displayName: event.source.value, value: event }
      // let index = this.filters.indexOf(event.source.value)
      // this.filters.splice(index, 1);
      // if (type == 'district') {
      //   let index = this.selectedDataToFilter.district.indexOf(event.source.value)
      //   this.selectedDataToFilter.district.splice(index, 1);
      // }
      // else if (type == 'place') {
      //   let index = this.selectedDataToFilter.place.indexOf(event.source.value)
      //   this.selectedDataToFilter.place.splice(index, 1);
      // }
      // else if (type == 'agency') {
      //   let index = this.selectedDataToFilter.agency_name.indexOf(event.source.value)
      //   this.selectedDataToFilter.agency_name.splice(index, 1);
      // }
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

  setAgencyFilter() {
    this.agencyFilter = !this.agencyFilter;
  }

  /**
   * Clearing search textbox value
   */
  clearSearch(event) {
    event.stopPropagation();
    this.searchAgencyControl.patchValue('');
  }

  /**
   * Set selected values to retain the state
   */
  setSelectedValuesDistrict() {
    if (this.selectDistrictFormControl.value && this.selectDistrictFormControl.value.length > 0) {
      this.selectDistrictFormControl.value.forEach((e) => {
        if (this.selectedDistrictValues.indexOf(e) == -1) {
          this.selectedDistrictValues.push(e);
        }
      });
    }
  }
  setSelectedValuesPlace() {
    if (this.selectPlaceFormControl.value && this.selectPlaceFormControl.value.length > 0) {
      this.selectPlaceFormControl.value.forEach((e) => {
        if (this.selectedPlaceValues.indexOf(e) == -1) {
          this.selectedPlaceValues.push(e);
        }
      });
    }
  }
  setSelectedValuesAgency() {
    if (this.selectAgencyFormControl.value && this.selectAgencyFormControl.value.length > 0) {
      this.selectAgencyFormControl.value.forEach((e) => {
        if (this.selectedAgencyValues.indexOf(e) == -1) {
          this.selectedAgencyValues.push(e);
        }
      });
    }
  }
  hideShowColumnsAgency(data) {
    console.log("agency table", data)
    const columns = this.gridOptions.columnApi.getAllColumns();
    const valueColumn = columns.filter(column => column.getColDef().headerName === data.headerName)[0];
    const newState = !valueColumn.isVisible();
    console.log("grid table", newState, valueColumn)
    this.gridOptions.columnApi.setColumnVisible(valueColumn, newState);
    this.gridOptions.api.sizeColumnsToFit();
  }
  hideShowColumnsFieldAgent(data) {
    const columns = this.gridOptionsAgent.columnApi.getAllColumns();
    const valueColumn = columns.filter(column => column.getColDef().headerName === data.headerName)[0];
    const newState = !valueColumn.isVisible();
    this.gridOptionsAgent.columnApi.setColumnVisible(valueColumn, newState);
    this.gridOptionsAgent.api.sizeColumnsToFit();
  }
  hideShowColumnsOther(data) {
    const columns = this.gridOptionsOther.columnApi.getAllColumns();
    const valueColumn = columns.filter(column => column.getColDef().headerName === data.headerName)[0];
    const newState = !valueColumn.isVisible();
    this.gridOptionsOther.columnApi.setColumnVisible(valueColumn, newState);
    this.gridOptionsOther.api.sizeColumnsToFit();
  }
  addAgency() {

    if (this.loggedInUser.user_level <= 5) {
      return this.modalCtrl.create({
        component: AddAgencyPage,
        componentProps: { modalType: 'addManager', modalController: this.modalCtrl }
      })
        .then(popover => popover.present());
    }
    else {
      this.toastr.success('User can not be created above ' + this.loggedInUser.user_level + ' level...');
    }
  }
  OnGridReadyManager(params) {
    // this.gridOptions = params.api;
    // this.gridOptions.setRowData([]);
    // this.gridOptions.updateRowData({ add: this.manager_list })
  }
  OnGridReadyAgent(params) {
    // this.gridOptionsAgent = params.api;
    // this.gridOptionsAgent.setRowData([]);
    // this.gridOptionsAgent.updateRowData({ add: this.agent_list })
  }
  OnGridReadyOther(params) {
    // this.gridOptionsOther = params.api;
    // this.gridOptionsOther.setRowData([]);
    // this.gridOptionsOther.updateRowData({ add: this.other_list })
  }
  // onFiltering(e) {
  //   // cpublic onFiltering: EmitType =  (e: FilteringEventArgs) => {
  //   let query = new Query();
  //   //frame the query based on search string with filter type.
  //   query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
  //   //pass the filter data source, filter query to updateData method.
  //   e.updateData(this.dropDownAgency, query);
  // }
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
  remove(filter): void {
    if (filter.type == 'Agency') {
      let indexAgency = this.selectedAgencyValues.indexOf(filter.displayName);
      this.selectedAgencyValues.splice(indexAgency, 1)
      let index = this.selectedDataToFilter.agency_name.indexOf(filter.displayName)
      this.selectedDataToFilter.agency_name.splice(index, 1)

    }
    if (filter.type == 'District') {
      let indexDistrict = this.selectedDistrictValues.indexOf(filter.displayName);
      this.selectedDistrictValues.splice(indexDistrict, 1)
      let index = this.selectedDataToFilter.district.indexOf(filter.displayName)
      this.selectedDataToFilter.district.splice(index, 1)
    }
    if (filter.type == 'Place') {
      let indexPlace = this.selectedPlaceValues.indexOf(filter.displayName);
      this.selectedPlaceValues.splice(indexPlace, 1)
      let index = this.selectedDataToFilter.place.indexOf(filter.displayName)
      this.selectedDataToFilter.place.splice(index, 1)
    }
    let indexFilter = this.filters.findIndex(x => x.displayName === filter.displayName);
    this.filters.splice(indexFilter, 1);
    if (this.filters.length == 0) {
      this.clearButtonFlag = false;
    } else {
      this.clearButtonFlag = true;
    }
    this.rest.limit = this.rest.LIMITS[0].value;
    this.rest.countpage = 0;
    this.getPaginatorData(1)
  }
  filter(event) {
    if (this.filters.indexOf(event) === -1) {

    }
    if (this.filters.length > 0) {
      this.clearButtonFlag = true;
    } else {
      this.clearButtonFlag = false;
    }

  }
  clearFilter() {
    this.selectedDataToFilter.district = [];
    this.selectedDataToFilter.place = [];
    this.selectedDataToFilter.agency_name = [];
    this.selectDistrictFormControl.patchValue("")
    this.selectPlaceFormControl.patchValue("")
    this.selectAgencyFormControl.patchValue("")
    this.selectedAgencyValues = []
    this.selectedDistrictValues = []
    this.selectedPlaceValues = []
    this.filters = [];
    if (this.filters.length == 0) {
      this.clearButtonFlag = false;
    } else {
      this.clearButtonFlag = true;
    }
    // this.rest.getUser("").then(data => {
    // })
    this.rest.limit = this.rest.LIMITS[0].value;
    this.rest.countpage = 0;
    this.getPaginatorData(1)
  }
  // toggleFilter() {
  //   return this.modalCtrl.create({
  //     component: UsersFilterPage,
  //     componentProps: { type: 'users', modalController: this.modalCtrl }
  //   })
  //     .then(popover => popover.present());
  // }
  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  }
  hierarchy() {

  }

}

