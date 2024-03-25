import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarritoServiceService } from '../../../core/services/Services Sucursales/carrito-service.service';

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

  constructor(private carritoService: CarritoServiceService) {
    this.carritoService.items$.subscribe((items) => {
      this.items = items;
    });
  }

  validarCantidad(event: any, item: any): void {
    const value = event.target.value.trim();
    const newValue = parseInt(value, 10);

    if (!/^\d+$/.test(value) || value === '' || newValue === 0) {
      event.target.value = item.cantidad;
    } else {
      if (newValue > item.existencia) {
        item.cantidad = item.existencia;
        event.target.value = item.existencia;
      } else {
        item.cantidad = newValue;
      }
    }
  }

  eliminarItem(index: number) {
    this.carritoService.eliminarItem(index);
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
