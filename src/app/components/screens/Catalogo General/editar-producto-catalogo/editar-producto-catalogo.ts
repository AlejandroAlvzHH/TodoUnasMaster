import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-editar-producto-catalogo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal">
      <div class="modal-content">
        <h2>Editar el producto</h2>
        <div *ngIf="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
        <h2>Agregar Producto al Catálogo General</h2>
        <div *ngIf="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
        <label>ID del Producto:</label>
        <input type="number" />
        <label>Clave:</label>
        <input type="text" />
        <label>Nombre:</label>
        <input type="text" />
        <label>Descripción:</label>
        <input type="text" />
        <label>Cantidad:</label>
        <input type="number" />
        <label>Precio:</label>
        <input type="number" />
        <div class="botonera">
          <button class="btn" (click)="modificarProducto()">
            Modificar Producto
          </button>
          <button class="btn" (click)="cerrarModal()">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './editar-producto-catalogo.css',
})
export class EditarProductoCatalogoComponent {
  @Input() id_producto: number | null = null;
  loading: boolean = false;
  @Output() cancelar = new EventEmitter<void>();

  cerrarModal() {
    this.cancelar.emit();
  }

  modificarProducto() {}
}
