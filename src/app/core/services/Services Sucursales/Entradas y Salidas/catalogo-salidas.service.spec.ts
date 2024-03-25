import { TestBed } from '@angular/core/testing';

import { CatalogoSalidasService } from './catalogo-salidas.service';

describe('CatalodoSalidasService', () => {
  let service: CatalogoSalidasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogoSalidasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
