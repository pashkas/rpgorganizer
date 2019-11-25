import { TestBed } from '@angular/core/testing';

import { EnamiesService } from './enamies.service';

describe('EnamiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnamiesService = TestBed.get(EnamiesService);
    expect(service).toBeTruthy();
  });
});
