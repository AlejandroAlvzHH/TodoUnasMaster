import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Branches } from '../../../../Models/Master/branches';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { ModifysucursalmodalComponent } from '../../../../modals/Modals Sucursales/modifysucursalmodal/modifysucursalmodal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { VistaRolesPrivilegiosService } from '../../../../core/services/Services Configuracion/vista-roles-privilegios.service';
import { VistaRolesPrivilegios } from '../../../../Models/Master/vista-roles-privilegios';
import { Users } from '../../../../Models/Master/users';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CatalogoSucursalService } from '../../../../core/services/Services Catalogo General/catalogo-sucursal.service';

type TipoDeError = HttpErrorResponse;
@Component({
  selector: 'app-sucursal-selected',
  standalone: true,
  imports: [
    CommonModule,
    ModifysucursalmodalComponent,
    SidebarComponent,
    HeaderComponent,
  ],
  template: ` <app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <div *ngIf="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
      <app-modifysucursalmodal
        *ngIf="mostrarModal"
        [sucursal]="sucursal"
        (modificar)="modificarSucursal($event)"
        (cancelar)="cerrarModal()"
      ></app-modifysucursalmodal>
      <div class="title-container">
        <h1 class="mayusculas">{{ sucursal?.nombre }}</h1>
      </div>
      <br />
      <div class="subtitle-container">
        <h2>URL de servicios: {{ sucursal?.url }}</h2>
      </div>
      <div class="menu-container">
        <div class="menu">
          <a href="/entradasysalidas/{{ sucursal?.idSucursal }}" class="opcion"
            >Entradas y Salidas</a
          >
          <a
            href="/inventariosucursal/{{ sucursal?.idSucursal }}"
            class="opcion"
            >Inventario</a
          >
          <a href="/traspasos/{{ sucursal?.idSucursal }}" class="opcion"
            >Traspaso a Sucursal</a
          >
          <button
            class="opcion"
            (click)="eliminarSucursal()"
            *ngIf="mostrarBotonEliminarSucursal"
          >
            Eliminar Sucursal
          </button>
          <button
            class="opcion"
            (click)="abrirModal()"
            *ngIf="mostrarBotonModificarSucursal"
          >
            Modificar Sucursal
          </button>
          <a href="/traspasosclinica/{{ sucursal?.idSucursal }}" class="opcion"
            >Traspaso a Clínica</a
          >
        </div>
      </div>
    </main>`,
  styleUrls: ['./sucursal-selected.component.css'],
})
export class SucursalSelectedComponent implements OnInit, OnDestroy {
  sucursal: Branches | null = null;
  mostrarModal: boolean = false;
  isSidebarOpen: boolean = false;
  private isOpenSubscription!: Subscription;

  loading: boolean = false;
  currentUser?: Users | null;
  privilegiosDisponibles?: VistaRolesPrivilegios[] | null;
  mostrarBotonEliminarSucursal: boolean = false;
  mostrarBotonModificarSucursal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sidebarOpeningService: SidebaropeningService,
    private router: Router,
    private authService: AuthService,
    private vistaRolesPrivilegiosService: VistaRolesPrivilegiosService,
    private catalogoSucursalService: CatalogoSucursalService
  ) {}

  toggleSidebar(): void {
    this.sidebarOpeningService.toggleSidebar();
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
    this.getAllRolesPrivilegios();
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
    this.obtenerDetalleSucursal();
  }

  async getAllRolesPrivilegios(): Promise<void> {
    try {
      const id = this.currentUser?.id_rol;
      if (id) {
        this.privilegiosDisponibles =
          await this.vistaRolesPrivilegiosService.getAllRolesPrivilegios(id);
        console.log('Privilegios disponibles:', this.privilegiosDisponibles);
        this.mostrarBotonEliminarSucursal = this.privilegiosDisponibles.some(
          (privilegio) => privilegio.id_privilegio === 1
        );
        this.mostrarBotonModificarSucursal = this.privilegiosDisponibles.some(
          (privilegio) => privilegio.id_privilegio === 2
        );
      }
    } catch (error) {
      console.error('Error al obtener los roles y privilegios:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.isOpenSubscription) {
      this.isOpenSubscription.unsubscribe();
    }
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  async eliminarSucursal() {
    const result = await Swal.fire({
      title: 'Confirmar Eliminación',
      text: `¿Estás seguro de eliminar ${this.sucursal?.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar eliminación',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
      },
    });
    if (result.isConfirmed) {
      if (this.sucursal) {
        this.apiService
          .modificarStatusSucursal(this.sucursal.idSucursal, 0)
          .toPromise();

        await Swal.fire({
          title: 'Sucursal Eliminada',
          text: 'Los registros permanecerán en la base de datos.',
          icon: 'success',
          confirmButtonColor: '#333333',
          confirmButtonText: 'Aceptar',
        });
        this.obtenerDetalleSucursal();
        this.mostrarModal = false;
        this.router.navigate(['/']);
      } else {
        console.error('Error al eliminar la sucursal.');
      }
    }
  }

  obtenerDetalleSucursal(): void {
    this.loading = true;
    this.route.paramMap.subscribe((params) => {
      const sucursalId = params.get('id');
      if (sucursalId) {
        this.apiService.getSucursalById(parseInt(sucursalId, 10)).subscribe(
          (sucursal) => {
            this.sucursal = sucursal;
            if (this.sucursal) {
              this.catalogoSucursalService
                .getAllProductsHTTP(this.sucursal.url)
                .subscribe(
                  (response) => {
                    console.log(
                      `La sucursal ${this.sucursal?.nombre} está online.`
                    );
                    const fechaActual = new Date();
                    fechaActual.setHours(fechaActual.getHours() - 6);
                    this.modificarSucursal({
                      ...this.sucursal!,
                      estado: 'Online 🟢',
                      fechaActualizacion: fechaActual,
                    });
                  },
                  (error) => {
                    console.error(
                      `La sucursal ${this.sucursal?.nombre} está offline.`
                    );
                    const fechaActual = new Date();
                    fechaActual.setHours(fechaActual.getHours() - 6);
                    this.modificarSucursal({
                      ...this.sucursal!,
                      estado: 'Offline 🔴',
                      fechaActualizacion: fechaActual,
                    });
                  }
                );
            }
          },
          (error) => {
            console.error('Error al obtener la sucursal:', error);
            this.loading = false;
          }
        );
      } else {
        this.loading = false; 
      }
    });
  }

  modificarSucursal(sucursalModificada: Branches): void {
    if (!sucursalModificada) {
      console.error('Sucursal modificada no es válida');
      this.loading = false;
      return;
    }
    this.apiService.modificarSucursal(sucursalModificada).subscribe(
      (resultado: boolean) => {
        if (resultado) {
          console.log('Sucursal modificada exitosamente');
        } else {
          console.error('La modificación de la sucursal no fue exitosa');
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error al modificar la sucursal:', error);
        this.loading = false;
      }
    );
  }
}
