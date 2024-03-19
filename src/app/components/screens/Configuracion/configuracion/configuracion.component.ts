import { Component } from '@angular/core';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [],
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
      <h1>CONFIGURACIÓN</h1>
      <div class="menu-container">
        <div class="menu">
          <a href="#" class="opcion">Contraseñas</a>
          <a href="#" class="opcion">Catálogo de Salidas</a>
          <a href="#" class="opcion">Catálogo de Clínicas</a>
          <a href="#" class="opcion">Roles y Usuarios</a>
        </div>
      </div>
    </main>
  </div>`,
  styleUrl: './configuracion.component.css',
})
export class ConfiguracionComponent {}
