import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricosDetalleComponent } from './historicos-detalle.component';

describe('HistoricosDetalleComponent', () => {
  let component: HistoricosDetalleComponent;
  let fixture: ComponentFixture<HistoricosDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricosDetalleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoricosDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
