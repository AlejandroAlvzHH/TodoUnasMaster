import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraspasosClinicaComponent } from './traspasos-clinica.component';

describe('TraspasosClinicaComponent', () => {
  let component: TraspasosClinicaComponent;
  let fixture: ComponentFixture<TraspasosClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraspasosClinicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TraspasosClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
