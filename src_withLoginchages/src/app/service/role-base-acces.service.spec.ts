import { TestBed } from '@angular/core/testing';

import { RoleBaseAccesService } from './role-base-acces.service';

describe('RoleBaseAccesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoleBaseAccesService = TestBed.get(RoleBaseAccesService);
    expect(service).toBeTruthy();
  });
});
