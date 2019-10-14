// Dependency Imports
import { Injectable } from '@angular/core';

@Injectable()
export class LoginData {
  loginData_other: Object = {
    mobile_no: "",
    password: "",
    status: "active",
    requestor_type: "admin_app",
  }
  loginData_FA: Object = {
    mobile_no: "",
    password: "",
    status: "active",
    requestor_type: "FA_app",
  }

}