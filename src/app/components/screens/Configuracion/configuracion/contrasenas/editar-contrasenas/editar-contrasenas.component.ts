import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Users } from '../../../../../../Models/Master/users';
import { UsuariosService } from '../../../../../../core/services/Services Configuracion/usuarios.service';
import { FormsModule } from '@angular/forms';
import { Roles } from '../../../../../../Models/Master/roles';
import { RolesService } from '../../../../../../core/services/Services Configuracion/roles.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-editar-contrasenas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal">
      <div class="modal-content" *ngIf="!loadingRoles">
        <h2>Editar Usuario</h2>
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
        <div class="password-input">
          <input
            type="password"
            [(ngModel)]="nuevoUsuario.contrasena"
            [ngClass]="{
              mismatch:
                nuevoUsuario.contrasena !== nuevoUsuario.confirmarContrasena &&
                nuevoUsuario.confirmarContrasena !== ''
            }"
            (input)="onPasswordInput()"
          />
          <i
            class="fa fa-eye"
            (click)="togglePasswordVisibility('password')"
          ></i>
        </div>
        <label *ngIf="isPasswordModified()">Confirmar Contraseña:</label>
        <div class="password-input" *ngIf="isPasswordModified()">
          <input
            type="password"
            [(ngModel)]="nuevoUsuario.confirmarContrasena"
            [ngClass]="{
              mismatch:
                nuevoUsuario.contrasena !== nuevoUsuario.confirmarContrasena &&
                nuevoUsuario.confirmarContrasena !== ''
            }"
            (input)="onConfirmPasswordInput()"
          />
          <i
            class="fa fa-eye"
            (click)="togglePasswordVisibility('confirm')"
          ></i>
        </div>
        <div
          *ngIf="
            isPasswordModified() &&
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
        <select [(ngModel)]="selectedRol" (ngModelChange)="onRolChange($event)">
          <option *ngFor="let rol of roles" [value]="rol.id_rol">
            {{ rol.nombre }}
          </option>
        </select>
        <div class="botonera">
          <button
            class="btn"
            [disabled]="!canEditUser()"
            (click)="editarUsuario()"
          >
            Editar
          </button>
          <button class="btn-cerrar" (click)="cerrarModalEditar()">
            Cancelar
          </button>
        </div>
      </div>
      <div *ngIf="loadingRoles" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
    </div>
  `,
  styleUrls: ['./editar-contrasenas.component.css'],
})
export class EditarContrasenasComponent {
  loading: boolean = false;
  @Output() cancelar = new EventEmitter<void>();
  @Input() id_usuario: number | null = null;
  selectedRol: number | null = null;
  roles: Roles[] = [];
  contrasena: Users | null = null;
  nuevoUsuario: any = {};

  loadingRoles: boolean = true;
  emailTimer: any;
  showEmailError: boolean = false;
  passwordModified: boolean = false;
  passwordVisible: boolean = false;

  constructor(
    private usuariosService: UsuariosService,
    private rolesService: RolesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.loadingRoles = true;
    try {
      this.contrasena = await firstValueFrom(
        this.usuariosService.getUserById(this.id_usuario!)
      );
      console.log(this.contrasena);
      this.nuevoUsuario = {
        id_usuario: this.contrasena.id_usuario,
        nombre: this.contrasena.nombre,
        apellido_paterno: this.contrasena.apellido_paterno,
        apellido_materno: this.contrasena.apellido_materno,
        contrasena: this.contrasena.contrasena,
        correo: this.contrasena.correo,
        id_rol: this.contrasena.id_rol,
        status: this.contrasena.status,
      };
      this.roles = await firstValueFrom(this.rolesService.getRoles());
      if (this.roles.length > 0) {
        this.selectedRol = this.nuevoUsuario.id_rol || this.roles[0].id_rol;
        this.loadingRoles = false;
      }
    } catch (error) {
      console.error('Error fetching usuarios o roles:', error);
      this.loadingRoles = false;
    } finally {
      this.loading = false;
      this.loadingRoles = false;
    }
  }

  cerrarModalEditar() {
    this.cancelar.emit();
  }

  onRolChange(newRolId: number): void {
    this.selectedRol = newRolId;
    this.nuevoUsuario.id_rol = newRolId;
  }

  onEmailInput(): void {
    clearTimeout(this.emailTimer);
    this.emailTimer = setTimeout(() => {
      this.showEmailError = !this.isValidEmail(this.nuevoUsuario.correo);
    }, 500);
  }

  onPasswordInput(): void {
    this.passwordModified = true;
  }

  onConfirmPasswordInput(): void {
    this.passwordModified = true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  canEditUser(): boolean {
    return (
      this.passwordModified ||
      this.isRoleChanged() ||
      this.areOtherFieldsModified()
    );
  }

  isRoleChanged(): boolean {
    return this.nuevoUsuario.id_rol !== this.contrasena?.id_rol;
  }
  
  areOtherFieldsModified(): boolean {
    return (
      this.nuevoUsuario.nombre !== this.contrasena?.nombre ||
      this.nuevoUsuario.apellido_paterno !==
        this.contrasena?.apellido_paterno ||
      this.nuevoUsuario.apellido_materno !==
        this.contrasena?.apellido_materno ||
      this.nuevoUsuario.correo !== this.contrasena?.correo
    );
  }

  editarUsuario() {
    if (!this.canEditUser()) {
      Swal.fire({
        title: 'Contraseña no coincide',
        text: 'Las contraseñas no coinciden.',
        icon: 'error',
        confirmButtonColor: '#333333',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    Swal.fire({
      title: 'Confirmar Edición',
      text: `¿Estás seguro de registrar el nuevo usuario ${this.nuevoUsuario.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar registro',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.loading = true;
        try {
          await firstValueFrom(
            this.usuariosService.updateStatusUsuario(this.nuevoUsuario)
          );
          Swal.fire({
            title: 'Éxito',
            text: 'El usuario editado se ha registrado correctamente.',
            icon: 'success',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.loading = false;
            this.cerrarModalEditar();
            window.location.reload();
          });
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al registrar la edición del usuario.',
            icon: 'error',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.loading = false;
          });
        }
      }
    });
  }

  isPasswordModified(): boolean {
    return this.passwordModified;
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    }
  }
}
