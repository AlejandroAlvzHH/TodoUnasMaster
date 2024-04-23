import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { CatalogoSincronizacionService } from '../../../../core/services/Services Catalogo General/catalogo-sincronizacion.service';
import { VistaCatalogoSincronizacion } from '../../../../Models/Master/vista-catalogo-sincronizacion';
import { ModalDetallesSincronizacionComponent } from '../modal-detalles-sincronizacion/modal-detalles-sincronizacion.component';

@Component({
  selector: 'app-tabla-catalogo',
  standalone: true,
  imports: [CommonModule, ModalDetallesSincronizacionComponent],
  template: `
    <app-modal-detalles-sincronizacion
        *ngIf="mostrarModalDetalles"
        (cancelar)="cerrarModalDetalles()"
        [id_producto]="productoSeleccionado!.id_producto"
      ></app-modal-detalles-sincronizacion>
    <div>
      <form class="search-form">
        <div class="search-input">
          <input
            type="text"
            placeholder="Buscar por ID"
            (input)="filterById($event)"
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
            (input)="filterByNombre($event)"
          />
        </div>
        <div class="search-input">
          <input
            type="text"
            placeholder="Buscar por precio"
            (input)="filterByPrecio($event)"
          />
        </div>
      </form>
      <!--<app-detalle-producto-catalogo
        *ngIf="mostrarModal"
        [id_producto]="movimientoSeleccionado!.id_producto"
        [usuario_creador]="movimientoSeleccionado!.usuario_creador"
        [fecha_creado]="movimientoSeleccionado!.fecha_creado"
        [usuario_modificador]="movimientoSeleccionado!.usuario_modificador"
        [fecha_modificado]="movimientoSeleccionado!.fecha_modificado"
        [usuario_eliminador]="movimientoSeleccionado!.usuario_eliminador"
        [fecha_eliminado]="movimientoSeleccionado!.fecha_eliminado"
        (cancelar)="cerrarModal()"
      ></app-detalle-producto-catalogo>-->
    </div>
    <div>
      <table border="2">
        <thead>
          <tr>
            <th
              scope="col"
              (click)="ordenarPorColumna('id_producto')"
              [class.interactive]="columnaOrdenada === 'id_producto'"
            >
              Id_Artículo
              <i
                *ngIf="columnaOrdenada === 'id_producto'"
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
              (click)="ordenarPorColumna('cantidad_total')"
              [class.interactive]="columnaOrdenada === 'cantidad_total'"
            >
              Existencia Global
              <i
                *ngIf="columnaOrdenada === 'cantidad_total'"
                class="arrow-icon"
                [class.asc]="ordenAscendente"
                [class.desc]="!ordenAscendente"
              ></i>
            </th>
            <th
              scope="col"
              (click)="ordenarPorColumna('precio')"
              [class.interactive]="columnaOrdenada === 'precio'"
            >
              Precio
              <i
                *ngIf="columnaOrdenada === 'precio'"
                class="arrow-icon"
                [class.asc]="ordenAscendente"
                [class.desc]="!ordenAscendente"
              ></i>
            </th>
            <th
              scope="col"
              (click)="ordenarPorColumna('sincronizacion')"
              [class.interactive]="columnaOrdenada === 'sincronizacion'"
            >
              Sincronización
              <i
                *ngIf="columnaOrdenada === 'sincronizacion'"
                class="arrow-icon"
                [class.asc]="ordenAscendente"
                [class.desc]="!ordenAscendente"
              ></i>
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let product of filteredProductsList">
            <td>{{ product.id_producto }}</td>
            <td>{{ product.clave }}</td>
            <td>{{ product.nombre }}</td>
            <td>{{ product.cantidad_total }}</td>
            <td>{{ product.precio }}</td>
            <td>{{ product.sincronizacion }}</td>
            <!--<td>
              <button class="btn">Ver Detalles</button>
            </td>-->
            <td>
              <button class="btn" (click)="abrirModalDetalles()">
                Detalles
              </button>
              <button class="btn">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styleUrl: './tabla-catalogo.component.css',
})
export class TablaCatalogoComponent {
  productsList: VistaCatalogoSincronizacion[] = [];
  filteredProductsList: VistaCatalogoSincronizacion[] = [];
  filteredIndices: number[] = [];
  columnaOrdenada: keyof VistaCatalogoSincronizacion | null = null;
  ordenAscendente: boolean = true;
  mostrarModalDetalles: boolean = false;
  productoSeleccionado: VistaCatalogoSincronizacion | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private catalogoSincronizacionService: CatalogoSincronizacionService
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  private async initialize() {
    try {
      this.productsList =
        await this.catalogoSincronizacionService.getAllVistaCatalogoSincronizacion();
      this.filteredProductsList = this.productsList.map((product) => ({
        id_producto: product.id_producto,
        clave: product.clave,
        nombre: product.nombre,
        cantidad_total: product.cantidad_total,
        precio: product.precio,
        sincronizacion: product.sincronizacion,
      }));
      this.filteredIndices = Array.from(
        { length: this.filteredProductsList.length },
        (_, i) => i
      );
      this.cdr.detectChanges();
    } catch (error) {
      console.error(
        'Error al obtener los productos del catálogo general:',
        error
      );
    }
  }

  resetFilteredProductsList(): void {
    this.filteredProductsList = this.productsList.map((product) => ({
      id_producto: product.id_producto,
      clave: product.clave,
      nombre: product.nombre,
      cantidad_total: product.cantidad_total,
      precio: product.precio,
      sincronizacion: product.sincronizacion,
    }));
    this.filteredIndices = Array.from(
      { length: this.filteredProductsList.length },
      (_, i) => i
    );
  }

  filterByNombre(event: Event) {
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

  filterById(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    if (!text) {
      this.filteredProductsList = this.productsList;
      return;
    }
    this.filteredProductsList = this.productsList.filter((product) =>
      product.id_producto.toString().startsWith(text)
    );
  }

  filterByPrecio(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    if (!text) {
      this.filteredProductsList = this.productsList;
      return;
    }
    this.filteredProductsList = this.productsList.filter((product) =>
      product.precio.toString().startsWith(text)
    );
  }

  ordenarPorColumna(columna: keyof VistaCatalogoSincronizacion) {
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

  abrirModalDetalles(): void {
    this.mostrarModalDetalles = true;
  }
  /*abrirModalDetalles(producto: VistaCatalogoSincronizacion): void {
    this.mostrarModalDetalles = true;
    this.productoSeleccionado = producto;
  }*/

  cerrarModalDetalles(): void {
    this.mostrarModalDetalles = false;
  }
}
