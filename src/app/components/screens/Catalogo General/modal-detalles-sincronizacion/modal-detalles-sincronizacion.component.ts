import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { SucursalesConSincronizacionPendienteService } from '../../../../core/services/Services Catalogo General/sucursales-con-sincronizacion-pendiente.service';
import { CatalogoGeneralService } from '../../../../core/services/Services Catalogo General/catalogo-general.service';
import { CatalogoSucursalService } from '../../../../core/services/Services Catalogo General/catalogo-sucursal.service';
import { SincronizacionPendienteService } from '../../../../core/services/Services Catalogo General/sincronizacion-pendiente.service';
import Swal from 'sweetalert2';
import { VistaSincronizacionPendienteReciente } from '../../../../Models/Master/vista-sincronizacion-pendiente-reciente';
import { VistaRolesPrivilegios } from '../../../../Models/Master/vista-roles-privilegios';
import { VistaRolesPrivilegiosService } from '../../../../core/services/Services Configuracion/vista-roles-privilegios.service';
import { Users } from '../../../../Models/Master/users';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-modal-detalles-sincronizacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal">
      <div class="modal-content">
        <h2>Detalles de Sincronización</h2>
        <div *ngIf="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Sucursal</th>
              <th>Estado de Sincronización</th>
              <th>Existencias</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let detalle of detallesProducto; let i = index">
              <td>{{ i + 1 }}</td>
              <td>{{ detalle.nombre_sucursal }}</td>
              <td>{{ detalle.estado }}</td>
              <td>{{ detalle.cantidad_existencia }}</td>
            </tr>
          </tbody>
        </table>
        <button
          *ngIf="mostrarBotonReintentar"
          class="btn"
          (click)="reintentarSincronizacion()"
        >
          Reintentar Sincronización
        </button>
        <button class="btn-cerrar" (click)="cerrarModal()">Cerrar</button>
      </div>
    </div>
  `,
  styleUrl: './modal-detalles-sincronizacion.component.css',
})
export class ModalDetallesSincronizacionComponent {
  @Output() cancelar = new EventEmitter<void>();
  @Input() id_producto: number | null = null;
  detallesProducto: VistaSincronizacionPendienteReciente[] = [];
  loading: boolean = false;

  currentUser?: Users | null;
  mostrarBotonReintentar: boolean = false;
  privilegiosDisponibles?: VistaRolesPrivilegios[] | null;

  constructor(
    private sucursalesConSincronizacionPendienteService: SucursalesConSincronizacionPendienteService,
    private catalogoGeneralService: CatalogoGeneralService,
    private catalogoSucursalService: CatalogoSucursalService,
    private sincronizacionPendienteService: SincronizacionPendienteService,
    private vistaRolesPrivilegiosService: VistaRolesPrivilegiosService,
    private authService: AuthService
  ) {}

  async getAllRolesPrivilegios(): Promise<void> {
    try {
      const id = this.currentUser?.id_rol;
      if (id) {
        this.privilegiosDisponibles =
          await this.vistaRolesPrivilegiosService.getAllRolesPrivilegios(id);
        this.mostrarBotonReintentar = this.privilegiosDisponibles.some(
          (privilegio) => privilegio.id_privilegio === 9
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
    this.getAllRolesPrivilegios();
    if (this.id_producto !== null) {
      this.getDetallesProducto();
    }
  }

  getDetallesProducto(): void {
    this.sucursalesConSincronizacionPendienteService
      .getDetalleSincronizacionProductoReciente(this.id_producto!)
      .subscribe((detalles) => {
        this.detallesProducto = detalles;
        console.log(this.detallesProducto);
      });
  }

  cerrarModal() {
    this.cancelar.emit();
  }

  async reintentarSincronizacion() {
    this.loading = true;
    let algunoPendiente = false;
    for (const producto of this.detallesProducto) {
      if (producto.estado === 'PENDIENTE') {
        console.log('HAY PENDIENTES');
        algunoPendiente = true;
        try {
          const productByID =
            await this.catalogoGeneralService.getCatalogueProductByID(
              producto.id_producto
            );
          if (productByID) {
            const JSON = {
              idArticulo: productByID.id_producto,
              clave: productByID.clave,
              nombre: productByID.nombre,
              precioVenta: productByID.precio,
              precioCompra: 0,
              unidadVenta: '',
              unidadCompra: '',
              relacion: 0,
              idImp1: 0,
              idImp2: 0,
              idRet1: 0,
              idRet2: 0,
              existencia: productByID.cantidad_total,
              observaciones: productByID.descripcion,
              neto: 0,
              netoC: 0,
              inventariable: 0,
              costo: 0,
              lotes: 0,
              series: 0,
              precioSug: 0,
              oferta: '',
              promocion: '',
              impCig: 0,
              color: 0,
              precioLista: 0,
              condiciones: '',
              utilidad: 0,
              alterna: '',
              kit: 0,
              dpc: 0,
              dpv: 0,
              reorden: 0,
              maximo: 0,
              kitSuelto: 0,
              idClaseMultiple: 0,
              prcFix: 0,
              localiza: '',
            };
            const fechaActual = new Date();
            fechaActual.setHours(fechaActual.getHours() - 6);
            const JSON1 = {
              id_producto: producto.id_producto,
              id_sucursal: producto.id_sucursal,
              fecha_registro: fechaActual,
              estado: 'SINCRONIZADO',
              mensaje_error: '',
            };
            try {
              const urlSucursal = producto.url_sucursal;
              const product = await this.catalogoSucursalService.getProductById(
                urlSucursal,
                producto.id_producto
              );
              if (product) {
                try {
                  await this.catalogoSucursalService.updateProductoSucursal(
                    urlSucursal,
                    producto.id_producto,
                    JSON
                  );
                  await this.sincronizacionPendienteService
                    .registrarFalloSincronizacion(JSON1)
                    .toPromise();
                  console.log('Producto encontrado:', producto);
                } catch (error) {
                  console.error('Error al actualizar el producto:', error);
                }
              } else {
                try {
                  await this.catalogoSucursalService
                    .agregarProductoSucursal(urlSucursal, JSON)
                    .toPromise();
                  await this.sincronizacionPendienteService
                    .registrarFalloSincronizacion(JSON1)
                    .toPromise();
                } catch (error) {
                  console.error('Error al agregar el producto:', error);
                }
              }
            } catch (error) {
              console.error('Error al obtener el producto:', error);
            }
          } else {
            console.log(
              'No se pudo obtener información del producto con ID:',
              producto.id_producto
            );
          }
        } catch (error) {
          console.error('Error durante la sincronización:', error);
          Swal.fire({
            title:
              'Error durante la sincronización, intente de nuevo más tarde por favor.',
            icon: 'error',
            confirmButtonColor: '#5c5c5c',
            confirmButtonText: 'Aceptar',
          });
          this.loading = false;
          return;
        }
      }
    }
    if (!algunoPendiente) {
      Swal.fire({
        title: 'Todos los productos ya están sincronizados',
        text: 'Los productos se encuentran sincronizados en todas las sucursales, no es necesaria ninguna acción.',
        icon: 'success',
        confirmButtonColor: '#5c5c5c',
        confirmButtonText: 'Aceptar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = false;
        }
      });
      return;
    }
    Swal.fire({
      title: 'Se sincronizaron los productos con éxito',
      text: 'Los productos ahora se encuentran sincronizados en todas las sucursales.',
      icon: 'success',
      confirmButtonColor: '#5c5c5c',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = false;
        this.cerrarModal();
        window.location.reload();
      }
    });
  }
}
