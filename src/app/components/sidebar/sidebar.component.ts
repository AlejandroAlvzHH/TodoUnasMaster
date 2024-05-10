import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebaropeningService } from '../../core/services/sidebaropening.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Users } from '../../Models/Master/users';

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
        <li><a class="red" (click)="logout()">Cerrar Sesión</a></li>
        <div class="user-info">
          <img src="../../assets/User Icon.png" />
          <h3>
            {{ this.currentUser?.nombre }}
            {{ this.currentUser?.apellido_paterno || '' }}
            {{ this.currentUser?.apellido_materno || '' }}
          </h3>
        </div>
      </ul>
    </aside>
  `,
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  isOpen = false;
  currentUser?: Users | null;

  constructor(
    private SidebaropeningService: SidebaropeningService,
    private authService: AuthService,
    private router: Router,
    private sidebarOpeningService: SidebaropeningService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
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
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
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
