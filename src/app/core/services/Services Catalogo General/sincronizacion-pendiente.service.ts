import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SincronizacionPendienteService {
  private apiUrl = 'http://localhost:10395/api/SincronizacionPendienteApi';

  constructor(private http: HttpClient) {}

  actualizarFalloSincronizacion(id: number, body: any): Observable<number | null> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<number | null>(url, body);
  }

  obtenerFalloSincronizacionPorId(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  registrarFalloSincronizacion(body: any): Observable<number | null> {
    return this.http.post<number | null>(this.apiUrl, body);
  }
}
