import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movements } from '../../Models/Master/movements';

@Injectable({
  providedIn: 'root',
})
export class MovimientosService {
  url = 'http://localhost:10395/api/MovimientosApi';
  constructor(private http: HttpClient) {}

  getAllMovimientos(): Observable<Movements[]> {
    return this.http.get<Movements[]>(this.url);
  }

  getMovimientoById(id: number): Observable<Movements | null> {
    return this.http.get<Movements | null>(`${this.url}/${id}`);
  }

  insertarLogMovimiento(movimiento: any): Observable<number | null> {
    return this.http.post<number | null>(this.url, movimiento);
  }
}


