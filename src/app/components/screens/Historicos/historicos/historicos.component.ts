import { ChangeDetectorRef, Component } from '@angular/core';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';
import { CommonModule } from '@angular/common';
import { VistaMovements } from '../../../../Models/Master/vista-movements';
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
        <form class="search-form">
          <div class="search-input">
            <input
              type="text"
              placeholder="Buscar por ID de movimiento"
              (input)="filterByIdMovimiento($event)"
            />
          </div>
          <div class="search-input">
            <input
              type="text"
              placeholder="Buscar por nombre de usuario"
              (input)="filterByUsuario($event)"
            />
          </div>
          <div class="search-input">
            <input
              type="text"
              placeholder="Buscar por tipo de movimiento"
              (input)="filterByTipoMovimiento($event)"
            />
          </div>

          <div class="search-input">
            <input
              type="text"
              placeholder="Buscar por sucursal de salida"
              (input)="filterBySucursalSalida($event)"
            />
          </div>
        </form>
        <form class="search-form">
          <div class="search-input">
            <input
              type="text"
              placeholder="Buscar por sucursal de destino"
              (input)="filterBySucursalDestino($event)"
            />
          </div>
          <div class="search-input">
            <input
              type="text"
              placeholder="Buscar por motivo de salida"
              (input)="filterByMotivoSalida($event)"
            />
          </div>
          <div class="search-input">
            <input
              type="text"
              placeholder="Buscar por clínica"
              (input)="filterByClinica($event)"
            />
          </div>
          <div class="search-input">
            <input
              type="text"
              placeholder="Fecha YYYY-MM-DDTHH:MM:SS"
              (input)="filterByFecha($event)"
            />
          </div>
        </form>
        <app-historicos-detalle
          *ngIf="mostrarModal"
          [nombre_usuario]="movimientoSeleccionado!.nombre_usuario"
          [movimientoId]="movimientoSeleccionado!.id_movimiento"
          [tipoMovimiento]="movimientoSeleccionado!.tipo_movimiento"
          [sucursalSalida]="movimientoSeleccionado!.sucursal_salida"
          [sucursalDestino]="movimientoSeleccionado!.sucursal_destino"
          [tipoSalida]="movimientoSeleccionado!.tipo_salida"
          [clinica]="movimientoSeleccionado!.nombre_clinica"
          [valorTotal]="movimientoSeleccionado!.precio_total"
          [fecha]="movimientoSeleccionado!.fecha"
          (cancelar)="cerrarModal()"
        ></app-historicos-detalle>
        <table border="2">
          <thead>
            <tr>
              <th
                scope="col"
                (click)="ordenarPorColumna('id_movimiento')"
                [class.interactive]="columnaOrdenada === 'id_movimiento'"
              >
                ID Movimiento
                <i
                  *ngIf="columnaOrdenada === 'id_movimiento'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('nombre_usuario')"
                [class.interactive]="columnaOrdenada === 'nombre_usuario'"
              >
                Usuario
                <i
                  *ngIf="columnaOrdenada === 'nombre_usuario'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('tipo_movimiento')"
                [class.interactive]="columnaOrdenada === 'tipo_movimiento'"
              >
                Tipo
                <i
                  *ngIf="columnaOrdenada === 'tipo_movimiento'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('sucursal_salida')"
                [class.interactive]="columnaOrdenada === 'sucursal_salida'"
              >
                Sucursal de Salida
                <i
                  *ngIf="columnaOrdenada === 'sucursal_salida'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('sucursal_destino')"
                [class.interactive]="columnaOrdenada === 'sucursal_destino'"
              >
                Sucursal Destino
                <i
                  *ngIf="columnaOrdenada === 'sucursal_destino'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('tipo_salida')"
                [class.interactive]="columnaOrdenada === 'tipo_salida'"
              >
                Motivo de Salida
                <i
                  *ngIf="columnaOrdenada === 'tipo_salida'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('nombre_clinica')"
                [class.interactive]="columnaOrdenada === 'nombre_clinica'"
              >
                Clínica
                <i
                  *ngIf="columnaOrdenada === 'nombre_clinica'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('fecha')"
                [class.interactive]="columnaOrdenada === 'fecha'"
              >
                Fecha
                <i
                  *ngIf="columnaOrdenada === 'fecha'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('precio_total')"
                [class.interactive]="columnaOrdenada === 'precio_total'"
              >
                Precio Total
                <i
                  *ngIf="columnaOrdenada === 'precio_total'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th scope="col">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let index of filteredIndices">
              <td>{{ filteredMovementsList[index].id_movimiento }}</td>
              <td>{{ filteredMovementsList[index].nombre_usuario }}</td>
              <td>{{ filteredMovementsList[index].tipo_movimiento }}</td>
              <td>{{ filteredMovementsList[index].sucursal_salida }}</td>
              <td>{{ filteredMovementsList[index].sucursal_destino }}</td>
              <td>{{ filteredMovementsList[index].tipo_salida }}</td>
              <td>{{ filteredMovementsList[index].nombre_clinica }}</td>
              <td>{{ filteredMovementsList[index].fecha | date : 'short' }}</td>
              <td>
                {{ filteredMovementsList[index].precio_total }}
              </td>
              <td>
                <button
                  class="btn"
                  (click)="abrirModal(filteredMovementsList[index])"
                >
                  Ver Detalle
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>`,
  styleUrl: './historicos.component.css',
})
export class HistoricosComponent {
  isSidebarOpen: boolean = false;
  mostrarModal: boolean = false;
  movimientoSeleccionado: VistaMovements | null = null;

  movementsList: VistaMovements[] = [];
  filteredMovementsList: VistaMovements[] = [];
  filteredIndices: number[] = [];
  columnaOrdenada: keyof VistaMovements | null = null;
  ordenAscendente: boolean = true;

  constructor(
    private sidebarOpeningService: SidebaropeningService,
    private historicosMovimientosService: HistoricosMovimientosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initialize();
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
  }

  private async initialize() {
    try {
      this.movementsList =
        await this.historicosMovimientosService.getAllMovimientos();
      this.filteredMovementsList = this.movementsList.map((movement) => ({
        id_movimiento: movement.id_movimiento,
        nombre_usuario: movement.nombre_usuario,
        tipo_movimiento: movement.tipo_movimiento,
        sucursal_salida: movement.sucursal_salida,
        sucursal_destino: movement.sucursal_destino,
        tipo_salida: movement.tipo_salida,
        nombre_clinica: movement.nombre_clinica,
        fecha: movement.fecha,
        precio_total: movement.precio_total,
      }));
      this.filteredIndices = Array.from(
        { length: this.filteredMovementsList.length },
        (_, i) => i
      );
      this.cdr.detectChanges();
      console.log(this.movementsList)
    } catch (error) {
      console.error('Error al obtener los movimientos:', error);
    }
  }

  resetFilteredMovementsList(): void {
    this.filteredMovementsList = this.movementsList.map((movement) => ({
      id_movimiento: movement.id_movimiento,
      nombre_usuario: movement.nombre_usuario,
      tipo_movimiento: movement.tipo_movimiento,
      sucursal_salida: movement.sucursal_salida,
      sucursal_destino: movement.sucursal_destino,
      tipo_salida: movement.tipo_salida,
      nombre_clinica: movement.nombre_clinica,
      fecha: movement.fecha,
      precio_total: movement.precio_total,
    }));
    this.filteredIndices = Array.from(
      { length: this.filteredMovementsList.length },
      (_, i) => i
    );
  }

  filterByIdMovimiento(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    if (text === '') {
      this.resetFilteredMovementsList();
    } else {
      const filteredList = this.movementsList.filter((movement) =>
        movement.id_movimiento.toString().startsWith(text)
      );
      this.filteredMovementsList = filteredList;
      this.filteredIndices = Array.from(
        { length: filteredList.length },
        (_, i) => i
      );
    }
  }

  filterByUsuario(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (text === '') {
      this.resetFilteredMovementsList();
    } else {
      const filteredList = this.movementsList.filter((movement) =>
        movement.nombre_usuario.toString().toLowerCase().startsWith(text)
      );
      this.filteredMovementsList = filteredList;
      this.filteredIndices = Array.from(
        { length: filteredList.length },
        (_, i) => i
      );
    }
  }

  filterByTipoMovimiento(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (text === '') {
      this.resetFilteredMovementsList();
    } else {
      const filteredList = this.movementsList.filter((movement) =>
        movement.tipo_movimiento.toString().toLowerCase().startsWith(text)
      );
      this.filteredMovementsList = filteredList;
      this.filteredIndices = Array.from(
        { length: filteredList.length },
        (_, i) => i
      );
    }
  }

  filterBySucursalSalida(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (text === '') {
      this.resetFilteredMovementsList();
    } else {
      const filteredList = this.movementsList.filter((movement) =>
        movement.sucursal_salida.toString().toLowerCase().startsWith(text)
      );
      this.filteredMovementsList = filteredList;
      this.filteredIndices = Array.from(
        { length: filteredList.length },
        (_, i) => i
      );
    }
  }

  filterBySucursalDestino(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (text === '') {
      this.resetFilteredMovementsList();
    } else {
      const filteredList = this.movementsList.filter((movement) =>
        movement.sucursal_destino.toString().toLowerCase().startsWith(text)
      );
      this.filteredMovementsList = filteredList;
      this.filteredIndices = Array.from(
        { length: filteredList.length },
        (_, i) => i
      );
    }
  }

  filterByMotivoSalida(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (text === '') {
      this.resetFilteredMovementsList();
    } else {
      const filteredList = this.movementsList.filter((movement) =>
        movement.tipo_salida.toString().toLowerCase().startsWith(text)
      );
      this.filteredMovementsList = filteredList;
      this.filteredIndices = Array.from(
        { length: filteredList.length },
        (_, i) => i
      );
    }
  }

  filterByClinica(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (text === '') {
      this.resetFilteredMovementsList();
    } else {
      const filteredList = this.movementsList.filter((movement) =>
        movement.nombre_clinica.toString().toLowerCase().startsWith(text)
      );
      this.filteredMovementsList = filteredList;
      this.filteredIndices = Array.from(
        { length: filteredList.length },
        (_, i) => i
      );
    }
  }

  filterByFecha(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (text === '') {
      this.resetFilteredMovementsList();
    } else {
      const filteredList = this.movementsList.filter((movement) =>
        movement.fecha.toString().toLowerCase().startsWith(text)
      );
      this.filteredMovementsList = filteredList;
      this.filteredIndices = Array.from(
        { length: filteredList.length },
        (_, i) => i
      );
    }
  }

  ordenarPorColumna(columna: keyof VistaMovements) {
    if (this.columnaOrdenada === columna) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.columnaOrdenada = columna;
      this.ordenAscendente = true;
    }
    this.filteredIndices.sort((a, b) => {
      const productA = this.filteredMovementsList[a];
      const productB = this.filteredMovementsList[b];
      if (this.columnaOrdenada === null) {
        return 0;
      }
      if (productA[this.columnaOrdenada] > productB[this.columnaOrdenada]) {
        return this.ordenAscendente ? 1 : -1;
      } else if (
        productA[this.columnaOrdenada] < productB[this.columnaOrdenada]
      ) {
        return this.ordenAscendente ? -1 : 1;
      } else {
        return 0;
      }
    });
  }

  abrirModal(movement: VistaMovements): void {
    this.movimientoSeleccionado = movement;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  toggleSidebar(): void {
    console.log('Toggle');
    this.sidebarOpeningService.toggleSidebar();
  }
}
