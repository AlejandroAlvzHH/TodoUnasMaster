import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CatalogoSalidas } from '../../../../Models/Master/catalogo_salidas';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CatalogoSalidasService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/CatalogoSalidasApi`;

  constructor(private http: HttpClient) {}

  getCatalogoSalidas(): Observable<CatalogoSalidas[]> {
    return this.http.get<CatalogoSalidas[]>(this.url);
  }

  getCatalogoSalidasStatus1(): Observable<CatalogoSalidas[]> {
    return this.http
      .get<CatalogoSalidas[]>(this.url)
      .pipe(
        map((catalogoSalidas) =>
          catalogoSalidas.filter((item) => item.status === 1)
        )
      );
  }

  async getAllCatalogoSalidas(): Promise<CatalogoSalidas[]> {
    try {
      const data = await fetch(this.url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }

  addMotivoSalida(
    catalogoSalida: CatalogoSalidas
  ): Observable<CatalogoSalidas> {
    return this.http.post<CatalogoSalidas>(this.url, catalogoSalida);
  }

  updateStatusMotivo(motivo: CatalogoSalidas): Observable<CatalogoSalidas> {
    const updateUrl = `${this.url}/${motivo.id_tipo_salida}`;
    console.log(updateUrl);
    return this.http.put<CatalogoSalidas>(updateUrl, motivo);
  }

  async updateMotivoSalida(
    motivo: CatalogoSalidas,
    id_tipo_salida: number
  ): Promise<CatalogoSalidas | null> {
    try {
      const response = await fetch(`${this.url}/${id_tipo_salida}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(motivo),
      });
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
      const response = await fetch(`${this.url}/${id_tipo_salida}`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
        throw new Error('Failed to delete motivo');
      }
    } catch (error) {
      console.error('Error deleting motivo:', error);
      throw error;
    }
  }
}
