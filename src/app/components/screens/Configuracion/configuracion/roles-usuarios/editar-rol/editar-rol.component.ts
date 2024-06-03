import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Roles } from '../../../../../../Models/Master/roles';
import { RolesService } from '../../../../../../core/services/Services Configuracion/roles.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-rol',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="modal">
      <div class="modal-content">
        <h2>Editar Rol</h2>
        <div *ngIf="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
        <label>Nombre:</label>
        <input type="text" [(ngModel)]="nuevoRol.nombre" />
        <div class="botonera">
          <button class="btn" (click)="editarRol()">Editar</button>
          <button class="btn-cerrar" (click)="cerrarModalEditar()">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editar-rol.component.css',
})
export class EditarRolComponent {
  loading: boolean = false;
  @Output() cancelar = new EventEmitter<void>();
  @Input() rol: Roles | null = null;

  nuevoRol: any = {};

  constructor(private rolesService: RolesService) {}

  ngOnInit() {
    this.nuevoRol = {
      id_rol: this.rol?.id_rol,
      nombre: this.rol?.nombre || '',
      status: this.rol?.status
    };
  }

  cerrarModalEditar() {
    this.cancelar.emit();
  }

  async editarRol() {
    if (this.nuevoRol.nombre == '') {
      Swal.fire({
        title: 'Campo Vacío',
        text: 'Por favor ingrese un nuevo valor para modificar el rol.',
        icon: 'warning',
        confirmButtonColor: '#333333',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    Swal.fire({
      title: 'Confirmar Edición',
      text: `¿Estás seguro de registrar la edición para el rol ${this.nuevoRol.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar edición',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.loading = true;
        if (this.rol?.id_rol)
          await this.rolesService
            .updateRol(this.nuevoRol, this.rol?.id_rol)
            .then(
              () => {
                Swal.fire({
                  title: 'Éxito',
                  text: 'El rol editado se ha registrado correctamente.',
                  icon: 'success',
                  confirmButtonColor:'#333333',
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
                  text: 'Ha ocurrido un error al registrar la edición del rol.',
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
