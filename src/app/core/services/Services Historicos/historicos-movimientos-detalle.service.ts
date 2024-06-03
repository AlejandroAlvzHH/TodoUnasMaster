import { Injectable } from '@angular/core';
import { VistaMovementsDetail } from '../../../Models/Master/vista-movements-detail';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HistoricosMovimientosDetalleService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/VistaDetalleMovimientoApi`;

  constructor(private http: HttpClient) {}

  getDetalleMovimientosByGlobalID(
    id: number
  ): Observable<VistaMovementsDetail[]> {
    return this.http.get<VistaMovementsDetail[]>(
      `${this.url}/ByMovimientoGlobal/${id}`
    );
  }
}
