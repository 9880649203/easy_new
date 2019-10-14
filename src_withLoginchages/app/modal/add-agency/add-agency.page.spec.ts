import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAgencyPage } from './add-agency.page';

describe('AddAgencyPage', () => {
  let component: AddAgencyPage;
  let fixture: ComponentFixture<AddAgencyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAgencyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAgencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
