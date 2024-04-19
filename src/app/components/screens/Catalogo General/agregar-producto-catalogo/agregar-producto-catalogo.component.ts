import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { General_Catalogue } from '../../../../Models/Master/general_catalogue';

@Component({
  selector: 'app-agregar-producto-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal">
      <div class="modal-content">
        <h2>Agregar Producto al Catálogo General</h2>
        <label>Clave:</label>
        <input type="text" [(ngModel)]="nuevoProducto.clave" />
        <label>Nombre:</label>
        <input type="text" [(ngModel)]="nuevoProducto.nombre" />
        <label>Cantidad:</label>
        <input type="text" [(ngModel)]="nuevoProducto.cantidad_total" />
        <label>Precio:</label>
        <input type="text" [(ngModel)]="nuevoProducto.precio" />
        <div class="botonera">
          <button class="btn" (click)="agregarProducto()">Añadir</button>
          <button class="btn" (click)="cerrarModal()">Cancelar</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './agregar-producto-catalogo.component.css',
})
export class AgregarProductoCatalogoComponent {
  @Output() addProducto = new EventEmitter<General_Catalogue>();
  @Output() cancelar = new EventEmitter<void>();

  nuevoProducto: General_Catalogue = {
    id_producto: 0,
    clave: '',
    nombre: '',
    descripcion: '',
    cantidad_total: 0,
    precio: 0,
    usuario_creador: 0,
    fecha_creado: new Date(),
    usuario_modificador: 0,
    fecha_modificado: new Date(),
    usuario_eliminador: 0,
    fecha_eliminado: new Date(),
  };

  cerrarModal() {
    this.cancelar.emit();
  }

  agregarProducto() {
    this.addProducto.emit(this.nuevoProducto);
  }
}
