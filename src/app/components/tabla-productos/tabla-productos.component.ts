import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiService } from '../../core/services/Services Catalogo General/api.service';
import { Products } from '../../Models/products';
import { CarritoServiceService } from '../../core/services/Services Sucursales/carrito-service.service';

@Component({
  selector: 'app-tabla-productos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
    <form class="search-form">
        <div class="search-input">
          <input
            type="text"
            placeholder="Buscar por ID de artículo"
            (input)="filterByIdArticulo($event)"
          />
        </div>
        <div class="search-input">
          <input
            type="text"
            placeholder="Buscar por clave"
            (input)="filterByClave($event)"
          />
        </div>
        <div class="search-input">
          <input
            type="text"
            placeholder="Buscar por nombre"
            (input)="filterResults($event)"
          />
        </div>
      </form>
      <div>
        <table border="2">
          <thead>
            <tr>
              <th
                scope="col"
                (click)="ordenarPorColumna('idArticulo')"
                [class.interactive]="columnaOrdenada === 'idArticulo'"
              >
                Id_Artículo
                <i
                  *ngIf="columnaOrdenada === 'idArticulo'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('clave')"
                [class.interactive]="columnaOrdenada === 'clave'"
              >
                Clave
                <i
                  *ngIf="columnaOrdenada === 'clave'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('nombre')"
                [class.interactive]="columnaOrdenada === 'nombre'"
              >
                Nombre
                <i
                  *ngIf="columnaOrdenada === 'nombre'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('existencia')"
                [class.interactive]="columnaOrdenada === 'existencia'"
              >
                Existencia
                <i
                  *ngIf="columnaOrdenada === 'existencia'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of filteredProductsList">
              <td>{{ product.idArticulo }}</td>
              <td>{{ product.clave }}</td>
              <td>{{ product.nombre }}</td>
              <td>
                {{ product.existencia }}
                <button class="btn" (click)="agregarAlCarrito(product)">
                  Agregar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrl: './tabla-productos.component.css',
})
export class TablaProductosComponent {
  productsList: Products[] = [];
  apiService: ApiService = inject(ApiService);
  filteredProductsList: Products[] = [];
  columnaOrdenada: keyof Products | null = null;
  ordenAscendente: boolean = true;

  constructor(private carritoService: CarritoServiceService) {
    this.apiService.getAllProducts().then((productsList: Products[]) => {
      this.productsList = productsList;
      this.filteredProductsList = productsList;
    });
  }

  agregarAlCarrito(product: Products) {
    this.carritoService.agregarItem({ ...product, cantidad: 1 });
    console.log('Se agregó al carrito. :)');
  }

  filterResults(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    if (!text) {
      this.filteredProductsList = this.productsList;
      return;
    }
    this.filteredProductsList = this.productsList.filter((product) =>
      product.nombre.toLowerCase().includes(text.toLowerCase())
    );
  }

  filterByClave(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    if (!text) {
      this.filteredProductsList = this.productsList;
      return;
    }
    this.filteredProductsList = this.productsList.filter((product) =>
      product.clave.toLowerCase().includes(text.toLowerCase())
    );
  }

  filterByIdArticulo(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    if (!text) {
      this.filteredProductsList = this.productsList;
      return;
    }
    const idArticulo = parseInt(text, 10);
    this.filteredProductsList = this.productsList.filter(
      (product) => product.idArticulo === idArticulo
    );
  }

  ordenarPorColumna(columna: keyof Products) {
    if (this.columnaOrdenada === columna) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.columnaOrdenada = columna;
      this.ordenAscendente = true;
    }
    this.filteredProductsList.sort((a, b) => {
      if (this.columnaOrdenada === null) {
        return 0;
      }
      if (a[this.columnaOrdenada] > b[this.columnaOrdenada]) {
        return this.ordenAscendente ? 1 : -1;
      } else if (a[this.columnaOrdenada] < b[this.columnaOrdenada]) {
        return this.ordenAscendente ? -1 : 1;
      } else {
        return 0;
      }
    });
  }
}
