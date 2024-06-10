import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../../header/header.component';
import { SidebaropeningService } from '../../../../../core/services/sidebaropening.service';
import { EditarContrasenasComponent } from './editar-contrasenas/editar-contrasenas.component';
import { AgregarContrasenasComponent } from './agregar-contrasenas/agregar-contrasenas.component';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../../../../core/services/Services Configuracion/usuarios.service';
import { VistaUsuarioDetalle } from '../../../../../Models/Master/vista-usuario-detalle';
import { VistaUsuarioDetalleService } from '../../../../../core/services/Services Configuracion/vista-usuario-detalle.service';

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
        [id_usuario]="usuarioSeleccionado"
        (cancelar)="cerrarModalEditar()"
      ></app-editar-contrasenas>
      <div class="flex flex-col">
        <div class="table-container overflow-x-auto">
          <div class="inline-block min-w-full py-1">
            <div class="overflow-hidden">
              <table class="min-w-full text-left text-xs font-light">
                <thead class="border-b border-neutral-200 font-medium">
                  <tr>
                    <th
                      scope="col"
                      class="px-2 py-1"
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
                      class="px-2 py-1"
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
                      class="px-2 py-1"
                      (click)="ordenarPorColumna('correo')"
                      [class.interactive]="columnaOrdenada === 'correo'"
                    >
                      Correo
                      <i
                        *ngIf="columnaOrdenada === 'correo'"
                        class="arrow-icon"
                        [class.asc]="ordenAscendente"
                        [class.desc]="!ordenAscendente"
                      ></i>
                    </th>
                    <th
                      scope="col"
                      class="px-2 py-1"
                      (click)="ordenarPorColumna('nombre')"
                      [class.interactive]="columnaOrdenada === 'nombre'"
                    >
                      Rol
                      <i
                        *ngIf="columnaOrdenada === 'nombre'"
                        class="arrow-icon"
                        [class.asc]="ordenAscendente"
                        [class.desc]="!ordenAscendente"
                      ></i>
                    </th>
                    <th scope="col" class="px-2 py-1">Contraseña</th>
                    <th
                      scope="col"
                      class="px-2 py-1"
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
                    <th scope="col" class="px-2 py-1">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="let index of filteredIndices"
                    class="border-b border-neutral-200"
                  >
                    <td class="whitespace-nowrap px-2 py-1 font-medium">
                      {{ filteredContrasenasListVista[index].id_usuario }}
                    </td>
                    <td class="whitespace-nowrap px-2 py-1 font-medium">
                      {{ filteredContrasenasListVista[index].nombre }}
                    </td>
                    <td class="whitespace-nowrap px-2 py-1 font-medium">
                      {{ filteredContrasenasListVista[index].correo }}
                    </td>
                    <td class="whitespace-nowrap px-2 py-1 font-medium">
                      {{ filteredContrasenasListVista[index].rol }}
                    </td>
                    <td class="whitespace-nowrap px-2 py-1 font-medium">
                      {{ filteredContrasenasListVista[index].contrasena }}
                    </td>
                    <td class="whitespace-nowrap px-2 py-1 font-medium">
                      <span
                        *ngIf="filteredContrasenasListVista[index].status === 1"
                        >Activo</span
                      >
                      <span
                        *ngIf="filteredContrasenasListVista[index].status === 0"
                        >Inactivo</span
                      >
                    </td>
                    <td class="whitespace-nowrap px-2 py-1 font-medium">
                      <button
                        class="btn"
                        (click)="
                          abrirModalEditar(
                            filteredContrasenasListVista[index].id_usuario
                          )
                        "
                      >
                        Editar
                      </button>
                      <button
                        *ngIf="
                          filteredContrasenasListVista[index].status === 1 &&
                          filteredContrasenasListVista[index].id_usuario !== 1
                        "
                        class="btn"
                        (click)="
                          deshabilitarContrasena(
                            filteredContrasenasListVista[index]
                          )
                        "
                      >
                        Deshabilitar
                      </button>
                      <button
                        *ngIf="
                          filteredContrasenasListVista[index].status === 0 &&
                          filteredContrasenasListVista[index].id_usuario !== 0
                        "
                        class="btn"
                        (click)="
                          restaurarContrasena(
                            filteredContrasenasListVista[index]
                          )
                        "
                      >
                        Restaurar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main> `,
  styleUrl: './contrasenas.component.css',
})
export class ContrasenasComponent {
  isSidebarOpen: boolean = false;
  mostrarModal: boolean = false;
  mostrarModalEditar: boolean = false;
  contrasenasListVista: VistaUsuarioDetalle[] = [];
  filteredContrasenasListVista: VistaUsuarioDetalle[] = [];
  filteredIndices: number[] = [];
  columnaOrdenada: keyof VistaUsuarioDetalle | null = null;
  ordenAscendente: boolean = true;
  usuarioSeleccionado: number | null = null;

  constructor(
    private sidebarOpeningService: SidebaropeningService,
    private cdr: ChangeDetectorRef,
    private usuariosService: UsuariosService,
    private vistaUsuarioDetalleService: VistaUsuarioDetalleService
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
      this.contrasenasListVista =
        await this.vistaUsuarioDetalleService.getAllDetalleUsers();
      this.filteredContrasenasListVista = this.contrasenasListVista.map(
        (contrasena) => ({
          id_usuario: contrasena.id_usuario,
          nombre: contrasena.nombre,
          correo: contrasena.correo,
          rol: contrasena.rol,
          contrasena: contrasena.contrasena,
          status: contrasena.status,
        })
      );
      this.filteredIndices = Array.from(
        { length: this.filteredContrasenasListVista.length },
        (_, i) => i
      );
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al obtener las contraseñas de Master:', error);
    }
  }

  ordenarPorColumna(columna: keyof VistaUsuarioDetalle) {
    if (this.columnaOrdenada === columna) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.columnaOrdenada = columna;
      this.ordenAscendente = true;
    }
    this.filteredContrasenasListVista.sort((a, b) => {
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

  deshabilitarContrasena(contrasena: VistaUsuarioDetalle) {
    Swal.fire({
      title: 'Confirmar Deshabilitación',
      text: `¿Estás seguro de deshabilitar el usuario ${contrasena.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar deshabilitación',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const usuario = await this.usuariosService
            .getUserById(contrasena.id_usuario)
            .toPromise();
          if (usuario) {
            const usuarioModificado = { ...usuario, status: 0 };
            await this.usuariosService
              .updateStatusUsuario(usuarioModificado)
              .toPromise();
          }
          Swal.fire({
            title: 'Deshabilitación Realizada',
            text: `Se deshabilitó el usuario: ${contrasena.nombre}`,
            icon: 'success',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          }).then(async (result) => {
            this.cerrarModal();
            window.location.reload();
          });
        } catch (error) {
          Swal.fire({
            title: 'Deshabilitación No Realizada',
            text: `No se logró deshabilitar el usuario: ${contrasena.nombre}`,
            icon: 'error',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          });
        }
      }
    });
  }

  restaurarContrasena(contrasena: VistaUsuarioDetalle) {
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
          const usuario = await this.usuariosService
            .getUserById(contrasena.id_usuario)
            .toPromise();
          if (usuario) {
            const usuarioModificado = { ...usuario, status: 1 };
            await this.usuariosService
              .updateStatusUsuario(usuarioModificado)
              .toPromise();
          }
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

  abrirModalEditar(id_usuario: number): void {
    this.usuarioSeleccionado = id_usuario;
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
  }
}
