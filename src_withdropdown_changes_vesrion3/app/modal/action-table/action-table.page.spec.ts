import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionTablePage } from './action-table.page';

describe('ActionTablePage', () => {
  let component: ActionTablePage;
  let fixture: ComponentFixture<ActionTablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionTablePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
