import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Inventory } from '../../Models/Master/inventory';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventarioApiService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/InventarioApi`;

  constructor(private http: HttpClient) {}

  getInventarios(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getInventariosFromSucursal(sucursalUrl: string): Observable<any[]> {
    return this.http.get<any[]>(`${sucursalUrl}/api/InventarioApi`);
  }

  getAllInventariosFromAllSucursales(
    sucursalUrls: string[]
  ): Observable<any[]> {
    const requests = sucursalUrls.map((url) =>
      this.getInventariosFromSucursal(url)
    );
    return forkJoin(requests).pipe(
      map((inventariosArray) => inventariosArray.flat())
    );
  }

  postInventory(inventory: Inventory): Observable<any> {
    return this.http.post(`${this.url}`, inventory);
  }

  insertOrUpdateInventory(inventory: Inventory): Observable<any> {
    return this.http.put(
      `${this.url}/${inventory.id_sucursal}/${inventory.id_producto}`,
      inventory
    );
  }
}
