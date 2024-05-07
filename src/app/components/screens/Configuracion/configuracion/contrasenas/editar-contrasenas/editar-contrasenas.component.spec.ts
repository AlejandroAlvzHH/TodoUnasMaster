import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarContrasenasComponent } from './editar-contrasenas.component';

describe('EditarContrasenasComponent', () => {
  let component: EditarContrasenasComponent;
  let fixture: ComponentFixture<EditarContrasenasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarContrasenasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarContrasenasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
