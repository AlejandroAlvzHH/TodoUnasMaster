import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricosMovimientosDetalleService } from '../../../../core/services/Services Historicos/historicos-movimientos-detalle.service';
import { VistaMovementsDetail } from '../../../../Models/Master/vista-movements-detail';
import { PdfServiceService } from '../../../../core/services/pdf-service.service';

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
            <th>#</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Valor $</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let detalle of detallesMovimiento; let i = index">
            <td>{{ i + 1 }}</td>
            <td>{{ detalle.nombre_producto }}</td>
            <td>{{ detalle.cantidad }}</td>
            <td>{{ detalle.precio }}</td>
          </tr>
        </tbody>
      </table>
      <button class="btn" (click)="generarPdf()">Generar PDF</button>
      <button class="btn" (click)="cerrarModal()">Cerrar</button>
    </div>
  </div>`,
  styleUrls: ['./historicos-detalle.component.css'],
})
export class HistoricosDetalleComponent {
  @Output() cancelar = new EventEmitter<void>();
  @Input() movimientoId: number | null = null;
  detallesMovimiento: VistaMovementsDetail[] = [];

  //Datos del movimiento master que recibo por inputsss
  @Input() nombre_usuario: string | null = null;
  @Input() tipoMovimiento: string | null = null;
  @Input() sucursalSalida: string | null = null;
  @Input() sucursalDestino: string | null = null;
  @Input() tipoSalida: string | null = null;
  @Input() clinica: string | null = null;
  @Input() valorTotal: number | null = null;
  @Input() fecha: Date | null = null;

  constructor(
    private historicosMovimientosDetalleService: HistoricosMovimientosDetalleService,
    private pdfService: PdfServiceService
  ) {}

  ngOnInit(): void {
    if (this.movimientoId !== null) {
      this.getDetallesMovimiento();
    }
  }

  getDetallesMovimiento(): void {
    this.historicosMovimientosDetalleService
      .getDetalleMovimientosByGlobalID(this.movimientoId!)
      .subscribe((detalles) => {
        this.detallesMovimiento = detalles;
      });
  }
  generarPdf(): void {
    const detallesProductos = this.detallesMovimiento.map((item, index) => {
      return {
        IdDetalle: index + 1,
        Producto: item.nombre_producto,
        Cantidad: item.cantidad,
        Valor: item.precio,
      };
    });
    const data = {
      Usuario: this.nombre_usuario,
      Tipo: this.tipoMovimiento,
      SucursalSalida: this.sucursalSalida,
      SucursalDestino: this.sucursalDestino,
      TipoSalida: this.tipoSalida,
      Clinica: this.clinica,
      Fecha: this.fecha,
      PrecioTotal: this.valorTotal,
      Detalles: detallesProductos,
    };
    console.log("la data del pdf histórico es:", data)
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
  }

  cerrarModal() {
    this.cancelar.emit();
  }
}
