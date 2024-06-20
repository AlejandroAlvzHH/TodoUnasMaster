import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarritoServiceService } from '../../../core/services/Services Sucursales/carrito-service.service';
import { CarritoComunicationService } from '../../../core/services/Services Sucursales/Entradas y Salidas/carrito-comunication.service';

@Component({
  selector: 'app-tabla-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="table-container overflow-x-auto">
      <button class="btn" (click)="cerrarModal()">Cerrar</button>
      <div class="flex flex-col">
        <div class="overflow-x-auto">
          <div class="inline-block min-w-full py-1">
            <div class="overflow-hidden">
              <table class="min-w-full text-left text-xs font-light">
                <thead class="border-b border-neutral-200 font-medium">
                  <tr>
                    <th scope="col" class="px-2 py-1">ID Artículo</th>
                    <th scope="col" class="px-2 py-1">Clave</th>
                    <th scope="col" class="px-2 py-1">Nombre</th>
                    <th scope="col" class="px-2 py-1">Precio</th>
                    <th scope="col" class="px-2 py-1">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="let item of items; let i = index"
                    class="border-b border-neutral-200"
                  >
                    <td class="whitespace-nowrap px-2 py-1 font-medium">
                      {{ item.idArticulo }}
                    </td>
                    <td class="whitespace-nowrap px-2 py-1 font-medium">
                      {{ item.clave }}
                    </td>
                    <td class="whitespace-nowrap px-2 py-1 font-medium">
                      {{ item.nombre }}
                    </td>
                    <td class="whitespace-nowrap px-2 py-1 font-medium">
                      {{ '$' + item.precioVenta * item.cantidad }}
                    </td>
                    <td class="whitespace-nowrap px-2 py-1 font-medium">
                      <input
                        type="number"
                        [min]="1"
                        [max]="item.existencia"
                        [(ngModel)]="item.cantidad"
                        (input)="validarCantidad($event, item)"
                        class="quantity-input"
                      />
                      <button class="btn" (click)="eliminarItem(i)">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
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
    if (this.isSalida) {
      if (newValue > item.existencia) {
        item.cantidad = item.existencia;
        event.target.value = item.existencia;
      } else {
        item.cantidad = newValue;
      }
    }
  }

  eliminarItem(index: number) {
    console.log(this.items[index])
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
