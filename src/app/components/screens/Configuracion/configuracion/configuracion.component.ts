import { Component } from '@angular/core';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { CommonModule } from '@angular/common';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, CommonModule],
  template: `
    <app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <h1>AJUSTES</h1>
      <div class="menu-container">
        <div class="menu">
          <a href="#" class="opcion">Contraseñas</a>
          <a href="#" class="opcion">Catálogo de Salidas</a>
          <a href="#" class="opcion">Catálogo de Clínicas</a>
          <a href="#" class="opcion">Roles y Usuarios</a>
        </div>
      </div>
    </main>
  `,
  styleUrl: './configuracion.component.css',
})
export class ConfiguracionComponent {
  isSidebarOpen: boolean = false;
  constructor(private sidebarOpeningService: SidebaropeningService) {}

  toggleSidebar(): void {
    console.log('Toggle');
    this.sidebarOpeningService.toggleSidebar();
  }

  ngOnInit(): void {
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
  }
}
