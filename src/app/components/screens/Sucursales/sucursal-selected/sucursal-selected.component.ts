import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Sucursales } from '../../../../Models/sucursales';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { ModifysucursalmodalComponent } from '../../../../modals/Modals Sucursales/modifysucursalmodal/modifysucursalmodal.component';

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
      <h1>{{ sucursal.nombre }}</h1>
      <h2>{{ sucursal.url }}</h2>
      <div class="menu-container">
        <div class="menu">
          <a href="#" class="opcion">Entradas y Salidas</a>
          <a href="#" class="opcion">Inventario</a>
          <a href="#" class="opcion">Traspasos</a>
          <button class="opcion">Eliminar Sucursal</button>
          <button class="opcion" (click)="abrirModal()">
            Modificar Sucursal
          </button>
          <a href="#" class="opcion">Traspaso a Clínica</a>
        </div>
      </div>
    </main>
    <!-- En el componente que abre el modal -->
    <app-modifysucursalmodal
      *ngIf="mostrarModal"
      [sucursal]="sucursal"
      (modificar)="modificarSucursal()"
      (cancelar)="cerrarModal()"
    ></app-modifysucursalmodal>
  </div>`,
  styleUrls: ['./sucursal-selected.component.css'],
})
export class SucursalSelectedComponent implements OnInit {
  sucursal: Sucursales = {
    idSucursal: 0,
    nombre: '',
    estado: '',
    fechaActualizacion: new Date(),
    direccion: '',
    url: '',
    usuarioCreador: 0,
    fechaCreado: new Date(),
    usuarioModificador: 0,
    fechaModificado: new Date(),
    usuarioEliminador: 0,
    fechaEliminado: new Date(),
    url_imagen: '',
    status: 1,
  };
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
          (error) => {
            console.error('Error al obtener la sucursal:', error);
          }
        );
      }
    });
  }

  abrirModal(): void {
    this.mostrarModal = true;
    console.log('works');
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  modificarSucursal(): void {
  }
  
}
