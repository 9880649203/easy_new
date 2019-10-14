// Dependency Imports
import { Injectable } from '@angular/core';

@Injectable()
export class RoleBasedAccessData {

  viewDashboardPage: boolean = false;
  viewUserPage: boolean = false;
  viewAgencyPage: boolean = false;
  viewFarmDataPage: boolean = false;
  viewProductsPage: boolean = false;
  viewOrdersPage: boolean = false;
  viewIndentPage: boolean = false;
  viewAdminConsole: boolean = false;
  createOrder: boolean = false;
  editOrder: boolean = false;
  createAgency: boolean = false;
  deactivateAgency: boolean = false;
  editAgency: boolean = false;
  createSubAgency: boolean = false;
  editSubAgency: boolean = false;
  deactivateSubAgency: boolean = false;
  createFieldAgent: boolean = false;
  editFieldAgent: boolean = false;
  deactivateFieldAgent: boolean = false;

  createRole: boolean = false;
  deactivateRole: boolean = false;
  createProduct: boolean = false;
  editProduct: boolean = false;
  deactivateProduct: boolean = false;
  createProductCategory: boolean = false;
  editProductCategory: boolean = false;
  deactivateProductCategory: boolean = false;

  createFarmer: boolean = false;
  editFarmer: boolean = false;
  deactivateFarmer: boolean = false;

  constructor() { }
}
