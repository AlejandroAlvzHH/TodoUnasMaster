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
    <div class="modal-content" *ngIf="!loadingRoles">
      <h2>Agregar Usuario al Sistema</h2>
      <div *ngIf="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
      <label>Nombre:</label>
      <input type="text" [(ngModel)]="nuevoUsuario.nombre" />
      <label>Apellido Paterno:</label>
      <input type="text" [(ngModel)]="nuevoUsuario.apellido_paterno" />
      <label>Apellido Materno:</label>
      <input type="text" [(ngModel)]="nuevoUsuario.apellido_materno" />
      <!-- Agregar esto dentro del template del componente -->
      <label>Contraseña:</label>
      <div class="password-input">
        <input
          type="password"
          [(ngModel)]="nuevoUsuario.contrasena"
          [ngClass]="{
            mismatch:
              nuevoUsuario.contrasena !== nuevoUsuario.confirmarContrasena &&
              nuevoUsuario.confirmarContrasena !== ''
          }"
        />
        <i class="fa fa-eye" (click)="togglePasswordVisibility('password')"></i>
      </div>
      <label>Confirmar Contraseña:</label>
      <div class="password-input">
        <input
          type="password"
          [(ngModel)]="nuevoUsuario.confirmarContrasena"
          [ngClass]="{
            mismatch:
              nuevoUsuario.contrasena !== nuevoUsuario.confirmarContrasena &&
              nuevoUsuario.confirmarContrasena !== ''
          }"
        />
        <i class="fa fa-eye" (click)="togglePasswordVisibility('confirm')"></i>
      </div>

      <div
        *ngIf="
          nuevoUsuario.confirmarContrasena !== '' &&
          nuevoUsuario.contrasena !== nuevoUsuario.confirmarContrasena
        "
        class="error-message"
      >
        Las contraseñas no coinciden.
      </div>
      <label>Correo:</label>
      <div
        class="input-container"
        [ngClass]="{ 'invalid-email': showEmailError }"
      >
        <input
          type="text"
          [(ngModel)]="nuevoUsuario.correo"
          (input)="onEmailInput()"
        />
        <div *ngIf="showEmailError" class="error-message">
          Por favor ingrese un correo válido.
        </div>
      </div>
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
    <div *ngIf="loadingRoles" class="loading-overlay">
      <div class="loading-spinner"></div>
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
    confirmarContrasena: '',
    correo: '',
    id_rol: null,
    status: 1,
  };
  loadingRoles: boolean = true;
  emailTimer: any;
  showEmailError: boolean = false;
  passwordVisible: boolean = false;

  constructor(
    private usuariosService: UsuariosService,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.loadingRoles = true;
    this.rolesService.getRoles().subscribe(
      (roles) => {
        this.roles = roles.filter((role) => role.status === 1);
        if (this.roles.length > 0) {
          this.selectedRol = this.roles[0].id_rol;
          this.nuevoUsuario.id_rol = this.roles[0].id_rol;
        }
        this.loadingRoles = false;
      },
      (error) => {
        console.error('Error al obtener los roles: ', error);
        this.loadingRoles = false;
      }
    );
  }

  cerrarModal() {
    this.cancelar.emit();
  }

  onEmailInput(): void {
    clearTimeout(this.emailTimer);
    this.emailTimer = setTimeout(() => {
      this.showEmailError = !this.isValidEmail(this.nuevoUsuario.correo);
    }, 500);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  agregarUsuario(): void {
    if (
      this.nuevoUsuario.nombre === '' ||
      this.nuevoUsuario.apellido_paterno === '' ||
      this.nuevoUsuario.apellido_materno === '' ||
      this.nuevoUsuario.contrasena === '' ||
      this.nuevoUsuario.correo === '' ||
      !this.isValidEmail(this.nuevoUsuario.correo) ||
      this.nuevoUsuario.contrasena !== this.nuevoUsuario.confirmarContrasena
    ) {
      Swal.fire({
        title: 'Campos Vacíos o Contraseñas no Coinciden',
        text: 'Por favor rellene los campos vacíos correctamente y asegúrese de que las contraseñas coincidan.',
        icon: 'warning',
        confirmButtonColor: '#333333',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    this.usuariosService
      .verificarCorreoExistente(this.nuevoUsuario.correo)
      .subscribe(
        (existe) => {
          if (existe) {
            Swal.fire({
              title: 'Correo Existente',
              text: 'El correo ingresado ya está registrado. Por favor ingrese un correo diferente.',
              icon: 'error',
              confirmButtonColor: '#333333',
              confirmButtonText: 'Aceptar',
            });
          } else {
            this.confirmarAgregarUsuario();
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al verificar el correo.',
            icon: 'error',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          });
        }
      );
  }

  confirmarAgregarUsuario(): void {
    Swal.fire({
      title: 'Confirmar Registro',
      text: `¿Estás seguro de registrar el nuevo usuario ${this.nuevoUsuario.nombre}?`,
      icon: 'question',
      showCancelButton: true,
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

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    }
  }
}
