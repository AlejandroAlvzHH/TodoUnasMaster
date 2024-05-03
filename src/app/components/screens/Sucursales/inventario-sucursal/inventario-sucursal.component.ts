import { Component } from '@angular/core';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';
import { HeaderComponent } from '../../../header/header.component';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { ActivatedRoute } from '@angular/router';
import { Branches } from '../../../../Models/Master/branches';
import { TablaProductosSucursalComponent } from './tabla-productos-sucursal.component';

@Component({
  selector: 'app-inventario-sucursal',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    CommonModule,
    TablaProductosSucursalComponent,
  ],
  template: `
    <app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <div class="title-container">
        <h1 class="mayusculas">INVENTARIO DE {{ sucursal?.nombre }}</h1>
      </div>
      <app-tabla-productos-sucursal [baseUrl]="sucursal?.url"></app-tabla-productos-sucursal>
    </main>
  `,
  styleUrl: './inventario-sucursal.component.css',
})
export class InventarioSucursalComponent {
  isSidebarOpen: boolean = false;
  sucursal: Branches | null = null;

  constructor(
    private sidebarOpeningService: SidebaropeningService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
    this.obtenerDetalleSucursal();
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

  toggleSidebar(): void {
    this.sidebarOpeningService.toggleSidebar();
  }
}
