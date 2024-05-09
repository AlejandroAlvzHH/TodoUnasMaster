import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ClinicasService } from '../../../../../../core/services/Services Sucursales/clinicas.service';
import { Clinics } from '../../../../../../Models/Master/clinics';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-clinica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: ` <div class="modal">
    <div class="modal-content">
      <h2>Editar Clínica</h2>
      <div *ngIf="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
      <label>Nombre:</label>
      <input type="text" [(ngModel)]="nuevaClinica.nombre" />
      <label>Direccion:</label>
      <input type="text" [(ngModel)]="nuevaClinica.direccion" />
      <div class="botonera">
        <button class="btn" (click)="editarClinica()">Editar</button>
        <button class="btn-cerrar" (click)="cerrarModalEditar()">
          Cancelar
        </button>
      </div>
    </div>
  </div>`,
  styleUrl: './editar-clinica.component.css',
})
export class EditarClinicaComponent {
  loading: boolean = false;
  @Output() cancelar = new EventEmitter<void>();
  @Input() clinica: Clinics | null = null;

  nuevaClinica: any = {};

  constructor(private clinicasService: ClinicasService) {}

  ngOnInit() {
    this.nuevaClinica = {
      id_clinica: this.clinica?.id_clinica,
      nombre: this.clinica?.nombre || '',
      direccion: this.clinica?.direccion || '',
    };
  }

  cerrarModalEditar() {
    this.cancelar.emit();
  }

  async editarClinica() {
    if (this.nuevaClinica.nombre == '' || this.nuevaClinica.direccion == '') {
      Swal.fire({
        title: 'Campos Vacíos',
        text: 'Por favor ingrese valores para modificar la clínica.',
        icon: 'warning',
        confirmButtonColor: '#5c5c5c',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    Swal.fire({
      title: 'Confirmar Edición',
      text: `¿Estás seguro de registrar la edición para la clínica ${this.nuevaClinica.nombre}?`,
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
        console.log('THIS IS THE ID: ', this.clinica?.id_clinica);
        console.log(this.clinica);
        if (this.clinica?.id_clinica)
          await this.clinicasService
            .updateClinica(this.nuevaClinica, this.clinica?.id_clinica)
            .then(
              () => {
                Swal.fire({
                  title: 'Éxito',
                  text: 'La clínica editada se ha registrado correctamente.',
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
                  text: 'Ha ocurrido un error al registrar la edición de la clínica.',
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
