import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, } from '@angular/common/http';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';

const endpointAddress = 'http://134.209.147.129:3001';
@Injectable({
  providedIn: 'root'
})
export class RoleBaseAccesService {

  token = localStorage.getItem('token')
  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': this.token,
    }),
  };
  public role_list = [];
  public loggedInUser: any;
  // Observable declaration
  public _roleList$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _roleList = this._roleList$.asObservable();

  role: any;

  viewDashboard: boolean = false;
  viewAgencyManager: boolean = false;
  viewFieldAgent: boolean = false;
  viewOthers: boolean = false;
  viewFarmData: boolean = false;
  viewProducts: boolean = false;
  viewOrders: boolean = false;
  viewIndent: boolean = false;
  viewRole: boolean = false;
  viewAgency: boolean = false;
  viewProductCategory: boolean = false;

  createOrder: boolean = false;
  createIndent: boolean = false;
  createProduct: boolean = false;
  createFarmsData: boolean = false;
  createAgencyManager: boolean = false;
  createFieldAgent: boolean = false;
  createOthers: boolean = false;
  createAgency: boolean = false;
  createRole: boolean = false;
  createProductCategory: boolean = false;

  editOrder: boolean = false;
  acceptStatusOrder: boolean = false;
  cancelStatusOrder: boolean = false;
  editIndent: boolean = false;
  editStatusIndent: boolean = false;
  editFarmsData: boolean = false;
  editProduct: boolean = false;
  editAgencyManager: boolean = false;
  editFieldAgent: boolean = false;
  editOthers: boolean = false;
  editRole: boolean = false;
  editAgency: boolean = false;
  editProductCategory: boolean = false;



  constructor(private http: HttpClient) {
    // this.role = JSON.parse(localStorage.getItem('user')).role;
    // this.getRoles().then(data => {

    // })



  }

  determineRoleBasedAccess() {
    this.viewDashboard = this.role_list[0].dashboard[0].view;
    this.viewOrders = this.role_list[1].orders[0].view;
    this.viewIndent = this.role_list[2].indents[0].view;
    this.viewFarmData = this.role_list[4].farmsData[0].view;
    this.viewProducts = this.role_list[3].products[0].view;
    this.viewAgencyManager = this.role_list[5].agencyManager[0].view;
    this.viewFieldAgent = this.role_list[6].fieldAgent[0].view;
    this.viewOthers = this.role_list[7].others[0].view;
    this.viewAgency = this.role_list[8].agency[0].view;
    this.viewRole = this.role_list[9].roles[0].view;
    this.viewProductCategory = this.role_list[10].productCategory[0].view;

    this.createOrder = this.role_list[1].orders[0].create;
    this.createIndent = this.role_list[2].indents[0].create;
    this.createProduct = this.role_list[3].products[0].create;
    this.createFarmsData = this.role_list[4].farmsData[0].create;
    this.createAgencyManager = this.role_list[5].agencyManager[0].create;
    this.createFieldAgent = this.role_list[6].fieldAgent[0].create;
    this.createOthers = this.role_list[7].others[0].create;
    this.createRole = this.role_list[9].roles[0].create;
    this.createAgency = this.role_list[8].agency[0].create;
    this.createProductCategory = this.role_list[10].productCategory[0].create;

    this.editOrder = this.role_list[1].orders[0].edit;
    this.acceptStatusOrder = this.role_list[1].orders[0].acceptStatus;
    this.cancelStatusOrder = this.role_list[1].orders[0].cancelStatus;
    this.editIndent = this.role_list[2].indents[0].edit;
    this.editStatusIndent = this.role_list[2].indents[0].editStatus;
    this.editProduct = this.role_list[3].products[0].edit;
    this.editFarmsData = this.role_list[4].farmsData[0].edit;
    this.editAgencyManager = this.role_list[5].agencyManager[0].edit;
    this.editFieldAgent = this.role_list[6].fieldAgent[0].edit;
    this.editOthers = this.role_list[7].others[0].edit;
    this.editRole = this.role_list[9].roles[0].edit;
    this.editAgency = this.role_list[8].agency[0].edit;
    this.editProductCategory = this.role_list[10].productCategory[0].edit;
    console.log("role access", this.role_list, this.createAgencyManager, this.createFieldAgent, this.createOthers)


  }




  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
  getRoles(): Promise<any> {
    this.token = localStorage.getItem('token')
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': this.token,
      }),
    };
    return this.http
      .post(endpointAddress + '/role_list', '', this.httpOptions)
      .toPromise()
      .then((response: any) => {
        if (response.statusCode == '200') {
          this._roleList$.next(response.message);
         // console.log("response.message",response.message);
        }
      })
      .catch(this.handleError<any>('role list'))
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.error.statusCode}`);
      return of(result as T);
    };
  }





  private rolebaseaccess = {
    viewDashboardPage: ['Admin', 'Agency Manager', 'Field Agent', 'Order Manager', 'Viewer'],
    viewProductPage: ['Admin', 'Agency Manager', 'Field Agent', 'Order Manager', 'Viewer'],
    viewOrderPage: ['Admin', 'Agency Manager', 'Field Agent', 'Order Manager', 'Viewer'],
    viewIndentPage: ['Admin', 'Order Manager', 'Viewer'],
    viewUserAgency: ['Admin', 'Agency Manager', 'Order Manager', 'Viewer'],
    viewUserFieldAgent: ['Admin', 'Agency Manager', 'Order Manager', 'Viewer'],
    viewUserOther: ['Admin'],
    viewFormersDataPage: ['Admin', 'Agency Manager', 'Field Agent', 'Order Manager', 'Viewer'],
    viewAdminConsole: ['Admin'],

    createModifyIndent: ['Order Manager'],
    changeStatusIndent: ['Order Manager'],
    createModifyOrder: ['Agency Manager', 'Field Agent', 'Order Manager'],
    cancelOrder: ['Admin', 'Agency Manager', 'Field Agent', 'Order Manager'],
    acceptOrder: ['Admin'],
    completeOrders: ['Admin'],
    exportOrders: ['Admin', 'Agency Manager', 'Field Agent', 'Order Manager', 'Viewer'],
    exportIndents: ['Admin', 'Order Manager', 'Viewer'],

    addModifyAgency: ['Admin'],
    deactivateReactivateAgency: ['Admin', 'Agency Manager'],
    addModifySubAgency: ['Agency Manager'],
    deactivateReactivateSubAgency: ['Agency Manager'],
    addModifyFieldAgent: ['Agency Manager'],
    deactivateReactivateFieldAgent: ['Agency Manager'],
    addModifyEkOrderManager: ['Admin'],
    deactivateReactivateEkOrderManager: ['Admin'],
    addModifyViewer: ['Admin'],
    DeactivateReactivateViewer: ['Admin'],

    addModifyProduct: ['Admin'],
    deactivateReactivateProduct: ['Admin'],

    addModifyFormerDetails: ['Field Agent'],
    deactivateReactivateFormer: ['Field Agent'],

    AddDeactivateRole: ['Admin'],
    AddModifyProductCategory: ['Admin'],
  };

  access_checking(val) {
    this.role = JSON.parse(localStorage.getItem('user')).role;
    let t = false;
    Object.keys(this.rolebaseaccess).forEach(key => {
      if (val === key) {
        this.rolebaseaccess[key].forEach(res => {
          if (res === this.role) {
            t = true;
          }
        });
      }
    });
    return t;
  }

}
