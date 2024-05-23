import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CatalogoSucursalService } from '../../../../core/services/Services Catalogo General/catalogo-sucursal.service';
import { Products } from '../../../../Models/Factuprint/products';
import { ProductListItem } from '../../../../Models/Master/product_list_item';

@Component({
  selector: 'app-tabla-productos-sucursal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <br />
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
      <div class="table-container">
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
            <ng-container *ngFor="let index of filteredIndices">
              <tr>
                <td>{{ filteredProductsList[index].idArticulo }}</td>
                <td>{{ filteredProductsList[index].clave }}</td>
                <td>{{ filteredProductsList[index].nombre }}</td>
                <td>
                  {{ filteredProductsList[index].existencia }}
                </td>
              </tr>
            </ng-container>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrl: './tabla-productos-sucursal.component.css',
})
export class TablaProductosSucursalComponent {
  private _baseUrl?: string;

  productsList: Products[] = [];
  filteredProductsList: ProductListItem[] = [];
  filteredIndices: number[] = [];
  columnaOrdenada: keyof Products | null = null;
  ordenAscendente: boolean = true;

  constructor(
    private catalogoSucursalService: CatalogoSucursalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.baseUrl) {
      this.initialize();
    }
  }

  private async initialize() {
    try {
      this.productsList = await this.catalogoSucursalService.getAllProducts(
        this.baseUrl!, ''
      );
      this.filteredProductsList = this.productsList.map((product) => ({
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
      this.filteredIndices = Array.from(
        { length: this.filteredProductsList.length },
        (_, i) => i
      );
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  }

  resetFilteredProductsList(): void {
    this.filteredProductsList = this.productsList.map((product) => ({
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
    this.filteredIndices = Array.from(
      { length: this.filteredProductsList.length },
      (_, i) => i
    );
  }

  filterResults(event: Event) {
    const text = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredIndices = this.productsList
      .map((product, index) => ({ product, index }))
      .filter(({ product }) => product.nombre.toLowerCase().includes(text))
      .map(({ index }) => index);
  }

  filterByClave(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredIndices = this.productsList
      .map((product, index) => ({ product, index }))
      .filter(({ product }) => product.clave.toLowerCase().includes(text))
      .map(({ index }) => index);
  }

  filterByIdArticulo(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim();
    if (text === '') {
      this.filteredIndices = Array.from(
        { length: this.productsList.length },
        (_, i) => i
      );
    } else {
      const idArticulo = parseInt(text, 10);
      this.filteredIndices = this.productsList
        .map((product, index) => ({ product, index }))
        .filter(({ product }) => product.idArticulo === idArticulo)
        .map(({ index }) => index);
    }
  }

  ordenarPorColumna(columna: keyof Products) {
    if (this.columnaOrdenada === columna) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.columnaOrdenada = columna;
      this.ordenAscendente = true;
    }
    this.filteredIndices.sort((a, b) => {
      const productA = this.filteredProductsList[a];
      const productB = this.filteredProductsList[b];
      if (this.columnaOrdenada === null) {
        return 0;
      }
      if (productA[this.columnaOrdenada] > productB[this.columnaOrdenada]) {
        return this.ordenAscendente ? 1 : -1;
      } else if (
        productA[this.columnaOrdenada] < productB[this.columnaOrdenada]
      ) {
        return this.ordenAscendente ? -1 : 1;
      } else {
        return 0;
      }
    });
  }

  @Input()
  set baseUrl(value: string | undefined) {
    this._baseUrl = value;
    if (value) {
      this.initialize();
    }
  }

  get baseUrl(): string | undefined {
    return this._baseUrl;
  }
}
