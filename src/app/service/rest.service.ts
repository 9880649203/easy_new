import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, } from '@angular/common/http';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/internal/operators';
import { LoadingController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';


const endpointAddress = 'http://134.209.147.129:3001';
@Injectable({
    providedIn: "root"
})
export class RestService {


    successMsg: any;
    opendrop: boolean = false;
    dropDownDistrict: any = [];
    dropDownPlace: any = [];
    dropDownAgency: any = [];
    userListCount: any;
    farmerListCount: any;
    userType = "Agency Manager";
    roleType: any;
    // limit: any;
    countpage = 0;
    LIMITS = [
        { key: '10', value: 10 },
        { key: '20', value: 20 },
        { key: '30', value: 30 },
        { key: '40', value: 30 },
        { key: '50', value: 30 },
    ];

    token = localStorage.getItem('token')
    httpOptions = {
        headers: new HttpHeaders({
            'Content-type': 'application/json',
            'Authorization': this.token,
        }),
    };

    // Observable
    public _createdUser: any;
    public _userList$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public _userList = this._userList$.asObservable();
    public _userDropDownList$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public _userDropDownList = this._userDropDownList$.asObservable();
    public _farmerList$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public _farmerList = this._farmerList$.asObservable();
    public _farmerDropDownList$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public _farmerDropDownList = this._farmerDropDownList$.asObservable();
    public _creationSuccess: boolean = false;
    public saveStateAgGrid
    public _saveStateAgGrid$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public _saveStateAgGrid = this._saveStateAgGrid$.asObservable();
    constructor(private http: HttpClient, private loadingCtrl: LoadingController, private toastr: ToastrService) {
        // this.getUserDropDownList().subscribe((response) => {
        // this._userDropDownList$.next(response)
        // })
    }

    private extractData(res: Response) {
        let body = res;
        return body || {};
    }
    limit: number = this.LIMITS[0].value;

    getFarmer(request): Promise<any> {
        this.token = localStorage.getItem('token')
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'Authorization': this.token,
            }),
        };
        return this.http
            .post(endpointAddress + '/farmer_list', request, this.httpOptions)
            .toPromise()
            .then((response: any) => {
                if (response.statusCode == '200') {
                    this._farmerList$.next(response.data);
                    this.farmerListCount = response.count;

                }
                else if (response.statusCode == '400') {
                    this._farmerList$.next(response.data);
                    this.farmerListCount = response.count;
                }
            })
            .catch(this.handleError<any>('farmer list'))

    }
    createFarmer(request): Promise<any> {
        this.token = localStorage.getItem('token')
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'Authorization': this.token,
            }),
        };
        return this.http
            .post(endpointAddress + '/farmer_create', request, this.httpOptions)
            .toPromise()
            .then((response: any) => {
                if (response.statusCode == '200') {
                    this.successMsg = 'created successfully'
                    let req = {
                        roleType: this.roleType
                    }
                    this.getFarmer(req);
                    this._creationSuccess = true;
                    this._createdUser = response.data.farmer_id;
                }
            })
            .catch(this.handleError<any>('farmer create'))
    }
    updateFarmer(request): Promise<any> {
        this.token = localStorage.getItem('token')
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'Authorization': this.token,
            }),
        };
        // console.log("user list", re)
        return this.http
            .post(endpointAddress + '/farmer_update', request, this.httpOptions)
            .toPromise()
            .then((response: any) => {
                if (response.statusCode == '200') {
                    this.successMsg = 'updated successfully'
                    let req = {
                        roleType: this.roleType
                    }
                    this.getFarmer(req);
                    this._creationSuccess = true;
                }
            })
            .catch(this.handleError<any>('farmer update'))
    }
    getFarmerDropdown(request): Observable<any> {
        this.token = localStorage.getItem('token')
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'Authorization': this.token,
            }),
        };
        return this.http.post<any>(endpointAddress + '/farmer_dropDown', request, this.httpOptions).pipe(
            tap((response) => {
                if (response.statusCode == '200') {
                    this._farmerDropDownList$.next(response);
                }
                else if (response.statusCode == '400') {
                    this._farmerDropDownList$.next(response);
                }
            }),
            catchError(this.handleError<any>('userDropdown'))
        );

    }
    getUserDropDownList(request): Observable<any> {
        this.token = localStorage.getItem('token')
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'Authorization': this.token,
            }),
        };
        return this.http.post<any>(endpointAddress + '/user_dropDown', request, this.httpOptions).pipe(
            tap((result) => {
                if (result) {
                    this._userDropDownList$.next(result);
                }
            }),
            catchError(this.handleError<any>('userDropdown'))
        );
    }
    getUser(data): Promise<any> {
        this.token = localStorage.getItem('token')
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'Authorization': this.token,
            }),
        };
        return this.http
            .post(endpointAddress + '/user_list', data, this.httpOptions)
            .toPromise()
            .then((response: any) => {
                if (response.statusCode == '200') {
                    this._userList$.next(response.data);
                    this.userListCount = response.count
                }
                else if (response.statusCode == '400') {
                    this._userList$.next(response.data);
                    this.userListCount = response.count
                }

            })
            .catch(this.handleError<any>('user list'))
    }
    createUserManager(request): Promise<any> {
        this.token = localStorage.getItem('token')
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'Authorization': this.token,
            }),
        };
        return this.http
            .post(endpointAddress + '/user_create', request, this.httpOptions)
            .toPromise()
            .then((response: any) => {
                if (response.statusCode == '200') {
                    this.successMsg = 'created successfully'
                    let sendObjData = {
                        "page": this.countpage,
                        "limit": this.limit,
                        "userType": this.userType,
                        "roleType": this.roleType
                    }
                    this.getUser(sendObjData);
                    this._createdUser = response.data.uid;
                    this._creationSuccess = true;
                }
            })
            .catch(this.handleError<any>('user create'))
    }
    updateUserManager(request): Promise<any> {
        this.token = localStorage.getItem('token')
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'Authorization': this.token,
            }),
        };
        // console.log("user list", re)
        return this.http
            .post(endpointAddress + '/user_update', request, this.httpOptions)
            .toPromise()
            .then((response: any) => {
                if (response.statusCode == '200') {
                    this.successMsg = 'updated successfully'
                    let sendObjData = {
                        "page": this.countpage,
                        "limit": this.limit,
                        "userType": this.userType,
                        "roleType": this.roleType
                    }
                    this.getUser(sendObjData);
                    this._creationSuccess = true;
                }
            })
            .catch(this.handleError<any>('user update'))
    }
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            this._creationSuccess = false;;
            // if (status == '500') {
            //     this.successMsg = 'can not be updated';
            // }
            // else {
            //     this.successMsg = error.error.message;
            // }
            // if (status == '500') {
            this.toastr.error(error.error.message);
            // }
            // if (status == '401') {
            //     this.toastr.error('Unauthorized Access. You do not have permission to perform this action. Contact your supervisor.');
            // }
            // if (status == '404') {
            //     this.toastr.error('data not found');
            // }
            // if (status == '400') {
            //     this.toastr.error('Mandatory field is missing. Please enter');
            // }


            console.log(`${operation} failed: ${error.error.message}`);
            return of(result as T);
        };
    }

}


