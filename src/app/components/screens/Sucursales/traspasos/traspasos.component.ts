import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';
import { HeaderComponent } from '../../../header/header.component';

@Component({
  selector: 'app-traspasos',
  standalone: true,
  imports: [CommonModule,
    SidebarComponent,
    HeaderComponent,],
  template:` <app-header></app-header>
  <app-sidebar></app-sidebar>
  <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
  <div
      class="overlay"
      *ngIf="isSidebarOpen"
      (click)="toggleSidebar()"
    ></div>
    <h1>TRASPASOS</h1>
  </main>`,
  styleUrl: './traspasos.component.css'
})
export class TraspasosComponent implements OnInit {
  mostrarModal: boolean = false;
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

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }
}

