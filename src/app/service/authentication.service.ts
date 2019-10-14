import { Platform, MenuController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/internal/operators';
import { ToastrService } from 'ngx-toastr';


const endpointAddress = 'http://134.209.147.129:3001/login';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  //to toggle side menu
  toggleSplitPane: boolean = true;

  public _loggedInUser$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public _loggedInUser = this._loggedInUser$.asObservable();
  public routeUrlSegmments: any[] = [];

  constructor(private toastr: ToastrService, private plt: Platform, private http: HttpClient, public router: Router, public menuCtrl: MenuController, ) {
  }


  login(sendObjData): Observable<any> {

    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }

    return this.http.post<any>(endpointAddress, sendObjData, httpOptions).pipe(
      tap((result) => {
        if (result.statusCode == '200') {
          if (result.jwt_token) {
            localStorage.setItem('token', result.jwt_token);
            localStorage.setItem('user', JSON.stringify(result.user));
            this._loggedInUser$.next(result.jwt_token);
            setTimeout(() => {
              this.menuCtrl.enable(true);
            }, 500)

          }
        }
      }),
      catchError(this.handleError<any>('login'))
    );
  }
  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token == null) {
      this.router.navigate(['login']);
      this.menuCtrl.enable(false);
      return false;
    }
    return true;
  }


  logout() {
    localStorage.removeItem('token');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
     // this.toastr.error(error.error.message);
      console.log(`${operation} failed: ${error.error.message}`);
      return of(result as T);
    };
  }

}
