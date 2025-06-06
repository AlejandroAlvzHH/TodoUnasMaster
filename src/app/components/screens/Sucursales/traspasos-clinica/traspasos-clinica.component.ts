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
import Swal from 'sweetalert2';
import { PdfServiceService } from '../../../../core/services/pdf-service.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Users } from '../../../../Models/Master/users';
import { CatalogoGeneralService } from '../../../../core/services/Services Catalogo General/catalogo-general.service';

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
      <div class="title-container">
        <h1>TRASPASOS A CLÍNICA</h1>
      </div>
      <br />
      <div class="subtitle-container">
        <h2>Desde {{ sucursal?.nombre }} -> hacia:</h2>
      </div>
      <br />
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
      <app-tabla-productos [baseUrl]="sucursal?.url" [isTraspaso]="isTraspaso"></app-tabla-productos>
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
  currentUser?: Users | null;
  isTraspaso: boolean = true;
  
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
    private detalleMovimientosService: DetalleMovimientosService,
    private pdfService: PdfServiceService,
    private authService: AuthService,
    private catalogoGeneralService: CatalogoGeneralService
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
        confirmButtonColor: '#333333',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    if (this.selectedClinica !== null && this.selectedClinica !== undefined) {
      const selectedClinica = this.clinicas.find(
        (clinica) =>
          clinica.id_clinica === parseInt(this.selectedClinica!.toString(), 10)
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
        text: `¿Estás seguro de traspasar los productos a ${selectedClinica?.nombre}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#333333',
        cancelButtonColor: '#bcbcbs',
        confirmButtonText: 'Sí, confirmar traspaso',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Traspaso confirmado hacia', selectedClinica?.nombre);
          let valor_total_movimiento = 0;
          const logDetalles: Movements_Detail[] = [];
          this.items.forEach((item) => {
            const productGlobalObservable =
              this.catalogoGeneralService.getCatalogueProductObesrvableByID(
                item.idArticulo
              );
            productGlobalObservable.subscribe((productGlobal) => {
              if (!productGlobal) {
                console.error('Producto no encontrado');
                return;
              }
              productGlobal.cantidad_total -= item.cantidad;
              console.log('NUEVA CANTIDAD: ', productGlobal.cantidad_total);
              this.catalogoGeneralService
                .updateCatalogueProduct(productGlobal, item.idArticulo)
                .then((updatedProduct) => {
                  if (updatedProduct) {
                    console.log('Producto actualizado:', updatedProduct);
                  } else {
                    console.log('Producto no encontrado o no actualizado.');
                  }
                })
                .catch((error) => {
                  console.error('Error al actualizar el producto:', error);
                });
            });
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
              .registrarSalidaUniversal(
                this.sucursal!.url,
                item.idArticulo,
                cambios
              )
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
            console.log('Log creado exitosamente: ', logDetalle);
          });
          const logGlobal = {
            id_usuario: this.currentUser?.id_usuario,
            tipo_movimiento: 'Traspaso a Clinica',
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
          const usuario = (
            (this.currentUser?.nombre ?? '') +
            ' ' +
            (this.currentUser?.apellido_paterno ?? '') +
            ' ' +
            (this.currentUser?.apellido_materno ?? '')
          ).trim();
          const data = {
            Usuario: usuario,
            Tipo: 'Traspaso a Clinica',
            SucursalSalida: this.sucursal?.nombre,
            SucursalDestino: '',
            TipoSalida: '',
            Clinica: selectedClinica?.nombre,
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
            text: `Los productos han sido traspasados a ${selectedClinica?.nombre}.`,
            icon: 'success',
            confirmButtonColor: '#333333',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            window.location.reload();
          });
        }
      });
    } else {
      Swal.fire({
        title: 'No hay Clínicas Registradas',
        text: `Los productos no se pueden traspasar porque no hay clínicas registradas en el sistema.`,
        icon: 'error',
        confirmButtonColor: '#333333',
        confirmButtonText: 'Aceptar',
      });
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
    this.clinicasService.getClinicasStatus1().subscribe(
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
