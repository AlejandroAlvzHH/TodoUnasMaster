import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../../header/header.component';
import { SidebaropeningService } from '../../../../../core/services/sidebaropening.service';
import { EditarContrasenasComponent } from './editar-contrasenas/editar-contrasenas.component';
import { AgregarContrasenasComponent } from './agregar-contrasenas/agregar-contrasenas.component';
import { Users } from '../../../../../Models/Master/users';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../../../../core/services/Services Configuracion/usuarios.service';

@Component({
  selector: 'app-contrasenas',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    CommonModule,
    EditarContrasenasComponent,
    AgregarContrasenasComponent,
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
        <h1>CONTRASEÑAS</h1>
      </div>
      <div class="botonera">
        <button class="btn" (click)="abrirModal()">Agregar Usuario</button>
      </div>
      <app-agregar-contrasenas
        *ngIf="mostrarModal"
        (cancelar)="cerrarModal()"
      ></app-agregar-contrasenas>
      <app-editar-contrasenas
        *ngIf="mostrarModalEditar"
        [contrasena]="contrasenaSeleccionada"
        (cancelar)="cerrarModalEditar()"
      >
      </app-editar-contrasenas>
      <div class="table-container">
        <table border="2">
          <thead>
            <tr>
              <th
                scope="col"
                (click)="ordenarPorColumna('id_usuario')"
                [class.interactive]="columnaOrdenada === 'id_usuario'"
              >
                ID Usuario
                <i
                  *ngIf="columnaOrdenada === 'id_usuario'"
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
              <th>Contraseña</th>
              <th
                scope="col"
                (click)="ordenarPorColumna('status')"
                [class.interactive]="columnaOrdenada === 'status'"
              >
              Status
                <i
                  *ngIf="columnaOrdenada === 'status'"
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
              <td>{{ filteredContrasenasList[index].id_usuario }}</td>
              <td>
                {{ filteredContrasenasList[index].nombre }}
                {{ filteredContrasenasList[index].apellido_paterno }}
                {{ filteredContrasenasList[index].apellido_materno }}
              </td>
              <td type="password">••••••••••••</td>
              <td>
                <span *ngIf="filteredContrasenasList[index].status === 1"
                  >Activo</span
                >
                <span *ngIf="filteredContrasenasList[index].status === 0"
                  >Inactivo</span
                >
              </td>
              <td>
                <button
                  class="btn"
                  (click)="abrirModalEditar(filteredContrasenasList[index])"
                >
                  Editar
                </button>
                <button
                  *ngIf="filteredContrasenasList[index].status === 1"
                  class="btn"
                  (click)="eliminarContrasena(filteredContrasenasList[index])"
                >
                  Eliminar
                </button>
                <button
                  *ngIf="filteredContrasenasList[index].status === 0"
                  class="btn"
                  (click)="restaurarContrasena(filteredContrasenasList[index])"
                >
                  Restaurar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>`,
  styleUrl: './contrasenas.component.css',
})
export class ContrasenasComponent {
  isSidebarOpen: boolean = false;
  mostrarModal: boolean = false;
  mostrarModalEditar: boolean = false;

  contrasenasList: Users[] = [];
  filteredContrasenasList: Users[] = [];
  filteredIndices: number[] = [];
  columnaOrdenada: keyof Users | null = null;
  ordenAscendente: boolean = true;
  contrasenaSeleccionada: Users | null = null;

  constructor(
    private sidebarOpeningService: SidebaropeningService,
    private cdr: ChangeDetectorRef,
    private usuariosService: UsuariosService
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
      this.contrasenasList = await this.usuariosService.getAllUsers();
      this.filteredContrasenasList = this.contrasenasList.map((contrasena) => ({
        id_usuario: contrasena.id_usuario,
        nombre: contrasena.nombre,
        apellido_paterno: contrasena.apellido_paterno,
        apellido_materno: contrasena.apellido_materno,
        contrasena: contrasena.contrasena,
        correo: contrasena.correo,
        id_rol: contrasena.id_rol,
        status: contrasena.status,
      }));
      this.filteredIndices = Array.from(
        { length: this.filteredContrasenasList.length },
        (_, i) => i
      );
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al obtener las contraseñas de Master:', error);
    }
  }

  ordenarPorColumna(columna: keyof Users) {
    if (this.columnaOrdenada === columna) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.columnaOrdenada = columna;
      this.ordenAscendente = true;
    }
    this.filteredContrasenasList.sort((a, b) => {
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

  eliminarContrasena(contrasena: Users) {
    Swal.fire({
      title: 'Confirmar Eliminación',
      text: `¿Estás seguro de eliminar el usuario ${contrasena.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar eliminación',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const usuarioModificado = { ...contrasena };
          usuarioModificado.status = 0;
          await this.usuariosService
            .updateStatusUsuario(usuarioModificado)
            .subscribe();
          Swal.fire({
            title: 'Eliminación Realizada',
            text: `Se eliminó el usuario: ${contrasena.nombre}`,
            icon: 'success',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          }).then(async (result) => {
            this.cerrarModal();
            window.location.reload();
          });
        } catch (error) {
          Swal.fire({
            title: 'Eliminación No Realizada',
            text: `No se logró eliminar el usuario: ${contrasena.nombre}`,
            icon: 'error',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          });
        }
      }
    });
  }

  restaurarContrasena(contrasena: Users) {
    Swal.fire({
      title: 'Confirmar Restauración',
      text: `¿Estás seguro de restaurar el usuario ${contrasena.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar restauración',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const usuarioModificado = { ...contrasena };
          usuarioModificado.status = 1;
          await this.usuariosService
            .updateStatusUsuario(usuarioModificado)
            .subscribe();
          Swal.fire({
            title: 'Restauración Realizada',
            text: `Se restauró el usuario: ${contrasena.nombre}`,
            icon: 'success',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          }).then(async (result) => {
            this.cerrarModal();
            window.location.reload();
          });
        } catch (error) {
          Swal.fire({
            title: 'Restauración No Realizada',
            text: `No se logró restaurar el usuario: ${contrasena.nombre}`,
            icon: 'error',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          });
        }
      }
    });
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  abrirModalEditar(contrasena: Users): void {
    this.contrasenaSeleccionada = contrasena;
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
  }
}
