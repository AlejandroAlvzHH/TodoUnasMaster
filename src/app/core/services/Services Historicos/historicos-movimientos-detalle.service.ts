import { Injectable } from '@angular/core';
import { Movements_Detail } from '../../../Models/Master/movements_detail';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistoricosMovimientosDetalleService {
  private baseUrl = 'http://localhost:10395/api/DetalleMovimientoApi';

  constructor(private http: HttpClient) {}

  getDetalleMovimientosByGlobalID(id: number): Observable<Movements_Detail[]> {
    return this.http.get<Movements_Detail[]>(
      `${this.baseUrl}/ByMovimientoGlobal/${id}`
    );
  }
}
