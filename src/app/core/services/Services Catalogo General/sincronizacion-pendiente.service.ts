import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SincronizacionPendienteService {
  private apiUrl = 'http://localhost:10395/api/SincronizacionPendienteApi';

  constructor(private http: HttpClient) {}

  registrarFalloSincronizacion(body: any): Observable<number | null> {
    return this.http.post<number | null>(this.apiUrl, body);
  }
}
