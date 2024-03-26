import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarritoComunicationService {
  private itemRemovedSource = new Subject<number>();
  itemRemoved$ = this.itemRemovedSource.asObservable();

  constructor() {}

  notifyItemRemoved(idArticulo: number) {
    this.itemRemovedSource.next(idArticulo);
  }
}
