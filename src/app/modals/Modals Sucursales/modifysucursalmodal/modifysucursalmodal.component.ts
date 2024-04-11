import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Branches } from '../../../Models/Master/branches';

@Component({
  selector: 'app-modifysucursalmodal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<div class="modal">
    <div class="modal-content">
      <h2>Modificar Sucursal</h2>
      <label>Nombre:</label>
      <input type="text" [(ngModel)]="nombre" />
      <label>Dirección:</label>
      <input type="text" [(ngModel)]="direccion" />
      <label>URL de servicios:</label>
      <input type="text" [(ngModel)]="url" />
      <label>URL de imagen:</label>
      <input type="text" [(ngModel)]="url_imagen" />
      <div class="botonera">
        <button class="btn" (click)="modificarSucursal()">Modificar</button>
        <button class="btn" (click)="cerrarModal()">Cancelar</button>
      </div>
    </div>
  </div> `,
  styleUrl: './modifysucursalmodal.component.css',
})
export class ModifysucursalmodalComponent {
  @Input() sucursal: Branches | null = null;
  @Output() modificar = new EventEmitter<Branches>();
  @Output() cancelar = new EventEmitter<void>();

  nombre: string = '';
  direccion: string = '';
  url: string = '';
  url_imagen: string = '';

  ngOnChanges() {
    if (this.sucursal) {
      this.nombre = this.sucursal.nombre || '';
      this.direccion = this.sucursal.direccion || '';
      this.url = this.sucursal.url || '';
      this.url_imagen = this.sucursal.url_imagen || '';
    }
  }

  cerrarModal() {
    this.cancelar.emit();
  }

  modificarSucursal() {
    if (this.sucursal) {
      const sucursalModificada: Branches = {
        ...this.sucursal,
        nombre: this.nombre,
        direccion: this.direccion,
        url: this.url,
        url_imagen: this.url_imagen,
      };
      this.modificar.emit(sucursalModificada);
    }
  }
}
