import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiService } from '../../core/services/Services Catalogo General/api.service';
import { Products } from '../../Models/Factuprint/products';
import { CarritoServiceService } from '../../core/services/Services Sucursales/carrito-service.service';
import { ProductListItem } from '../../Models/Master/product_list_item';
import { CarritoComunicationService } from '../../core/services/Services Sucursales/Entradas y Salidas/carrito-comunication.service';

@Component({
  selector: 'app-tabla-productos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <form class="search-form">
        <div class="search-input">
          <input
            type="text"
            placeholder="Buscar por ID de artículo"
            (input)="filterByIdArticulo($event)"
          />
        </div>
        <div class="search-input">
          <input
            type="text"
            placeholder="Buscar por clave"
            (input)="filterByClave($event)"
          />
        </div>
        <div class="search-input">
          <input
            type="text"
            placeholder="Buscar por nombre"
            (input)="filterResults($event)"
          />
        </div>
      </form>
      <div>
        <table border="2">
          <thead>
            <tr>
              <th
                scope="col"
                (click)="ordenarPorColumna('idArticulo')"
                [class.interactive]="columnaOrdenada === 'idArticulo'"
              >
                Id_Artículo
                <i
                  *ngIf="columnaOrdenada === 'idArticulo'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('clave')"
                [class.interactive]="columnaOrdenada === 'clave'"
              >
                Clave
                <i
                  *ngIf="columnaOrdenada === 'clave'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('nombre')"
                [class.interactive]="columnaOrdenada === 'nombre'"
              >
                Nombre
                <i
                  *ngIf="columnaOrdenada === 'nombre'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
              <th
                scope="col"
                (click)="ordenarPorColumna('existencia')"
                [class.interactive]="columnaOrdenada === 'existencia'"
              >
                Existencia
                <i
                  *ngIf="columnaOrdenada === 'existencia'"
                  class="arrow-icon"
                  [class.asc]="ordenAscendente"
                  [class.desc]="!ordenAscendente"
                ></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredProductsList">
              <td>{{ item.idArticulo }}</td>
              <td>{{ item.clave }}</td>
              <td>{{ item.nombre }}</td>
              <td>
                {{ item.existencia }}
                <button
                  class="btn"
                  [disabled]="item.botonDesactivado"
                  (click)="agregarAlCarrito(item)"
                >
                  {{ item.enCarrito ? 'Agregado' : 'Agregar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrl: './tabla-productos.component.css',
})
export class TablaProductosComponent {
  productsList: Products[] = [];
  apiService: ApiService = inject(ApiService);
  filteredProductsList: ProductListItem[] = [];
  columnaOrdenada: keyof Products | null = null;
  ordenAscendente: boolean = true;
  botonDesactivado: boolean = false;

  constructor(
    private carritoService: CarritoServiceService,
    private carritoCommunicationService: CarritoComunicationService
  ) {
    this.apiService.getAllProducts().then((productsList: Products[]) => {
      this.productsList = productsList;
      this.carritoCommunicationService.itemRemoved$.subscribe((idArticulo) => {
        const indexInFilteredProductsList = this.filteredProductsList.findIndex(
          (product) => product.idArticulo === idArticulo
        );
        if (indexInFilteredProductsList !== -1) {
          this.filteredProductsList[indexInFilteredProductsList].enCarrito =
            false;
          this.filteredProductsList[
            indexInFilteredProductsList
          ].botonDesactivado = false;
        }
      });
      this.filteredProductsList = productsList.map((product) => ({
        idArticulo: product.idArticulo,
        clave: product.clave,
        nombre: product.nombre,
        precioVenta: product.precioVenta,
        precioCompra: product.precioCompra,
        unidadVenta: product.unidadVenta,
        unidadCompra: product.unidadCompra,
        relacion: product.relacion,
        idImp1: product.idImp1,
        idImp2: product.idImp2,
        idRet1: product.idRet1,
        idRet2: product.idRet2,
        existencia: product.existencia,
        observaciones: product.observaciones,
        neto: product.neto,
        netoC: product.netoC,
        inventariable: product.inventariable,
        costo: product.costo,
        lotes: product.lotes,
        series: product.series,
        precioSug: product.precioSug,
        oferta: product.oferta,
        promocion: product.promocion,
        impCig: product.impCig,
        color: product.color,
        precioLista: product.precioLista,
        condiciones: product.condiciones,
        utilidad: product.utilidad,
        alterna: product.alterna,
        kit: product.kit,
        dpc: product.dpc,
        dpv: product.dpv,
        reorden: product.reorden,
        maximo: product.maximo,
        kitSuelto: product.kitSuelto,
        idClaseMultiple: product.idClaseMultiple,
        prcFix: product.prcFix,
        localiza: product.localiza,
        enCarrito: false,
        botonDesactivado: false,
      }));
    });
  }

  agregarAlCarrito(item: ProductListItem) {
    const index = this.filteredProductsList.findIndex(
      (listItem) => listItem.idArticulo === item.idArticulo
    );
    if (index !== -1) {
      this.filteredProductsList[index].enCarrito = true;
      this.filteredProductsList[index].botonDesactivado = true;
    }
    this.carritoService.agregarItem({ ...item, cantidad: 1 });
    console.log('Se agregó al carrito. :)');
  }

  filterResults(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.filteredProductsList = this.productsList
      .filter((product) =>
        product.nombre.toLowerCase().includes(text.toLowerCase())
      )
      .map((product) => ({
        idArticulo: product.idArticulo,
        clave: product.clave,
        nombre: product.nombre,
        precioVenta: product.precioVenta,
        precioCompra: product.precioCompra,
        unidadVenta: product.unidadVenta,
        unidadCompra: product.unidadCompra,
        relacion: product.relacion,
        idImp1: product.idImp1,
        idImp2: product.idImp2,
        idRet1: product.idRet1,
        idRet2: product.idRet2,
        existencia: product.existencia,
        observaciones: product.observaciones,
        neto: product.neto,
        netoC: product.netoC,
        inventariable: product.inventariable,
        costo: product.costo,
        lotes: product.lotes,
        series: product.series,
        precioSug: product.precioSug,
        oferta: product.oferta,
        promocion: product.promocion,
        impCig: product.impCig,
        color: product.color,
        precioLista: product.precioLista,
        condiciones: product.condiciones,
        utilidad: product.utilidad,
        alterna: product.alterna,
        kit: product.kit,
        dpc: product.dpc,
        dpv: product.dpv,
        reorden: product.reorden,
        maximo: product.maximo,
        kitSuelto: product.kitSuelto,
        idClaseMultiple: product.idClaseMultiple,
        prcFix: product.prcFix,
        localiza: product.localiza,
        enCarrito: false,
        botonDesactivado: false,
      }));
  }

  filterByClave(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    this.filteredProductsList = this.productsList
      .filter((product) =>
        product.clave.toLowerCase().includes(text.toLowerCase())
      )
      .map((product) => ({
        idArticulo: product.idArticulo,
        clave: product.clave,
        nombre: product.nombre,
        precioVenta: product.precioVenta,
        precioCompra: product.precioCompra,
        unidadVenta: product.unidadVenta,
        unidadCompra: product.unidadCompra,
        relacion: product.relacion,
        idImp1: product.idImp1,
        idImp2: product.idImp2,
        idRet1: product.idRet1,
        idRet2: product.idRet2,
        existencia: product.existencia,
        observaciones: product.observaciones,
        neto: product.neto,
        netoC: product.netoC,
        inventariable: product.inventariable,
        costo: product.costo,
        lotes: product.lotes,
        series: product.series,
        precioSug: product.precioSug,
        oferta: product.oferta,
        promocion: product.promocion,
        impCig: product.impCig,
        color: product.color,
        precioLista: product.precioLista,
        condiciones: product.condiciones,
        utilidad: product.utilidad,
        alterna: product.alterna,
        kit: product.kit,
        dpc: product.dpc,
        dpv: product.dpv,
        reorden: product.reorden,
        maximo: product.maximo,
        kitSuelto: product.kitSuelto,
        idClaseMultiple: product.idClaseMultiple,
        prcFix: product.prcFix,
        localiza: product.localiza,
        enCarrito: false,
        botonDesactivado: false,
      }));
  }

  filterByIdArticulo(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    const idArticulo = parseInt(text, 10);
    this.filteredProductsList = this.productsList
      .filter((product) => product.idArticulo === idArticulo)
      .map((product) => ({
        idArticulo: product.idArticulo,
        clave: product.clave,
        nombre: product.nombre,
        precioVenta: product.precioVenta,
        precioCompra: product.precioCompra,
        unidadVenta: product.unidadVenta,
        unidadCompra: product.unidadCompra,
        relacion: product.relacion,
        idImp1: product.idImp1,
        idImp2: product.idImp2,
        idRet1: product.idRet1,
        idRet2: product.idRet2,
        existencia: product.existencia,
        observaciones: product.observaciones,
        neto: product.neto,
        netoC: product.netoC,
        inventariable: product.inventariable,
        costo: product.costo,
        lotes: product.lotes,
        series: product.series,
        precioSug: product.precioSug,
        oferta: product.oferta,
        promocion: product.promocion,
        impCig: product.impCig,
        color: product.color,
        precioLista: product.precioLista,
        condiciones: product.condiciones,
        utilidad: product.utilidad,
        alterna: product.alterna,
        kit: product.kit,
        dpc: product.dpc,
        dpv: product.dpv,
        reorden: product.reorden,
        maximo: product.maximo,
        kitSuelto: product.kitSuelto,
        idClaseMultiple: product.idClaseMultiple,
        prcFix: product.prcFix,
        localiza: product.localiza,
        enCarrito: false,
        botonDesactivado: false,
      }));
  }

  ordenarPorColumna(columna: keyof Products) {
    if (this.columnaOrdenada === columna) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.columnaOrdenada = columna;
      this.ordenAscendente = true;
    }
    this.filteredProductsList.sort((a, b) => {
      if (this.columnaOrdenada === null) {
        return 0;
      }
      if (a[this.columnaOrdenada] > b[this.columnaOrdenada]) {
        return this.ordenAscendente ? 1 : -1;
      } else if (a[this.columnaOrdenada] < b[this.columnaOrdenada]) {
        return this.ordenAscendente ? -1 : 1;
      } else {
        return 0;
      }
    });
  }
}
