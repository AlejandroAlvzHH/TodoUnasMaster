import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarritoServiceService } from '../../core/services/Services Sucursales/carrito-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabla-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
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
                (change)="actualizarCantidad(i, item.cantidad)"
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

  constructor(private carritoService: CarritoServiceService) {
    this.carritoService.items$.subscribe((items) => {
      this.items = items;
    });
  }
  actualizarCantidad(index: number, cantidad: number) {
    this.carritoService.actualizarCantidad(index, cantidad);
  }
  eliminarItem(index: number) {
    this.carritoService.eliminarItem(index);
  }
}
