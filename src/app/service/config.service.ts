import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, } from '@angular/common/http';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/internal/operators';
import { Moment } from 'moment';
import * as moment_ from 'moment';
import { ToastrService } from 'ngx-toastr';

const moment = moment_;
const endpointAddress = 'http://134.209.147.129:3001';
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json',
  }),
  withCredentials: false
};

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  token = localStorage.getItem('token')
  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': this.token,
    }),
  };
  opendrop: boolean = false;
  public logedInUser: any;

  public _listCountry$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _listCountry = this._listCountry$.asObservable();

  public _listState$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _listState = this._listState$.asObservable();

  public _listDistrict$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _listDistrict = this._listDistrict$.asObservable();


  public _listAgency$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _listAgency = this._listAgency$.asObservable();

  public _setTab$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public _setTab = this._setTab$.asObservable();


  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.logedInUser = JSON.parse(localStorage.getItem('user'));
  }
  convertToMomentDate(date: Moment) {
    console.log("dat 2")
    var toppingArr = date.toString();
    var splitArray = toppingArr.split(" ");
    let saparatingTimeZone = splitArray[5];
    let splitingTimeZone = saparatingTimeZone.split("+")
    let dateFormat = splitArray[0] + " " + splitArray[1] + " " + splitArray[2] + " " + splitArray[4] + " GMT " + splitArray[3];
    return dateFormat;
  }

  DateMonthYear(event) {
    if (event != "Invalid Date") {
      // event.hour(24).toGMTString()
      var localDate = event.setHours(0, 0, 0, 0);
      var pre_moment_date = moment(localDate);
      var post_moment_date = this.convertToMomentDate(pre_moment_date);
      return post_moment_date;
    }
  };
  getCountry(data): Promise<any> {
    return this.http
      .post(endpointAddress + '/area_list', data, httpOptions)
      .toPromise()
      .then((response: any) => {
        if (response.statusCode == '200') {
          this._listCountry$.next(response.data)
        }
      })
      .catch(this.handleError<any>('area list'))
  }
  getState(data): Promise<any> {
    return this.http
      .post(endpointAddress + '/area_list', data, httpOptions)
      .toPromise()
      .then((response: any) => {
        if (response.statusCode == '200') {
          this._listState$.next(response.data)
        }
      })
      .catch(this.handleError<any>('area list'))
  }
  getDistrict(data): Promise<any> {
    return this.http
      .post(endpointAddress + '/area_list', data, httpOptions)
      .toPromise()
      .then((response: any) => {
        if (response.statusCode == '200') {
          this._listDistrict$.next(response.data)
        }
      })
      .catch(this.handleError<any>('area list'))
  }
  getAgency(): Promise<any> {
    this.token = localStorage.getItem('token')
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': this.token,
      }),
    };
    return this.http
      .post(endpointAddress + '/unique_agency_list', '', this.httpOptions)
      .toPromise()
      .then((response: any) => {
        if (response.statusCode == '200') {
          this._listAgency$.next(response.data)
        }
      })
      .catch(this.handleError<any>('agency list'))
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.toastr.error(error.error.message);
      console.log(`${operation} failed: ${error.error.message}`);
      return of(result as T);
    };
  }

}
