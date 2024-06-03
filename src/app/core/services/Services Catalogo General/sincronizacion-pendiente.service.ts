import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SincronizacionPendienteService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/SincronizacionPendienteApi`;

  constructor(private http: HttpClient) {}

  actualizarFalloSincronizacion(
    id: number,
    body: any
  ): Observable<number | null> {
    const url = `${this.url}/${id}`;
    return this.http.put<number | null>(url, body);
  }

  obtenerFalloSincronizacionPorId(id: number): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.get<any>(url);
  }

  registrarFalloSincronizacion(body: any): Observable<number | null> {
    return this.http.post<number | null>(this.url, body);
  }
}
