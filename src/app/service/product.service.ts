import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Product } from '../model/product.model';
import { delay } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { throwError } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../service/authentication.service';
const endpointAddress = 'http://134.209.147.129:3001';
import { LoadingController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
//const token = localStorage.getItem('token');

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  result: any = [];
  token: any;

  public _initializeCategory$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _initializeCategory = this._initializeCategory$.asObservable();

  public _product$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _product = this._product$.asObservable();

  public _barnd$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _barnd = this._barnd$.asObservable();

  public _company$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _company = this._company$.asObservable();

  public _clear$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _clear = this._clear$.asObservable();

  public _list$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _list = this._list$.asObservable();

  public _product_list$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _product_list = this._product_list$.asObservable();

  public _filterProductsKeys$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public _filterProductsKeys = this._filterProductsKeys$.asObservable();

  products: Product[]
  constructor(private http: HttpClient,  private toastr: ToastrService, private auth: AuthenticationService, public loadingController: LoadingController) {
    // this.auth._loggedInUser.subscribe(res => {
    //   this.token = res;
    //   console.log('sdd', this.token)
    // })
  }


  ngOnInit() {

  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }



  createProduct(createProjectRequest): Observable<any> {
    console.log('previous', this.token)
    this.token = localStorage.getItem('token')
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": this.token,
      })
    };
    var request = createProjectRequest;
    return this.http
      .post(endpointAddress + '/add_product', request, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError<any>('product create')));
  }

  productList(createProjectRequest): Observable<any> {
    this.token = localStorage.getItem('token')
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": this.token,
      })
    };
    var request = createProjectRequest;
    return this.http
      .post(endpointAddress + '/list_product', request, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError<any>('product list')));
  }



  productUpdate(product): Observable<any> {
    this.token = localStorage.getItem('token')
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": this.token,
      })
    };
    var request = product;
    return this.http
      .post(`${endpointAddress}/update_product`, request, httpOptions)
      .pipe(map(this.extractData)
      , catchError(this.handleError<any>('product update')));
  }


  filterData(request): Observable<any> {
    this.token = localStorage.getItem('token')
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": this.token,
      })
    };
  
    return this.http
      .post(`${endpointAddress}/list_filter_product`, request,httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }


  category_list(): Observable<any> {
    this.token = localStorage.getItem('token')
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": this.token,
      })
    };

    return this.http
      .post(`${endpointAddress}/list_category`, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  productView(productview): Observable<any> {
    this.token = localStorage.getItem('token')
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": this.token,
      })
    };
    var request = productview;
    return this.http
      .post(endpointAddress + '/view_product', request, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }



  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //     console.error("ahet is err",error);
  //     console.log(`${operation} failed: ${error.message}`);
  //     return of(result as T);
  //   };
  // }

  // handleError(error) {
  //   let errorMessage = '';
  //   if (error.error instanceof ErrorEvent) {
  //     // client-side error
  //     errorMessage = `Error: ${error.error.message}`;
  //     console.log("error hh", errorMessage);
  //     this._product_errors$.next(error.status);
  //   } else {
  //     // server-side error
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //     console.log("error me", error.status);
  //     this._product_errors$.next(error.status);

  //   }
  //   // window.alert(errorMessage);
  //   this._product_errors$.next(error.status);
  //   return throwError(errorMessage);
  // }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
        console.error(error);
        console.log("this is one",error.status)
       // console.log(error.error.message);
        if(error.status == 401){
    
          this.toastr.error(`Unauthorized Access. You don't have permission to perform this action. Contact your supervisor.`);
         }
        // else if(error.status == 404){
        //   this.toastr.error(`No products to show`);
         
        // }
        else if(error.status == 400){
          this.toastr.error(`Mandatory field is missing. Please enter.`);
         
        }
       else{
        this.toastr.error(`Problem with the service. Please try again after sometime`);
       
       }
        console.log(`${operation} failed: ${error.error.message}`);
        return of(result as T);
    };
}


}