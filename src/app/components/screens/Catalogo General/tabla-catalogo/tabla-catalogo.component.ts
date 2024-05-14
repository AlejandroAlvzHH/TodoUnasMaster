import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { CatalogoSincronizacionService } from '../../../../core/services/Services Catalogo General/catalogo-sincronizacion.service';
import { VistaCatalogoSincronizacion } from '../../../../Models/Master/vista-catalogo-sincronizacion';
import { ModalDetallesSincronizacionComponent } from '../modal-detalles-sincronizacion/modal-detalles-sincronizacion.component';
import { EditarProductoCatalogoComponent } from '../editar-producto-catalogo/editar-producto-catalogo';

import { AuthService } from '../../../../core/services/auth/auth.service';
import { VistaRolesPrivilegios } from '../../../../Models/Master/vista-roles-privilegios';
import { VistaRolesPrivilegiosService } from '../../../../core/services/Services Configuracion/vista-roles-privilegios.service';
import { Users } from '../../../../Models/Master/users';
@Component({
  selector: 'app-tabla-catalogo',
  standalone: true,
  imports: [
    CommonModule,
    ModalDetallesSincronizacionComponent,
    EditarProductoCatalogoComponent,
  ],
  template: `
    <app-modal-detalles-sincronizacion
      *ngIf="mostrarModalDetalles && productoSeleccionado"
      (cancelar)="cerrarModalDetalles()"
      [id_producto]="
        productoSeleccionado ? productoSeleccionado.id_producto : null
      "
    ></app-modal-detalles-sincronizacion>
    <app-editar-producto-catalogo
      *ngIf="mostrarModalEditar"
      (cancelar)="cerrarModalEditar()"
      [id_producto]="productoSeleccionado!.id_producto"
    ></app-editar-producto-catalogo>
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
    </div>
    <div class="table-container">
      <table border="2">
        <thead>
          <tr>
            <th
              scope="col"
              (click)="ordenarPorColumna('id_producto')"
              [class.interactive]="columnaOrdenada === 'id_producto'"
            >
              Id Artículo
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
          <tr *ngFor="let index of filteredIndices">
            <td>{{ filteredProductsList[index].id_producto }}</td>
            <td>{{ filteredProductsList[index].clave }}</td>
            <td>{{ filteredProductsList[index].nombre }}</td>
            <td>{{ filteredProductsList[index].cantidad_total }}</td>
            <td>{{ filteredProductsList[index].precio }}</td>
            <td>{{ filteredProductsList[index].sincronizacion }}</td>
            <td>
              <button
                class="btn"
                (click)="abrirModalDetalles(filteredProductsList[index])"
              >
                Sincronización
              </button>
              <button
                class="btn"
                (click)="abrirModalEditar(filteredProductsList[index])"
                *ngIf="mostrarBotonEditar"
              >
                Editar
              </button>
              <button
                class="btn"
                (click)="abrirModalEditar(filteredProductsList[index])"
                *ngIf="mostrarBotonEliminar"
              >
                Eliminar
              </button>
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
  mostrarModalEditar: boolean = false;
  productoSeleccionado: VistaCatalogoSincronizacion | null = null;

  mostrarBotonEliminar: boolean = false;
  mostrarBotonEditar: boolean = false;
  privilegiosDisponibles?: VistaRolesPrivilegios[] | null;
  currentUser?: Users | null;

  constructor(
    private cdr: ChangeDetectorRef,
    private catalogoSincronizacionService: CatalogoSincronizacionService,
    private authService: AuthService,
    private vistaRolesPrivilegiosService: VistaRolesPrivilegiosService
  ) {}

  async getAllRolesPrivilegios(): Promise<void> {
    try {
      const id = this.currentUser?.id_rol;
      if (id) {
        this.privilegiosDisponibles =
          await this.vistaRolesPrivilegiosService.getAllRolesPrivilegios(id);
        // console.log('Privilegios disponibles:', this.privilegiosDisponibles);
        this.mostrarBotonEditar = this.privilegiosDisponibles.some(
          (privilegio) => privilegio.id_privilegio === 10
        );
        this.mostrarBotonEliminar = this.privilegiosDisponibles.some(
          (privilegio) => privilegio.id_privilegio === 16
        );
      }
    } catch (error) {
      console.error('Error al obtener los roles y privilegios:', error);
    }
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
    this.getAllRolesPrivilegios();
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
    } else {
      this.filteredProductsList = this.productsList.filter((product) =>
        product.nombre.toLowerCase().includes(text.toLowerCase())
      );
    }
    this.updateFilteredIndices();
  }

  filterByClave(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    if (!text) {
      this.filteredProductsList = this.productsList;
    } else {
      this.filteredProductsList = this.productsList.filter((product) =>
        product.clave.toLowerCase().includes(text.toLowerCase())
      );
    }
    this.updateFilteredIndices();
  }

  filterById(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    if (!text) {
      this.filteredProductsList = this.productsList;
    } else {
      this.filteredProductsList = this.productsList.filter((product) =>
        product.id_producto.toString().startsWith(text)
      );
    }
    this.updateFilteredIndices();
  }

  filterByPrecio(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    if (!text) {
      this.filteredProductsList = this.productsList;
    } else {
      this.filteredProductsList = this.productsList.filter((product) =>
        product.precio.toString().startsWith(text)
      );
    }
    this.updateFilteredIndices();
  }

  private updateFilteredIndices() {
    this.filteredIndices = Array.from(
      { length: this.filteredProductsList.length },
      (_, i) => i
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

  abrirModalDetalles(producto: VistaCatalogoSincronizacion): void {
    this.mostrarModalDetalles = true;
    this.productoSeleccionado = producto;
  }

  cerrarModalDetalles(): void {
    this.mostrarModalDetalles = false;
  }

  abrirModalEditar(producto: VistaCatalogoSincronizacion): void {
    this.mostrarModalEditar = true;
    this.productoSeleccionado = producto;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
  }
}
