import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';
import { Branches } from '../../../../Models/Master/branches';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { ActivatedRoute } from '@angular/router';
import { Clinics } from '../../../../Models/Master/clinics';
import { ClinicasService } from '../../../../core/services/Services Sucursales/clinicas.service';
import { FormsModule } from '@angular/forms';
import { TablaProductosComponent } from '../../../tabla-productos/tabla-productos.component';
import { CarritoClinicaComponent } from '../../../../modals/Modals Sucursales/carrito-clinica/carrito-clinica.component';
import { InventarioMasterService } from '../../../../core/services/Services Sucursales/Entradas y Salidas/inventario-master.service';
import { InventarioService } from '../../../../core/services/inventario.service';
import { CarritoServiceService } from '../../../../core/services/Services Sucursales/carrito-service.service';
import { MovimientosService } from '../../../../core/services/movimientos.service';
import { DetalleMovimientosService } from '../../../../core/services/detalle-movimientos.service';
import { Movements_Detail } from '../../../../Models/Master/movements_detail';

@Component({
  selector: 'app-traspasos-clinica',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderComponent,
    TablaProductosComponent,
    CarritoClinicaComponent,
  ],
  template: `
    <app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <h1>TRASPASOS A CLÍNICA</h1>
      <h2>DESDE {{ sucursal?.nombre }} HACIA:</h2>
      <select [(ngModel)]="selectedClinica">
        <option *ngFor="let clinica of clinicas" [value]="clinica.id_clinica">
          {{ clinica.nombre }}
        </option>
      </select>
      <br />
      <button class="btn" (click)="abrirModal()">Ver Productos Elegidos</button>
      <button class="btn" (click)="confirmAction()">Confirmar Traspaso</button>
      <app-carrito-clinica
        *ngIf="mostrarModal"
        (cerrar)="cerrarModal()"
      ></app-carrito-clinica>
      <app-tabla-productos [baseUrl]="sucursal?.url"></app-tabla-productos>
    </main>
  `,
  styleUrl: './traspasos-clinica.component.css',
})
export class TraspasosClinicaComponent {
  isSidebarOpen: boolean = false;
  sucursal: Branches | null = null;
  clinicas: Clinics[] = [];
  selectedClinica: number | null = null;
  mostrarModal: boolean = false;
  items: any[] = [];

  carritoClinicaComponent!: CarritoClinicaComponent;
  constructor(
    private sidebarOpeningService: SidebaropeningService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private clinicasService: ClinicasService,
    private inventarioServiceMaster: InventarioMasterService,
    private inventarioService: InventarioService,
    private carritoService: CarritoServiceService,
    private movimientosService: MovimientosService,
    private detalleMovimientosService: DetalleMovimientosService
  ) {}

  obtenerDetalleSucursal(): void {
    this.route.paramMap.subscribe((params) => {
      const sucursalId = params.get('id');
      if (sucursalId) {
        this.apiService.getSucursalById(parseInt(sucursalId, 10)).subscribe(
          (sucursal) => {
            this.sucursal = sucursal;
          },
          (error) => {
            console.error('Error al obtener la sucursal:', error);
          }
        );
      }
    });
  }

