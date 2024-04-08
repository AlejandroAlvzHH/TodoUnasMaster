import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';
import { FormsModule } from '@angular/forms';
import { Branches } from '../../../../Models/Master/branches';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { ActivatedRoute } from '@angular/router';
import { TablaProductosComponent } from '../../../tabla-productos/tabla-productos.component';
import { TablaCarritoComponent } from '../../../../modals/Modals Sucursales/tabla-carrito/tabla-carrito.component';
import { InventarioService } from '../../../../core/services/inventario.service';
import { CarritoServiceService } from '../../../../core/services/Services Sucursales/carrito-service.service';
import { ViewChild } from '@angular/core';
import { InventarioMasterService } from '../../../../core/services/Services Sucursales/Entradas y Salidas/inventario-master.service';
import { Movements_Detail } from '../../../../Models/Master/movements_detail';
import { DetalleMovimientosService } from '../../../../core/services/detalle-movimientos.service';
import { MovimientosService } from '../../../../core/services/movimientos.service';

@Component({
  selector: 'app-entradasysalidas',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    FormsModule,
    TablaProductosComponent,
    TablaCarritoComponent,
  ],
  template: `<app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <h1>ENTRADAS Y SALIDAS</h1>
      <div class="switch-container">
        <button
          class="switch-btn"
          [class.active]="isEntradaSelected"
          (click)="selectEntrada()"
        >
          Entrada
        </button>
        <button
          class="switch-btn"
          [class.active]="!isEntradaSelected"
          (click)="selectSalida()"
        >
          Salida
        </button>
      </div>
      <button class="btn" (click)="abrirModal()">Ver Productos Elegidos</button>
      <button class="btn" (click)="confirmAction()">
        {{ isEntradaSelected ? 'Confirmar Entrada' : 'Confirmar Salida' }}
      </button>
      <app-tabla-carrito
        *ngIf="mostrarModal"
        [isSalida]="!isEntradaSelected"
        (cerrar)="cerrarModal()"
      ></app-tabla-carrito>
      <div class="table">
        <h2>Inventario en {{ sucursal?.nombre }}</h2>
        <app-tabla-productos [baseUrl]="sucursal?.url"></app-tabla-productos>
      </div>
    </main> `,
  styleUrl: './entradasysalidas.component.css',
})
export class EntradasysalidasComponent implements OnInit {
  sucursal: Branches | null = null;
  isSidebarOpen: boolean = false;
  isEntradaSelected: boolean = true;
  mostrarModal: boolean = false;
  items: any[] = [];
 

