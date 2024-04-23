import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Input } from '@angular/core';

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
              <th>Sucursal Pendiente</th>
            </tr>
          </thead>
          <tbody>
            <!--<tr *ngFor="let detalle of detallesMovimiento; let i = index">
            <td>{{ i + 1 }}</td>
            <td>{{ detalle.nombre_producto }}</td>
            <td>{{ detalle.cantidad }}</td>
            <td>{{ detalle.precio }}</td>
          </tr>-->
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

  cerrarModal() {
    this.cancelar.emit();
  }

  reintentarSincronizacion() {}
}
