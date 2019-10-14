import { Component, OnInit } from '@angular/core';
import { RoleBaseAccesService } from '../../service/role-base-acces.service';
import { Event as NavigationEvent } from "@angular/router";
import { filter } from "rxjs/operators";
import { Router, NavigationStart } from '@angular/router';
import { ConfigService } from '../../service/config.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public roleService: RoleBaseAccesService, public router: Router, public config: ConfigService, public menuCtrl: MenuController) {
    this.menuCtrl.enable(false);
    
    //logout while clicking backword and reached in login url
    this.router.events
      .pipe(
        filter(
          (event: NavigationEvent) => {
            return (event instanceof NavigationStart);
          }
        )
      )
      .subscribe(
        (event: NavigationStart) => {
          console.group("NavigationStart Event");
          console.log("navigation id:", event.id);
          console.log("route:", event.url);
          // this.config.opendrop = false;
          if (event.url !== '/login') {
            this.config.opendrop = false;
          }
          console.log("trigger:", event.navigationTrigger);
          if (event.restoredState) {
            console.warn(
              "restoring navigation id:",
              event.restoredState.navigationId
            );

          }
        })


    // this.roleService.getRoles().then(response => {
    //   this.roleService._roleList$.subscribe(data => {
    //     let role = JSON.parse(localStorage.getItem('user')).role;
    //     if (data.length > 0) {
    //       this.roleService.role_list = []
    //       this.roleService.role_list = data.filter((item) => item.name === role)
    //       this.roleService.role_list = this.roleService.role_list[0].role;
    //       this.roleService.loggedInUser = this.roleService.role_list[0].name
    //       console.log("home service", this.roleService.role_list)
    //       this.roleService.determineRoleBasedAccess();
    //       if (this.roleService.viewAgencyManager || this.roleService.viewFieldAgent || this.roleService.viewOthers) {
    //         this.toggleAddUser = true;
    //       }
    //       else {
    //         this.toggleAddUser = false;
    //       }
    //     }
    //   });
    // })
  }

 

  ngOnInit() {
  }

}
