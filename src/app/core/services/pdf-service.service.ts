import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfServiceService {

  constructor(private http: HttpClient) { }

  generarReporte(datos: any): Observable<Blob> {
    return this.http.post<Blob>('https://tudominio.com/api/PdfApi/generar-reporte', datos, { responseType: 'blob' as 'json' });
  }
}
