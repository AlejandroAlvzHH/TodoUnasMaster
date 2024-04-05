import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricosMovimientosDetalleService } from '../../../../core/services/Services Historicos/historicos-movimientos-detalle.service';
import { VistaMovementsDetail } from '../../../../Models/Master/vista-movements-detail';

@Component({
  selector: 'app-historicos-detalle',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="modal">
  <div class="modal-content">
    <h2>Detalles del movimiento {{ movimientoId }}</h2>
    <table>
      <thead>
        <tr>
          <th>ID Detalle</th>
          <th>ID Movimiento</th>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let detalle of detallesMovimiento">
          <td>{{ detalle.id_detalle_mov }}</td>
          <td>{{ detalle.id_movimiento }}</td>
          <td>{{ detalle.nombre_producto }}</td>
          <td>{{ detalle.cantidad }}</td>
          <td>{{ detalle.precio }}</td>
        </tr>
      </tbody>
    </table>
    <button class="btn" (click)="cerrarModal()">Cerrar</button>
  </div>
</div>`,
  styleUrls: ['./historicos-detalle.component.css'],
})
export class HistoricosDetalleComponent {
  @Output() cancelar = new EventEmitter<void>();
  @Input() movimientoId: number | null = null;
  detallesMovimiento: VistaMovementsDetail[] = [];

  constructor(private historicosMovimientosDetalleService: HistoricosMovimientosDetalleService) { }

  ngOnInit(): void {
    if (this.movimientoId !== null) {
      this.getDetallesMovimiento();
    }
  }

  getDetallesMovimiento(): void {
    this.historicosMovimientosDetalleService.getDetalleMovimientosByGlobalID(this.movimientoId!)
      .subscribe(detalles => {
        this.detallesMovimiento = detalles;
      });
  }

  cerrarModal() {
    this.cancelar.emit();
  }
}
