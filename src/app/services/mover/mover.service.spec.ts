import { TestBed } from '@angular/core/testing';

import { MoverService } from './mover.service';

describe('MoverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoverService = TestBed.get(MoverService);
    expect(service).toBeTruthy();
  });
});
