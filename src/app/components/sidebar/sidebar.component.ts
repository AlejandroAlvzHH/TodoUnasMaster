import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebaropeningService } from '../../core/services/sidebaropening.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar" [style.left]="getSidebarLeft()">
      <ul *ngIf="isOpen">
        <h2>TODO UÑAS</h2>
        <li><a href="/">Sucursales</a></li>
        <li><a href="/catalogogeneral">Catálogo General</a></li>
        <li><a href="/historicos">Históricos</a></li>
        <li><a href="/configuracion">Ajustes</a></li>
      </ul>
    </aside>
  `,
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  isOpen = false;

  constructor(private SidebaropeningService: SidebaropeningService) {}

  ngOnInit(): void {
    this.SidebaropeningService.isOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
  }

  getSidebarLeft(): string {
    return this.isOpen ? '0' : '-100%'; // Mueve el aside fuera de la pantalla
  }
}
