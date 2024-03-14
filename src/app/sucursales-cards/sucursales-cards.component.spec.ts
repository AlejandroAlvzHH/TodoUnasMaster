import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalesCardsComponent } from './sucursales-cards.component';

describe('SucursalesCardsComponent', () => {
  let component: SucursalesCardsComponent;
  let fixture: ComponentFixture<SucursalesCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalesCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SucursalesCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
