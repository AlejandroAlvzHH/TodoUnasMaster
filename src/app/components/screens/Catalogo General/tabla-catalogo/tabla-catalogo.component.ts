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
import { InventarioApiService } from '../../../../core/services/inventario-api.service';
import { CatalogoSucursalService } from '../../../../core/services/Services Catalogo General/catalogo-sucursal.service';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { Products } from '../../../../Models/Factuprint/products';

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
      *ngIf="mostrarModalEditar && productoSeleccionado"
      (cancelar)="cerrarModalEditar()"
      [id_producto]="
        productoSeleccionado ? productoSeleccionado.id_producto : null
      "
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
            <td>{{ getTotalCantidad(filteredProductsList[index].id_producto) }}</td>
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
  inventarios: any[] = [];

  branchesUrls: { idSucursal: number; nombre: string; url: string }[] = [];
  allProducts: {
    id_sucursal: number;
    id_producto: number;
    cantidad: number;
  }[] = [];
  totalProducts: { id_producto: number; cantidad: number }[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private catalogoSincronizacionService: CatalogoSincronizacionService,
    private authService: AuthService,
    private vistaRolesPrivilegiosService: VistaRolesPrivilegiosService,
    private inventarioService: InventarioApiService,
    private apiService: ApiService,
    private catalogoSucursalService: CatalogoSucursalService
  ) {}

  ngOnInit(): void {
    this.apiService.getAllBranchesUrlsConStatus1URL().subscribe(
      (data) => {
        this.branchesUrls = data;
        this.loadAllProducts();
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
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
      const inventariosResponse = await this.inventarioService
        .getInventarios()
        .toPromise();
      this.inventarios = inventariosResponse || [];
      this.calculateGlobalExistence();
      this.resetFilteredProductsList();
      this.cdr.detectChanges();
    } catch (error) {
      console.error(
        'Error al obtener los productos del catálogo general:',
        error
      );
    }
  }

  getTotalCantidad(id_producto: number): number {
    const totalProduct = this.totalProducts.find(product => product.id_producto === id_producto);
    return totalProduct ? totalProduct.cantidad : 0;
  }
  
  async loadAllProducts(): Promise<void> {
    for (const branch of this.branchesUrls) {
      try {
        const products: Products[] =
          await this.catalogoSucursalService.getAllProducts(branch.url);
        for (const product of products) {
          this.allProducts.push({
            id_sucursal: branch.idSucursal,
            id_producto: product.idArticulo,
            cantidad: product.existencia,
          });
        }
      } catch (error) {
        console.error('Error fetching products for branch', branch, error);
      }
    }
    this.calculateTotalProducts();
  }

  calculateTotalProducts(): void {
    const productMap: { [key: number]: number } = {};

    this.allProducts.forEach((product) => {
      if (productMap[product.id_producto]) {
        productMap[product.id_producto] += product.cantidad;
      } else {
        productMap[product.id_producto] = product.cantidad;
      }
    });
    this.totalProducts = Object.keys(productMap).map((key) => ({
      id_producto: Number(key),
      cantidad: productMap[Number(key)],
    }));
    console.log(this.totalProducts);
  }

  private calculateGlobalExistence() {
    const productExistenceMap = this.inventarios.reduce((acc, item) => {
      if (!acc[item.id_producto]) {
        acc[item.id_producto] = 0;
      }
      acc[item.id_producto] += item.cantidad;
      return acc;
    }, {});

    this.productsList.forEach((product) => {
      product.cantidad_total = productExistenceMap[product.id_producto] || 0;
    });
  }

  async getAllRolesPrivilegios(): Promise<void> {
    try {
      const id = this.currentUser?.id_rol;
      if (id) {
        this.privilegiosDisponibles =
          await this.vistaRolesPrivilegiosService.getAllRolesPrivilegios(id);
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

  resetFilteredProductsList(): void {
    this.filteredProductsList = [...this.productsList];
    this.updateFilteredIndices();
  }

  filterByNombre(event: Event) {
    const text = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProductsList = this.productsList.filter((product) =>
      product.nombre.toLowerCase().includes(text)
    );
    this.updateFilteredIndices();
  }

  filterByClave(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredProductsList = this.productsList.filter((product) =>
      product.clave.toLowerCase().includes(text)
    );
    this.updateFilteredIndices();
  }

  filterById(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    this.filteredProductsList = this.productsList.filter((product) =>
      product.id_producto.toString().startsWith(text)
    );
    this.updateFilteredIndices();
  }

  filterByPrecio(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    this.filteredProductsList = this.productsList.filter((product) =>
      product.precio.toString().startsWith(text)
    );
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
      if (this.columnaOrdenada === null) return 0;
      const order = a[this.columnaOrdenada] > b[this.columnaOrdenada] ? 1 : -1;
      return this.ordenAscendente ? order : -order;
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
