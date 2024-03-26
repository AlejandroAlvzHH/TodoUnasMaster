import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Products } from '../../../../Models/Factuprint/products';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';
import { TablaCatalogoComponent } from '../tabla-catalogo/tabla-catalogo.component';

@Component({
  selector: 'app-catalogo-general',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, TablaCatalogoComponent],
  template: `
    <app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <h1>CATÁLOGO GENERAL</h1>
      <div class="menu-container">
        <div class="menu">
          <a href="#" class="opcion">Generar Reporte</a>
          <a href="#" class="opcion">Agregar Producto</a>
        </div>
      </div>
      <app-tabla-catalogo></app-tabla-catalogo>
    </main>
  `,
  styleUrl: './catalogo-general.component.css',
})
export class CatalogoGeneralComponent {
  productsList: Products[] = [];
  filteredProductsList: Products[] = [];
  isSidebarOpen: boolean = false;

  constructor(private sidebarOpeningService: SidebaropeningService) {
  }

  toggleSidebar(): void {
    console.log('Toggle');
    this.sidebarOpeningService.toggleSidebar();
  }

  ngOnInit(): void {
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
  }
}
