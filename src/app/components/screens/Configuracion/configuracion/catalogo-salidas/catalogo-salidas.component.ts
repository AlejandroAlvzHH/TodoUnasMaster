import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../../header/header.component';
import { SidebaropeningService } from '../../../../../core/services/sidebaropening.service';
import { AgregarMotivoComponent } from './agregar-motivo/agregar-motivo.component';
import { CatalogoSalidasService } from '../../../../../core/services/Services Sucursales/Entradas y Salidas/catalogo-salidas.service';
import { CatalogoSalidas } from '../../../../../Models/Master/catalogo_salidas';
import { ChangeDetectorRef } from '@angular/core';
import { EditarMotivoComponent } from './editar-motivo/editar-motivo.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo-salidas',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    CommonModule,
    AgregarMotivoComponent,
    EditarMotivoComponent,
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
        <h1>CATÁLOGO DE SALIDAS</h1>
      </div>
      <div class="botonera">
        <button class="btn" (click)="abrirModal()">
          Agregar Motivo de Salida
        </button>
      </div>
      <app-agregar-motivo
        *ngIf="mostrarModal"
        (cancelar)="cerrarModal()"
      ></app-agregar-motivo>
      <app-editar-motivo 
        *ngIf="mostrarModalEditar"
        [motivo]="motivoSeleccionado"
        (cancelar)="cerrarModalEditar()"
      >
      </app-editar-motivo>
      <div class="table-container">
        <table border="2">
          <thead>
            <tr>
              <th
                scope="col"
                (click)="ordenarPorColumna('id_tipo_salida')"
                [class.interactive]="columnaOrdenada === 'id_tipo_salida'"
              >
                ID Tipo Salida
                <i
                  *ngIf="columnaOrdenada === 'id_tipo_salida'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('tipo')"
                [class.interactive]="columnaOrdenada === 'tipo'"
              >
                Tipo
                <i
                  *ngIf="columnaOrdenada === 'tipo'"
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
              <td>{{ filteredMotivosList[index].id_tipo_salida }}</td>
              <td>{{ filteredMotivosList[index].tipo }}</td>
              <td>
                <button
                  class="btn"
                  (click)="abrirModalEditar(filteredMotivosList[index])"
                >
                  Editar
                </button>
                <button
                  class="btn"
                  (click)="eliminarMotivo(filteredMotivosList[index])"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>`,
  styleUrl: './catalogo-salidas.component.css',
})
export class CatalogoSalidasComponent {
  isSidebarOpen: boolean = false;
  mostrarModal: boolean = false;

  motivosList: CatalogoSalidas[] = [];
  filteredMotivosList: CatalogoSalidas[] = [];
  filteredIndices: number[] = [];
  columnaOrdenada: keyof CatalogoSalidas | null = null;
  ordenAscendente: boolean = true;
  mostrarModalEditar: boolean = false;
  motivoSeleccionado: CatalogoSalidas | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private sidebarOpeningService: SidebaropeningService,
    private catalogoSalidasService: CatalogoSalidasService
  ) {}

  toggleSidebar(): void {
    console.log('Toggle');
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
      this.motivosList =
        await this.catalogoSalidasService.getAllCatalogoSalidas();
      this.filteredMotivosList = this.motivosList.map((motivo) => ({
        id_tipo_salida: motivo.id_tipo_salida,
        tipo: motivo.tipo,
      }));
      this.filteredIndices = Array.from(
        { length: this.filteredMotivosList.length },
        (_, i) => i
      );
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al obtener los motivos de salida de Master:', error);
    }
  }

  ordenarPorColumna(columna: keyof CatalogoSalidas) {
    if (this.columnaOrdenada === columna) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.columnaOrdenada = columna;
      this.ordenAscendente = true;
    }
    this.filteredMotivosList.sort((a, b) => {
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
  
  abrirModalEditar(motivo: CatalogoSalidas): void {
    this.motivoSeleccionado = motivo;
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
  }

  eliminarMotivo(motivo: CatalogoSalidas) {
    Swal.fire({
      title: 'Confirmar Eliminación',
      text: `¿Estás seguro de eliminar el motivo ${motivo.tipo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5c5c5c',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar eliminación',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.catalogoSalidasService.deleteMotivoSalida(
            motivo.id_tipo_salida
          );
          Swal.fire({
            title: 'Eliminación Realizada',
            text: `Se eliminó el motivo: ${motivo.tipo}`,
            icon: 'success',
            confirmButtonColor: '#5c5c5c',
            confirmButtonText: 'Aceptar',
          }).then(async (result) => {
            this.cerrarModal();
            window.location.reload();
          });
        } catch (error) {
          Swal.fire({
            title: 'Eliminación No Realizada',
            text: `No se logró eliminar el motivo: ${motivo.tipo}`,
            icon: 'error',
            confirmButtonColor: '#5c5c5c',
            confirmButtonText: 'Aceptar',
          })
        }
      }
    });
  }
}
