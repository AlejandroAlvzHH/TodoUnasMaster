import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  Input,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarritoServiceService } from '../../../core/services/Services Sucursales/carrito-service.service';
import { CatalogoSalidasService } from '../../../core/services/Services Sucursales/Entradas y Salidas/catalogo-salidas.service';
import { CatalogoSalidas } from '../../../Models/Master/catalogo_salidas';
import { CarritoComunicationService } from '../../../core/services/Services Sucursales/Entradas y Salidas/carrito-comunication.service';

@Component({
  selector: 'app-tabla-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <button class="btn" (click)="cerrarModal()">Cerrar</button>
      <table border="2">
        <thead>
          <tr>
            <th scope="col">Id_Artículo</th>
            <th scope="col">Clave</th>
            <th scope="col">Nombre</th>
            <th scope="col">Cantidad</th>
            <th *ngIf="isSalida" scope="col">Motivo de Salida</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of items; let i = index">
            <td>{{ item.idArticulo }}</td>
            <td>{{ item.clave }}</td>
            <td>{{ item.nombre }}</td>
            <td>
              <input
                type="number"
                [min]="1"
                [max]="item.existencia"
                [(ngModel)]="item.cantidad"
                (input)="validarCantidad($event, item)"
                class="quantity-input"
              />
              <button class="btn" (click)="eliminarItem(i)">Eliminar</button>
            </td>
            <td *ngIf="isSalida">
              <select [(ngModel)]="item.motivoSalida" class="select-motivo">
                <option value="" disabled selected>-- Seleccione --</option>
                <option
                  *ngFor="let motivo of catalogoSalidas"
                  [value]="motivo.id_tipo_salida"
                >
                  {{ motivo.tipo }}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styleUrl: './tabla-carrito.component.css',
})
export class TablaCarritoComponent {
  items: any[] = [];
  @Output() cerrar = new EventEmitter<void>();
  @Input() isSalida: boolean = false;
  @Input() productsList: any[] = [];
  @Input() filteredProductsList: any[] = [];
  catalogoSalidas: CatalogoSalidas[] = [];

  constructor(
    private carritoService: CarritoServiceService,
    private catalogoSalidasService: CatalogoSalidasService,
    private carritoCommunicationService: CarritoComunicationService
  ) {
    this.carritoService.items$.subscribe((items) => {
      this.items = items;
    });
  }

  private preseleccionarMotivoSalida(): void {
    if (this.catalogoSalidas.length > 0) {
      this.items.forEach((item) => {
        if (!item.motivoSalida) {
          item.motivoSalida = this.catalogoSalidas[0].id_tipo_salida;
        }
      });
    }
  }

  ngOnInit(): void {
    if (this.isSalida) {
      this.catalogoSalidasService.getCatalogoSalidas().subscribe((data) => {
        console.log(data);
        this.catalogoSalidas = data;
        this.preseleccionarMotivoSalida();
      });
    }
    this.carritoService.items$.subscribe((items) => {
      this.items = items;
      this.preseleccionarMotivoSalida();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['isSalida'] &&
      !changes['isSalida'].firstChange &&
      changes['isSalida'].currentValue
    ) {
      this.actualizarMotivosSalida();
    }
  }

  private actualizarMotivosSalida(): void {
    this.catalogoSalidasService.getCatalogoSalidas().subscribe((data) => {
      console.log(data);
      this.catalogoSalidas = data;
      this.preseleccionarMotivoSalida();
    });
  }

  validarCantidad(event: any, item: any): void {
    const value = event.target.value.trim();
    let newValue = parseInt(value, 10);
    if (!/^\d+$/.test(value) || value === '' || newValue === 0) {
      newValue = 1;
      event.target.value = newValue;
    }
    if (this.isSalida){
    if (newValue > item.existencia) {
      item.cantidad = item.existencia;
      event.target.value = item.existencia;
    } else {
      item.cantidad = newValue;
    }}
  }

  eliminarItem(index: number) {
    const item = this.items[index];
    item.enCarrito = false;
    item.botonDesactivado = false;
    this.carritoCommunicationService.notifyItemRemoved(item.idArticulo);
    this.carritoService.eliminarItem(index);
    const indexInProductsList = this.productsList.findIndex(
      (product) => product.idArticulo === item.idArticulo
    );
    if (indexInProductsList !== -1) {
      this.filteredProductsList[indexInProductsList].enCarrito = false;
      this.filteredProductsList[indexInProductsList].botonDesactivado = false;
    }
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}


