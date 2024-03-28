import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventarioMasterService {
  private inventarioMasterUrl = 'http://localhost:10395/api/InventarioApi';

  constructor(private http: HttpClient) {}

  registrarEntrada(id_sucursal: number, id_producto: number, changes: any): Observable<any> {
    return this.http.put<any>(`${this.inventarioMasterUrl}/${id_sucursal}/${id_producto}`, changes);
  }

  registrarSalida(id_sucursal: number, id_producto: number, changes: any): Observable<any> {
    return this.http.put<any>(`${this.inventarioMasterUrl}/${id_sucursal}/${id_producto}`, changes);
  }
}
