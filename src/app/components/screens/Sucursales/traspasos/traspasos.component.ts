import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { SidebaropeningService } from '../../../../core/services/sidebaropening.service';
import { HeaderComponent } from '../../../header/header.component';
import Swal from 'sweetalert2';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { Branches } from '../../../../Models/Master/branches';
import { FormsModule } from '@angular/forms';
import { CarritoClinicaComponent } from '../../../../modals/Modals Sucursales/carrito-clinica/carrito-clinica.component';
import { ActivatedRoute } from '@angular/router';
import { TablaProductosComponent } from '../../../tabla-productos/tabla-productos.component';
import { InventarioMasterService } from '../../../../core/services/Services Sucursales/Entradas y Salidas/inventario-master.service';
import { InventarioService } from '../../../../core/services/inventario.service';
import { CarritoServiceService } from '../../../../core/services/Services Sucursales/carrito-service.service';
import { MovimientosService } from '../../../../core/services/movimientos.service';
import { DetalleMovimientosService } from '../../../../core/services/detalle-movimientos.service';
import { Movements_Detail } from '../../../../Models/Master/movements_detail';
import { PdfServiceService } from '../../../../core/services/pdf-service.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Users } from '../../../../Models/Master/users';

@Component({
  selector: 'app-traspasos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderComponent,
    TablaProductosComponent,
    CarritoClinicaComponent,
  ],
  template: ` <app-header></app-header>
    <app-sidebar></app-sidebar>
    <main class="main-content" [class.opened-sidebar]="isSidebarOpen">
      <div
        class="overlay"
        *ngIf="isSidebarOpen"
        (click)="toggleSidebar()"
      ></div>
      <div class="title-container">
        <h1>TRASPASOS A SUCURSAL</h1>
      </div>
      <br />
      <div class="subtitle-container">
        <h2>Desde {{ sucursal?.nombre }} -> hacia:</h2>
      </div>
      <br />
      <select [(ngModel)]="selectedSucursalDestino">
        <option
          *ngFor="let sucursal of sucursalDestino"
          [value]="sucursal.idSucursal"
        >
          {{ sucursal.nombre }}
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
    </main>`,
  styleUrl: './traspasos.component.css',
})
export class TraspasosComponent {
  isSidebarOpen: boolean = false;
  sucursal: Branches | null = null;
  sucursalDestino: Branches[] = [];
  selectedSucursalDestino: number | null = null;
  mostrarModal: boolean = false;
  items: any[] = [];
  currentUser?: Users | null;

  carritoClinicaComponent!: CarritoClinicaComponent;
  constructor(
    private sidebarOpeningService: SidebaropeningService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private inventarioServiceMaster: InventarioMasterService,
    private inventarioService: InventarioService,
    private carritoService: CarritoServiceService,
    private movimientosService: MovimientosService,
    private detalleMovimientosService: DetalleMovimientosService,
    private pdfService: PdfServiceService,
    private authService: AuthService
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
    if (this.items.length === 0) {
      Swal.fire({
        title: 'Carrito Vacío',
        text: 'El carrito está vacío. Por favor, agrega productos antes de confirmar el traspaso.',
        icon: 'warning',
        confirmButtonColor: '#5c5c5c',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    if (
      this.selectedSucursalDestino !== null &&
      this.selectedSucursalDestino !== undefined
    ) {
      const selectedSucursalDestino = this.sucursalDestino.find(
        (sucursalDestiny) =>
          sucursalDestiny.idSucursal ===
          parseInt(this.selectedSucursalDestino!.toString(), 10)
      );
      const detallesProductos = this.items.map((item, index) => {
        return {
          IdDetalle: index + 1,
          Producto: item.nombre,
          Cantidad: item.cantidad,
          Valor: item.precioVenta * item.cantidad,
        };
      });
      Swal.fire({
        title: 'Confirmar Traspaso',
        text: `¿Estás seguro de traspasar los productos a ${selectedSucursalDestino?.nombre}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#5c5c5c',
        cancelButtonColor: '#bcbcbs',
        confirmButtonText: 'Sí, confirmar traspaso',
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
              precio: item.precioVenta * item.cantidad,
            };
            logDetalles.push(logDetalle);
          });
          const logGlobal = {
            id_usuario: this.currentUser?.id_usuario,
            tipo_movimiento: 'Traspaso a Sucursal',
            sucursal_salida: this.sucursal?.idSucursal,
            sucursal_destino: selectedSucursalDestino?.idSucursal,
            id_tipo_salida: null,
            id_clinica: null,
            fecha: new Date(),
            precio_total: valor_total_movimiento,
          };
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
            Tipo: 'Traspaso a Sucursal',
            SucursalSalida: this.sucursal?.nombre,
            SucursalDestino: selectedSucursalDestino?.nombre,
            TipoSalida: '',
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
            title: 'Traspaso Confirmado',
            text: `Los productos han sido traspasados a ${selectedSucursalDestino?.nombre}.`,
            icon: 'success',
            confirmButtonColor: '#5c5c5c',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            window.location.reload();
          });
        }
      });
    } else {
      return;
    }
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
    this.sidebarOpeningService.isOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
    this.obtenerDetalleSucursal();
    this.apiService.getAllSucursales().subscribe(
      (sucursales) => {
        this.sucursalDestino = sucursales.filter(
          (sucursal) => sucursal.idSucursal !== this.sucursal?.idSucursal
        );
        if (this.sucursalDestino.length > 0) {
          this.selectedSucursalDestino = this.sucursalDestino[0].idSucursal;
        }
      },
      (error) => {
        console.error('Error al obtener las sucursales: ', error);
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
