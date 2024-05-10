import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ClinicasService } from '../../../../../../core/services/Services Sucursales/clinicas.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agregar-clinica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<div class="modal">
  <div class="modal-content">
    <h2>Agregar Clínica al Catálogo de Clínicas</h2>
    <div *ngIf="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <label>Nombre:</label>
    <input type="text" [(ngModel)]="nuevaClinica.nombre" />
    <label>Direccion:</label>
    <input type="text" [(ngModel)]="nuevaClinica.direccion" />
    <div class="botonera">
      <button class="btn" (click)="agregarClinica()">Añadir</button>
      <button class="btn-cerrar" (click)="cerrarModal()">Cancelar</button>
    </div>
  </div>
</div>`,
  styleUrl: './agregar-clinica.component.css'
})
export class AgregarClinicaComponent {
  loading: boolean = false;
  @Output() cancelar = new EventEmitter<void>();

  nuevaClinica: any = {
    nombre: '',
    direccion: '',
  };

  constructor(private clinicasService: ClinicasService) {}

  cerrarModal() {
    this.cancelar.emit();
  }

  agregarClinica(): void {
    if (this.nuevaClinica.nombre == '' || this.nuevaClinica.direccion == '') {
      Swal.fire({
        title: 'Campos Vacíos',
        text: 'Por favor rellene los campos vacíos para poder agregar una nueva clínica.',
        icon: 'warning',
        confirmButtonColor: '#333333',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    Swal.fire({
      title: 'Confirmar Registro',
      text: `¿Estás seguro de registrar la nueva clínica ${this.nuevaClinica.nombre}?`,
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
        console.log(this.nuevaClinica)
        this.clinicasService.addClinica(this.nuevaClinica).subscribe(
          (response) => {
            Swal.fire({
              title: 'Éxito',
              text: 'La nueva clínica se ha registrado correctamente.',
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
              text: 'Ha ocurrido un error al registrar la nueva clínica.',
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