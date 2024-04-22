import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { General_Catalogue } from '../../../../Models/Master/general_catalogue';
import Swal from 'sweetalert2';
import { CatalogoSucursalService } from '../../../../core/services/Services Catalogo General/catalogo-sucursal';
import { Products } from '../../../../Models/Factuprint/products';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { SincronizacionPendienteService } from '../../../../core/services/Services Catalogo General/sincronizacion-pendiente.service';

@Component({
  selector: 'app-agregar-producto-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal">
      <div class="modal-content">
        <h2>Agregar Producto al Catálogo General</h2>
        <div *ngIf="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
        <label>ID del Producto:</label>
        <input type="text" [(ngModel)]="nuevoProducto.id_producto" />
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
  sucursales: any[] = [];
  loading: boolean = false;

  ngOnInit(): void {
    this.apiService.getAllBranchesUrlsConStatus1().subscribe((sucursales) => {
      this.sucursales = sucursales.map((sucursal) => ({
        url: sucursal.url,
        idSucursal: sucursal.idSucursal,
        nombre: sucursal.nombre,
      }));
    });
  }

  constructor(
    private catalogoSucursalService: CatalogoSucursalService,
    private apiService: ApiService,
    private sincronizacionPendienteService: SincronizacionPendienteService
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
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar registro',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'swal2-container',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.addProducto.emit(this.nuevoProducto);
        const requests = this.sucursales.map((sucursal) => {
          const productoSucursal = this.mapToProductsModel(this.nuevoProducto);
          return this.catalogoSucursalService
            .agregarProductoSucursal(sucursal.url, productoSucursal)
            .toPromise()
            .then(() => ({ success: true, sucursalNombre: sucursal.nombre }))
            .catch((error: any) => {
              this.registrarFalloSincronizacion(
                sucursal.idSucursal,
                productoSucursal.idArticulo,
                error.message
              );
              return { success: false, sucursalNombre: sucursal.nombre };
            });
        });
        Promise.all(requests).then((results) => {
          const errores = results.filter((result) => !result.success);
          if (errores.length > 0) {
            const mensaje = errores
              .map(
                (error) =>
                  `Error al agregar producto en la sucursal: ${error.sucursalNombre}`
              )
              .join('\n');
            console.error(mensaje);
            Swal.fire({
              title: 'Error',
              text: mensaje,
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK',
              customClass: {
                container: 'swal2-container',
              },
            });
          } else {
            console.log('Todos los productos agregados correctamente.');
            Swal.fire({
              title: 'Éxito',
              text: 'Todos los productos se agregaron correctamente en las sucursales.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK',
              customClass: {
                container: 'swal2-container',
              },
            });
          }
          this.loading = false;
          this.cerrarModal();
        });
      }
    });
  }


  registrarFalloSincronizacion(
    idSucursal: number,
    id_producto: number,
    mensaje: string
  ) {
    const fechaActual = new Date();
    fechaActual.setHours(fechaActual.getHours() - 6);
    const body = {
      id_producto: id_producto,
      id_sucursal: idSucursal,
      fecha_registro: fechaActual,
      estado: 'Sincronización Pendiente',
      mensaje_error: mensaje,
    };
    this.sincronizacionPendienteService
      .registrarFalloSincronizacion(body)
      .subscribe(
        () => {
          console.log(
            'Fallo registrado en la tabla de sincronización pendiente.'
          );
        },
        (error: any) => {
          console.error(
            'Error al registrar fallo en la tabla de sincronización pendiente',
            error
          );
        }
      );
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
