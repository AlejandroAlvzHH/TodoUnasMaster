import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventarioMasterService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/InventarioApi`;

  constructor(private http: HttpClient) {}

  registrarEntradaMaster(
    id_sucursal: number,
    id_producto: number,
    changes: any
  ): Observable<any> {
    return this.http.put<any>(
      `${this.url}/${id_sucursal}/${id_producto}`,
      changes
    );
  }

  registrarSalidaMaster(
    id_sucursal: number,
    id_producto: number,
    changes: any
  ): Observable<any> {
    return this.http.put<any>(
      `${this.url}/${id_sucursal}/${id_producto}`,
      changes
    );
  }
}
