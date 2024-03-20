import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sucursales } from '../../../Models/sucursales';

@Component({
  selector: 'app-modifysucursalmodal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<div class="modal">
  <h2>Modificar Sucursal</h2>
  <label>Nombre:</label>
  <input type="text" value="{{ sucursal?.nombre }}" />
  <label>Dirección:</label>
  <input type="text" value="{{ sucursal?.direccion }}" />
  <label>URL de servicios:</label>
  <input type="text" value="{{ sucursal?.url }}" />
  <label>URL de imagen:</label>
  <input type="text" value="{{ sucursal?.url_imagen }}" />
  <div class="botonera">
    <button class="btn" (click)="modificarSucursal()">Modificar</button>
    <button class="btn" (click)="cerrarModal()">Cancelar</button>
  </div>
</div>
`,
  styleUrl: './modifysucursalmodal.component.css',
})
export class ModifysucursalmodalComponent {
  @Input() sucursal: Sucursales | null = null;
  @Output() modificar = new EventEmitter<Sucursales>();
  @Output() cancelar = new EventEmitter<void>();

  cerrarModal() {
    this.cancelar.emit();
  }

  modificarSucursal() {
    if (this.sucursal) {
      this.modificar.emit(this.sucursal);
    }
  }
}
