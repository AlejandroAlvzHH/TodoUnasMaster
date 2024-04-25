import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { VistaSucursalesaConSincronizacionPendiente } from '../../../../Models/Master/vista-sucursales-con-sincronizacion-pendiente';
import { SucursalesConSincronizacionPendienteService } from '../../../../core/services/Services Catalogo General/sucursales-con-sincronizacion-pendiente.service';
import { CatalogoGeneralService } from '../../../../core/services/Services Catalogo General/catalogo-general.service';
import { CatalogoSucursalService } from '../../../../core/services/Services Catalogo General/catalogo-sucursal.service';
import { SincronizacionPendienteService } from '../../../../core/services/Services Catalogo General/sincronizacion-pendiente.service';
import Swal from 'sweetalert2';

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
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let detalle of detallesProducto; let i = index">
              <td>{{ i + 1 }}</td>
              <td>{{ detalle.nombre }}</td>
              <td>{{ detalle.estado }}</td>
            </tr>
          </tbody>
        </table>
        <button class="btn" (click)="reintentarSincronizacion()">
          Reintentar Sincronización
        </button>
        <button class="btn" (click)="cerrarModal()">Cancelar</button>
      </div>
    </div>
  `,
  styleUrl: './modal-detalles-sincronizacion.component.css',
})
export class ModalDetallesSincronizacionComponent {
  @Output() cancelar = new EventEmitter<void>();
  @Input() id_producto: number | null = null;
  detallesProducto: VistaSucursalesaConSincronizacionPendiente[] = [];
  loading: boolean = false;
  
  constructor(
    private sucursalesConSincronizacionPendienteService: SucursalesConSincronizacionPendienteService,
    private catalogoGeneralService: CatalogoGeneralService,
    private catalogoSucursalService: CatalogoSucursalService,
    private sincronizacionPendienteService: SincronizacionPendienteService
  ) {}

  ngOnInit(): void {
    if (this.id_producto !== null) {
      this.getDetallesProducto();
    }
  }

  getDetallesProducto(): void {
    this.sucursalesConSincronizacionPendienteService
      .getDetalleSincronizacionProducto(this.id_producto!)
      .subscribe((detalles) => {
        this.detallesProducto = detalles;
        console.log(this.detallesProducto);
      });
  }

  cerrarModal() {
    this.cancelar.emit();
  }

  reintentarSincronizacion() {
    let algunoPendiente = false;
    this.detallesProducto.forEach(async (producto) => {
      if (producto.estado === 'PENDIENTE') {
        console.log(`El producto ${producto.nombre} tiene estado PENDIENTE.`);
        algunoPendiente = true;
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
          this.catalogoSucursalService
            .agregarProductoSucursal(producto.url, JSON)
            .toPromise()
            .then(() => {
              const JSON1 = 'SINCRONIZADO';
              /*this.sincronizacionPendienteService
                .marcarComoSincronizado(producto.id_sync, body2)
                .toPromise();*/
            });
        } else {
          console.log(
            'No se pudo obtener información del producto con ID:',
            producto.id_producto
          );
        }
      }
    });
    if (!algunoPendiente) {
      console.log('No hay productos con estado PENDIENTE.');
      Swal.fire({
        title: 'Todos los productos ya están sincronizados',
        text: 'Los productos se encuentran sincronizados en todas las sucursales, no es necesaria ninguna acción.',
        icon: 'success',
        confirmButtonColor: '#5c5c5c',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
  }
}
