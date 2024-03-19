import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Products } from '../../../../Models/products';
import { ApiService } from '../../../../core/services/Services Catalogo General/api.service';

@Component({
  selector: 'app-catalogo-general',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <aside class="sidebar">
        <ul>
          <li><a href="/">Sucursales</a></li>
          <li><a href="/catalogogeneral">Catálogo General</a></li>
          <li><a href="/historicos">Históricos</a></li>
          <li><a href="/configuracion">Configuración</a></li>
        </ul>
      </aside>
      <main class="main-content">
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
        <section>
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
        </section>
        <section>
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
        </section>
      </main>
    </div>
  `,
  styleUrl: './catalogo-general.component.css',
})
export class CatalogoGeneralComponent {
  productsList: Products[] = [];
  apiService: ApiService = inject(ApiService);
  filteredProductsList: Products[] = [];

  constructor() {
    this.apiService.getAllProducts().then((productsList: Products[]) => {
      this.productsList = productsList;
      this.filteredProductsList = productsList;
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
