import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { CatalogoSalidasService } from '../../../../../../core/services/Services Sucursales/Entradas y Salidas/catalogo-salidas.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agregar-motivo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<div class="modal">
    <div class="modal-content">
      <h2>Agregar Motivo de Salida al Catálogo de Salidas</h2>
      <div *ngIf="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
      <label>Nuevo Motivo:</label>
      <input type="text" [(ngModel)]="nuevoMotivo.tipo" />
      <div class="botonera">
        <button class="btn" (click)="agregarMotivo()">Añadir</button>
        <button class="btn-cerrar" (click)="cerrarModal()">Cancelar</button>
      </div>
    </div>
  </div>`,
  styleUrl: './agregar-motivo.component.css',
})
export class AgregarMotivoComponent {
  loading: boolean = false;
  @Output() cancelar = new EventEmitter<void>();

  nuevoMotivo: any = {
    tipo: '',
  };

  constructor(private catalogoSalidasService: CatalogoSalidasService) {}

  cerrarModal() {
    this.cancelar.emit();
  }

  agregarMotivo(): void {
    if (this.nuevoMotivo.tipo == '') {
      Swal.fire({
        title: 'Campo Vacío',
        text: 'Por favor ingrese un nuevo motivo para agregarlo.',
        icon: 'warning',
        confirmButtonColor: '#5c5c5c',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    Swal.fire({
      title: 'Confirmar Registro',
      text: `¿Estás seguro de registrar el nuevo motivo ${this.nuevoMotivo.tipo}?`,
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
        console.log(this.nuevoMotivo)
        this.catalogoSalidasService.addMotivoSalida(this.nuevoMotivo).subscribe(
          (response) => {
            Swal.fire({
              title: 'Éxito',
              text: 'El nuevo motivo se ha registrado correctamente.',
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
              text: 'Ha ocurrido un error al registrar el nuevo motivo.',
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
