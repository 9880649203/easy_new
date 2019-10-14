import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, } from '@angular/common/http';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';

const endpointAddress = 'http://134.209.147.129:3001';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  token = localStorage.getItem('token')
  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': this.token,
    }),
  };

  // Observable
  public _orderArea$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _orderArea = this._orderArea$.asObservable();
  public _successfullIndent$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _successfullIndent = this._successfullIndent$.asObservable();
  public _orderOpen$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _orderOpen = this._orderOpen$.asObservable();
  public _orderCancel$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _orderCancel = this._orderCancel$.asObservable();


  constructor(private http: HttpClient) {
  }


  getOrderArea(request): Promise<any> {
    this.token = localStorage.getItem('token')
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': this.token,
      }),
    };
    return this.http
      .post(endpointAddress + '/order_per_area', request, this.httpOptions)
      .toPromise()
      .then((response: any) => {
        if (response.statusCode == '200') {
          this._orderArea$.next(response.data)
        }
      })
      .catch((data: any) => Promise.resolve());

  }
  getSuccessfullIndent(request): Promise<any> {
    this.token = localStorage.getItem('token')
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': this.token,
      }),
    };
    return this.http
      .post(endpointAddress + '/indent_stats', request, this.httpOptions)
      .toPromise()
      .then((response: any) => {
        if (response.statusCode == '200') {
          this._successfullIndent$.next(response.data)
        }
      })
      .catch((data: any) => Promise.resolve());

  }
  getOrderOpen(request): Promise<any> {
    this.token = localStorage.getItem('token')
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': this.token,
      }),
    };
    return this.http
      .post(endpointAddress + '/open_orders', request, this.httpOptions)
      .toPromise()
      .then((response: any) => {
        if (response.statusCode == '200') {
          this._orderOpen$.next(response.data)
        }
      })
      .catch((data: any) => Promise.resolve());

  }
  getOrderCancel(request): Promise<any> {
    this.token = localStorage.getItem('token')
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': this.token,
      }),
    };
    return this.http
      .post(endpointAddress + '/cancelled_orders', request, this.httpOptions)
      .toPromise()
      .then((response: any) => {
        if (response.statusCode == '200') {
          this._orderCancel$.next(response.data)
        }
      })
      .catch((data: any) => Promise.resolve());

  }
}
