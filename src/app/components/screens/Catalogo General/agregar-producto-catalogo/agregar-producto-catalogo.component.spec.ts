import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarProductoCatalogoComponent } from './agregar-producto-catalogo.component';

describe('AgregarProductoCatalogoComponent', () => {
  let component: AgregarProductoCatalogoComponent;
  let fixture: ComponentFixture<AgregarProductoCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarProductoCatalogoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarProductoCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
