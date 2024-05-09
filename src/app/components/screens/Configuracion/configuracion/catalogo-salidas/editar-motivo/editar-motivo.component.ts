import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { CatalogoSalidas } from '../../../../../../Models/Master/catalogo_salidas';
import { CatalogoSalidasService } from '../../../../../../core/services/Services Sucursales/Entradas y Salidas/catalogo-salidas.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-motivo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<div class="modal">
    <div class="modal-content">
      <h2>Editar Motivo</h2>
      <div *ngIf="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
      <label>Tipo:</label>
      <input type="text" [(ngModel)]="nuevoMotivo.tipo" />
      <div class="botonera">
        <button class="btn" (click)="editarMotivo()">Editar</button>
        <button class="btn-cerrar" (click)="cerrarModalEditar()">
          Cancelar
        </button>
      </div>
    </div>
  </div>`,
  styleUrl: './editar-motivo.component.css',
})
export class EditarMotivoComponent {
  loading: boolean = false;
  @Output() cancelar = new EventEmitter<void>();
  @Input() motivo: CatalogoSalidas | null = null;

  nuevoMotivo: any = {};

  constructor(private catalogoSalidasService: CatalogoSalidasService) {}

  ngOnInit() {
    this.nuevoMotivo = {
      id_tipo_salida: this.motivo?.id_tipo_salida,
      tipo: this.motivo?.tipo || '',
    };
  }

  cerrarModalEditar() {
    this.cancelar.emit();
  }

  async editarMotivo() {
    if (this.nuevoMotivo.tipo == '') {
      Swal.fire({
        title: 'Campo Vacío',
        text: 'Por favor ingrese un nuevo valor para modificar el motivo.',
        icon: 'warning',
        confirmButtonColor: '#5c5c5c',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    Swal.fire({
      title: 'Confirmar Edición',
      text: `¿Estás seguro de registrar la edición para el motivo ${this.nuevoMotivo.tipo}?`,
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#5c5c5c',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar edición',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.loading = true;
        console.log('THIS IS THE ID: ', this.motivo?.id_tipo_salida);
        console.log(this.nuevoMotivo);
        if (this.motivo?.id_tipo_salida)
          await this.catalogoSalidasService
            .updateMotivoSalida(this.nuevoMotivo, this.motivo?.id_tipo_salida)
            .then(
              () => {
                Swal.fire({
                  title: 'Éxito',
                  text: 'El motivo editado se ha registrado correctamente.',
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
                  text: 'Ha ocurrido un error al registrar la edición del motivo.',
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
