import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifysucursalmodalComponent } from './modifysucursalmodal.component';

describe('ModifysucursalmodalComponent', () => {
  let component: ModifysucursalmodalComponent;
  let fixture: ComponentFixture<ModifysucursalmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifysucursalmodalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifysucursalmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
