import { TestBed } from '@angular/core/testing';

import { InventarioMasterService } from './inventario-master.service';

describe('InventarioMasterService', () => {
  let service: InventarioMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventarioMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
