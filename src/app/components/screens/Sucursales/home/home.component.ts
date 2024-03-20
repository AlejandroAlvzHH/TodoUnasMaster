import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sucursales } from '../../../../Models/sucursales';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { SucursalesmodalComponent } from '../../../../modals/Modals Sucursales/sucursalesmodal/sucursalesmodal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SucursalesmodalComponent],
  template: ` <div class="container">
    <aside class="sidebar">
      <ul>
        <li><a href="/">Sucursales</a></li>
        <li><a href="/catalogogeneral">Catálogo General</a></li>
        <li><a href="/historicos">Históricos</a></li>
        <li><a href="/configuracion">Configuración</a></li>
      </ul>
    </aside>
    <main class="main-content">
      <h1>SUCURSALES</h1>
      <div class="botonera">
        <button class="btn" (click)="abrirModal()">Agregar Sucursal</button>
      </div>
      <div class="card-container">
        <div class="card" *ngFor="let sucursal of filteredSucursalesList">
          <img src="{{ sucursal.url_imagen }}" />
          <div class="card-content">
            <h2>{{ sucursal.nombre }}</h2>
            <p>{{ sucursal.estado }}</p>
            <h4>Última fecha de actualización:</h4>
            <p>{{ sucursal.fechaActualizacion }}</p>
            <a
              href="http://localhost:4200/sucursalselected/{{
                sucursal.idSucursal
              }}"
              class="btn"
              >Seleccionar</a
            >
          </div>
        </div>
      </div>
    </main>
    <app-sucursalesmodal
      *ngIf="mostrarModal"
      (addSucursal)="agregarSucursal($event)"
      (cancelar)="cerrarModal()"
    ></app-sucursalesmodal>
  </div>`,
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  sucursalesList: Sucursales[] = [];
  filteredSucursalesList: Sucursales[] = [];
  mostrarModal: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.actualizarListaSucursales();
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  agregarSucursal(sucursal: Sucursales): void {
    this.apiService.agregarSucursal(sucursal).subscribe(
      (success) => {
        console.log('Éxito al agregar la sucursal:', success);
        this.actualizarListaSucursales();
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al agregar la sucursal:', error);
      }
    );
  }

  private actualizarListaSucursales(): void {
    this.apiService.getAllSucursales().subscribe(
      (sucursalesList: Sucursales[]) => {
        this.filteredSucursalesList = sucursalesList.filter(
          (sucursal) => sucursal.status === 1
        );
        this.sucursalesList = sucursalesList;
      },
      (error) => {
        console.error('Error al obtener todas las sucursales:', error);
      }
    );
  }
}
