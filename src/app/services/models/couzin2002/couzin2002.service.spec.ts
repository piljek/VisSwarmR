import { TestBed } from '@angular/core/testing';

import { Couzin2002Model } from './couzin2002.service';

describe('Couzin2002Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Couzin2002Model = TestBed.get(Couzin2002Model);
    expect(service).toBeTruthy();
  });
});
