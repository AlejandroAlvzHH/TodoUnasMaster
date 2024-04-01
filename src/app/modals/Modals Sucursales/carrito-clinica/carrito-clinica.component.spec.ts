import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoClinicaComponent } from './carrito-clinica.component';

describe('CarritoClinicaComponent', () => {
  let component: CarritoClinicaComponent;
  let fixture: ComponentFixture<CarritoClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoClinicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarritoClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
