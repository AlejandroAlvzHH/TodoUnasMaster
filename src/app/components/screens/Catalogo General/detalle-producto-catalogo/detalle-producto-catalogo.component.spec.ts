import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleProductoCatalogoComponent } from './detalle-producto-catalogo.component';

describe('DetalleProductoCatalogoComponent', () => {
  let component: DetalleProductoCatalogoComponent;
  let fixture: ComponentFixture<DetalleProductoCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleProductoCatalogoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleProductoCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
