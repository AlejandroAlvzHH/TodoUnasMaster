import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';
import { FormsModule } from '@angular/forms';
import { Sucursales } from '../../../../Models/sucursales';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { ActivatedRoute } from '@angular/router';
import { TablaProductosComponent } from '../../../tabla-productos/tabla-productos.component';
import { TablaCarritoComponent } from '../../../tabla-carrito/tabla-carrito.component';
@Component({
  selector: 'app-entradasysalidas',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    FormsModule,
    TablaProductosComponent,
    TablaCarritoComponent
  ],
  template: `<app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <h1>ENTRADAS Y SALIDAS</h1>
      <div class="switch-container">
        <button
          class="switch-btn"
          [class.active]="isEntradaSelected"
          (click)="selectEntrada()"
        >
          Entrada
        </button>
        <button
          class="switch-btn"
          [class.active]="!isEntradaSelected"
          (click)="selectSalida()"
        >
          Salida
        </button>
      </div>
      <button class="btn" (click)="confirmAction()">
        {{ isEntradaSelected ? 'Confirmar Entrada' : 'Confirmar Salida' }}
      </button>
      <div class="tables-container">
        <div class="table">
          <h2>Inventario en {{ sucursal?.nombre }}</h2>
          <app-tabla-productos></app-tabla-productos>
        </div>
        <div class="table">
          <h2>Ítems Seleccionados para {{ isEntradaSelected ? 'Entrada' : 'Salida' }}</h2>
          <app-tabla-carrito></app-tabla-carrito>
        </div>
      </div>
    </main> `,
  styleUrl: './entradasysalidas.component.css',
})
export class EntradasysalidasComponent implements OnInit {
  sucursal: Sucursales | null = null;
  isSidebarOpen: boolean = false;
  isEntradaSelected: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sidebarOpeningService: SidebaropeningService
  ) {}

  toggleSidebar(): void {
    console.log('Toggle');
    this.sidebarOpeningService.toggleSidebar();
  }

  selectEntrada(): void {
    this.isEntradaSelected = true;
  }

  selectSalida(): void {
    this.isEntradaSelected = false;
  }
  toggleSwitch(): void {
    this.isEntradaSelected = !this.isEntradaSelected;
  }

  confirmAction(): void {
    if (this.isEntradaSelected) {
      console.log('Confirmar Entrada');
    } else {
      console.log('Confirmar Salida');
    }
  }

  obtenerDetalleSucursal(): void {
    this.route.paramMap.subscribe((params) => {
      const sucursalId = params.get('id');
      if (sucursalId) {
        this.apiService.getSucursalById(parseInt(sucursalId, 10)).subscribe(
          (sucursal) => {
            this.sucursal = sucursal;
          },
          (error) => {
            console.error('Error al obtener la sucursal:', error);
          }
        );
      }
    });
  }

  ngOnInit(): void {
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
    this.obtenerDetalleSucursal();
  }
}