  confirmAction(): void {
    if (this.selectedClinica !== null && this.selectedClinica !== undefined) {
      const selectedClinica = this.clinicas.find(
        (clinica) =>
          clinica.id_clinica === parseInt(this.selectedClinica!.toString(), 10)
      );
      console.log('Traspaso confirmado hacia', selectedClinica?.nombre);
      let valor_total_movimiento = 0;
      const logDetalles: Movements_Detail[] = [];
      this.items.forEach((item) => {
        valor_total_movimiento += item.precioVenta * item.cantidad;
        console.log(
          'Cantidad de traspaso para el artículo con id ',
          item.idArticulo,
          ':',
          item.cantidad
        );
        const cambiosMaster = {
          id_sucursal: this.sucursal?.idSucursal ?? 0,
          id_producto: item.idArticulo,
          cantidad: item.existencia - item.cantidad,
        };
        const cambios = {
          idArticulo: item.idArticulo,
          clave: item.clave,
          nombre: item.nombre,
          precioVenta: item.precioVenta,
          precioCompra: item.precioCompra,
          unidadVenta: item.unidadVenta,
          unidadCompra: item.unidadCompra,
          relacion: item.relacion,
          idImp1: item.idImp1,
          idImp2: item.idImp2,
          idRet1: item.idRet1,
          idRet2: item.idRet2,
          existencia: item.existencia - item.cantidad,
          observaciones: item.observaciones,
          neto: item.neto,
          netoC: item.netoC,
          inventariable: item.inventariable,
          costo: item.costo,
          lotes: item.lotes,
          series: item.series,
          precioSug: item.precioSug,
          oferta: item.oferta,
          promocion: item.promocion,
          impCig: item.impCig,
          color: item.color,
          precioLista: item.precioLista,
          condiciones: item.condiciones,
          utilidad: item.utilidad,
          alterna: item.alterna,
          kit: item.kit,
          dpc: item.dpc,
          dpv: item.dpv,
          reorden: item.reorden,
          maximo: item.maximo,
          kitSuelto: item.kitSuelto,
          idClaseMultiple: item.idClaseMultiple,
          prcFix: item.prcFix,
          localiza: item.localiza,
        };
        console.log('JSON final: ', cambios);
        console.log('JSON final master: ', cambiosMaster);
        this.inventarioServiceMaster
          .registrarSalidaMaster(
            this.sucursal?.idSucursal ?? 0,
            item.idArticulo,
            cambiosMaster
          )
          .subscribe(
            () => {
              console.log('Traspaso master registrado exitosamente.');
            },
            (error) => {
              console.error('Error al registrar traspaso master:', error);
            }
          );
        this.inventarioService
          .registrarSalida(item.idArticulo, cambios)
          .subscribe(
            () => {
              console.log('Traspaso registrado exitosamente.');
            },
            (error) => {
              console.error('Error al registrar traspaso:', error);
            }
          );
        const logDetalle: Movements_Detail = {
          id_detalle_mov: 0,
          id_movimiento: 0,
          id_producto: item.idArticulo,
          cantidad: item.cantidad,
          precio: item.precioVenta*item.cantidad,
        };
        logDetalles.push(logDetalle);
        console.log('Log creado exitosamente: ', logDetalle);
      });
      const logGlobal = {
        id_usuario: 1,
        tipo_movimiento: 'Traspaso a clínica',
        sucursal_salida: this.sucursal?.idSucursal,
        sucursal_destino: null,
        id_tipo_salida: null,
        id_clinica: selectedClinica?.id_clinica,
        fecha: new Date(),
        precio_total: valor_total_movimiento,
      };
      console.log('Log Global creado exitosamente: ', logGlobal);
      this.movimientosService
        .insertarLogMovimiento(logGlobal)
        .subscribe((id) => {
          if (id !== null) {
            console.log('Movimiento insertado con ID:', id);
            logDetalles.forEach((logDetalle) => {
              logDetalle.id_movimiento = id;
              this.detalleMovimientosService
                .insertarLogMovimientoDetail(logDetalle)
                .subscribe();
            });
          } else {
            console.error('Error al insertar el movimiento.');
          }
        });
    } else {
      console.error('selectedClinica es null o undefined.');
      return;
    }
  }

  ngOnInit(): void {
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
    this.obtenerDetalleSucursal();
    this.clinicasService.getClinicas().subscribe(
      (clinicas) => {
        this.clinicas = clinicas;
        if (this.clinicas.length > 0) {
          this.selectedClinica = this.clinicas[0].id_clinica;
        }
      },
      (error) => {
        console.error('Error al obtener las clínicas: ', error);
      }
    );
    this.carritoService.items$.subscribe((items) => {
      this.items = items;
    });
  }

  toggleSidebar(): void {
    this.sidebarOpeningService.toggleSidebar();
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }
}
