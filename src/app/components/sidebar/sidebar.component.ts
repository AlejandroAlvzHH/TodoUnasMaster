import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebaropeningService } from '../../core/services/sidebaropening.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Users } from '../../Models/Master/users';
import { VistaRolesPrivilegios } from '../../Models/Master/vista-roles-privilegios';
import { VistaRolesPrivilegiosService } from '../../core/services/Services Configuracion/vista-roles-privilegios.service';
import { RolesService } from '../../core/services/Services Configuracion/roles.service';
import { UsuariosService } from '../../core/services/Services Configuracion/usuarios.service';
import { EditarContrasenasComponent } from '../screens/Configuracion/configuracion/contrasenas/editar-contrasenas/editar-contrasenas.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, EditarContrasenasComponent],
  template: `
    <aside class="sidebar" [style.left]="getSidebarLeft()">
      <ul *ngIf="isOpen">
        <h2>TODO UÑAS MASTER</h2>
        <li><a href="/">Sucursales</a></li>
        <li><a href="/catalogogeneral">Catálogo General</a></li>
        <li><a href="/historicos">Históricos</a></li>
        <app-editar-contrasenas
          *ngIf="mostrarModalEditar"
          [id_usuario]="usuarioSeleccionado"
          [fromSidebar]="fromSidebar"
          (cancelar)="cerrarModalEditar()"
        ></app-editar-contrasenas>
        <li>
          <a href="/configuracion" *ngIf="mostrarBotonAjustes">Ajustes</a>
        </li>
        <li><a class="red" (click)="logout()">Cerrar Sesión</a></li>
        <div class="user-info">
          <img src="../../assets/User Icon.png" />
          <h3>{{ this.rol }}</h3>
          <h3>
            {{ this.currentUser?.nombre }}
            {{ this.currentUser?.apellido_paterno || '' }}
            {{ this.currentUser?.apellido_materno || '' }}
          </h3>
          <button (click)="abrirModalEditar(this.currentUser!.id_usuario)">
            Editar mis Datos
          </button>
        </div>
      </ul>
    </aside>
  `,
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  isOpen = false;

  mostrarModalEditar: boolean = false;
  usuarioSeleccionado: number | null = null;
  fromSidebar: number = 1;
  
  //PARA PRIVILEGIOS
  mostrarBotonAjustes: boolean = false;
  currentUser?: Users | null;
  privilegiosDisponibles?: VistaRolesPrivilegios[] | null;
  rol: string = '';
  constructor(
    private usuariosService: UsuariosService,
    private SidebaropeningService: SidebaropeningService,
    private authService: AuthService,
    private router: Router,
    private sidebarOpeningService: SidebaropeningService,
    private vistaRolesPrivilegiosService: VistaRolesPrivilegiosService,
    private rolesService: RolesService
  ) {}

  async getAllRolesPrivilegios(): Promise<void> {
    try {
      const id = this.currentUser?.id_rol;
      if (id) {
        this.privilegiosDisponibles =
          await this.vistaRolesPrivilegiosService.getAllRolesPrivilegios(id);
        this.mostrarBotonAjustes = this.privilegiosDisponibles.some(
          (privilegio) => privilegio.id_privilegio === 11
        );
      }
    } catch (error) {
      console.error('Error al obtener los roles y privilegios:', error);
    }
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
    this.rolesService
      .getNombrePorId(this.currentUser!.id_rol)
      .then((nombre) => {
        this.rol = nombre || '';
      })
      .catch((error) => {
        console.error('Error obteniendo nombre del rol:', error);
      });
    this.getAllRolesPrivilegios();
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

  abrirModalEditar(id_usuario: number): void {
    this.usuarioSeleccionado = id_usuario;
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
  }
}
