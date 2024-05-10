import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../../../../../core/services/Services Configuracion/usuarios.service';
import { FormsModule } from '@angular/forms';
import { RolesService } from '../../../../../../core/services/Services Configuracion/roles.service';
import { Roles } from '../../../../../../Models/Master/roles';

@Component({
  selector: 'app-agregar-contrasenas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<div class="modal">
    <div class="modal-content">
      <h2>Agregar Clínica al Catálogo de Clínicas</h2>
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
        <button class="btn" (click)="agregarUsuario()">Añadir</button>
        <button class="btn-cerrar" (click)="cerrarModal()">Cancelar</button>
      </div>
    </div>
  </div>`,
  styleUrl: './agregar-contrasenas.component.css',
})
export class AgregarContrasenasComponent {
  loading: boolean = false;
  @Output() cancelar = new EventEmitter<void>();
  selectedRol: number | null = null;
  roles: Roles[] = [];
  nuevoUsuario: any = {
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    contrasena: '',
    correo: '',
    id_rol: 1,
    status: 1,
  };

  constructor(
    private usuariosService: UsuariosService,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
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
  }
  cerrarModal() {
    this.cancelar.emit();
  }

  agregarUsuario(): void {
    if (
      this.nuevoUsuario.nombre == '' ||
      this.nuevoUsuario.apellido_paterno == '' ||
      this.nuevoUsuario.apellido_materno == '' ||
      this.nuevoUsuario.contrasena == '' ||
      this.nuevoUsuario.correo == ''
    ) {
      Swal.fire({
        title: 'Campos Vacíos',
        text: 'Por favor rellene los campos vacíos para poder agregar un nuevo usuario.',
        icon: 'warning',
        confirmButtonColor: '#333333',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    Swal.fire({
      title: 'Confirmar Registro',
      text: `¿Estás seguro de registrar el nuevo usuario ${this.nuevoUsuario.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar registro',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        console.log(this.nuevoUsuario);
        this.usuariosService.addUsuario(this.nuevoUsuario).subscribe(
          (response) => {
            Swal.fire({
              title: 'Éxito',
              text: 'El nuevo usuario se ha registrado correctamente.',
              icon: 'success',
              confirmButtonColor: '#333333',
              confirmButtonText: 'Aceptar',
            }).then(() => {
              this.loading = false;
              this.cerrarModal();
              window.location.reload();
            });
          },
          (error) => {
            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al registrar el nuevo usuario.',
              icon: 'error',
              confirmButtonColor: '#333333',
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
