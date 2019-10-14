// Dependency Imports
import { Injectable } from '@angular/core';

@Injectable()
export class UserModel {
  AddUser: Object = {
    // agency_id: '',
    agency_name: '',
    parent_ageny: '',
    first_name: '',
    last_name: '',
    mobile_no: '',
    role: '',
    password: '',
    aadhar_no: '',
    gender: 'male',
    dob: '',
    place: '',
    pincode: '',
    country: '',
    state: '',
    district: '',
    user_level: '',
  }
  AddFieldAgent: Object = {
    // agent_id: '',
    // agency_id: '',
    // agency_name: '',
    first_name: '',
    last_name: '',
    mobile_no: '',
    role: '',
    password: '',
    aadhar_no: '',
    gender: 'male',
    dob: '',
    place: '',
    pincode: '',
    country: '',
    state: '',
    district: '',
    user_level: '6',
  }

}