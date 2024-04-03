import { TestBed } from '@angular/core/testing';

import { HistoricosMovimientosService } from './historicos-movimientos.service';

describe('HistoricosMovimientosService', () => {
  let service: HistoricosMovimientosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricosMovimientosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
