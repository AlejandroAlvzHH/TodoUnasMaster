import { TestBed } from '@angular/core/testing';

import { SidebaropeningService } from './sidebaropening.service';

describe('SidebaropeningService', () => {
  let service: SidebaropeningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebaropeningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
