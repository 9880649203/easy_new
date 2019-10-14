import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/internal/operators';



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

  constructor(private plt: Platform, private http: HttpClient, public router: Router) {
  }


  login(sendObjData): Observable<any> {

    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }

    return this.http.post<any>(endpointAddress, sendObjData, httpOptions).pipe(
      tap((result) => {
        if (result.jwt_token) {
          localStorage.setItem('token', result.jwt_token);
          localStorage.setItem('user', JSON.stringify(result.user));
          this._loggedInUser$.next(result.jwt_token);
        }
      }),
      catchError(this.handleError<any>('login'))
    );
  }

  canActivate(): boolean {
    const token = localStorage.getItem('token');
        if (token == null)   {
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }


    // canActivate(): boolean {
    //   const token = localStorage.getItem('token');
    //       if (token !== null)   {
    //           this.router.navigate(['login']);
    //           return false;
    //       }
    //       return true;
    //   }

  logout() {
    localStorage.removeItem('token');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

}
