import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sucursales } from '../../../Models/sucursales';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = 'https://localhost:44301/api/SucursalApi';

  constructor(private http: HttpClient) {}

  getAllSucursales(): Observable<Sucursales[]> {
    return this.http.get<Sucursales[]>(this.url);
  }

  getSucursalById(id: number): Observable<Sucursales | null> {
    return this.http.get<Sucursales | null>(`${this.url}/${id}`);
  }

  async agregarSucursal(sucursal: Sucursales): Promise<boolean> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sucursal),
      });

      return response.ok;
    } catch (error) {
      console.error('Error al agregar la sucursal:', error);
      return false;
    }
  }
}
