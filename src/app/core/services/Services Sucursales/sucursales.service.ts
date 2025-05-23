import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Branches } from '../../../Models/Master/branches';
import { catchError, throwError, Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/SucursalApi`;

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
    return this.http
      .put<boolean>(`${this.url}/${sucursal.idSucursal}`, sucursal)
      .pipe(
        catchError((error) => {
          console.error('Error al modificar la sucursal:', error);
          return throwError(error);
        })
      );
  }

  modificarStatusSucursal(id: number, status: number): Observable<boolean> {
    const url = `${this.url}/${id}/status`;
    return this.http.put<boolean>(url, { status });
  }

  getAllBranchesUrlsConStatus1(): Observable<
    { idSucursal: number; nombre: string; url: string }[]
  > {
    return this.getAllSucursales().pipe(
      map((sucursales) =>
        sucursales.filter((sucursal) => sucursal.status === 1)
      ),
      map((filteredSucursales) =>
        filteredSucursales.map((sucursal) => ({
          idSucursal: sucursal.idSucursal,
          nombre: sucursal.nombre,
          url: sucursal.url,
        }))
      )
    );
  }

  getAllBranchesUrlsConStatus1URL(): Observable<
    { idSucursal: number; nombre: string; url: string }[]
  > {
    return this.getAllSucursales().pipe(
      map((sucursales) =>
        sucursales.filter((sucursal) => sucursal.status === 1)
      ),
      map((filteredSucursales) =>
        filteredSucursales.map((sucursal) => ({
          idSucursal: sucursal.idSucursal,
          nombre: sucursal.nombre,
          url: sucursal.url,
        }))
      )
    );
  }

  getAllBranchesConStatus1(): Observable<Branches[]> {
    return this.http
      .get<Branches[]>(this.url)
      .pipe(
        map((sucursales) =>
          sucursales.filter((sucursal) => sucursal.status === 1)
        )
      );
  }

  /* EN ESTE NO IMPORTA EL STATUS 1*/
  getAllUrls(): Observable<string[]> {
    return this.getAllSucursales().pipe(
      map((sucursales) => sucursales.map((sucursal) => sucursal.url))
    );
  }
}
