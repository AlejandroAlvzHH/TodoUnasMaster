import { TestBed } from '@angular/core/testing';

import { CarritoComunicationService } from './carrito-comunication.service';

describe('CarritoComunicationService', () => {
  let service: CarritoComunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarritoComunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
