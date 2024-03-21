import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Products } from '../../../../Models/products';
import { ApiService } from '../../../../core/services/Services Catalogo General/api.service';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';

@Component({
  selector: 'app-catalogo-general',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent],
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
            <a href="#" class="opcion">Filtro</a>
            <a href="#" class="opcion">Filtro</a>
            <a href="#" class="opcion">Filtro</a>
            <a href="#" class="opcion">Filtro</a>
            <a href="#" class="opcion">Generar Reporte</a>
            <a href="#" class="opcion">Agregar Producto</a>
          </div>
        </div>
        <div>
          <form>
            <input type="text" placeholder="Buscar por nombre" #filter />
            <button
              class="primary"
              type="button"
              (click)="filterResults(filter.value)"
            >
              Ir
            </button>
          </form>
          </div>
        <div>
          <table border="2">
            <thead>
              <tr>
                <th scope="col">Id_Artículo</th>
                <th scope="col">Clave</th>
                <th scope="col">Nombre</th>
                <th scope="col">Existencia</th>
                <th scope="col">Precio de Compra</th>
                <th scope="col">Precio de Venta</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of filteredProductsList">
                <td>{{ product.idArticulo }}</td>
                <td>{{ product.clave }}</td>
                <td>{{ product.nombre }}</td>
                <td>{{ product.existencia }}</td>
                <td>{{ product.precioCompra }}</td>
                <td>{{ product.precioVenta }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
  `,
  styleUrl: './catalogo-general.component.css',
})
export class CatalogoGeneralComponent {
  productsList: Products[] = [];
  apiService: ApiService = inject(ApiService);
  filteredProductsList: Products[] = [];
  isSidebarOpen: boolean = false;

  constructor(private sidebarOpeningService: SidebaropeningService) {
    this.apiService.getAllProducts().then((productsList: Products[]) => {
      this.productsList = productsList;
      this.filteredProductsList = productsList;
    });
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

  filterResults(text: string) {
    if (!text) {
      this.filteredProductsList = this.productsList;
      return;
    }

    this.filteredProductsList = this.productsList.filter((products) =>
      products?.nombre.toLowerCase().includes(text.toLowerCase())
    );
  }
}
