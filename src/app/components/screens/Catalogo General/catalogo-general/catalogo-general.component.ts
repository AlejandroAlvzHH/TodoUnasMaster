import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';
import { TablaCatalogoComponent } from '../tabla-catalogo/tabla-catalogo.component';
import { General_Catalogue } from '../../../../Models/Master/general_catalogue';
import { AgregarProductoCatalogoComponent } from '../agregar-producto-catalogo/agregar-producto-catalogo.component';
import { CatalogoGeneralService } from '../../../../core/services/Services Catalogo General/catalogo-general.service';

import { Users } from '../../../../Models/Master/users';
import { VistaRolesPrivilegios } from '../../../../Models/Master/vista-roles-privilegios';
import { VistaRolesPrivilegiosService } from '../../../../core/services/Services Configuracion/vista-roles-privilegios.service';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-catalogo-general',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    TablaCatalogoComponent,
    AgregarProductoCatalogoComponent,
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
      <app-agregar-producto-catalogo
        *ngIf="mostrarModal"
        (addProducto)="agregarProducto($event)"
        (cancelar)="cerrarModal()"
      ></app-agregar-producto-catalogo>
      <div class="title-container">
        <h1>CATÁLOGO GENERAL</h1>
      </div>
      <div class="botonera">
        <button class="btn" (click)="abrirModal()"  *ngIf="mostrarBotonAgregar">Agregar Producto</button>
      </div>
      <app-tabla-catalogo></app-tabla-catalogo>
    </main>
  `,
  styleUrl: './catalogo-general.component.css',
})
export class CatalogoGeneralComponent {
  productsList: General_Catalogue[] = [];
  filteredProductsList: General_Catalogue[] = [];
  isSidebarOpen: boolean = false;
  mostrarModal: boolean = false;

   //PARA PRIVILEGIOS
   mostrarBotonAgregar: boolean = false;
   mostrarBotonReintentar: boolean = false;
   currentUser?: Users | null;
   privilegiosDisponibles?: VistaRolesPrivilegios[] | null;
 
  constructor(
    private sidebarOpeningService: SidebaropeningService,
    private catalogoGeneralService: CatalogoGeneralService,
    private vistaRolesPrivilegiosService: VistaRolesPrivilegiosService,
    private authService: AuthService,
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
        // console.log('Privilegios disponibles:', this.privilegiosDisponibles);
        this.mostrarBotonAgregar = this.privilegiosDisponibles.some(
          (privilegio) => privilegio.id_privilegio === 8
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
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
  }

  agregarProducto(producto: General_Catalogue): void {
    this.catalogoGeneralService
      .addCatalogueProduct(producto)
      .then((success) => {
        console.log('Éxito al agregar el producto:', success);
      })
      .catch((error) => {
        console.error('Error al agregar el producto:', error);
      });
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }
}
