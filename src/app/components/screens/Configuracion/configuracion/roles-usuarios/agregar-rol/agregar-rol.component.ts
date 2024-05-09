import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RolesService } from '../../../../../../core/services/Services Configuracion/roles.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agregar-rol',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal">
      <div class="modal-content">
        <h2>Agregar Rol</h2>
        <div *ngIf="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
        <label>Nombre del Nuevo Rol:</label>
        <input type="text" [(ngModel)]="nuevoRol.nombre" />
        <div class="botonera">
          <button class="btn" (click)="agregarRol()">Añadir</button>
          <button class="btn-cerrar" (click)="cerrarModal()">Cancelar</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './agregar-rol.component.css',
})
export class AgregarRolComponent {
  loading: boolean = false;
  @Output() cancelar = new EventEmitter<void>();

  nuevoRol: any = {
    nombre: '',
  };

  constructor(private rolesService: RolesService) {}

  cerrarModal() {
    this.cancelar.emit();
  }

  agregarRol(): void {
    if (this.nuevoRol.nombre == '') {
      Swal.fire({
        title: 'Campo Vacío',
        text: 'Por favor ingrese un nuevo rol para agregarlo.',
        icon: 'warning',
        confirmButtonColor: '#5c5c5c',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    Swal.fire({
      title: 'Confirmar Registro',
      text: `¿Estás seguro de registrar el nuevo rol ${this.nuevoRol.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#5c5c5c',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar registro',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        console.log(this.nuevoRol);
        this.rolesService.addRol(this.nuevoRol).subscribe(
          (response) => {
            Swal.fire({
              title: 'Éxito',
              text: 'El nuevo rol se ha registrado correctamente.',
              icon: 'success',
              confirmButtonColor: '#5c5c5c',
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
              text: 'Ha ocurrido un error al registrar el nuevo rol.',
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
