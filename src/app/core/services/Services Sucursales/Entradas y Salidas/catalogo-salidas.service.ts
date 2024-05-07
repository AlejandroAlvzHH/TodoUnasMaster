import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogoSalidas } from '../../../../Models/Master/catalogo_salidas';

@Injectable({
  providedIn: 'root',
})
export class CatalogoSalidasService {
  private catalogoSalidasUrl = 'http://localhost:10395/api/CatalogoSalidasApi';

  constructor(private http: HttpClient) {}

  getCatalogoSalidas(): Observable<CatalogoSalidas[]> {
    return this.http.get<CatalogoSalidas[]>(this.catalogoSalidasUrl);
  }
  
  async getAllCatalogoSalidas(): Promise<CatalogoSalidas[]> {
    try {
      const url = `${this.catalogoSalidasUrl}`;
      const data = await fetch(url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }

  addMotivoSalida(
    catalogoSalida: CatalogoSalidas
  ): Observable<CatalogoSalidas> {
    return this.http.post<CatalogoSalidas>(
      this.catalogoSalidasUrl,
      catalogoSalida
    );
  }

  async updateMotivoSalida(
    motivo: CatalogoSalidas,
    id_tipo_salida: number
  ): Promise<CatalogoSalidas | null> {
    try {
      const response = await fetch(
        `${this.catalogoSalidasUrl}/${id_tipo_salida}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(motivo),
        }
      );
      if (response.status === 204) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating motivo:', error);
      throw error;
    }
  }

  async deleteMotivoSalida(id_tipo_salida: number): Promise<void> {
    try {
      const response = await fetch(
        `${this.catalogoSalidasUrl}/${id_tipo_salida}`,
        {
          method: 'DELETE',
        }
      );
      if (response.status !== 204) {
        throw new Error('Failed to delete motivo');
      }
    } catch (error) {
      console.error('Error deleting motivo:', error);
      throw error;
    }
  }
}
