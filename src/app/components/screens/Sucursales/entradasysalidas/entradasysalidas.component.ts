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
import Swal from 'sweetalert2';
import { CatalogoSalidasService } from '../../../../core/services/Services Sucursales/Entradas y Salidas/catalogo-salidas.service';
import { CatalogoSalidas } from '../../../../Models/Master/catalogo_salidas';
import { PdfServiceService } from '../../../../core/services/pdf-service.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Users } from '../../../../Models/Master/users';
import { CatalogoGeneralService } from '../../../../core/services/Services Catalogo General/catalogo-general.service';

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
      <div class="title-container">
        <h1>ENTRADAS Y SALIDAS</h1>
      </div>
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
      <select
        *ngIf="!isEntradaSelected"
        [(ngModel)]="motivoSalidaSeleccionado"
        (change)="onMotivoSalidaChange($event)"
      >
        <option value="" disabled selected>-- Motivo --</option>
        <option
          *ngFor="let motivo of catalogoSalidas"
          [value]="motivo.id_tipo_salida"
        >
          {{ motivo.tipo }}
        </option>
      </select>
      <button class="btn" (click)="confirmAction()">
        {{ isEntradaSelected ? 'Confirmar Entrada' : 'Confirmar Salida' }}
      </button>
      <app-tabla-carrito
        *ngIf="mostrarModal"
        [isSalida]="!isEntradaSelected"
        (cerrar)="cerrarModal()"
      ></app-tabla-carrito>
      <br />
      <div class="subtitle-container-especial">
        <h2>Inventario en {{ sucursal?.nombre }}</h2>
      </div>
      <app-tabla-productos
        [isSalida]="!isEntradaSelected"
        [baseUrl]="sucursal?.url"
        #tablaProductos
      ></app-tabla-productos>
    </main> `,
  styleUrl: './entradasysalidas.component.css',
})
export class EntradasysalidasComponent implements OnInit {
  sucursal: Branches | null = null;
  isSidebarOpen: boolean = false;
  isEntradaSelected: boolean = true;
  mostrarModal: boolean = false;
  items: any[] = [];
  motivoSalidaSeleccionado: string = '';
  nombreMotivoSalidaSeleccionado: string = '';
  catalogoSalidas: CatalogoSalidas[] = [];
  currentUser?: Users | null;

  @ViewChild(TablaCarritoComponent)
  tablaCarritoComponent!: TablaCarritoComponent;

  constructor(
    private route: ActivatedRoute,
    private catalogoSalidasService: CatalogoSalidasService,
    private apiService: ApiService,
    private sidebarOpeningService: SidebaropeningService,
    private inventarioService: InventarioService,
    private carritoService: CarritoServiceService,
    private movimientosService: MovimientosService,
    private detalleMovimientosService: DetalleMovimientosService,
    private pdfService: PdfServiceService,
    private authService: AuthService,
    private catalogoGeneralService: CatalogoGeneralService,
    private inventarioServiceMaster: InventarioMasterService
  ) {}

  onMotivoSalidaChange(event: any) {
    this.motivoSalidaSeleccionado = event.target.value;
    this.nombreMotivoSalidaSeleccionado =
      event.target.options[event.target.selectedIndex].text;
  }

  confirmAction(): void {
    if (this.items.length === 0) {
      Swal.fire({
        title: 'Carrito Vacío',
        text: 'No se seleccionó ningún producto. Por favor, agrega ítems antes de confirmar la acción.',
        icon: 'warning',
        confirmButtonColor: '#333333',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    if (this.isEntradaSelected) {
      this.registrarEntrada();
    } else {
      this.registrarSalida();
    }
  }

  registrarEntrada(): void {
    const detallesProductos = this.items.map((item, index) => {
      return {
        IdDetalle: index + 1,
        Producto: item.nombre,
        Cantidad: item.cantidad,
        Valor: item.precioVenta * item.cantidad,
      };
    });
    Swal.fire({
      title: 'Confirmar Entrada',
      text: `¿Estás seguro de registrar la entrada de productos en ${this.sucursal?.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar entrada',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let valor_total_movimiento = 0;
        const logDetalles: Movements_Detail[] = [];
        this.items.forEach((item) => {
          valor_total_movimiento += item.precioVenta * item.cantidad;
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
            .registrarEntradaUniversal(
              this.sucursal!.url,
              item.idArticulo,
              cambios
            )
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
          id_usuario: this.currentUser?.id_usuario,
          tipo_movimiento: 'Entrada',
          sucursal_salida: null,
          sucursal_destino: this.sucursal?.idSucursal,
          id_tipo_salida: null,
          id_clinica: null,
          fecha: new Date(),
          precio_total: valor_total_movimiento,
        };
        console.log('Log Global creado exitosamente: ', logGlobal);
        this.movimientosService
          .insertarLogMovimiento(logGlobal)
          .subscribe((id) => {
            if (id !== null) {
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
        const usuario = (
          (this.currentUser?.nombre ?? '') +
          ' ' +
          (this.currentUser?.apellido_paterno ?? '') +
          ' ' +
          (this.currentUser?.apellido_materno ?? '')
        ).trim();
        const data = {
          Usuario: usuario,
          Tipo: 'Entrada',
          SucursalSalida: '',
          SucursalDestino: this.sucursal?.nombre,
          TipoSalida: '',
          Clinica: '',
          Fecha: new Date(),
          PrecioTotal: valor_total_movimiento,
          Detalles: detallesProductos,
        };
        console.log('la data para el pdf es:', data);
        this.pdfService.generarReporte(data).subscribe(
          (blob: Blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'reporte_movimiento.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          },
          (error: any) => {
            console.error('Error al generar el reporte:', error);
          }
        );
        Swal.fire({
          title: 'Entrada Confirmada',
          text: `Los productos han sido agregados al inventario de ${this.sucursal?.nombre}.`,
          icon: 'success',
          confirmButtonColor: '#333333',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          window.location.reload();
        });
      }
    });
  }

  registrarSalida(): void {
    const detallesProductos = this.items.map((item, index) => {
      return {
        IdDetalle: index + 1,
        Producto: item.nombre,
        Cantidad: item.cantidad,
        Valor: item.precioVenta * item.cantidad,
      };
    });
    Swal.fire({
      title: 'Confirmar Salida',
      text: `¿Estás seguro de registrar la salida de productos en ${this.sucursal?.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar salida',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let valor_total_movimiento = 0;
        const logDetalles: Movements_Detail[] = [];
        this.items.forEach((item) => {
          valor_total_movimiento += item.precioVenta * item.cantidad;
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
            .registrarSalidaUniversal(
              this.sucursal!.url,
              item.idArticulo,
              cambios
            )
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
          id_usuario: this.currentUser?.id_usuario,
          tipo_movimiento: 'Salida',
          sucursal_salida: this.sucursal?.idSucursal,
          sucursal_destino: null,
          id_tipo_salida: this.motivoSalidaSeleccionado,
          id_clinica: null,
          fecha: new Date(),
          precio_total: valor_total_movimiento,
        };
        console.log('Log Global creado exitosamente: ', logGlobal);
        this.movimientosService
          .insertarLogMovimiento(logGlobal)
          .subscribe((id) => {
            if (id !== null) {
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
        const usuario = (
          (this.currentUser?.nombre ?? '') +
          ' ' +
          (this.currentUser?.apellido_paterno ?? '') +
          ' ' +
          (this.currentUser?.apellido_materno ?? '')
        ).trim();
        const data = {
          Usuario: usuario,
          Tipo: 'Salida',
          SucursalSalida: this.sucursal?.nombre,
          SucursalDestino: '',
          TipoSalida: this.nombreMotivoSalidaSeleccionado,
          Clinica: '',
          Fecha: new Date(),
          PrecioTotal: valor_total_movimiento,
          Detalles: detallesProductos,
        };
        this.pdfService.generarReporte(data).subscribe(
          (blob: Blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'reporte_movimiento.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          },
          (error: any) => {
            console.error('Error al generar el reporte:', error);
          }
        );
        Swal.fire({
          title: 'Salida Confirmada',
          text: `Los productos han sido eliminados del inventario de ${this.sucursal?.nombre}.`,
          icon: 'success',
          confirmButtonColor: '#333333',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          window.location.reload();
        });
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

  async ngOnInit(): Promise<void> {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
    this.catalogoSalidas = [];
    try {
      const catalogoSalidas = await this.catalogoSalidasService
        .getCatalogoSalidasStatus1()
        .toPromise();
      if (catalogoSalidas) {
        this.catalogoSalidas = catalogoSalidas;
        if (this.catalogoSalidas.length > 0) {
          this.motivoSalidaSeleccionado =
            this.catalogoSalidas[0].id_tipo_salida.toString();
          this.nombreMotivoSalidaSeleccionado =
            this.catalogoSalidas[0].tipo.toString();
        }
      } else {
        console.error('El catálogo de salidas está vacío.');
      }
    } catch (error) {
      console.error('Error al obtener el catálogo de salidas:', error);
    }
    this.obtenerDetalleSucursal();
    this.carritoService.items$.subscribe((items) => {
      this.items = items;
    });
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  toggleSidebar(): void {
    this.sidebarOpeningService.toggleSidebar();
  }

  selectEntrada(): void {
    this.isEntradaSelected = true;
  }

  selectSalida(): void {
    this.isEntradaSelected = false;
    this.comprobacionNegativos();
  }

  comprobacionNegativos() {
    const itemsConExistenciaCeroIds: number[] = [];
    this.items.forEach((item) => {
      if (item.existencia === 0) {
        item.enCarrito = false;
        item.botonDesactivado = false;
        itemsConExistenciaCeroIds.push(item.idArticulo);
        console.log(item);
      }
    });
    itemsConExistenciaCeroIds.forEach((id) => {
      this.carritoService.eliminarItemPorId(id);
    });
  }
}
