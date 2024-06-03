import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movements_Detail } from '../../Models/Master/movements_detail';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DetalleMovimientosService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/DetalleMovimientoApi`;

  constructor(private http: HttpClient) {}

  getAllMovimientosDetail(): Observable<Movements_Detail[]> {
    return this.http.get<Movements_Detail[]>(this.url);
  }

  getMovimientoDetailById(id: number): Observable<Movements_Detail | null> {
    return this.http.get<Movements_Detail | null>(`${this.url}/${id}`);
  }

  insertarLogMovimientoDetail(logDetalle: any): Observable<number | null> {
    return this.http.post<number | null>(this.url, logDetalle);
  }
}
