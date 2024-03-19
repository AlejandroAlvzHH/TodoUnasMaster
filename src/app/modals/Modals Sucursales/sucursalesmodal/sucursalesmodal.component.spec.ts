import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalesmodalComponent } from './sucursalesmodal.component';

describe('SucursalesmodalComponent', () => {
  let component: SucursalesmodalComponent;
  let fixture: ComponentFixture<SucursalesmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalesmodalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SucursalesmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
