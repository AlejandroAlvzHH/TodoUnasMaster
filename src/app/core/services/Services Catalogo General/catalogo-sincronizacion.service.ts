import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VistaCatalogoSincronizacion } from '../../../Models/Master/vista-catalogo-sincronizacion';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CatalogoSincronizacionService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/VistaCatalogoSincronizacion`;

  constructor(private http: HttpClient) {}

  async getAllVistaCatalogoSincronizacion(): Promise<
    VistaCatalogoSincronizacion[]
  > {
    try {
      const data = await fetch(this.url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }

  getVistaCatalogoSincronizacionPaginated(
    startIndex: number,
    itemsPerPage: number
  ): Observable<VistaCatalogoSincronizacion[]> {
    const params = new HttpParams()
      .set('startIndex', startIndex.toString())
      .set('itemsPerPage', itemsPerPage.toString());

    return this.http.get<VistaCatalogoSincronizacion[]>(this.url, {
      params,
    });
  }
}
