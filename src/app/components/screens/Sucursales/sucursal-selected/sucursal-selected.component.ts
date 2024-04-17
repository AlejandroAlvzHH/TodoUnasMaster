import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Branches } from '../../../../Models/Master/branches';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { ModifysucursalmodalComponent } from '../../../../modals/Modals Sucursales/modifysucursalmodal/modifysucursalmodal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

type TipoDeError = HttpErrorResponse;
@Component({
  selector: 'app-sucursal-selected',
  standalone: true,
  imports: [
    CommonModule,
    ModifysucursalmodalComponent,
    SidebarComponent,
    HeaderComponent,
  ],
  template: ` <app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <app-modifysucursalmodal
        *ngIf="mostrarModal"
        [sucursal]="sucursal"
        (modificar)="modificarSucursal($event)"
        (cancelar)="cerrarModal()"
      ></app-modifysucursalmodal>
      <h1 class="mayusculas">{{ sucursal?.nombre }}</h1>
      <h2>URL de servicios: {{ sucursal?.url }}</h2>
      <div class="menu-container">
        <div class="menu">
          <a href="/entradasysalidas/{{ sucursal?.idSucursal }}" class="opcion"
            >Entradas y Salidas</a
          >
          <a
            href="/inventariosucursal/{{ sucursal?.idSucursal }}"
            class="opcion"
            >Inventario</a
          >
          <a href="/traspasos/{{ sucursal?.idSucursal }}" class="opcion"
            >Traspaso a Sucursal</a
          >
          <button class="opcion" (click)="eliminarSucursal()">
            Eliminar Sucursal
          </button>
          <button class="opcion" (click)="abrirModal()">
            Modificar Sucursal
          </button>
          <a href="/traspasosclinica/{{ sucursal?.idSucursal }}" class="opcion"
            >Traspaso a Clínica</a
          >
        </div>
      </div>
    </main>`,
  styleUrls: ['./sucursal-selected.component.css'],
})
export class SucursalSelectedComponent implements OnInit {
  sucursal: Branches | null = null;
  mostrarModal: boolean = false;
  isSidebarOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sidebarOpeningService: SidebaropeningService,
    private router: Router
  ) {}

  toggleSidebar(): void {
    console.log('Toggle');
    this.sidebarOpeningService.toggleSidebar();
  }

  ngOnInit(): void {
    const sucursalModificada: any = {
      ...this.sucursal,
      fecha_actualizacion: new Date(),
    };
    console.log("Sucursal modificada es:", sucursalModificada)
    this.modificarSucursal(sucursalModificada);
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
    this.obtenerDetalleSucursal();
  }

  obtenerDetalleSucursal(): void {
    this.route.paramMap.subscribe((params) => {
      const sucursalId = params.get('id');
      if (sucursalId) {
        this.apiService.getSucursalById(parseInt(sucursalId, 10)).subscribe(
          (sucursal) => {
            this.sucursal = sucursal;
          },
          (error) => {
            console.error('Error al obtener la sucursal:', error);
          }
        );
      }
    });
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  async eliminarSucursal() {
    const result = await Swal.fire({
      title: 'Confirmar Eliminación',
      text: `¿Estás seguro de eliminar ${this.sucursal?.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar eliminación',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      if (this.sucursal) {
        this.apiService
          .modificarStatusSucursal(this.sucursal.idSucursal, 0)
          .toPromise();

        await Swal.fire({
          title: 'Sucursal Eliminada',
          text: 'Los registros permanecerán en la base de datos.',
          icon: 'success',
          confirmButtonColor: '#007bff',
          confirmButtonText: 'Aceptar',
        });
        this.obtenerDetalleSucursal();
        this.mostrarModal = false;
        this.router.navigate(['/']);
      } else {
        console.error('Error al eliminar la sucursal.');
      }
    }
  }

  modificarSucursal(sucursalModificada: Branches): void {
    if (this.sucursal) {
      this.apiService.modificarSucursal(sucursalModificada).subscribe(
        (resultado: boolean) => {
          this.obtenerDetalleSucursal();
          this.mostrarModal = false;
        },
        (error: TipoDeError) => {
          console.error('Error al modificar la sucursal:', error);
        }
      );
    }
  }
}
