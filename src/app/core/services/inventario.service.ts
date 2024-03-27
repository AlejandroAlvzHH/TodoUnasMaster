import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private apiUrl = 'http://localhost:10394/api/ProductApi';

  constructor(private http: HttpClient) {}

  registrarEntrada(idArticulo: number, changes: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${idArticulo}`, changes);
  }

  registrarSalida(idArticulo: number, changes: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${idArticulo}`, changes);
  }
}
