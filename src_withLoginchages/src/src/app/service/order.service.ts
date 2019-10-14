import { Injectable } from '@angular/core';
import { credit, indcredit } from '../pages/order/order.page';
import { Observable, of, Subject, BehaviorSubject, throwError } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const endpointAddress = 'http://134.209.147.129:3001';


@Injectable({
  providedIn: 'root'
})
export class OrderService {


  ListCount: any;
  ListIndCount: any;
  public _userFilteredData$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _userFilteredData = this._userFilteredData$.asObservable();

  public _selectedFilterItem$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public _selectedFilterItem = this._selectedFilterItem$.asObservable();

  public _order_list$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _order_list = this._order_list$.asObservable();

  public _indent_list$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _indent_list = this._indent_list$.asObservable();

  public _filter_type$: BehaviorSubject<any> = new BehaviorSubject<any>(String);
  public _filter_type = this._filter_type$.asObservable();

  public _initializeCategory$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _initializeCategory = this._initializeCategory$.asObservable();

  public _product$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _product = this._product$.asObservable();

  public _initializeAgency$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _initializeAgency = this._initializeAgency$.asObservable();

  public _initializeFieldAgent$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _initializeFieldAgent = this._initializeFieldAgent$.asObservable();

  public _initializeDistrict$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _initializeDistrict = this._initializeDistrict$.asObservable();

  public _initializePlace$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _initializePlace = this._initializePlace$.asObservable();

  public _initializeOrderCount$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _initializeOrderCount = this._initializeOrderCount$.asObservable();

  public _initializeIndentCount$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _initializeIndentCount = this._initializeIndentCount$.asObservable();

  public _clear$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _clear = this._clear$.asObservable();


  public _clear_order$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _clear_order = this._clear_order$.asObservable();

  public _totalCount$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _totalCount = this._totalCount$.asObservable();

  public _page$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _page = this._page$.asObservable();

  public _totalIndPage$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _totalIndPage = this._totalIndPage$.asObservable();

  public _orderStatusChangeArr$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _orderStatusChangeArr = this._orderStatusChangeArr$.asObservable();

  public credits: any = [];
  constructor(private http: HttpClient, public loadingController: LoadingController, ) {
    // this.orderList();
    // this.indentList();
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  orderList(data): Promise<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    // return this.present('messagesService.loadMessagesOverview', 'Loading...').then(() => {
    return this.http
      .post(endpointAddress + '/list_order', data, httpOptions)
      .toPromise()
      .then((res: any) => {
        //console.log("order service res", res);
        if (res.statusCode == '200') {
          this._order_list$.next(res.message);
          // this.ListCount = res.order_count;
          this._totalCount$.next(res.order_count);
        }
        else if (res.statusCode == '400') {
          this._order_list$.next(res);
        }
        //  console.log('result order---', res);
        // this._totalCount$.next(res.order_count);
        //this._order_list$.next(res.message);
        // this._initializeOrderCount$.next(res.order_count);
        // setTimeout(() =>{
        //   this.dismiss('messagesService.loadMessagesOverview');
        // },1000)

      })
      .catch((data: any) => Promise.resolve());
    // });
  }



  indentList(request): Promise<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };

    return this.http
      .post(endpointAddress + '/list_indent', request, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log("indent service res", res);
        if (res.statusCode == '200') {
          this._indent_list$.next(res.message);
          this.ListIndCount = res.indent_count;
          this._initializeIndentCount$.next(res.indent_count);
          // console.log("indentcount", this.ListIndCount);
        }
        else if (res.statusCode == '400') {
          this._indent_list$.next(res.message);
        }
        //   console.log('result indent---', res);
      })
      .catch((data: any) => Promise.resolve());
  }


  filterOrder(data) {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    this.http
      .post(endpointAddress + '/list_order', data, httpOptions)
      .toPromise()
      .then((res: any) => {
        console.log('filtered data:', res);
        this._totalCount$.next(res.order_count);
        this._order_list$.next(res.message);
      });
  }

  filterIndent(data) {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    this.http
      .post(endpointAddress + '/list_indent', data, httpOptions)
      .toPromise()
      .then((res: any) => {
        // console.log('filtered data:', res);
        this._initializeIndentCount$.next(res.indent_count);
        this._indent_list$.next(res.message);

      });
  }

  filterListData(): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    return this.http.post(endpointAddress + '/user_dropDown', '', httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }


  filterProductCategory(data) {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    return this.http.post(endpointAddress + '/list_filter_product', data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  filterIndentCategory(data) {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    return this.http.post(endpointAddress + '/list_filter_indent', data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getProducts(): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    return this.http.post(endpointAddress + '/list_filter_order', {}, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  createOrder(createProjectRequest): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    return this.http
      .post(endpointAddress + '/create_order', createProjectRequest, httpOptions)
      .pipe(
        tap((result) => {
          this.orderList("")
        }),
        catchError(this.handleError)
      );
    // map(this.extractData), catchError(this.handleError<any>('createorder')));
  }

  createIndent(createProjectRequest): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    console.log('Token', httpOptions);
    return this.http
      .post(endpointAddress + '/create_indent', createProjectRequest, httpOptions)
      .pipe(
        tap((result) => {
          this.indentList("")
        }),
        catchError(this.handleError)
      );
    // map(this.extractData), catchError(this.handleError<any>('createIndent')));
  }

  orderUpdate(createProjectRequest): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    return this.http
      .post(endpointAddress + '/update_order', createProjectRequest, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  indentUpdate(createProjectRequest): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    return this.http
      .post(endpointAddress + '/update_indent', createProjectRequest, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  updateMultipleOrderStatus(data) {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    return this.http
      .post(endpointAddress + '/update_order_status', data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  farmerList(): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };
    const datta: any = { district: [], place: [], agency_name: [] };
    return this.http
      .post(endpointAddress + '/farmer_list', datta, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
      console.log("error", errorMessage)
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.log("error", errorMessage)
    }
    // window.alert(errorMessage);
    return throwError(errorMessage);
  }

  async present(loadingId: string, loadingMessage: string) {
    const loading = await this.loadingController.create({
      id: loadingId,
      message: loadingMessage,
      cssClass: 'custom-class custom-loading',
      spinner: 'lines-small',

    });
    return await loading.present();
  }

  async dismiss(loadingId: string) {
    return await this.loadingController.dismiss(null, null, loadingId);
  }
}