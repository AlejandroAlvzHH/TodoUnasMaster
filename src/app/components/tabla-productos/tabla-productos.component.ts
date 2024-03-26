import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiService } from '../../core/services/Services Catalogo General/api.service';
import { Products } from '../../Models/Factuprint/products';
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
              <td>{{ product.product.idArticulo }}</td>
              <td>{{ product.product.clave }}</td>
              <td>{{ product.product.nombre }}</td>
              <td>
                {{ product.product.existencia }}
                <button class="btn" [disabled]="product.enCarrito" (click)="agregarAlCarrito(product.product)">
                  {{ product.enCarrito ? 'Agregado' : 'Agregar' }}
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
  filteredProductsList: { product: Products; enCarrito: boolean; }[] = [];
  columnaOrdenada: keyof Products | null = null;
  ordenAscendente: boolean = true;

  constructor(private carritoService: CarritoServiceService) {
    this.apiService.getAllProducts().then((productsList: Products[]) => {
      this.productsList = productsList;
      this.filteredProductsList = productsList.map(product => ({ product, enCarrito: false }));
    });
  }

  agregarAlCarrito(product: Products) {
    const index = this.filteredProductsList.findIndex(item => item.product === product);
    if (index !== -1) {
      this.filteredProductsList[index].enCarrito = true;
    }
    this.carritoService.agregarItem({ ...product, cantidad: 1 });
    console.log('Se agregó al carrito. :)');
  }

  filterResults(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    if (!text) {
      this.filteredProductsList = this.productsList.map(product => ({ product, enCarrito: false }));
      return;
    }
    this.filteredProductsList = this.productsList.filter((product) =>
      product.nombre.toLowerCase().includes(text.toLowerCase())
    ).map(product => ({ product, enCarrito: false }));
  }

  filterByClave(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    if (!text) {
      this.filteredProductsList = this.productsList.map(product => ({ product, enCarrito: false }));
      return;
    }
    this.filteredProductsList = this.productsList.filter((product) =>
      product.clave.toLowerCase().includes(text.toLowerCase())
    ).map(product => ({ product, enCarrito: false }));
  }

  filterByIdArticulo(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    if (!text) {
      this.filteredProductsList = this.productsList.map(product => ({ product, enCarrito: false }));
      return;
    }
    const idArticulo = parseInt(text, 10);
    this.filteredProductsList = this.productsList.filter(
      (product) => product.idArticulo === idArticulo
    ).map(product => ({ product, enCarrito: false }));
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
      if (a.product[this.columnaOrdenada] > b.product[this.columnaOrdenada]) {
        return this.ordenAscendente ? 1 : -1;
      } else if (a.product[this.columnaOrdenada] < b.product[this.columnaOrdenada]) {
        return this.ordenAscendente ? -1 : 1;
      } else {
        return 0;
      }
    });
  }
}
