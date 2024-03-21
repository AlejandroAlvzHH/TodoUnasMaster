import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';

@Component({
  selector: 'app-entradasysalidas',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent],
  template: `<app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <h1>ENTRADAS Y SALIDAS</h1>
    </main> `,
  styleUrl: './entradasysalidas.component.css',
})
export class EntradasysalidasComponent {
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
