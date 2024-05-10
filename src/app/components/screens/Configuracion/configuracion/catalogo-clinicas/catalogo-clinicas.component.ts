import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../../header/header.component';
import { SidebaropeningService } from '../../../../../core/services/sidebaropening.service';
import { Clinics } from '../../../../../Models/Master/clinics';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { AgregarClinicaComponent } from './agregar-clinica/agregar-clinica.component';
import { EditarClinicaComponent } from './editar-clinica/editar-clinica.component';
import { ClinicasService } from '../../../../../core/services/Services Sucursales/clinicas.service';

@Component({
  selector: 'app-catalogo-clinicas',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    CommonModule,
    EditarClinicaComponent,
    AgregarClinicaComponent,
  ],
  template: `<app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <div class="title-container">
        <h1>CATÁLOGO DE CLÍNICAS</h1>
      </div>
      <div class="botonera">
        <button class="btn" (click)="abrirModal()">
          Agregar Motivo de Salida
        </button>
      </div>
      <app-agregar-clinica
        *ngIf="mostrarModal"
        (cancelar)="cerrarModal()"
      ></app-agregar-clinica>
      <app-editar-clinica
        *ngIf="mostrarModalEditar"
        [clinica]="clinicaSeleccionada"
        (cancelar)="cerrarModalEditar()"
      >
      </app-editar-clinica>
      <div class="table-container">
        <table border="2">
          <thead>
            <tr>
              <th
                scope="col"
                (click)="ordenarPorColumna('id_clinica')"
                [class.interactive]="columnaOrdenada === 'id_clinica'"
              >
                ID Clínica
                <i
                  *ngIf="columnaOrdenada === 'id_clinica'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('nombre')"
                [class.interactive]="columnaOrdenada === 'nombre'"
              >
                Nombre
                <i
                  *ngIf="columnaOrdenada === 'nombre'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('status')"
                [class.interactive]="columnaOrdenada === 'status'"
              >
                Status
                <i
                  *ngIf="columnaOrdenada === 'nombre'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let index of filteredIndices">
              <td>{{ filteredClinicasList[index].id_clinica }}</td>
              <td>{{ filteredClinicasList[index].nombre }}</td>
              <td>
                <span *ngIf="filteredClinicasList[index].status === 1"
                  >Activo</span
                >
                <span *ngIf="filteredClinicasList[index].status === 0"
                  >Inactivo</span
                >
              </td>
              <td>
                <button
                  class="btn"
                  (click)="abrirModalEditar(filteredClinicasList[index])"
                >
                  Editar
                </button>
                <button
                  *ngIf="filteredClinicasList[index].status === 1"
                  class="btn"
                  (click)="eliminarClinica(filteredClinicasList[index])"
                >
                  Eliminar
                </button>
                <button
                  *ngIf="filteredClinicasList[index].status === 0"
                  class="btn"
                  (click)="restaurarClinica(filteredClinicasList[index])"
                >
                  Restaurar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>`,
  styleUrl: './catalogo-clinicas.component.css',
})
export class CatalogoClinicasComponent {
  isSidebarOpen: boolean = false;
  mostrarModal: boolean = false;
  mostrarModalEditar: boolean = false;

  clinicasList: Clinics[] = [];
  filteredClinicasList: Clinics[] = [];
  filteredIndices: number[] = [];
  columnaOrdenada: keyof Clinics | null = null;
  ordenAscendente: boolean = true;
  clinicaSeleccionada: Clinics | null = null;

  constructor(
    private sidebarOpeningService: SidebaropeningService,
    private cdr: ChangeDetectorRef,
    private clinicasService: ClinicasService
  ) {}

  toggleSidebar(): void {
    this.sidebarOpeningService.toggleSidebar();
  }

  ngOnInit(): void {
    this.initialize();
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
  }

  private async initialize() {
    try {
      this.clinicasList = await this.clinicasService.getAllClinicas();
      this.filteredClinicasList = this.clinicasList.map((clinica) => ({
        id_clinica: clinica.id_clinica,
        nombre: clinica.nombre,
        direccion: clinica.direccion,
        status: clinica.status,
      }));
      this.filteredIndices = Array.from(
        { length: this.filteredClinicasList.length },
        (_, i) => i
      );
      this.cdr.detectChanges();
    } catch (error) {
      console.error(
        'Error al obtener las clínicas de salida de Master:',
        error
      );
    }
  }

  ordenarPorColumna(columna: keyof Clinics) {
    if (this.columnaOrdenada === columna) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.columnaOrdenada = columna;
      this.ordenAscendente = true;
    }
    this.filteredClinicasList.sort((a, b) => {
      if (this.columnaOrdenada === null) {
        return 0;
      }
      if (a[this.columnaOrdenada] > b[this.columnaOrdenada]) {
        return this.ordenAscendente ? 1 : -1;
      } else if (a[this.columnaOrdenada] < b[this.columnaOrdenada]) {
        return this.ordenAscendente ? -1 : 1;
      } else {
        return 0;
      }
    });
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  abrirModalEditar(clinica: Clinics): void {
    this.clinicaSeleccionada = clinica;
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
  }

  eliminarClinica(clinica: Clinics) {
    Swal.fire({
      title: 'Confirmar Eliminación',
      text: `¿Estás seguro de eliminar la clínica ${clinica.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar eliminación',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const clinicaModificada = { ...clinica };
          clinicaModificada.status = 0;
          await this.clinicasService
            .updateStatusClinica(clinicaModificada)
            .subscribe();
          Swal.fire({
            title: 'Eliminación Realizada',
            text: `Se eliminó la clínica: ${clinica.nombre}`,
            icon: 'success',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          }).then(async (result) => {
            this.cerrarModal();
            window.location.reload();
          });
        } catch (error) {
          Swal.fire({
            title: 'Eliminación No Realizada',
            text: `No se logró eliminar la clínica: ${clinica.nombre}`,
            icon: 'error',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          });
        }
      }
    });
  }

  restaurarClinica(clinica: Clinics) {
    Swal.fire({
      title: 'Confirmar Restauración',
      text: `¿Estás seguro de restaurar la clínica ${clinica.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar restauración',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const clinicaModificada = { ...clinica };
          clinicaModificada.status = 1;
          await this.clinicasService
            .updateStatusClinica(clinicaModificada)
            .subscribe();
          Swal.fire({
            title: 'Restauración Realizada',
            text: `Se restauró la clínica: ${clinica.nombre}`,
            icon: 'success',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          }).then(async (result) => {
            this.cerrarModal();
            window.location.reload();
          });
        } catch (error) {
          Swal.fire({
            title: 'Restauración No Realizada',
            text: `No se logró restaurar la clínica: ${clinica.nombre}`,
            icon: 'error',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          });
        }
      }
    });
  }
}
