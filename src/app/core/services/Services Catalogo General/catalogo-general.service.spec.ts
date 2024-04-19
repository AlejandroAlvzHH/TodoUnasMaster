import { TestBed } from '@angular/core/testing';

import { CatalogoGeneralService } from './catalogo-general.service';

describe('CatalogoGeneralService', () => {
  let service: CatalogoGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogoGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
