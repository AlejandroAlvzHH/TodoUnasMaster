import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Sucursales } from '../../../../Models/sucursales';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { ModifysucursalmodalComponent } from '../../../../modals/Modals Sucursales/modifysucursalmodal/modifysucursalmodal.component';
import { HttpErrorResponse } from '@angular/common/http';
type TipoDeError = HttpErrorResponse;
@Component({
  selector: 'app-sucursal-selected',
  standalone: true,
  imports: [CommonModule, ModifysucursalmodalComponent],
  template: `<div class="container">
    <aside class="sidebar">
      <ul>
        <li><a href="/">Sucursales</a></li>
        <li><a href="/catalogogeneral">Catálogo General</a></li>
        <li><a href="/historicos">Históricos</a></li>
        <li><a href="/configuracion">Configuración</a></li>
      </ul>
    </aside>
    <main class="main-content">
      <h1>{{ sucursal?.nombre }}</h1>
      <h2>{{ sucursal?.url }}</h2>
      <div class="menu-container">
        <div class="menu">
          <a href="#" class="opcion">Entradas y Salidas</a>
          <a href="#" class="opcion">Inventario</a>
          <a href="#" class="opcion">Traspasos</a>
          <a href="#" class="opcion" (click)="eliminarSucursal()">Eliminar</a>
          <button class="opcion" (click)="abrirModal()">Modificar Sucursal</button>
          <a href="#" class="opcion">Traspaso a Clínica</a>
        </div>
      </div>
    </main>
    <app-modifysucursalmodal
      *ngIf="mostrarModal"
      [sucursal]="sucursal"
      (modificar)="modificarSucursal($event)"
      (cancelar)="cerrarModal()"
    ></app-modifysucursalmodal>
  </div> `,
  styleUrls: ['./sucursal-selected.component.css'],
})
export class SucursalSelectedComponent implements OnInit {
  sucursal: Sucursales | null = null;
  mostrarModal: boolean = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
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

  eliminarSucursal() {
    if (this.sucursal) {
      this.sucursal.status = 0; 
      this.apiService
        .modificarStatusSucursal(this.sucursal.idSucursal, 0)
        .subscribe(
          (success: boolean) => {
            if (success) {
              this.obtenerDetalleSucursal(); 
              this.mostrarModal = false;
            } else {
              console.error('Error al eliminar la sucursal.');
            }
          },
          (error: TipoDeError) => {
            console.error('Error al eliminar la sucursal:', error);
          }
        );
    }
  }

  modificarSucursal(sucursalModificada: Sucursales): void {
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
