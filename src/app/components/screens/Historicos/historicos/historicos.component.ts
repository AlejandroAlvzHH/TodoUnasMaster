import { Component } from '@angular/core';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historicos',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent],
  template: ` <app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <h1>HISTÓRICOS</h1>
      <div class="menu-container">
        <div class="menu">
          <a href="#" class="opcion">Filtro</a>
          <a href="#" class="opcion">Filtro</a>
          <a href="#" class="opcion">Filtro</a>
          <a href="#" class="opcion">Generar Reporte</a>
        </div>
      </div>
      <table border="2">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Movimiento</th>
            <th>Usuario</th>
            <th>Detalles</th>
            <th>Datos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dato 1</td>
            <td>Dato 2</td>
            <td>Dato 3</td>
            <td>Dato 4</td>
            <td>Dato 5</td>
            <td>Dato 6</td>
          </tr>
          <tr>
            <td>Dato 1</td>
            <td>Dato 2</td>
            <td>Dato 3</td>
            <td>Dato 4</td>
            <td>Dato 5</td>
            <td>Dato 6</td>
          </tr>
          <tr>
            <td>Dato 1</td>
            <td>Dato 2</td>
            <td>Dato 3</td>
            <td>Dato 4</td>
            <td>Dato 5</td>
            <td>Dato 6</td>
          </tr>
          <tr>
            <td>Dato 1</td>
            <td>Dato 2</td>
            <td>Dato 3</td>
            <td>Dato 4</td>
            <td>Dato 5</td>
            <td>Dato 6</td>
          </tr>
          <tr>
            <td>Dato 1</td>
            <td>Dato 2</td>
            <td>Dato 3</td>
            <td>Dato 4</td>
            <td>Dato 5</td>
            <td>Dato 6</td>
          </tr>
          <tr>
            <td>Dato 1</td>
            <td>Dato 2</td>
            <td>Dato 3</td>
            <td>Dato 4</td>
            <td>Dato 5</td>
            <td>Dato 6</td>
          </tr>
        </tbody>
      </table>
    </main>`,
  styleUrl: './historicos.component.css',
})
export class HistoricosComponent {
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
