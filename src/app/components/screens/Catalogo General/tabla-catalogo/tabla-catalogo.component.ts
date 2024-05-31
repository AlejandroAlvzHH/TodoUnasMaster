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
import { CatalogoGeneralService } from '../../../../core/services/Services Catalogo General/catalogo-general.service';
import { General_Catalogue } from '../../../../Models/Master/general_catalogue';
import { Inventory } from '../../../../Models/Master/inventory';

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
            (input)="filterByNombre($event)"
          />
        </div>
      </form>
    </div>
    <div *ngIf="isLoading" class="spinner"></div>
    <div *ngIf="!isLoading" class="table-container">
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
          <ng-container *ngFor="let index of paginatedIndices">
            <tr>
              <td>{{ filteredProductsList[index].id_producto }}</td>
              <td>{{ filteredProductsList[index].clave }}</td>
              <td>{{ filteredProductsList[index].nombre }}</td>
              <td>
                {{ getTotalCantidad(filteredProductsList[index].id_producto) }}
              </td>
              <td>{{ filteredProductsList[index].precio }}</td>
              <td>{{ filteredProductsList[index].sincronizacion }}</td>
              <td>
                <button
                  class="btn"
                  (click)="abrirModalDetalles(filteredProductsList[index])"
                >
                  Detalles
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
                  Deshabilitar
                </button>
              </td>
            </tr>
          </ng-container>
        </tbody>
      </table>
      <div class="pagination-controls">
        <button (click)="previousPage()" [disabled]="currentPage === 1">
          Anterior
        </button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button (click)="nextPage()" [disabled]="currentPage === totalPages">
          Siguiente
        </button>
      </div>
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
  productoActual: General_Catalogue | null = null;
  isDataLoaded: boolean = false;
  inventarioTotal: { [idProducto: number]: number } = {};
  branchesUrls: { idSucursal: number; nombre: string; url: string }[] = [];
  allProducts: {
    id_sucursal: number;
    id_producto: number;
    cantidad: number;
  }[] = [];
  totalProducts: { id_producto: number; cantidad: number }[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  paginatedIndices: number[] = [];
  isLoading: boolean = true;

  constructor(
    private cdr: ChangeDetectorRef,
    private catalogoSincronizacionService: CatalogoSincronizacionService,
    private authService: AuthService,
    private vistaRolesPrivilegiosService: VistaRolesPrivilegiosService,
    private inventarioApiService: InventarioApiService,
    private apiService: ApiService,
    private catalogoSucursalService: CatalogoSucursalService,
    private catalogoGeneralService: CatalogoGeneralService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
      this.getAllRolesPrivilegios();
    });
    this.apiService.getAllBranchesUrlsConStatus1URL().subscribe(
      (data) => {
        this.branchesUrls = data;
        this.loadAllProductsForPage();
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
    this.initialize();
  }

  private async initialize() {
    try {
      this.productsList =
        await this.catalogoSincronizacionService.getAllVistaCatalogoSincronizacion();
      this.inventarios =
        (await this.inventarioApiService.getInventarios().toPromise()) || [];
      this.filteredProductsList = [...this.productsList];
      this.resetFilteredProductsList();
      await this.loadAllProductsForPage();
      this.isLoading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error(
        'Error al obtener los productos del catálogo general:',
        error
      );
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  getTotalCantidad(id_producto: number): number {
    const totalProduct = this.totalProducts.find(
      (product) => product.id_producto === id_producto
    );
    return totalProduct ? totalProduct.cantidad : 0;
  }

  resetFilteredProductsList(): void {
    this.filteredIndices = Array.from(
      { length: this.filteredProductsList.length },
      (_, i) => i
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  private updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedIndices = this.filteredIndices.slice(startIndex, endIndex);
  }

  async loadAllProductsForPage(): Promise<void> {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const productsForPage = this.filteredProductsList.slice(
      startIndex,
      endIndex
    );

    for (const branch of this.branchesUrls) {
      try {
        const productsResponse: Products[] | undefined =
          await this.catalogoSucursalService
            .getAllProductsHTTP(branch.url)
            .toPromise();

        if (productsResponse) {
          const products = productsResponse;
          products.forEach((product) => {
            const matchingProduct = productsForPage.find(
              (p) => p.id_producto === product.idArticulo
            );
            if (matchingProduct) {
              this.allProducts.push({
                id_sucursal: branch.idSucursal,
                id_producto: product.idArticulo,
                cantidad: product.existencia,
              });
            }
          });
        }
      } catch (error) {
        console.error('Error fetching products for branch', branch, error);
      }
    }
    try {
      const insertionPromises = this.allProducts.map((product) =>
        this.inventarioApiService.insertOrUpdateInventory(product).toPromise()
      );
      await Promise.all(insertionPromises);
      this.calculateTotalProductsForPage();
    } catch (error) {
      console.error('Error during inventory insertion:', error);
    }
  }

  calculateTotalProductsForPage(): void {
    const productsForPageIds = this.filteredProductsList.map(
      (product) => product.id_producto
    );
    const inventariosForPage = this.inventarios.filter((inv) =>
      productsForPageIds.includes(inv.id_producto)
    );

    inventariosForPage.forEach((inv) => {
      const idProducto = inv.id_producto;
      const cantidad = inv.cantidad;
      const existingProduct = this.totalProducts.find(
        (p) => p.id_producto === idProducto
      );
      if (existingProduct) {
        existingProduct.cantidad += cantidad;
      } else {
        this.totalProducts.push({
          id_producto: idProducto,
          cantidad: cantidad,
        });
      }
    });
    this.insertTotalProductsInventoryForPage();
  }

  insertTotalProductsInventoryForPage() {
    const productsForPageIds = this.filteredProductsList.map(
      (product) => product.id_producto
    );
    const productsForPage = this.totalProducts.filter((product) =>
      productsForPageIds.includes(product.id_producto)
    );

    productsForPage.forEach((product) => {
      this.catalogoGeneralService
        .getCatalogueProductObesrvableByID(product.id_producto)
        .subscribe(
          (resultado) => {
            this.productoActual = resultado;
            if (this.productoActual) {
              const fechaActual = new Date();
              fechaActual.setHours(fechaActual.getHours() - 6);
              this.productoActual.cantidad_total = product.cantidad;
              this.productoActual.usuario_modificador =
                this.currentUser!.id_usuario;
              this.productoActual.fecha_modificado = fechaActual;
              this.catalogoGeneralService.updateCatalogueProductop(
                this.productoActual,
                product.id_producto
              );
            }
          },
          (error) => {
            console.error('Ocurrió un error al obtener el producto:', error);
          }
        );
    });
  }

  calculateTotalProducts(): void {
    this.inventarioApiService.getInventarios().subscribe(
      (inventarios: Inventory[]) => {
        inventarios.forEach((inv) => {
          const idProducto = inv.id_producto;
          const cantidad = inv.cantidad;
          const existingProduct = this.totalProducts.find(
            (p) => p.id_producto === idProducto
          );
          if (existingProduct) {
            existingProduct.cantidad += cantidad;
          } else {
            this.totalProducts.push({
              id_producto: idProducto,
              cantidad: cantidad,
            });
          }
        });
        this.insertTotalProductsInventory();
        this.isDataLoaded = true;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error al obtener los datos de inventario:', error);
      }
    );
  }

  insertTotalProductsInventory() {
    this.totalProducts.forEach((product) => {
      this.catalogoGeneralService
        .getCatalogueProductObesrvableByID(product.id_producto)
        .subscribe(
          (resultado) => {
            this.productoActual = resultado;
            if (this.productoActual) {
              const fechaActual = new Date();
              fechaActual.setHours(fechaActual.getHours() - 6);
              this.productoActual.cantidad_total = product.cantidad;
              this.productoActual.usuario_modificador =
                this.currentUser!.id_usuario;
              this.productoActual.fecha_modificado = fechaActual;
              this.catalogoGeneralService.updateCatalogueProductop(
                this.productoActual,
                product.id_producto
              );
            }
          },
          (error) => {
            console.error('Ocurrió un error al obtener el producto:', error);
          }
        );
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

  filterByNombre(event: Event) {
    const text = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredIndices = this.productsList
      .map((product, index) => ({ product, index }))
      .filter(({ product }) => product.nombre.toLowerCase().includes(text))
      .map(({ index }) => index);
    this.currentPage = 1;
    this.updatePagination();
  }

  filterByClave(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredIndices = this.productsList
      .map((product, index) => ({ product, index }))
      .filter(({ product }) => product.clave.toLowerCase().includes(text))
      .map(({ index }) => index);
    this.currentPage = 1;
    this.updatePagination();
  }

  filterByIdArticulo(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    if (text === '') {
      this.filteredIndices = Array.from(
        { length: this.productsList.length },
        (_, i) => i
      );
    } else {
      const idArticulo = parseInt(text, 10);
      this.filteredIndices = this.productsList
        .map((product, index) => ({ product, index }))
        .filter(({ product }) => product.id_producto === idArticulo)
        .map(({ index }) => index);
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updateFilteredIndices() {
    this.filteredIndices = this.filteredProductsList.map((_, i) => i);
  }

  ordenarPorColumna(columna: keyof VistaCatalogoSincronizacion) {
    if (this.columnaOrdenada === columna) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.columnaOrdenada = columna;
      this.ordenAscendente = true;
    }

    this.filteredProductsList.sort((a, b) => {
      if (a[columna] < b[columna]) {
        return this.ordenAscendente ? -1 : 1;
      }
      if (a[columna] > b[columna]) {
        return this.ordenAscendente ? 1 : -1;
      }
      return 0;
    });

    this.updateFilteredIndices();
    this.updatePagination();
  }

  verDetalles(producto: VistaCatalogoSincronizacion) {
    this.productoSeleccionado = producto;
    this.mostrarModalDetalles = true;
  }

  editarProducto(producto: VistaCatalogoSincronizacion) {
    this.productoSeleccionado = producto;
    this.mostrarModalEditar = true;
  }

  eliminarProducto(producto: VistaCatalogoSincronizacion) {
    // PENDIENTE
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

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredIndices.length / this.itemsPerPage);
  }
}
