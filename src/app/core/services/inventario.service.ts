import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {

  constructor(private http: HttpClient) {}

  registrarEntradaUniversal(
    urlServicios: string,
    idArticulo: number,
    changes: any
  ): Observable<any> {
    const apiUrl = `${urlServicios}/api/ProductApi/${idArticulo}`;
    return this.http.put<any>(apiUrl, changes);
  }

  registrarSalidaUniversal(
    urlServicios: string,
    idArticulo: number,
    changes: any
  ): Observable<any> {
    const apiUrl = `${urlServicios}/api/ProductApi/${idArticulo}`;
    return this.http.put<any>(apiUrl, changes);
  }
}
