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
          <img
            src="https://image.placeholder.co/insecure/w:640/quality:65/czM6Ly9jZG4uc3BhY2VyLnByb3BlcnRpZXMvYjZhYTU2YjUtN2RkMS00N2MwLTg4ZjYtNjUyOTlkODk0YmE2"
            alt="Placeholder Image"
          />
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
    urlImagen: ''
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
      urlImagen: ''
    };
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  async agregarSucursal(sucursal: Sucursales): Promise<void> {
    try {
      console.log("Se mandó a agregar XD")
      console.log(sucursal)
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
        this.sucursalesList = sucursalesList;
        this.filteredSucursalesList = sucursalesList;
      },
      (error) => {
        console.error('Error al obtener todas las sucursales:', error);
      }
    );
  }
}
