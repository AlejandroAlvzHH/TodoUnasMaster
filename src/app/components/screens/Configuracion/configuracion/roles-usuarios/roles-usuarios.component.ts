import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../../header/header.component';
import { SidebaropeningService } from '../../../../../core/services/sidebaropening.service';

@Component({
  selector: 'app-roles-usuarios',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, CommonModule],
  template: `<app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <div class="title-container">
        <h1>ROLES Y USUARIOS</h1>
      </div>
    </main>`,
  styleUrl: './roles-usuarios.component.css',
})
export class RolesUsuariosComponent {
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
