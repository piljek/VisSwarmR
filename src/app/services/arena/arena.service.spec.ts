import { TestBed } from '@angular/core/testing';

import { ArenaService } from './arena.service';

describe('ArenaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArenaService = TestBed.get(ArenaService);
    expect(service).toBeTruthy();
  });
});
