import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductActionPage } from './product-action.page';

describe('ProductActionPage', () => {
  let component: ProductActionPage;
  let fixture: ComponentFixture<ProductActionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductActionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductActionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
