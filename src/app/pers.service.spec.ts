import { TestBed } from '@angular/core/testing';

import { PersService } from './pers.service';

describe('PersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersService = TestBed.get(PersService);
    expect(service).toBeTruthy();
  });
});
