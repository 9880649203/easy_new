import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  public _closePopover$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public _closePopover = this._closePopover$.asObservable();

  constructor() { }
}
