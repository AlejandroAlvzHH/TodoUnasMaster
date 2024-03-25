import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sucursales } from '../../../Models/sucursales';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = 'http://localhost:10395/api/SucursalApi';

  constructor(private http: HttpClient) {}
  agregarSucursal(sucursal: Sucursales): Observable<Sucursales> {
    return this.http.post<Sucursales>(this.url, sucursal);
  }

  getAllSucursales(): Observable<Sucursales[]> {
    return this.http.get<Sucursales[]>(this.url);
  }

  getSucursalById(id: number): Observable<Sucursales | null> {
    return this.http.get<Sucursales | null>(`${this.url}/${id}`);
  }

  modificarSucursal(sucursal: Sucursales): Observable<boolean> {
    return this.http.put<boolean>(
      `${this.url}/${sucursal.idSucursal}`,
      sucursal
    );
  }

  modificarStatusSucursal(id: number, status: number): Observable<boolean> {
    const url = `${this.url}/${id}/status`;
    return this.http.put<boolean>(url, { status });
  }
}