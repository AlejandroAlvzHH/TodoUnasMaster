import { Component } from '@angular/core';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { CommonModule } from '@angular/common';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';

import { Users } from '../../../../Models/Master/users';
import { VistaRolesPrivilegiosService } from '../../../../core/services/Services Configuracion/vista-roles-privilegios.service';
import { VistaRolesPrivilegios } from '../../../../Models/Master/vista-roles-privilegios';
import { AuthService } from '../../../../core/services/auth/auth.service';

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
          <a *ngIf="mostrarBotonContrasenas" href="/contrasenas" class="opcion">Contraseñas</a>
          <a *ngIf="mostrarBotonCatalogoSalidas" href="/catalogo-salidas" class="opcion">Catálogo de Salidas</a>
          <a *ngIf="mostrarBotonCatalogoClinicas" href="/catalogo-clinicas" class="opcion">Catálogo de Clínicas</a>
          <a *ngIf="mostrarBotonRolesUsuarios" href="/roles-usuarios" class="opcion">Roles y Usuarios</a>
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

  constructor(private sidebarOpeningService: SidebaropeningService,
    private authService: AuthService,
    private vistaRolesPrivilegiosService: VistaRolesPrivilegiosService
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
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
    this.getAllRolesPrivilegios();
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
  }
}
