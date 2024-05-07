import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarContrasenasComponent } from './agregar-contrasenas.component';

describe('AgregarContrasenasComponent', () => {
  let component: AgregarContrasenasComponent;
  let fixture: ComponentFixture<AgregarContrasenasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarContrasenasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarContrasenasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
