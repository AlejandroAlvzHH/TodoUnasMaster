import { TestBed } from '@angular/core/testing';

import { SincronizacionPendienteService } from './sincronizacion-pendiente.service';

describe('SincronizacionPendienteService', () => {
  let service: SincronizacionPendienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SincronizacionPendienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
