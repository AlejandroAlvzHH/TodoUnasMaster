import { Component, EventEmitter, Output, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricosMovimientosDetalleService } from '../../../../core/services/Services Historicos/historicos-movimientos-detalle.service';

@Component({
  selector: 'app-historicos-detalle',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="modal">
  <div class="modal-content">
    <h2>Detalles del movimiento {{ movimientoId }}</h2>
    <button class="btn" (click)="cerrarModal()">Cerrar</button>
  </div>
</div>  `,
  styleUrl: './historicos-detalle.component.css',
})
export class HistoricosDetalleComponent {
  @Output() cancelar = new EventEmitter<void>();
  @Input() movimientoId: number | null = null;

  cerrarModal() {
    this.cancelar.emit();
  }
}
