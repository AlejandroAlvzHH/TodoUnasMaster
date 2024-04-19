import { Component } from '@angular/core';

@Component({
  selector: 'app-detalle-producto-catalogo',
  standalone: true,
  imports: [],
  template: `
    <!--<div class="modal">
      <div class="modal-content">
        <h2>Detalles del producto {{ movimientoId }}</h2>
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
    </div>-->
  `,
  styleUrl: './detalle-producto-catalogo.component.css',
})
export class DetalleProductoCatalogoComponent {
  /*@Output() cancelar = new EventEmitter<void>();
  @Input() id_producto: number | null = null;
  detallesMovimiento: VistaMovementsDetail[] = [];

  //Datos del movimiento master que recibo por inputsss
  @Input() usuario_creador: string | null = null;
  @Input() fecha_creado: string | null = null;
  @Input() usuario_modificador: string | null = null;
  @Input() fecha_modificado: string | null = null;
  @Input() usuario_eliminador: string | null = null;
  @Input() fecha_eliminado: string | null = null;

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

  cerrarModal() {
    this.cancelar.emit();
  }*/
}
