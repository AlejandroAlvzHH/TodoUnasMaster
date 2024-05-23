import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VistaSincronizacionPendienteReciente } from '../../../Models/Master/vista-sincronizacion-pendiente-reciente copy';

@Injectable({
  providedIn: 'root',
})
export class SucursalesConSincronizacionPendienteService {
  private baseUrl =
    'http://localhost:10395/api/VistaSincronizacionPendienteReciente';

  constructor(private http: HttpClient) {}

  getDetalleSincronizacionProductoReciente(
    id: number
  ): Observable<VistaSincronizacionPendienteReciente[]> {
    return this.http.get<VistaSincronizacionPendienteReciente[]>(
      `${this.baseUrl}/${id}`
    );
  }
}
