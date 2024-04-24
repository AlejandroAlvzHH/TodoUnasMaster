import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { VistaSucursalesaConSincronizacionPendiente } from '../../../../Models/Master/vista-sucursales-con-sincronizacion-pendiente';
import { SucursalesConSincronizacionPendienteService } from '../../../../core/services/Services Catalogo General/sucursales-con-sincronizacion-pendiente.service';

@Component({
  selector: 'app-modal-detalles-sincronizacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal">
      <div class="modal-content">
        <h2>Detalles de Sincronización</h2>
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

  constructor(
    private sucursalesConSincronizacionPendienteService: SucursalesConSincronizacionPendienteService,
  ) {}

  ngOnInit(): void {
    if (this.id_producto !== null) {
      this.getDetallesProducto();
    }
  }

  getDetallesProducto(): void {
    console.log(this.id_producto)
    this.sucursalesConSincronizacionPendienteService
      .getDetalleSincronizacionProducto(this.id_producto!)
      .subscribe((detalles) => {
        this.detallesProducto = detalles;
      });
  }

  cerrarModal() {
    this.cancelar.emit();
  }

  reintentarSincronizacion() {}
}
