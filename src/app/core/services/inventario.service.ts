import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Products } from '../../Models/Factuprint/products';

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

  obtenerExistencia(
    urlServicios: string,
    idArticulo: number
  ): Observable<number> {
    const apiUrl = `${urlServicios}/api/ProductApi/${idArticulo}`;
    return this.http
      .get<Products>(apiUrl)
      .pipe(map((producto: Products) => producto.existencia));
  }
}
