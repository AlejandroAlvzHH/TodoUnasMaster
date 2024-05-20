import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Inventory } from '../../Models/Master/inventory';

@Injectable({
  providedIn: 'root',
})
export class InventarioApiService {
  private apiUrl = 'http://localhost:10395/api/InventarioApi';

  constructor(private http: HttpClient) {}

  getInventarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
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

  insertOrUpdateInventory(inventory: Inventory): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?id_sucursal=${inventory.id_sucursal}&id_producto=${inventory.id_producto}`).pipe(
      map((existingInventory) => {
        if (existingInventory.length > 0) {
          const existingId = existingInventory[0].id; 
          return this.http.put(`${this.apiUrl}/${existingId}`, inventory);
        } else {
          return this.http.post(this.apiUrl, inventory);
        }
      })
    );
  }
}
