import { Injectable } from '@angular/core';
import { VistaSucursalesaConSincronizacionPendiente } from '../../../Models/Master/vista-sucursales-con-sincronizacion-pendiente';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SucursalesConSincronizacionPendienteService {
  private baseUrl = 'http://localhost:10395/api/VistaSucursalesConSincronizacionPendienteApi/ByProducto';

  constructor(private http: HttpClient) {}

  getDetalleSincronizacionProducto(id: number): Observable<VistaSucursalesaConSincronizacionPendiente[]> {
    return this.http.get<VistaSucursalesaConSincronizacionPendiente[]>(
      `${this.baseUrl}/${id}` 
    );
  }
}