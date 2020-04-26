import { TestBed } from '@angular/core/testing';

import { ParameterControlPathService } from './path-controls.service';

describe('NavigationPathService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParameterControlPathService = TestBed.get(ParameterControlPathService);
    expect(service).toBeTruthy();
  });
});
