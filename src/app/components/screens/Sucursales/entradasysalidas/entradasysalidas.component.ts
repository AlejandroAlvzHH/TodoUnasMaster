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
        <app-tabla-productos></app-tabla-productos>
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
    private carritoService: CarritoServiceService
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
    this.items.forEach((item) => {
      console.log(
        'Cantidad de entrada para el artículo con id',
        item.idArticulo,
        ':',
        item.cantidad
      );
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
      this.inventarioService
        .registrarEntrada(item.idArticulo, cambios)
        .subscribe(
          (response) => {
            console.log('Entrada registrada exitosamente:', response);
          },
          (error) => {
            console.error('Error al registrar entrada:', error);
          }
        );
    });
  }

  registrarSalida(): void {
    this.items.forEach((item) => {
      console.log(
        'Cantidad de salida para el artículo con id',
        item.idArticulo,
        ':',
        item.cantidad
      );
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
      this.inventarioService
        .registrarSalida(item.idArticulo, cambios)
        .subscribe(
          (response) => {
            console.log('Salida registrada exitosamente:', response);
          },
          (error) => {
            console.error('Error al registrar salida:', error);
          }
        );
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
