import { TestBed } from '@angular/core/testing';

import { RouteReuseService } from './route-reuse.service';

describe('RouteReuseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteReuseService = TestBed.get(RouteReuseService);
    expect(service).toBeTruthy();
  });
});
