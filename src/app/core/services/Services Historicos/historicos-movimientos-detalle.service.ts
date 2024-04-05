import { Injectable } from '@angular/core';
import { VistaMovementsDetail } from '../../../Models/Master/vista-movements-detail';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistoricosMovimientosDetalleService {
  private baseUrl = 'http://localhost:10395/api/VistaDetalleMovimientoApi';

  constructor(private http: HttpClient) {}

  getDetalleMovimientosByGlobalID(id: number): Observable<VistaMovementsDetail[]> {
    return this.http.get<VistaMovementsDetail[]>(
      `${this.baseUrl}/ByMovimientoGlobal/${id}`
    );
  }
}
