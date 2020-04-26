import { TestBed } from '@angular/core/testing';

import { ParameterControlService } from './parameter.service';

describe('NavigationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParameterControlService = TestBed.get(ParameterControlService);
    expect(service).toBeTruthy();
  });
});
