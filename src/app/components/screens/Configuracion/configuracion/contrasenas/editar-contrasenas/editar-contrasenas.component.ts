import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Users } from '../../../../../../Models/Master/users';
import { UsuariosService } from '../../../../../../core/services/Services Configuracion/usuarios.service';
import { FormsModule } from '@angular/forms';
import { Roles } from '../../../../../../Models/Master/roles';
import { RolesService } from '../../../../../../core/services/Services Configuracion/roles.service';

@Component({
  selector: 'app-editar-contrasenas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal">
      <div class="modal-content">
        <h2>Editar Motivo</h2>
        <div *ngIf="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
        <label>Nombre:</label>
        <input type="text" [(ngModel)]="nuevoUsuario.nombre" />
        <label>Apellido Paterno:</label>
        <input type="text" [(ngModel)]="nuevoUsuario.apellido_paterno" />
        <label>Apellido Materno:</label>
        <input type="text" [(ngModel)]="nuevoUsuario.apellido_materno" />
        <label>Contraseña:</label>
        <input type="text" [(ngModel)]="nuevoUsuario.contrasena" />
        <label>Correo:</label>
        <input type="text" [(ngModel)]="nuevoUsuario.correo" />
        <label>Rol:</label>
        <select [(ngModel)]="selectedRol">
          <option *ngFor="let rol of roles" [value]="rol.id_rol">
            {{ rol.nombre }}
          </option>
        </select>
        <div class="botonera">
          <button class="btn" (click)="editarUsuario()">Editar</button>
          <button class="btn-cerrar" (click)="cerrarModalEditar()">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editar-contrasenas.component.css',
})
export class EditarContrasenasComponent {
  loading: boolean = false;
  @Output() cancelar = new EventEmitter<void>();
  @Input() contrasena: Users | null = null;
  selectedRol: number | null = null;
  roles: Roles[] = [];

  nuevoUsuario: any = {};

  constructor(
    private usuariosService: UsuariosService,
    private rolesService: RolesService
  ) {}

  ngOnInit() {
    this.rolesService.getRoles().subscribe(
      (roles) => {
        this.roles = roles;
        if (this.roles.length > 0) {
          this.selectedRol = this.roles[0].id_rol;
        }
      },
      (error) => {
        console.error('Error al obtener los roles: ', error);
      }
    );
    this.nuevoUsuario = {
      id_usuario: this.contrasena?.id_usuario,
      nombre: this.contrasena?.nombre,
      apellido_paterno: this.contrasena?.apellido_paterno,
      apellido_materno: this.contrasena?.apellido_materno,
      contrasena: this.contrasena?.contrasena,
      correo: this.contrasena?.correo,
      id_rol: this.contrasena?.id_rol,
      status: this.contrasena?.status,
    };
  }

  cerrarModalEditar() {
    this.cancelar.emit();
  }

  async editarUsuario() {
    if (this.nuevoUsuario.nombre == '') {
      Swal.fire({
        title: 'Campos Vacíos',
        text: 'Por favor ingrese valores válidos para modificar el usuario.',
        icon: 'warning',
        confirmButtonColor: '#5c5c5c',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    Swal.fire({
      title: 'Confirmar Edición',
      text: `¿Estás seguro de registrar el nuevo usuario ${this.nuevoUsuario.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#5c5c5c',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar registro',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.loading = true;
        if (this.contrasena?.id_usuario)
          await this.usuariosService
            .updateStatusUsuario(this.nuevoUsuario)
            .subscribe(
              () => {
                Swal.fire({
                  title: 'Éxito',
                  text: 'El usuario editado se ha registrado correctamente.',
                  icon: 'success',
                  confirmButtonColor: '#5c5c5c',
                  confirmButtonText: 'Aceptar',
                }).then(() => {
                  this.loading = false;
                  this.cerrarModalEditar();
                  window.location.reload();
                });
              },
              (error) => {
                Swal.fire({
                  title: 'Error',
                  text: 'Ha ocurrido un error al registrar la edición del usuario.',
                  icon: 'error',
                  confirmButtonColor: '#5c5c5c',
                  confirmButtonText: 'Aceptar',
                }).then(() => {
                  this.loading = false;
                });
              }
            );
      }
    });
  }
}
