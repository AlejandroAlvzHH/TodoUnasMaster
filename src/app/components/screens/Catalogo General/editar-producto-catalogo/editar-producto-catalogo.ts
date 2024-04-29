import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogoGeneralService } from '../../../../core/services/Services Catalogo General/catalogo-general.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Users } from '../../../../Models/Master/users';

@Component({
  selector: 'app-editar-producto-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal">
      <div class="modal-content">
        <h2>Editar el Producto</h2>
        <div *ngIf="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
        <div *ngIf="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
        <label>Clave:</label>
        <input type="text" [(ngModel)]="clave" />
        <label>Nombre:</label>
        <input type="text" [(ngModel)]="nombre" />
        <label>Descripción:</label>
        <input type="text" [(ngModel)]="descripcion" />
        <label>Precio:</label>
        <input type="number" [(ngModel)]="precio" />
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
  currentUser?: Users | null;

  clave: string = '';
  nombre: string = '';
  descripcion: string = '';
  precio: number = 0;

  cantidad_total: number = 0;
  usuario_creador: number = 0;
  fecha_creado: Date = new Date();
  usuario_modificador: number = 0;
  fecha_modificado: Date = new Date();
  usuario_eliminador: number = 0;
  fecha_eliminado: Date = new Date();

  constructor(
    private catalogoGeneralService: CatalogoGeneralService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
    console.log(this.currentUser);
    if (this.id_producto !== null) {
      try {
        this.loading = true;
        const producto =
          await this.catalogoGeneralService.getCatalogueProductByID(
            this.id_producto
          );
        if (producto !== null) {
          this.clave = producto.clave || '';
          this.nombre = producto.nombre || '';
          this.descripcion = producto.descripcion || '';
          this.precio = producto.precio || 0;
          this.cantidad_total = producto.cantidad_total;
          this.usuario_creador = producto.usuario_creador;
          this.fecha_creado = producto.fecha_creado;
          this.usuario_modificador = producto.usuario_modificador;
          this.fecha_modificado = producto.fecha_modificado;
          this.usuario_eliminador = producto.usuario_eliminador;
          this.fecha_eliminado = producto.fecha_eliminado;
        } else {
          console.error('Producto no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      } finally {
        this.loading = false;
      }
    }
  }

  cerrarModal() {
    this.cancelar.emit();
  }

  modificarProducto() {
    Swal.fire({
      title: 'Confirmar Modificación',
      text: `¿Estás seguro de modificar el producto ${this.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5c5c5c',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar modificación',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.id_producto && this.currentUser) {
          const productoModificado = {
            id_producto: this.id_producto,
            clave: this.clave,
            nombre: this.nombre,
            descripcion: this.descripcion,
            precio: this.precio,
            cantidad_total: this.cantidad_total,
            usuario_creador: this.usuario_creador,
            fecha_creado: this.fecha_creado,
            usuario_modificador: this.currentUser?.id_usuario,
            fecha_modificado: new Date(),
            usuario_eliminador: this.usuario_eliminador,
            fecha_eliminado: this.fecha_eliminado,
          };
          console.log(
            'JSON a enviar al modificar el producto:',
            productoModificado
          );
          this.catalogoGeneralService.updateCatalogueProduct(
            productoModificado,
            this.id_producto
          );
        }
      }
    });
  }
}
