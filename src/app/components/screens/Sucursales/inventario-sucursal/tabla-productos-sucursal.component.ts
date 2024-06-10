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
      <div *ngIf="!isDataLoaded" class="spinner"></div>
      <div *ngIf="isDataLoaded" class="table-container overflow-x-auto">
        <div class="mb-4 flex justify-between" style="width: 100%">
          <form class="search-form flex flex-wrap gap-2 md:flex-nowrap w-full">
            <div class="search-input flex-grow w-full max-w-[calc(33%-0.5rem)]">
              <input
                type="text"
                placeholder="Buscar ID"
                class="w-full p-2 border rounded"
                (input)="filterByIdArticulo($event)"
              />
            </div>
            <div class="search-input flex-grow w-full max-w-[calc(33%-0.5rem)]">
              <input
                type="text"
                placeholder="Buscar clave"
                class="w-full p-2 border rounded"
                (input)="filterByClave($event)"
              />
            </div>
            <div class="search-input flex-grow w-full max-w-[calc(33%-0.5rem)]">
              <input
                type="text"
                placeholder="Buscar nombre"
                class="w-full p-2 border rounded"
                (input)="filterByNombre($event)"
              />
            </div>
          </form>
        </div>
        <div class="flex flex-col">
          <div class="overflow-x-auto">
            <div class="inline-block min-w-full py-1">
              <div class="overflow-hidden">
                <table class="min-w-full text-left text-xs font-light">
                  <thead class="border-b border-neutral-200 font-medium">
                    <tr>
                      <th
                        scope="col"
                        class="px-2 py-1"
                        (click)="ordenarPorColumna('idArticulo')"
                        [class.interactive]="columnaOrdenada === 'idArticulo'"
                      >
                        Id Artículo
                        <i
                          *ngIf="columnaOrdenada === 'idArticulo'"
                          class="arrow-icon"
                          [class.asc]="ordenAscendente"
                          [class.desc]="!ordenAscendente"
                        ></i>
                      </th>
                      <th
                        scope="col"
                        class="px-2 py-1"
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
                        class="px-2 py-1"
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
                        class="px-2 py-1"
                        (click)="ordenarPorColumna('precioVenta')"
                        [class.interactive]="columnaOrdenada === 'precioVenta'"
                      >
                        Precio
                        <i
                          *ngIf="columnaOrdenada === 'precioVenta'"
                          class="arrow-icon"
                          [class.asc]="ordenAscendente"
                          [class.desc]="!ordenAscendente"
                        ></i>
                      </th>
                      <th
                        scope="col"
                        class="px-2 py-1"
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
                    <ng-container *ngFor="let index of paginatedIndices">
                      <tr class="border-b border-neutral-200">
                        <td class="whitespace-nowrap px-2 py-1 font-medium">
                          {{ filteredProductsList[index].idArticulo }}
                        </td>
                        <td class="whitespace-nowrap px-2 py-1 font-medium">
                          {{ filteredProductsList[index].clave }}
                        </td>
                        <td class="whitespace-nowrap px-2 py-1 font-medium">
                          {{ filteredProductsList[index].nombre }}
                        </td>
                        <td class="whitespace-nowrap px-2 py-1 font-medium">
                          {{ '$' + filteredProductsList[index].precioVenta }}
                        </td>
                        <td class="whitespace-nowrap px-2 py-1 font-medium">
                          {{ filteredProductsList[index].existencia }}
                        </td>
                      </tr>
                    </ng-container>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination-controls mt-4">
          <button (click)="previousPage()" [disabled]="currentPage === 1">
            Anterior
          </button>
          <span>Página {{ currentPage }} de {{ totalPages }}</span>
          <button (click)="nextPage()" [disabled]="currentPage === totalPages">
            Siguiente
          </button>
        </div>
        <br />
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
  isDataLoaded: boolean = false;

  //PAGINACIÓN PARA QUE NO EXPLOTE
  currentPage: number = 1;
  itemsPerPage: number = 10;
  paginatedIndices: number[] = [];

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
        this.baseUrl!,
        ''
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
      this.resetFilteredProductsList();
      this.isDataLoaded = true;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  }

  private updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedIndices = this.filteredIndices.slice(startIndex, endIndex);
  }

  resetFilteredProductsList(): void {
    this.filteredIndices = Array.from(
      { length: this.filteredProductsList.length },
      (_, i) => i
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  filterByNombre(event: Event) {
    const text = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredIndices = this.productsList
      .map((product, index) => ({ product, index }))
      .filter(({ product }) => product.nombre.toLowerCase().includes(text))
      .map(({ index }) => index);
    this.currentPage = 1;
    this.updatePagination();
  }

  filterByClave(event: Event) {
    const text = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredIndices = this.productsList
      .map((product, index) => ({ product, index }))
      .filter(({ product }) => product.clave.toLowerCase().includes(text))
      .map(({ index }) => index);
    this.currentPage = 1;
    this.updatePagination();
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
    this.currentPage = 1;
    this.updatePagination();
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
    this.currentPage = 1;
    this.updatePagination();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredIndices.length / this.itemsPerPage);
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
