import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Products } from '../products';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <tr>
      <th scope="col">{{ products.idArticulo }}</th>
      <th scope="col">{{ products.clave }}</th>
      <td scope="col">{{ products.nombre }}</td>
      <td scope="col">{{ products.existencia }}</td>
      <td scope="col">{{ products.precioCompra }}</td>
      <td scope="col">{{ products.precioVenta }}</td>
    </tr>
  `,
  styleUrl: './products-component.component.css',
})
export class ProductsComponentComponent {
  @Input() products!: Products;
}
