import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController } from '@ionic/angular';
import {AdminConsolePage} from '../../modal/admin-console/admin-console.page';
import { RoleBaseAccesService } from 'src/app/service/role-base-acces.service';

@Component({
  selector: 'app-adminconsole',
  templateUrl: './adminconsole.page.html',
  styleUrls: ['./adminconsole.page.scss'],
})
export class AdminconsolePage {
  panelOpenState = false;
  admin_arry =[
  {
   "name":"admin",
   "access":[
        {
        "name":"dashboard",
        "view":true,"edit":true,"create":false,
         },
        { "name":"dashboard_View",
         "view":true,"edit":true,"create":false,
        },
        {
       "name":"dashboard_View1",
        "view":true,"edit":true,"create":false,
        },
        {
          "name":"dashboard_View2",
         "view":true,"edit":true,"create":false,
        },
        {"name":"product",
         "view":true,"edit":true,"create":true,
        },
        {"name":"orders",
         "view":true,"edit":true,"create":true,
        },
        {"name":"indent",
         "view":true,"edit":false,"create":false
        },
        {"name":"user_agency",
        "view":true,"edit":true,"create":true
       },
       {"name":"user_agency",
       "view":true,"edit":true,"create":true
      },
      {"name":"users_feildAgent",
       "view":true,"edit":false,"create":true
      },
      {"name":"user_others",
       "view":true,"edit":false,"create":false
      },
      {"name":"formadata",
      "view":true,"edit":false,"create":false
     },
     {"name":"admin_console",
     "view":true,"edit":false,"create":false
     }
    ]
  },
  {
    "name":"field_agent",
    "access":[
         {
         "name":"dashboard",
         "view":true,"edit":true,"create":false,
          },
         { "name":"dashboard_View",
          "view":true,"edit":true,"create":false,
         },
         {
        "name":"dashboard_View1",
         "view":true,"edit":true,"create":false,
         },
         {
           "name":"dashboard_View2",
          "view":true,"edit":true,"create":false,
         },
         {"name":"product",
          "view":true,"edit":true,"create":true,
         },
         {"name":"orders",
          "view":true,"edit":true,"create":true,
         },
         {"name":"indent",
          "view":true,"edit":false,"create":false
         },
         {"name":"user_agency",
         "view":true,"edit":true,"create":true
        },
        {"name":"user_agency",
        "view":true,"edit":true,"create":true
       },
       {"name":"users_feildAgent",
        "view":true,"edit":false,"create":true
       },
       {"name":"user_others",
        "view":true,"edit":false,"create":false
       },
       {"name":"formadata",
       "view":true,"edit":false,"create":false
      },
      {"name":"admin_console",
      "view":true,"edit":false,"create":false
      }
     ],
   },
 
];

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public roleService:RoleBaseAccesService
  ) {
    this.roleService.getRoles().then(data => {
      this.roleService._roleList$.subscribe(data => {
        let role = JSON.parse(localStorage.getItem('user')).role;
        if (data.length > 0) {
          this.roleService.role_list = []
          this.roleService.role_list = data.filter((item) => item.name === role)
          this.roleService.role_list = this.roleService.role_list[0].role;
          this.roleService.loggedInUser = this.roleService.role_list[0].name
          this.roleService.determineRoleBasedAccess();
                 }
      });
    })
  }

  ngOnInit() {
  }

  AdminConsole(): Promise<void> {
    return this.modalCtrl.create({
      component: AdminConsolePage,
      backdropDismiss:true,
      componentProps: {modalType: 'viewAdmin', modelController: this.modalCtrl }
    })
      .then(popover => popover.present());
  }
}

