import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sucursales } from '../Models/sucursales';
import { ApiService } from '../core/services/sucursales.service';
import { SucursalesmodalComponent } from '../modals/sucursalesmodal/sucursalesmodal.component';

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
        <a class="btn">Modificar Sucursales</a>
      </div>
      <div class="card-container">
        <div class="card" *ngFor="let sucursal of filteredSucursalesList">
          <img src="{{ sucursal.url_imagen }}" />
          <div class="card-content">
            <h2>{{ sucursal.nombre }}</h2>
            <p>{{ sucursal.estado }}</p>
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
  nuevaSucursal: Sucursales = {
    idSucursal: 0,
    nombre: '',
    estado: 'Online',
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.actualizarListaSucursales();
  }

  abrirModal(): void {
    this.mostrarModal = true;
    this.nuevaSucursal = {
      idSucursal: 0,
      nombre: '',
      estado: 'Online',
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
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  async agregarSucursal(sucursal: Sucursales): Promise<void> {
    try {
      console.log('Se mandó a agregar');
      console.log(sucursal);
      const success = await this.apiService.agregarSucursal(sucursal);
      if (success) {
        this.actualizarListaSucursales();
        this.cerrarModal();
      } else {
        console.error('Error al agregar la sucursal.');
      }
    } catch (error) {
      console.error('Error al agregar la sucursal:', error);
    }
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
