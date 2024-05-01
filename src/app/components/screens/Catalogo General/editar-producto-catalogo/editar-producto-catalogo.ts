import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogoGeneralService } from '../../../../core/services/Services Catalogo General/catalogo-general.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Users } from '../../../../Models/Master/users';
import { CatalogoSucursalService } from '../../../../core/services/Services Catalogo General/catalogo-sucursal.service';
import { ApiService } from '../../../../core/services/Services Sucursales/sucursales.service';
import { SincronizacionPendienteService } from '../../../../core/services/Services Catalogo General/sincronizacion-pendiente.service';

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
          <button class="btn-cerrar" (click)="cerrarModal()">Cerrar</button>
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
  urls: any[] = [];
  productoSucursal: any | null = null;

  //EStos se modifican
  clave: string = '';
  nombre: string = '';
  descripcion: string = '';
  precio: number = 0;
  //estos son solo para que los podamos mandar
  cantidad_total: number = 0;
  usuario_creador: number = 0;
  fecha_creado: Date = new Date();
  usuario_modificador: number = 0;
  fecha_modificado: Date = new Date();
  usuario_eliminador: number = 0;
  fecha_eliminado: Date = new Date();

  constructor(
    private catalogoGeneralService: CatalogoGeneralService,
    private authService: AuthService,
    private catalogoSucursalService: CatalogoSucursalService,
    private apiService: ApiService,
    private sincronizacionPendienteService: SincronizacionPendienteService
  ) {}

  async ngOnInit() {
    await this.apiService.getAllBranchesUrlsConStatus1().subscribe((urls) => {
      this.urls = urls;
    });
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
    console.log('El ID del usuario es: ', this.currentUser?.id_usuario);
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
        console.error('Error ONINIT:', error);
      } finally {
        this.loading = false;
      }
    }
  }

  cerrarModal() {
    this.cancelar.emit();
  }

  async modificarProducto() {
    let sucursalesFallidas: string[] = [];
    let insercionFallida = false;
    Swal.fire({
      title: 'Confirmar Modificación',
      text: `¿Estás seguro de modificar el producto ${this.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5c5c5c',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, confirmar modificación',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      this.loading = true;
      try {
        if (result.isConfirmed) {
          if (this.id_producto && this.currentUser) {
            const fechaActual = new Date();
            fechaActual.setHours(fechaActual.getHours() - 6);
            const productoModificadoMaster = {
              id_producto: this.id_producto,
              clave: this.clave,
              nombre: this.nombre,
              descripcion: this.descripcion,
              precio: this.precio,
              cantidad_total: this.cantidad_total,
              usuario_creador: this.usuario_creador,
              fecha_creado: this.fecha_creado,
              usuario_modificador: this.currentUser?.id_usuario,
              fecha_modificado: fechaActual,
              usuario_eliminador: this.usuario_eliminador,
              fecha_eliminado: this.fecha_eliminado,
            };
            await Promise.all(
              this.urls.map(async (sucursal) => {
                console.log('Se insertará modificación en: ', sucursal.url);
                if (this.id_producto) {
                  try {
                    this.productoSucursal =
                      await this.catalogoSucursalService.getProductById(
                        sucursal.url,
                        this.id_producto
                      );
                    if (this.productoSucursal) {
                      const productoModificadoSucursal = {
                        idArticulo: this.id_producto,
                        clave: this.clave,
                        nombre: this.nombre,
                        precioVenta: this.precio,
                        precioCompra: 0,
                        unidadVenta: '',
                        unidadCompra: '',
                        relacion: 0,
                        idImp1: 0,
                        idImp2: 0,
                        idRet1: 0,
                        idRet2: 0,
                        existencia: this.productoSucursal.existencia,
                        observaciones: this.descripcion,
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
                      await this.catalogoSucursalService
                        .updateProductoSucursal(
                          sucursal.url,
                          this.id_producto,
                          productoModificadoSucursal
                        )
                        .then(() => {
                          console.log(
                            'Se logró insertar en: ',
                            sucursal.idSucursal
                          );
                        })
                        .catch((error) => {
                          console.log(
                            'No se logró insertar. :( ->',
                            sucursal.idSucursal
                          );
                        });
                    } else {
                      //ESTO ES PARA SI ESTÁ ONLINE, PERO NO EXISTE EL PRODUCTO
                      console.log('El producto no fue encontrado');
                    }
                  } catch (error) {
                    console.error('Error al obtener el producto:', error);
                    sucursalesFallidas.push(sucursal.nombre);
                    console.log(sucursalesFallidas);
                    console.log(sucursal.idSucursal,
                      this.id_producto,
                      '')
                    this.registrarFalloSincronizacion(
                      sucursal.idSucursal,
                      this.id_producto,
                      'error'
                    );
                  }
                }
              })
            );
            console.log(
              'JSON que se envía a Master para modificar el producto:',
              productoModificadoMaster
            );
            this.catalogoGeneralService.updateCatalogueProduct(
              productoModificadoMaster,
              this.id_producto
            );
          }
          if (insercionFallida) {
            console.log('Hubo una o más inserciones fallidas.');
          } else {
            Swal.fire({
              title: 'Modificación exitosa en catálogo general.',
              icon: 'success',
              confirmButtonColor: '#5c5c5c',
              confirmButtonText: 'Aceptar',
            }).then((result) => {
              if (result.isConfirmed) {
                this.loading = false;
                if (sucursalesFallidas.length > 0) {
                  let mensaje =
                    'No se logró insertar en las siguientes sucursales:\n';
                  sucursalesFallidas.forEach((sucursal) => {
                    mensaje += sucursal + '\n';
                  });
                  Swal.fire({
                    title: 'Error al insertar en sucursales',
                    text: mensaje,
                    icon: 'error',
                    confirmButtonColor: '#5c5c5c',
                    confirmButtonText: 'Aceptar',
                  }).then(() => {
                    this.cerrarModal();
                    window.location.reload();
                  });
                } else {
                  this.cerrarModal();
                  window.location.reload();
                }
              }
            });
          }
          return;
        }
      } catch (error) {
        Swal.fire({
          title:
            'Error durante la modificación, intente de nuevo más tarde por favor.',
          icon: 'error',
          confirmButtonColor: '#5c5c5c',
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading = false;
          }
        });
        return;
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
}
