import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarritoServiceService {
  private itemsSubject = new BehaviorSubject<any[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor() {}

  agregarItem(item: any) {
    const items = this.itemsSubject.getValue();
    const index = items.findIndex((i) => i.idArticulo === item.idArticulo);
    if (index !== -1) {
      items[index].cantidad += item.cantidad;
    } else {
      items.push(item);
    }
    items.sort((a, b) => a.idArticulo - b.idArticulo);
    this.itemsSubject.next([...items]);
  }

  eliminarItem(index: number) {
    const items = this.itemsSubject.getValue();
    items.splice(index, 1);
    this.itemsSubject.next(items);
  }

  actualizarCantidad(index: number, cantidad: number) {
    const items = this.itemsSubject.getValue();
    const existencia = items[index].existencia;
    if (cantidad > 0 && cantidad <= existencia) {
      items[index].cantidad = cantidad;
      this.itemsSubject.next(items);
    }
  }

  actualizarItems(items: any[]) {
    this.itemsSubject.next(items);
  }

  eliminarItemPorId(id: number) {
    const items = this.itemsSubject.getValue();
    const index = items.findIndex((item) => item.idArticulo === id);
    if (index !== -1) {
      items.splice(index, 1);
      this.itemsSubject.next(items);
    }
  }

  vaciarCarrito() {
    this.itemsSubject.next([]);
  }
}
