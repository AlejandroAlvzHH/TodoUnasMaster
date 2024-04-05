import { ChangeDetectorRef, Component } from '@angular/core';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';
import { CommonModule } from '@angular/common';
import { VistaMovements } from '../../../../Models/Master/vista-movements copy';
import { HistoricosMovimientosService } from '../../../../core/services/Services Historicos/historicos-movimientos.service';
import { HistoricosDetalleComponent } from '../historicos-detalle/historicos-detalle.component';

@Component({
  selector: 'app-historicos',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    HistoricosDetalleComponent,
  ],
  template: ` <app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <h1>HISTÓRICOS</h1>
      <div>
        <div>
        <app-historicos-detalle
            *ngIf="mostrarModal"
            [movimientoId]="movimientoSeleccionado!.id_movimiento"
            (cancelar)="cerrarModal()"
          ></app-historicos-detalle>

          <table border="2">
            <thead>
              <tr>
                <th scope="col">
                  ID Movimiento
                  <i
                    *ngIf="columnaOrdenada === 'id_movimiento'"
                    class="arrow-icon"
                    [class.asc]="ordenAscendente"
                    [class.desc]="!ordenAscendente"
                  ></i>
                </th>
                <th scope="col">
                  Usuario
                  <i
                    *ngIf="columnaOrdenada === 'nombre_usuario'"
                    class="arrow-icon"
                    [class.asc]="ordenAscendente"
                    [class.desc]="!ordenAscendente"
                  ></i>
                </th>
                <th scope="col">
                  Tipo
                  <i
                    *ngIf="columnaOrdenada === 'tipo_movimiento'"
                    class="arrow-icon"
                    [class.asc]="ordenAscendente"
                    [class.desc]="!ordenAscendente"
                  ></i>
                </th>
                <th scope="col">
                  Sucursal de Salida
                  <i
                    *ngIf="columnaOrdenada === 'sucursal_salida'"
                    class="arrow-icon"
                    [class.asc]="ordenAscendente"
                    [class.desc]="!ordenAscendente"
                  ></i>
                </th>
                <th scope="col">
                  Sucursal Destino
                  <i
                    *ngIf="columnaOrdenada === 'sucursal_destino'"
                    class="arrow-icon"
                    [class.asc]="ordenAscendente"
                    [class.desc]="!ordenAscendente"
                  ></i>
                </th>
                <th scope="col">
                  Tipo Salida
                  <i
                    *ngIf="columnaOrdenada === 'tipo_salida'"
                    class="arrow-icon"
                    [class.asc]="ordenAscendente"
                    [class.desc]="!ordenAscendente"
                  ></i>
                </th>
                <th scope="col">
                  Clínica
                  <i
                    *ngIf="columnaOrdenada === 'nombre_clinica'"
                    class="arrow-icon"
                    [class.asc]="ordenAscendente"
                    [class.desc]="!ordenAscendente"
                  ></i>
                </th>
                <th scope="col">
                  Fecha
                  <i
                    *ngIf="columnaOrdenada === 'fecha'"
                    class="arrow-icon"
                    [class.asc]="ordenAscendente"
                    [class.desc]="!ordenAscendente"
                  ></i>
                </th>
                <th scope="col">
                  Precio Total
                  <i
                    *ngIf="columnaOrdenada === 'precio_total'"
                    class="arrow-icon"
                    [class.asc]="ordenAscendente"
                    [class.desc]="!ordenAscendente"
                  ></i>
                </th>
                
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let movement of movementsList">
                <td>{{ movement.id_movimiento }}</td>
                <td>{{ movement.nombre_usuario }}</td>
                <td>{{ movement.tipo_movimiento }}</td>
                <td>{{ movement.sucursal_salida }}</td>
                <td>{{ movement.sucursal_destino }}</td>
                <td>{{ movement.tipo_salida }}</td>
                <td>{{ movement.nombre_clinica }}</td>
                <td>{{ movement.fecha }}</td>
                <td>
                  {{ movement.precio_total }}
                  <button class="btn" (click)="abrirModal(movement)">Ver Detalle</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>`,
  styleUrl: './historicos.component.css',
})
export class HistoricosComponent {
  isSidebarOpen: boolean = false;
  movementsList: VistaMovements[] = [];
  columnaOrdenada: keyof VistaMovements | null = null;
  ordenAscendente: boolean = true;
  mostrarModal: boolean = false;
  movimientoSeleccionado: VistaMovements | null = null;

  constructor(
    private sidebarOpeningService: SidebaropeningService,
    private historicosMovimientosService: HistoricosMovimientosService,
    private cdr: ChangeDetectorRef
  ) {}

  toggleSidebar(): void {
    console.log('Toggle');
    this.sidebarOpeningService.toggleSidebar();
  }

  ngOnInit(): void {
    this.initialize();
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
  }

  private async initialize() {
    try {
      console.log('Antes de llamar a getAllMovimientos');
      this.movementsList =
        await this.historicosMovimientosService.getAllMovimientos();
      console.log('Después de obtener los movimientos:', this.movementsList);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al obtener los movimientos:', error);
    }
  }

  abrirModal(movement: VistaMovements): void {
    this.movimientoSeleccionado = movement;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }
}
