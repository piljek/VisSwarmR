import { TestBed } from '@angular/core/testing';

import { Reynolds1999Model } from './reynolds1999.service';

describe('Reynolds1999Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Reynolds1999Model = TestBed.get(Reynolds1999Model);
    expect(service).toBeTruthy();
  });
});
