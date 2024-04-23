import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { VistaCatalogoSincronizacion } from '../../../Models/Master/vista-catalogo-sincronizacion';

@Injectable({
  providedIn: 'root',
})
export class CatalogoSincronizacionService {
  private apiUrl = 'http://localhost:10395/api/VistaCatalogoSincronizacion';

  constructor(private http: HttpClient) {}

  async getAllVistaCatalogoSincronizacion(): Promise<VistaCatalogoSincronizacion[]> {
    try {
      const url = `${this.apiUrl}`;
      console.log(url);
      const data = await fetch(url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }
}