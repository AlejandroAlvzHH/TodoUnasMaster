import { TestBed } from '@angular/core/testing';

import { HistoricosMovimientosDetalleService } from './historicos-movimientos-detalle.service';

describe('HistoricosMovimientosDetalleService', () => {
  let service: HistoricosMovimientosDetalleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricosMovimientosDetalleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
