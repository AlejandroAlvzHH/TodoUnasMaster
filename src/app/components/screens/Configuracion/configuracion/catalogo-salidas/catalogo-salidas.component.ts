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
      <div class="table-container overflow-x-auto">
        <div class="flex flex-col">
          <div class="overflow-x-auto">
            <div class="inline-block min-w-full py-1">
              <div class="overflow-hidden">
                <table class="min-w-full text-left text-xs font-light">
                  <thead class="border-b border-neutral-200 font-medium">
                    <tr>
                      <th
                        scope="col"
                        class="px-2 py-1"
                        (click)="ordenarPorColumna('id_tipo_salida')"
                        [class.interactive]="
                          columnaOrdenada === 'id_tipo_salida'
                        "
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
                        class="px-2 py-1"
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
                      <th
                        scope="col"
                        class="px-2 py-1"
                        (click)="ordenarPorColumna('status')"
                        [class.interactive]="columnaOrdenada === 'status'"
                      >
                        Status
                        <i
                          *ngIf="columnaOrdenada === 'status'"
                          class="arrow-icon"
                          [class.asc]="ordenAscendente"
                          [class.desc]="!ordenAscendente"
                        ></i>
                      </th>
                      <th scope="col" class="px-2 py-1" Acciones></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      class="border-b border-neutral-200"
                      *ngFor="let index of filteredIndices"
                    >
                      <td class="whitespace-nowrap px-2 py-1 font-medium">
                        {{ filteredMotivosList[index].id_tipo_salida }}
                      </td>
                      <td class="whitespace-nowrap px-2 py-1 font-medium">
                        {{ filteredMotivosList[index].tipo }}
                      </td>
                      <td class="whitespace-nowrap px-2 py-1 font-medium">
                        <span *ngIf="filteredMotivosList[index].status === 1"
                          >Activo</span
                        >
                        <span *ngIf="filteredMotivosList[index].status === 0"
                          >Inactivo</span
                        >
                      </td>
                      <td class="whitespace-nowrap px-2 py-1 font-medium">
                        <button
                          class="btn"
                          (click)="abrirModalEditar(filteredMotivosList[index])"
                        >
                          Editar
                        </button>
                        <button
                          *ngIf="
                            filteredMotivosList[index].status === 1 &&
                            filteredMotivosList[index].id_tipo_salida !== 1
                          "
                          class="btn"
                          (click)="
                            deshabilitarMotivo(filteredMotivosList[index])
                          "
                        >
                          Deshabilitar
                        </button>
                        <button
                          *ngIf="
                            filteredMotivosList[index].status === 0 &&
                            filteredMotivosList[index].id_tipo_salida !== 1
                          "
                          class="btn"
                          (click)="restaurarMotivo(filteredMotivosList[index])"
                        >
                          Restaurar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
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
        status: motivo.status,
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

  deshabilitarMotivo(motivo: CatalogoSalidas) {
    Swal.fire({
      title: 'Confirmar Deshabilitación',
      text: `¿Estás seguro de deshabilitar el motivo ${motivo.tipo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar deshabilitación',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const motivoModificado = { ...motivo };
          motivoModificado.status = 0;
          await this.catalogoSalidasService
            .updateStatusMotivo(motivoModificado)
            .subscribe();
          Swal.fire({
            title: 'Deshabilitación Realizada',
            text: `Se deshabilitó el motivo: ${motivo.tipo}`,
            icon: 'success',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          }).then(async (result) => {
            this.cerrarModal();
            window.location.reload();
          });
        } catch (error) {
          Swal.fire({
            title: 'Deshabilitación No Realizada',
            text: `No se logró deshabilitar el motivo: ${motivo.tipo}`,
            icon: 'error',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          });
        }
      }
    });
  }

  restaurarMotivo(motivo: CatalogoSalidas) {
    Swal.fire({
      title: 'Confirmar Restauración',
      text: `¿Estás seguro de restaurar el motivo ${motivo.tipo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar restauración',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const motivoModificado = { ...motivo };
          motivoModificado.status = 1;
          await this.catalogoSalidasService
            .updateStatusMotivo(motivoModificado)
            .subscribe();
          Swal.fire({
            title: 'Restauración Realizada',
            text: `Se restauró el motivo: ${motivo.tipo}`,
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
            text: `No se logró restaurar el motivo: ${motivo.tipo}`,
            icon: 'error',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          });
        }
      }
    });
  }
}
