import { TestBed } from '@angular/core/testing';

import { CatalogoSincronizacionService } from './catalogo-sincronizacion.service';

describe('CatalogoSincronizacionService', () => {
  let service: CatalogoSincronizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogoSincronizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
