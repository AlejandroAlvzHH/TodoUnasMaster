import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VistaSincronizacionPendienteReciente } from '../../../Models/Master/vista-sincronizacion-pendiente-reciente copy';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SucursalesConSincronizacionPendienteService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/VistaSincronizacionPendienteReciente`;

  constructor(private http: HttpClient) {}

  getDetalleSincronizacionProductoReciente(
    id: number
  ): Observable<VistaSincronizacionPendienteReciente[]> {
    return this.http.get<VistaSincronizacionPendienteReciente[]>(
      `${this.url}/${id}`
    );
  }
}
