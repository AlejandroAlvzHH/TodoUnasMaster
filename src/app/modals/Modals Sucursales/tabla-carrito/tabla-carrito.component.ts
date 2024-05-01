import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarritoServiceService } from '../../../core/services/Services Sucursales/carrito-service.service';
import { CarritoComunicationService } from '../../../core/services/Services Sucursales/Entradas y Salidas/carrito-comunication.service';

@Component({
  selector: 'app-tabla-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="table-container">
      <button class="btn" (click)="cerrarModal()">Cerrar</button>
      <table border="2">
        <thead>
          <tr>
            <th scope="col">Id_Artículo</th>
            <th scope="col">Clave</th>
            <th scope="col">Nombre</th>
            <th scope="col">Cantidad</th>
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

  constructor(
    private carritoService: CarritoServiceService,
    private carritoCommunicationService: CarritoComunicationService
  ) {
    this.carritoService.items$.subscribe((items) => {
      this.items = items;
    });
  }

  ngOnInit(): void {
    this.carritoService.items$.subscribe((items) => {
      this.items = items;
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


