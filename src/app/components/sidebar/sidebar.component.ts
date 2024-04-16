import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebaropeningService } from '../../core/services/sidebaropening.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
        <li><a (click)="logout()">Cerrar Sesión</a></li>
      </ul>
    </aside>
  `,
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  isOpen = false;

  constructor(
    private SidebaropeningService: SidebaropeningService,
    private authService: AuthService,
    private router: Router,
    private sidebarOpeningService: SidebaropeningService
  ) {}

  ngOnInit(): void {
    this.SidebaropeningService.isOpen$.subscribe((isOpen) => {
      this.isOpen = isOpen;
    });
  }

  getSidebarLeft(): string {
    return this.isOpen ? '0' : '-100%';
  }

  logout(): void {
    Swal.fire({
      title: '¿Desea cerrar la sesión?',
      showCancelButton: true,
      confirmButtonColor: '#5c5c5c',
      cancelButtonColor: '#5c5c5c',
      confirmButtonText: 'Cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.sidebarOpeningService.toggleSidebar();
        this.router.navigate(['/login']);
      }
    });
  }
}
