import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFarmerPage } from './add-farmer.page';

describe('AddFarmerPage', () => {
  let component: AddFarmerPage;
  let fixture: ComponentFixture<AddFarmerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddFarmerPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFarmerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
