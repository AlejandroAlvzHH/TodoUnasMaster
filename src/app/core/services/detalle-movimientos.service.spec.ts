import { TestBed } from '@angular/core/testing';

import { DetalleMovimientosService } from './detalle-movimientos.service';

describe('DetalleMovimientosService', () => {
  let service: DetalleMovimientosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleMovimientosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
