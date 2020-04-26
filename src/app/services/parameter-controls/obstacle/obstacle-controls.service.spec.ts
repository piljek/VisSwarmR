import { TestBed } from '@angular/core/testing';

import { ParameterControlObstacleService } from './obstacle-controls.service';

describe('NavigationObstacleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParameterControlObstacleService = TestBed.get(ParameterControlObstacleService);
    expect(service).toBeTruthy();
  });
});
