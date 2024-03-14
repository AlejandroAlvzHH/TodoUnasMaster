import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SucursalesCardsComponent } from '../sucursales-cards/sucursales-cards.component';
import { Sucursales } from '../Models/sucursales';
import { ApiService } from '../core/services/sucursales.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SucursalesCardsComponent],
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
        <a class="btn">Agregar Sucursal</a>
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
            <a href="http://localhost:4200/sucursalselected/{{ sucursal.idSucursal }}" class="btn"
              >Seleccionar</a
            >
          </div>
        </div>
      </div>
    </main>
  </div>`,
  styleUrl: './home.component.css',
})
export class HomeComponent {
  sucursalesList: Sucursales[] = [];
  apiService: ApiService = inject(ApiService);
  filteredSucursalesList: Sucursales[] = [];

  constructor() {
    this.apiService.getAllSucursales().then((sucursalesList: Sucursales[]) => {
      this.sucursalesList = sucursalesList;
      this.filteredSucursalesList = sucursalesList;
    });
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredSucursalesList = this.filteredSucursalesList;
      return;
    }

    this.filteredSucursalesList = this.sucursalesList.filter((sucursales) =>
      sucursales?.nombre.toLowerCase().includes(text.toLowerCase())
    );
  }
}
