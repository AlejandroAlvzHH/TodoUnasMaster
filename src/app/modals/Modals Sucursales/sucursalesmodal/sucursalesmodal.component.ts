import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Branches } from '../../../Models/Master/branches';

@Component({
  selector: 'app-sucursalesmodal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<div class="modal">
    <h2>Agregar Sucursal</h2>
    <label>Nombre:</label>
    <input type="text" [(ngModel)]="nuevaSucursal.nombre" />
    <label>Dirección:</label>
    <input type="text" [(ngModel)]="nuevaSucursal.direccion" />
    <label>URL de servicios:</label>
    <input type="text" [(ngModel)]="nuevaSucursal.url" />
    <label>URL de imagen:</label>
    <input type="text" [(ngModel)]="nuevaSucursal.url_imagen" />
    <div class="botonera">
      <button class="btn" (click)="agregarSucursal()">Añadir</button>
      <button class="btn" (click)="cerrarModal()">Cancelar</button>
    </div>
  </div>`,
  styleUrl: './sucursalesmodal.component.css',
})
export class SucursalesmodalComponent {
  @Output() addSucursal = new EventEmitter<Branches>();
  @Output() cancelar = new EventEmitter<void>();
  nuevaSucursal: Branches = {
    idSucursal: 0,
    nombre: '',
    estado: 'Online 🟢',
    fechaActualizacion: new Date(),
    direccion: '',
    url: '',
    usuarioCreador: 0,
    fechaCreado: new Date(),
    usuarioModificador: 0,
    fechaModificado: new Date(),
    usuarioEliminador: 0,
    fechaEliminado: new Date(),
    url_imagen: '',
    status: 1,
  };

  cerrarModal() {
    this.cancelar.emit();
  }

  agregarSucursal() {
    this.addSucursal.emit(this.nuevaSucursal);
  }
}
