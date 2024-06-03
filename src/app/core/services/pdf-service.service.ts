import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PdfServiceService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/PdfApi/generar-reporte`;

  constructor(private http: HttpClient) {}

  /**
   * Genera un reporte en formato Blob a partir de los datos proporcionados.
   * @param datos Los datos para generar el reporte.
   * @returns Un Observable que emite el Blob del reporte generado.
   */

  generarReporte(datos: any): Observable<Blob> {
    return this.http
      .post<Blob>(this.url, datos, {
        responseType: 'blob' as 'json',
      })
      .pipe(catchError(this.handleHttpError));
  }

  /**
   * Maneja los errores de una solicitud HTTP.
   * @param error El error de la solicitud HTTP.
   * @returns Un Observable que emite el error.
   */

  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error en la solicitud HTTP';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}, Mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
