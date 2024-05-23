import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { General_Catalogue } from '../../../../Models/Master/general_catalogue';
import Swal from 'sweetalert2';
import { CatalogoSucursalService } from '../../../../core/services/Services Catalogo General/catalogo-sucursal.service';
import { Products } from '../../../../Models/Factuprint/products';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { SincronizacionPendienteService } from '../../../../core/services/Services Catalogo General/sincronizacion-pendiente.service';
import { InventarioApiService } from '../../../../core/services/inventario-api.service';
import { CatalogoGeneralService } from '../../../../core/services/Services Catalogo General/catalogo-general.service';

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
        <input
          type="number"
          [(ngModel)]="nuevoProducto.id_producto"
          (blur)="checkID()"
          (input)="validateID($event)"
        />
        <label>Clave:</label>
        <input type="text" [(ngModel)]="nuevoProducto.clave" />
        <label>Nombre:</label>
        <input type="text" [(ngModel)]="nuevoProducto.nombre" />
        <label>Descripción:</label>
        <input type="text" [(ngModel)]="nuevoProducto.descripcion" />
        <label>Precio:</label>
        <input
          type="number"
          [(ngModel)]="nuevoProducto.precio"
          (blur)="checkPrecio()"
          (input)="validatePrecio($event)"
        />
        <div class="botonera">
          <button class="btn" (click)="agregarProducto()">Añadir</button>
          <button class="btn-cerrar" (click)="cerrarModal()">Cancelar</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './agregar-producto-catalogo.component.css',
})
export class AgregarProductoCatalogoComponent {
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
    private sincronizacionPendienteService: SincronizacionPendienteService,
    private inventarioApiService: InventarioApiService,
    private catalogoGeneralService: CatalogoGeneralService
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

  agregarProducto(): void {
    if (this.nuevoProducto.id_producto == 0) {
      Swal.fire({
        title: 'ID no modificado',
        text: 'Por favor recuerde ingresar un ID válido.',
        icon: 'warning',
        confirmButtonColor: '#5c5c5c',
        confirmButtonText: 'Aceptar',
      });
      return;
    } else if (
      this.nuevoProducto.clave == '' ||
      this.nuevoProducto.nombre == '' ||
      this.nuevoProducto.descripcion == ''
    ) {
      Swal.fire({
        title: 'Campos Vacíos',
        text: 'Por favor rellene todos los campos para agregar el nuevo producto.',
        icon: 'warning',
        confirmButtonColor: '#333333',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    Swal.fire({
      title: 'Confirmar Registro',
      text: `¿Estás seguro de registrar el nuevo producto ${this.nuevoProducto?.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar registro',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.catalogoGeneralService
          .addCatalogueProduct(this.nuevoProducto)
          .then((success) => {
            console.log('Éxito al agregar el producto:', success);
          })
          .catch((error) => {
            console.error('Error al agregar el producto:', error);
          });
        const requests = this.sucursales.map((sucursal) => {
          const productoSucursal = this.mapToProductsModel(this.nuevoProducto);
          return this.catalogoSucursalService
            .agregarProductoSucursal(sucursal.url, productoSucursal)
            .toPromise()
            .then(() => {
              const inventory = {
                id_sucursal: sucursal.idSucursal,
                id_producto: this.nuevoProducto.id_producto,
                cantidad: 0,
              };
              console.log(inventory);
              this.inventarioApiService.postInventory(inventory).subscribe();
              this.registrarFalloSincronizacion(
                sucursal.idSucursal,
                productoSucursal.idArticulo,
                ''
              );
              return { success: true, sucursalNombre: sucursal.nombre };
            })
            .catch((error: any) => {
              const inventory = {
                id_sucursal: sucursal.idSucursal,
                id_producto: this.nuevoProducto.id_producto,
                cantidad: 0,
              };
              console.log(inventory);
              this.inventarioApiService.postInventory(inventory).subscribe();
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
            Swal.fire({
              title: 'Error',
              text: mensaje,
              icon: 'error',
              confirmButtonColor: '#333333',
              confirmButtonText: 'OK',
              customClass: {
                container: 'swal2-container',
              },
            }).then((result) => {
              this.loading = false;
              this.cerrarModal();
              window.location.reload();
            });
          } else {
            Swal.fire({
              title: 'Éxito',
              text: 'Todos los productos se agregaron correctamente en las sucursales.',
              icon: 'success',
              confirmButtonColor: '#333333',
              confirmButtonText: 'OK',
              customClass: {
                container: 'swal2-container',
              },
            }).then((result) => {
              this.loading = false;
              this.cerrarModal();
              window.location.reload();
            });
          }
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
    let body: any;
    if (mensaje !== '') {
      body = {
        id_producto: id_producto,
        id_sucursal: idSucursal,
        fecha_registro: fechaActual,
        estado: 'PENDIENTE',
        mensaje_error: mensaje,
      };
    } else {
      body = {
        id_producto: id_producto,
        id_sucursal: idSucursal,
        fecha_registro: fechaActual,
        estado: 'SINCRONIZADO',
        mensaje_error: mensaje,
      };
    }
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
      existencia: 0,
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

  validateID(event: any) {
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
      this.nuevoProducto.id_producto = 0;
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

  checkID() {
    if (
      this.nuevoProducto.id_producto === null ||
      this.nuevoProducto.id_producto === undefined
    ) {
      this.nuevoProducto.id_producto = 0;
    }
  }
}
