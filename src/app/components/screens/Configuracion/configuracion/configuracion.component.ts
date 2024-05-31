import { Component } from '@angular/core';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { CommonModule } from '@angular/common';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';
import { Users } from '../../../../Models/Master/users';
import { VistaRolesPrivilegiosService } from '../../../../core/services/Services Configuracion/vista-roles-privilegios.service';
import { VistaRolesPrivilegios } from '../../../../Models/Master/vista-roles-privilegios';
import { AuthService } from '../../../../core/services/auth/auth.service';

import { Branches } from '../../../../Models/Master/branches';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { Products } from '../../../../Models/Factuprint/products';
import { CatalogoSucursalService } from '../../../../core/services/Services Catalogo General/catalogo-sucursal.service';
import { Inventory } from '../../../../Models/Master/inventory';
import { InventarioApiService } from '../../../../core/services/inventario-api.service';
import { CatalogoGeneralService } from '../../../../core/services/Services Catalogo General/catalogo-general.service';
import { General_Catalogue } from '../../../../Models/Master/general_catalogue';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, CommonModule],
  template: `
    <app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <div class="title-container">
        <h1>AJUSTES</h1>
      </div>
      <div class="menu-container">
        <div class="menu">
          <a *ngIf="mostrarBotonContrasenas" href="/contrasenas" class="opcion"
            >Contraseñas</a
          >
          <a
            *ngIf="mostrarBotonCatalogoSalidas"
            href="/catalogo-salidas"
            class="opcion"
            >Catálogo de Salidas</a
          >
          <a
            *ngIf="mostrarBotonCatalogoClinicas"
            href="/catalogo-clinicas"
            class="opcion"
            >Catálogo de Clínicas</a
          >
          <a
            *ngIf="mostrarBotonRolesUsuarios"
            href="/roles-usuarios"
            class="opcion"
            >Roles y Usuarios</a
          >
        </div>
      </div>
    </main>
  `,
  styleUrl: './configuracion.component.css',
})
export class ConfiguracionComponent {
  isSidebarOpen: boolean = false;

  mostrarBotonRolesUsuarios: boolean = false;
  mostrarBotonCatalogoClinicas: boolean = false;
  mostrarBotonCatalogoSalidas: boolean = false;
  mostrarBotonContrasenas: boolean = false;
  mostrarBotonEditar: boolean = false;
  privilegiosDisponibles?: VistaRolesPrivilegios[] | null;
  currentUser?: Users | null;

  sucursalesDisponibles: Branches[] = [];
  productsList: Products[] = [];

  constructor(
    private sidebarOpeningService: SidebaropeningService,
    private authService: AuthService,
    private vistaRolesPrivilegiosService: VistaRolesPrivilegiosService,

    private apiService: ApiService,
    private inventarioApiService: InventarioApiService,
    private catalogoGeneralService: CatalogoGeneralService,
    private catalogoSucursalService: CatalogoSucursalService
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
        this.mostrarBotonContrasenas = this.privilegiosDisponibles.some(
          (privilegio) => privilegio.id_privilegio === 12
        );
        this.mostrarBotonCatalogoSalidas = this.privilegiosDisponibles.some(
          (privilegio) => privilegio.id_privilegio === 13
        );
        this.mostrarBotonCatalogoClinicas = this.privilegiosDisponibles.some(
          (privilegio) => privilegio.id_privilegio === 14
        );
        this.mostrarBotonRolesUsuarios = this.privilegiosDisponibles.some(
          (privilegio) => privilegio.id_privilegio === 15
        );
      }
    } catch (error) {
      console.error('Error al obtener los roles y privilegios:', error);
    }
  }

  ngOnInit(): void {
    //PRIMERO CLONAR TODOS LOS PRODUCTOS PARA QUE NO EXPLOTE
    /*this.apiService.getAllBranchesConStatus1().subscribe(
      (sucursales) => {
        if (sucursales.length > 0) {
          const sucursal = sucursales[0]; 
          const errores: any[] = []; 
          this.catalogoSucursalService.getAllProductsHTTP(sucursal.url).subscribe(
            (products) => {
              this.productsList = products;
              let productosProcesados = 0;
              products.forEach((product) => {
                let cantidad_total = product.existencia;
                if (cantidad_total === null || cantidad_total < 0 || !Number.isInteger(cantidad_total)) {
                  cantidad_total = 0; 
                }
                const generalCatalogue: General_Catalogue = {
                  id_producto: product.idArticulo,
                  clave: product.clave,
                  nombre: product.nombre,
                  descripcion: product.nombre,
                  cantidad_total: cantidad_total,
                  precio: product.precioVenta,
                  usuario_creador: 1,
                  fecha_creado: new Date(),
                  usuario_modificador: 1,
                  fecha_modificado: new Date(),
                  usuario_eliminador: 1,
                  fecha_eliminado: new Date(),
                };
                this.catalogoGeneralService.addCatalogueProductHTTP(generalCatalogue).subscribe(
                  (addedProduct) => {
                    console.log('Producto registrado exitosamente en el catálogo:', addedProduct);
                    productosProcesados++;
                    if (productosProcesados === products.length) {
                      console.log('Todos los productos procesados.');
                      if (errores.length > 0) {
                        console.error('Errores encontrados:', errores);
                      }
                    }
                  },
                  (error) => {
                    errores.push({ product, error });
                    productosProcesados++;
                    if (productosProcesados === products.length) {
                      console.log('Todos los productos procesados.');
                      if (errores.length > 0) {
                        console.error('Errores encontrados:', errores);
                      }
                    }
                  }
                );
              });
            },
            (error) => {
              console.error('Error al obtener los productos de la sucursal:', sucursal.url, error);
            }
          );
        } else {
          console.error('No se encontraron sucursales.');
        }
      },
      (error) => {
        console.error('Error al obtener las sucursales:', error);
      }
    );*/
    //LUEGO REGISTRAR EN TABLA DE INVENTARIO
    /*this.apiService.getAllBranchesConStatus1().subscribe(
      (sucursales) => {
        this.sucursalesDisponibles = sucursales;
        this.productsList = [];
        const errores: any[] = [];
        const observables = this.sucursalesDisponibles.map((sucursal) =>
          this.catalogoSucursalService.getAllProductsHTTP(sucursal.url).pipe(
            map((products) => ({ sucursal, products }))
          )
        );
        forkJoin(observables).subscribe(
          (results) => {
            let productosProcesados = 0;
            results.forEach(({ sucursal, products }) => {
              this.productsList.push(...products);
              products.forEach((product) => {
                const inventory: Inventory = {
                  id_sucursal: sucursal.idSucursal,
                  id_producto: product.idArticulo,
                  cantidad: product.existencia ?? 0 
                };
                this.inventarioApiService.postInventory(inventory).subscribe(
                  (response) => {
                    console.log('Inventario insertado exitosamente:', response);
                    productosProcesados++;
                    if (productosProcesados === this.productsList.length) {
                      console.log('Todos los productos procesados.');
                      if (errores.length > 0) {
                        console.error('Se han producido errores:', errores);
                      }
                    }
                  },
                  (error) => {
                    errores.push({ product, error });
                    productosProcesados++;
                    if (productosProcesados === this.productsList.length) {
                      console.log('Todos los productos procesados.');
                      if (errores.length > 0) {
                        console.error('Se han producido errores:', errores);
                      }
                    }
                  }
                );
              });
            });
          },
          (error) => {
            console.error('Error al obtener los productos de las sucursales:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener las sucursales:', error);
      }
    );*/
    //FIN DE SCRIPTS
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
    this.getAllRolesPrivilegios();
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
  }
}
