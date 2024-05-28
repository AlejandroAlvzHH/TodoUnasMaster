import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Branches } from '../../../../Models/Master/branches';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { SucursalesmodalComponent } from '../../../../modals/Modals Sucursales/sucursalesmodal/sucursalesmodal.component';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Users } from '../../../../Models/Master/users';
import { VistaRolesPrivilegios } from '../../../../Models/Master/vista-roles-privilegios';
import { VistaRolesPrivilegiosService } from '../../../../core/services/Services Configuracion/vista-roles-privilegios.service';
import { PermisosService } from '../../../../core/services/Services Configuracion/permisos.service';
import { CatalogoSucursalService } from '../../../../core/services/Services Catalogo General/catalogo-sucursal.service';
import { forkJoin, of, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Products } from '../../../../Models/Factuprint/products';
import { InventarioApiService } from '../../../../core/services/inventario-api.service';
import { CatalogoGeneralService } from '../../../../core/services/Services Catalogo General/catalogo-general.service';
import { Inventory } from '../../../../Models/Master/inventory';
import { ChangeDetectorRef } from '@angular/core';
import { General_Catalogue } from '../../../../Models/Master/general_catalogue';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SucursalesmodalComponent,
    SidebarComponent,
    HeaderComponent,
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
      <div *ngIf="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
      <app-sucursalesmodal
        *ngIf="mostrarModal"
        (addSucursal)="agregarSucursal($event)"
        (cancelar)="cerrarModal()"
      ></app-sucursalesmodal>
      <div class="title-container">
        <h1>SUCURSALES</h1>
      </div>
      <div class="botonera" *ngIf="mostrarBotonAgregar">
        <button class="btn" (click)="abrirModal()">Agregar Sucursal</button>
        <button class="btn" (click)="actualizarRegistros()">
          Verificar Status de Sucursales
        </button>
      </div>
      <div class="card-container">
        <div class="card" *ngFor="let sucursal of filteredSucursalesList">
          <img src="{{ sucursal.url_imagen }}" />
          <div class="card-content">
            <h2>{{ sucursal.nombre }}</h2>
            <p>{{ sucursal.estado }}</p>
            <h4>Última fecha de actualización:</h4>
            <p>
              {{ sucursal.fechaActualizacion | date : 'short' }}
            </p>
            <a href="/sucursalselected/{{ sucursal.idSucursal }}" class="btn"
              >Seleccionar</a
            >
          </div>
        </div>
      </div>
    </main>
  `,
  styleUrl: './home.component.css',
})
export class HomeComponent {
  sucursalesList: Branches[] = [];
  filteredSucursalesList: Branches[] = [];
  mostrarModal: boolean = false;
  isSidebarOpen: boolean = false;
  currentUser?: Users | null;
  privilegiosDisponibles?: VistaRolesPrivilegios[] | null;
  sucursalesDisponibles: Branches[] = [];
  loading: boolean = false;
  branchesUrls: { idSucursal: number; nombre: string; url: string }[] = [];
  allProducts: {
    id_sucursal: number;
    id_producto: number;
    cantidad: number;
  }[] = [];
  totalProducts: { id_producto: number; cantidad: number }[] = [];
  isDataLoaded: boolean = false;
  inventarioTotal: { [idProducto: number]: number } = {};
  productoActual: General_Catalogue | null = null;

  //PRIVILEGIOS
  mostrarBotonAgregar: boolean = false;

  constructor(
    private apiService: ApiService,
    private sidebarOpeningService: SidebaropeningService,
    private authService: AuthService,
    private vistaRolesPrivilegiosService: VistaRolesPrivilegiosService,
    private permisosService: PermisosService,
    private catalogoSucursalService: CatalogoSucursalService,
    private inventarioApiService: InventarioApiService,
    private catalogoGeneralService: CatalogoGeneralService,
    private cdr: ChangeDetectorRef
  ) {}

  toggleSidebar(): void {
    this.sidebarOpeningService.toggleSidebar();
  }

  async getAllRolesPrivilegios(): Promise<void> {
    try {
      const id = this.currentUser?.id_rol;
      if (id) {
        this.privilegiosDisponibles =
          await this.vistaRolesPrivilegiosService.getAllRolesPrivilegios(id);
        this.mostrarBotonAgregar = this.privilegiosDisponibles.some(
          (privilegio) => privilegio.id_privilegio === 3
        );
      }
    } catch (error) {
      console.error('Error al obtener los roles y privilegios:', error);
    }
  }

  ngOnInit(): void {
    this.apiService.getAllBranchesUrlsConStatus1URL().subscribe(
      (data) => {
        this.branchesUrls = data;
        this.loadAllProducts();
      },
      (error) => {
        console.error('Error obteniendo la data', error);
      }
    );
    this.apiService.getAllBranchesConStatus1().subscribe(
      (sucursales) => {
        this.sucursalesDisponibles = sucursales;
      },
      (error) => {
        console.error('Error al obtener las sucursales: ', error);
      }
    );
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
    this.getAllRolesPrivilegios();
    const canAddBranch = this.permisosService.canAddBranch();
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
    this.actualizarListaSucursales();
  }

  async loadAllProducts(): Promise<void> {
    for (const branch of this.branchesUrls) {
      try {
        const products: Products[] =
          await this.catalogoSucursalService.getAllProducts(
            branch.url,
            branch.nombre
          );
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
    const insertionPromises = this.allProducts.map((product) =>
      this.inventarioApiService.insertOrUpdateInventory(product).toPromise()
    );
    try {
      await Promise.all(insertionPromises);
      this.calculateTotalProducts();
    } catch (error) {
      console.error('Error during inventory insertion:', error);
    }
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
              (this.productoActual.usuario_modificador =
                this.currentUser!.id_usuario),
                (this.productoActual.fecha_modificado = fechaActual);
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

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  actualizarRegistros() {
    this.loading = true;
    const requests = this.sucursalesDisponibles.map((sucursal) => {
      return this.catalogoSucursalService.getAllProductsHTTP(sucursal.url).pipe(
        switchMap((response) => {
          console.log(`La sucursal ${sucursal.nombre} está online.`);
          return this.apiService.getSucursalById(sucursal.idSucursal).pipe(
            switchMap((actualBranch) => {
              if (actualBranch) {
                const fechaActual = new Date();
                fechaActual.setHours(fechaActual.getHours() - 6);
                const sucursalModificada = {
                  ...actualBranch,
                  estado: 'Online 🟢',
                  fechaActualizacion: fechaActual,
                };
                return this.apiService.modificarSucursal(sucursalModificada);
              }
              return of(null);
            })
          );
        }),
        catchError((error) => {
          console.error(`La sucursal ${sucursal.nombre} está offline.`);
          return this.apiService.getSucursalById(sucursal.idSucursal).pipe(
            switchMap((actualBranch) => {
              if (actualBranch) {
                const fechaActual = new Date();
                fechaActual.setHours(fechaActual.getHours() - 6);
                const sucursalModificada = {
                  ...actualBranch,
                  estado: 'Offline 🔴',
                  fechaActualizacion: fechaActual,
                };
                return this.apiService.modificarSucursal(sucursalModificada);
              }
              return of(null);
            })
          );
        })
      );
    });
    forkJoin(requests).subscribe(() => {
      this.loading = false;
      window.location.reload();
    });
  }

  modificarSucursal(sucursalModificada: Branches): Observable<boolean> {
    if (!sucursalModificada) {
      console.error('Sucursal modificada no es válida');
      return of(false);
    }
    return this.apiService.modificarSucursal(sucursalModificada);
  }

  agregarSucursal(sucursal: Branches): void {
    this.apiService.agregarSucursal(sucursal).subscribe(
      (success) => {
        console.log('Éxito al agregar la sucursal:', success);
        this.actualizarListaSucursales();
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al agregar la sucursal:', error);
      }
    );
  }

  private actualizarListaSucursales(): void {
    this.apiService.getAllSucursales().subscribe(
      (sucursalesList: Branches[]) => {
        this.filteredSucursalesList = sucursalesList.filter(
          (sucursal) => sucursal.status === 1
        );
        this.sucursalesList = sucursalesList;
      },
      (error) => {
        console.error('Error al obtener todas las sucursales:', error);
      }
    );
  }
}
