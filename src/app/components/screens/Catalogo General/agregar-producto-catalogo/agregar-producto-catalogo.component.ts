import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { General_Catalogue } from '../../../../Models/Master/general_catalogue';
import Swal from 'sweetalert2';
import { CatalogoSucursalService } from '../../../../core/services/Services Catalogo General/catalogo-sucursal';
import { Products } from '../../../../Models/Factuprint/products';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';

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
        <label>Descripción:</label>
        <input type="text" [(ngModel)]="nuevoProducto.descripcion" />
        <label>Cantidad:</label>
        <input
          type="number"
          [(ngModel)]="nuevoProducto.cantidad_total"
          (blur)="checkCantidad()"
          (input)="validateCantidad($event)"
        />
        <label>Precio:</label>
        <input
          type="number"
          [(ngModel)]="nuevoProducto.precio"
          (blur)="checkPrecio()"
          (input)="validatePrecio($event)"
        />
        <div class="botonera">
          <button
            class="btn"
            (click)="agregarProducto()"
            [disabled]="!isValid()"
          >
            Añadir
          </button>
          <button
            class="btn"
            (click)="cerrarModal()"
            (input)="validateCantidad($event)"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './agregar-producto-catalogo.component.css',
})
export class AgregarProductoCatalogoComponent {
  @Output() addProducto = new EventEmitter<General_Catalogue>();
  @Output() cancelar = new EventEmitter<void>();
  urls: string[] = [];

  ngOnInit(): void {
    this.apiService.getAllBranchesUrlsConStatus1().subscribe((urls) => {
      this.urls = urls;
    });
  }

  constructor(
    private catalogoSucursalService: CatalogoSucursalService,
    private apiService: ApiService
  ) {}

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
    Swal.fire({
      title: 'Confirmar Traspaso',
      text: `¿Estás seguro de registrar el nuevo producto ${this.nuevoProducto?.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar registro',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'swal2-container',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.urls.forEach((url) => {
          const productoSucursal = this.mapToProductsModel(this.nuevoProducto);
          this.catalogoSucursalService
            .agregarProductoSucursal(url, productoSucursal)
            .subscribe(
              () => {
                console.log(
                  `Producto insertado en la sucursal con URL: ${url}`
                );
              },
              (error: any) => {
                console.error(
                  `Error al insertar producto en la sucursal con URL: ${url}`,
                  error
                );
                Swal.fire({
                  title: 'Error',
                  text: `Error al insertar producto en la sucursal con URL: ${url}`,
                  icon: 'error',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK',
                  customClass: {
                    container: 'swal2-container',
                  },
                });
              }
            );
        });
        this.addProducto.emit(this.nuevoProducto);
      }
    });
  }

  mapToProductsModel(generalCatalogueData: General_Catalogue): Products {
    return {
      idArticulo: generalCatalogueData.id_producto,
      clave: generalCatalogueData.clave,
      nombre: generalCatalogueData.nombre,
      precioVenta: generalCatalogueData.precio,
      precioCompra: 0,
      unidadVenta: '',
      unidadCompra: '',
      relacion: 0,
      idImp1: 0,
      idImp2: 0,
      idRet1: 0,
      idRet2: 0,
      existencia: generalCatalogueData.cantidad_total,
      observaciones: generalCatalogueData.descripcion,
      neto: 0,
      netoC: 0,
      inventariable: 0,
      costo: 0,
      lotes: 0,
      series: 0,
      precioSug: 0,
      oferta: '',
      promocion: '',
      impCig: 0,
      color: 0,
      precioLista: 0,
      condiciones: '',
      utilidad: 0,
      alterna: '',
      kit: 0,
      dpc: 0,
      dpv: 0,
      reorden: 0,
      maximo: 0,
      kitSuelto: 0,
      idClaseMultiple: 0,
      prcFix: 0,
      localiza: '',
    };
  }

  isValid(): boolean {
    return this.nuevoProducto.cantidad_total > 0;
  }

  validateCantidad(event: any) {
    let input = event.target.value;
    input = input.replace(/[^0-9.]/g, '');
    const decimalCount = (input.match(/\./g) || []).length;
    if (decimalCount > 1) {
      input = input.slice(0, input.lastIndexOf('.'));
    }
    event.target.value = input;
    const value = parseFloat(input);
    if (isNaN(value) || value < 0) {
      event.target.value = '0';
      this.nuevoProducto.cantidad_total = 0;
    }
  }

  validatePrecio(event: any) {
    let input = event.target.value;
    input = input.replace(/[^0-9.]/g, '');
    const decimalCount = (input.match(/\./g) || []).length;
    if (decimalCount > 1) {
      input = input.slice(0, input.lastIndexOf('.'));
    }
    event.target.value = input;
    const value = parseFloat(input);
    if (isNaN(value) || value < 0) {
      event.target.value = '0';
      this.nuevoProducto.precio = 0;
    }
  }

  checkCantidad() {
    if (
      this.nuevoProducto.cantidad_total === null ||
      this.nuevoProducto.cantidad_total === undefined
    ) {
      this.nuevoProducto.cantidad_total = 0;
    }
  }

  checkPrecio() {
    if (
      this.nuevoProducto.precio === null ||
      this.nuevoProducto.precio === undefined
    ) {
      this.nuevoProducto.precio = 0;
    }
  }
}