  @ViewChild(TablaCarritoComponent)
  tablaCarritoComponent!: TablaCarritoComponent;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sidebarOpeningService: SidebaropeningService,
    private inventarioService: InventarioService,
    private carritoService: CarritoServiceService,
    private inventarioServiceMaster: InventarioMasterService,
    private movimientosService: MovimientosService,
    private detalleMovimientosService: DetalleMovimientosService
  ) {}

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  toggleSidebar(): void {
    console.log('Toggle');
    this.sidebarOpeningService.toggleSidebar();
  }

  selectEntrada(): void {
    this.isEntradaSelected = true;
  }

  selectSalida(): void {
    this.isEntradaSelected = false;
  }

  confirmAction(): void {
    if (this.isEntradaSelected) {
      console.log('Entrada:');
      this.registrarEntrada();
    } else {
      console.log('Salida:');
      this.registrarSalida();
    }
  }

  registrarEntrada(): void {
    let valor_total_movimiento = 0;
    const logDetalles: Movements_Detail[] = [];
    this.items.forEach((item) => {
      valor_total_movimiento += item.precioVenta * item.cantidad;
      console.log(
        'Cantidad de entrada para el artículo con id ',
        item.idArticulo,
        ':',
        item.cantidad
      );
      const cambiosMaster = {
        id_sucursal: this.sucursal?.idSucursal ?? 0,
        id_producto: item.idArticulo,
        cantidad: item.existencia + item.cantidad,
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
        existencia: item.existencia + item.cantidad,
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
      console.log('JSON final:', cambios);
      console.log('JSON final master:', cambiosMaster);
      this.inventarioServiceMaster
        .registrarEntradaMaster(
          this.sucursal?.idSucursal ?? 0,
          item.idArticulo,
          cambiosMaster
        )
        .subscribe(
          () => {
            console.log('Entrada master registrada exitosamente.');
          },
          (error) => {
            console.error('Error al registrar entrada master:', error);
          }
        );
      this.inventarioService
        .registrarEntrada(item.idArticulo, cambios)
        .subscribe(
          () => {
            console.log('Entrada registrada exitosamente.');
          },
          (error) => {
            console.error('Error al registrar entrada:', error);
          }
        );
      const logDetalle: Movements_Detail = {
        id_detalle_mov: 0,
        id_movimiento: 0,
        id_producto: item.idArticulo,
        cantidad: item.cantidad,
        precio: item.precioVenta * item.cantidad,
      };
      logDetalles.push(logDetalle);
      console.log('Log creado exitosamente: ', logDetalle);
    });
    const logGlobal = {
      id_usuario: 1,
      tipo_movimiento: 'Entrada',
      sucursal_salida: null,
      sucursal_destino: this.sucursal?.idSucursal,
      id_tipo_salida: null,
      id_clinica: null,
      fecha: new Date(),
      precio_total: valor_total_movimiento,
    };
    console.log('Log Global creado exitosamente: ', logGlobal);
    this.movimientosService.insertarLogMovimiento(logGlobal).subscribe((id) => {
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
  }

  registrarSalida(): void {
    let valor_total_movimiento = 0;
    const logDetalles: Movements_Detail[] = [];
    this.items.forEach((item) => {
      valor_total_movimiento += item.precioVenta * item.cantidad;
      console.log(
        'Cantidad de salida para el artículo con id',
        item.idArticulo,
        ':',
        item.cantidad
      );
      const cambiosMaster = {
        id_sucursal: this.sucursal?.idSucursal,
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
      console.log('JSON final:', cambios);
      console.log('JSON final master:', cambiosMaster);
      this.inventarioServiceMaster
        .registrarSalidaMaster(
          this.sucursal?.idSucursal ?? 0,
          item.idArticulo,
          cambiosMaster
        )
        .subscribe(
          () => {
            console.log('Salida master registrada exitosamente.');
          },
          (error) => {
            console.error('Error al registrar salida master:', error);
          }
        );
      this.inventarioService
        .registrarSalida(item.idArticulo, cambios)
        .subscribe(
          () => {
            console.log('Salida registrada exitosamente.');
          },
          (error) => {
            console.error('Error al registrar salida:', error);
          }
        );
        const logDetalle: Movements_Detail = {
          id_detalle_mov: 0,
          id_movimiento: 0,
          id_producto: item.idArticulo,
          cantidad: item.cantidad,
          precio: item.precioVenta * item.cantidad,
        };
        logDetalles.push(logDetalle);
        console.log('Log creado exitosamente: ', logDetalle);
      });
      const logGlobal = {
        id_usuario: 1,
        tipo_movimiento: 'Salida',
        sucursal_salida: this.sucursal?.idSucursal,
        sucursal_destino: null,
        id_tipo_salida: null,
        id_clinica: null,
        fecha: new Date(),
        precio_total: valor_total_movimiento,
      };
      console.log('Log Global creado exitosamente: ', logGlobal);
      this.movimientosService.insertarLogMovimiento(logGlobal).subscribe((id) => {
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
    }

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

  ngOnInit(): void {
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
    this.obtenerDetalleSucursal();
    this.carritoService.items$.subscribe((items) => {
      this.items = items;
    });
  }
}
