import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { AppComponent } from '../app.component';
import {DashboardService} from '../service/dashboard.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})


export class GuardsService  implements CanDeactivate<AppComponent> {
  Rouets:any


  constructor( private rouetChange:DashboardService,public router: Router ) {
    this.rouetChange._route_change$.subscribe((e)=>{
     this.Rouets = e;
    })
   }

  canDeactivate(component:AppComponent):boolean{
    if(component){
      
      return confirm("are you sure you want to leave this page")
    }
    else{
      localStorage.removeItem('token');
      return true;
    }
    
    }


    canDeaActivate(): boolean {
      const token = localStorage.getItem('token');
          if (token !== null)   {
              this.router.navigate(['dashboard']);
              return true;
          }
          return false;
      }



}
