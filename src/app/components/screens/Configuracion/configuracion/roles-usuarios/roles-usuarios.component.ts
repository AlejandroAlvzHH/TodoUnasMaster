import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../../header/header.component';
import { SidebaropeningService } from '../../../../../core/services/sidebaropening.service';
import { AgregarRolComponent } from './agregar-rol/agregar-rol.component';
import { EditarRolComponent } from './editar-rol/editar-rol.component';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { RolesService } from '../../../../../core/services/Services Configuracion/roles.service';
import { Roles } from '../../../../../Models/Master/roles';

@Component({
  selector: 'app-roles-usuarios',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    CommonModule,
    AgregarRolComponent,
    EditarRolComponent,
  ],
  template: `<app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <div class="title-container">
        <h1>ROLES Y USUARIOS</h1>
      </div>
      <div class="botonera">
        <button class="btn" (click)="abrirModal()">Agregar Rol</button>
      </div>
      <app-agregar-rol
        *ngIf="mostrarModal"
        (cancelar)="cerrarModal()"
      ></app-agregar-rol>
      <app-editar-rol
        *ngIf="mostrarModalEditar"
        [rol]="rolSeleccionado"
        (cancelar)="cerrarModalEditar()"
      >
      </app-editar-rol>
      <div class="table-container">
        <table border="2">
          <thead>
            <tr>
              <th
                scope="col"
                (click)="ordenarPorColumna('id_rol')"
                [class.interactive]="columnaOrdenada === 'id_rol'"
              >
                ID Rol
                <i
                  *ngIf="columnaOrdenada === 'id_rol'"
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let index of filteredIndices">
              <td>{{ filteredRolesList[index].id_rol }}</td>
              <td>{{ filteredRolesList[index].nombre }}</td>
              <td>
                <button
                  class="btn"
                  (click)="abrirModalEditar(filteredRolesList[index])"
                >
                  Editar Nombre
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>`,
  styleUrl: './roles-usuarios.component.css',
})
export class RolesUsuariosComponent {
  isSidebarOpen: boolean = false;

  mostrarModal: boolean = false;
  rolesList: Roles[] = [];
  filteredRolesList: Roles[] = [];
  filteredIndices: number[] = [];
  columnaOrdenada: keyof Roles | null = null;
  ordenAscendente: boolean = true;
  mostrarModalEditar: boolean = false;
  rolSeleccionado: Roles | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private sidebarOpeningService: SidebaropeningService,
    private rolesService: RolesService
  ) {}

  toggleSidebar(): void {
    this.sidebarOpeningService.toggleSidebar();
  }

  ngOnInit(): void {
    this.initialize();
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
  }

  private async initialize() {
    try {
      this.rolesList = await this.rolesService.getAllRoles();
      this.filteredRolesList = this.rolesList.map((rol) => ({
        id_rol: rol.id_rol,
        nombre: rol.nombre,
      }));
      this.filteredIndices = Array.from(
        { length: this.filteredRolesList.length },
        (_, i) => i
      );
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al obtener los roles de Master:', error);
    }
  }

  ordenarPorColumna(columna: keyof Roles) {
    if (this.columnaOrdenada === columna) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.columnaOrdenada = columna;
      this.ordenAscendente = true;
    }
    this.filteredRolesList.sort((a, b) => {
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

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }
  
  abrirModalEditar(rol: Roles): void {
    this.rolSeleccionado = rol;
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
  }
}
