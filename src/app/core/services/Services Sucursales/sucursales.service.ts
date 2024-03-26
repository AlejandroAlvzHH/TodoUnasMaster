import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branches } from '../../../Models/Master/branches';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = 'http://localhost:10395/api/SucursalApi';

  constructor(private http: HttpClient) {}
  agregarSucursal(sucursal: Branches): Observable<Branches> {
    return this.http.post<Branches>(this.url, sucursal);
  }

  getAllSucursales(): Observable<Branches[]> {
    return this.http.get<Branches[]>(this.url);
  }

  getSucursalById(id: number): Observable<Branches | null> {
    return this.http.get<Branches | null>(`${this.url}/${id}`);
  }

  modificarSucursal(sucursal: Branches): Observable<boolean> {
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